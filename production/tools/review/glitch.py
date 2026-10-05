"""One-frame glitch check for a rendered video.

Flags two kinds of single-frame defects (e.g. an empty screen between two
clips that do not share a frame boundary):
  * a frame that differs strongly from both neighbours while the neighbours
    match each other (a flash inside a continuous shot);
  * a frame with far less detail than both neighbours (an empty frame that
    lands on a cut, where the neighbours differ anyway).

  python3 production/tools/review/glitch.py production/output/sketchware-ia-promo.mp4

Needs ffmpeg and numpy. Exits 1 if anything is flagged.
"""
import subprocess
import sys

import numpy as np

W, H, FPS = 160, 90, 30


def frames(src: str) -> np.ndarray:
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", src, "-vf", f"scale={W}:{H},format=gray", "-f", "rawvideo", "-"],
        capture_output=True, check=True,
    ).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32)


def main(src: str) -> int:
    f = frames(src)
    diff = lambda a, b: float(np.abs(a - b).mean())
    detail = np.abs(np.diff(f, axis=2)).mean(axis=(1, 2)) + np.abs(np.diff(f, axis=1)).mean(axis=(1, 2))
    found = 0
    for i in range(1, len(f) - 1):
        a, b, c = diff(f[i], f[i - 1]), diff(f[i], f[i + 1]), diff(f[i - 1], f[i + 1])
        flash = min(a, b) > 6 and c < 0.5 * min(a, b)
        near = min(detail[i - 1], detail[i + 1])
        blank = detail[i] < 0.7 * near and near > 1.0
        if flash or blank:
            found += 1
            kind = "flash" if flash else "blank"
            print(f"{kind:5} frame {i:4d}  t={i / FPS:6.3f}s  detail {detail[i - 1]:.2f} | {detail[i]:.2f} | {detail[i + 1]:.2f}")
    print(f"{len(f)} frames, {found} flagged")
    return 1 if found else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1]))
