// Headless export host for a Diffusion Studio project.
//
// Mirrors what the desktop app does when it exports a scene
// (apps/web/src/engine/capture.ts → createCapture, then
// @diffusionstudio/encoder → createEncoder): the compiled project bundle is
// mounted into a fresh offline runtime world, the stage is reduced to the one
// scene being exported, and the encoder renders it frame by frame through the
// runtime's own systems. Only the host bits differ: the project's files are
// read over HTTP from the render server instead of Electron IPC, and the
// encoded bytes are streamed back to the server.

import { mount } from '@diffusionstudio/reconciler';
import {
	ChildOf, FramePromises, FrameRate, Library, Mode, RenderSurface, Root, Workarea,
	createRuntimeWorld, disposeDecoders, resetCamera, isScene,
} from '@diffusionstudio/runtime';
import { AssetLibrary } from '@diffusionstudio/assets';
import { createEncoder } from '@diffusionstudio/encoder';

import type { ProjectFS } from '@diffusionstudio/assets';

declare global {
	interface Window {
		__render: (options: RenderOptions) => Promise<RenderReport>;
		__log: (...args: unknown[]) => void;
	}
}

interface RenderOptions {
	scene?: string;
	fps?: number;
	from?: number;
	to?: number;
	bitrate?: number;
	audio?: boolean;
}

interface RenderReport {
	ok: boolean;
	error?: string;
	frames?: number;
	width?: number;
	height?: number;
}

const json = async <T>(url: string): Promise<T> => {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`${url}: ${res.status}`);
	return res.json() as Promise<T>;
};

/** The project folder as the asset library sees it, served by the render server. */
const httpFS: ProjectFS = {
	absolute: (path) => path,
	readManifest: async () => null,
	writeManifest: async () => {},
	list: (source) => json(`/fs/list?source=${encodeURIComponent(source)}`),
	stat: (source) => json(`/fs/stat?source=${encodeURIComponent(source)}`),
	file: async (source) => {
		const res = await fetch(`/fs/file?source=${encodeURIComponent(source)}`);
		if (!res.ok) throw new Error(`missing file ${source}`);
		const blob = await res.blob();
		return new File([blob], source.split('/').pop() ?? 'file', { type: blob.type });
	},
	write: async (path, data) => {
		await fetch(`/fs/write?path=${encodeURIComponent(path)}`, { method: 'POST', body: data });
	},
	remove: async () => {},
};

/** A FileSystemFileHandle-shaped target that streams the muxed bytes to the server. */
const httpTarget = {
	async createWritable() {
		await fetch('/out/open', { method: 'POST' });
		return new WritableStream({
			async write(chunk: { type: string; data: Uint8Array; position: number }) {
				if (chunk.type !== 'write') return;
				const res = await fetch(`/out/write?position=${chunk.position}`, { method: 'POST', body: chunk.data });
				if (!res.ok) throw new Error('write failed');
			},
			async close() {
				await fetch('/out/close', { method: 'POST' });
			},
		});
	},
};

window.__render = async (options: RenderOptions): Promise<RenderReport> => {
	try {
		const code = await (await fetch('/project.js')).text();
		const fps = options.fps ?? 30;

		const canvas = document.createElement('canvas');
		canvas.width = 2;
		canvas.height = 2;
		canvas.style.cssText = 'position:fixed;left:0;top:0;z-index:-9999;opacity:0;will-change:opacity;pointer-events:none;';
		document.body.appendChild(canvas);

		const world = createRuntimeWorld('sketchware-ia-promo');
		world.set(Mode, { value: 'offline-video' });
		world.set(Library, new AssetLibrary(httpFS));
		world.set(RenderSurface, { canvas, ctx: canvas.getContext('2d'), resolution: 1 });
		world.set(FrameRate, { value: fps });
		world.set(FramePromises, { list: [] });

		const mounted = mount(code, world);

		const roots = [...world.query(ChildOf(world.get(Root)!))];
		const scenes = roots.filter((root) => isScene(root));
		if (scenes.length === 0) throw new Error('The project rendered no scene');
		const scene = scenes[0]!;
		for (const root of roots) if (root !== scene) root.destroy();
		resetCamera(world);

		if (options.from !== undefined || options.to !== undefined) {
			const start = Math.round((options.from ?? 0) * fps);
			const end = Math.round((options.to ?? 1e6) * fps);
			if (scene.has(Workarea)) scene.set(Workarea, { start, end });
			else scene.add(Workarea({ start, end }));
		}

		const encoder = await createEncoder(world, {
			// Playwright's Chromium ships without an H.264 encoder, so the
			// master is VP9/Opus WebM at a high bitrate; render.mjs then makes
			// the H.264/AAC MP4 delivery file from it with ffmpeg.
			format: 'webm',
			target: httpTarget,
			video: { codec: 'vp9', bitrate: options.bitrate ?? 24e6, resolution: 1080, fps },
			audio: { enabled: options.audio ?? true, codec: 'opus', bitrate: 256e3, sampleRate: 48000 },
			comment: 'Sketchware IA — promo',
			onProgress(p) {
				window.__log?.(`progress ${p.progress}/${p.total}`);
			},
		} as never);

		const result = await encoder.render();
		mounted.dispose();
		disposeDecoders(world, world.get(Root)!);
		if (result.type !== 'success') {
			return { ok: false, error: result.type === 'error' ? String(result.error?.stack ?? result.error) : 'canceled' };
		}
		return { ok: true, width: canvas.width, height: canvas.height };
	} catch (error) {
		return { ok: false, error: error instanceof Error ? `${error.message}\n${error.stack}` : String(error) };
	}
};
