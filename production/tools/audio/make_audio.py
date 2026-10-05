"""Synthesizes the soundtrack and the sound effects of the Sketchware IA promo.

Everything is generated from code (numpy/scipy), so the audio is original and
free of licensing questions. The music is written against the video's scene
grid: 120 BPM, one bar = 2 s, so every scene boundary that matters lands on a
beat and the final brand hit lands on the downbeat of bar 28 (54.0 s).

    0 –  5 s   intro: pad swell + filtered arpeggio, sub hit on the logo
    5 – 21 s   groove: kick, hats, bass, arpeggio opening up
   21 – 31 s   logic: claps + brighter arp
   31 – 39 s   "app comes alive": short lift, then full groove
   39 – 47 s   montage: full energy
   47 – 54 s   result: build + riser into the final hit
   54 – 60 s   resolve: final chord, impact, long tail

Usage: python3 make_audio.py <out_dir>
"""

import os
import sys
import wave

import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000
BPM = 120.0
BEAT = 60.0 / BPM
BAR = BEAT * 4
DUR = 60.0
rng = np.random.default_rng(7)


# ----------------------------------------------------------------------------
# helpers

def t_axis(seconds):
    return np.arange(int(seconds * SR)) / SR


def lp(x, hz, order=2):
    return sosfilt(butter(order, min(hz, SR * 0.45), "low", fs=SR, output="sos"), x)


def hp(x, hz, order=2):
    return sosfilt(butter(order, hz, "high", fs=SR, output="sos"), x)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, min(hi, SR * 0.45)], "band", fs=SR, output="sos"), x)


def saw(freq, t, phase=0.0):
    p = (freq * t + phase) % 1.0
    return 2.0 * p - 1.0


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def env_adsr(n, a, d, s, r, sustain_len):
    a_n, d_n, r_n = int(a * SR), int(d * SR), int(r * SR)
    s_n = max(0, int(sustain_len * SR) - a_n - d_n)
    e = np.concatenate([
        np.linspace(0, 1, max(a_n, 1), endpoint=False),
        np.linspace(1, s, max(d_n, 1), endpoint=False),
        np.full(s_n, s),
        np.linspace(s, 0, max(r_n, 1)),
    ])
    if len(e) < n:
        e = np.pad(e, (0, n - len(e)))
    return e[:n]


def add(buf, sig, at):
    i = int(round(at * SR))
    if i >= buf.shape[-1]:
        return
    if sig.ndim == 1:
        sig = np.stack([sig, sig])
    j = min(buf.shape[-1], i + sig.shape[-1])
    buf[:, i:j] += sig[:, : j - i]


def pan(sig, p):
    """p in [-1, 1]."""
    l = np.cos((p + 1) * np.pi / 4)
    r = np.sin((p + 1) * np.pi / 4)
    return np.stack([sig * l, sig * r])


def reverb_ir(seconds=2.4, damp=3000):
    n = int(seconds * SR)
    t = np.arange(n) / SR
    ir_l = rng.standard_normal(n) * np.exp(-t * 3.2)
    ir_r = rng.standard_normal(n) * np.exp(-t * 3.2)
    ir_l, ir_r = lp(ir_l, damp), lp(ir_r, damp)
    ir = np.stack([ir_l, ir_r])
    return ir / np.abs(ir).sum(axis=1, keepdims=True).max() * 6


IR = reverb_ir()


def reverb(st, wet=0.25):
    out = np.stack([fftconvolve(st[0], IR[0])[: st.shape[1]], fftconvolve(st[1], IR[1])[: st.shape[1]]])
    return st + wet * out


def write_wav(path, st, peak=0.95):
    if st.ndim == 1:
        st = np.stack([st, st])
    m = np.abs(st).max()
    if m > 0:
        st = st / m * peak
    data = (np.clip(st.T, -1, 1) * 32767).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())


# ----------------------------------------------------------------------------
# instruments

def kick(level=1.0):
    t = t_axis(0.45)
    f = 45 + 110 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t * 7.5)
    click = hp(rng.standard_normal(len(t)), 2000) * np.exp(-t * 300) * 0.25
    return (body + click) * level


def hat(open_=False, level=1.0):
    t = t_axis(0.35 if open_ else 0.06)
    n = hp(rng.standard_normal(len(t)), 7500, 4)
    return n * np.exp(-t * (14 if open_ else 70)) * level


def clap(level=1.0):
    t = t_axis(0.3)
    n = bp(rng.standard_normal(len(t)), 900, 3500)
    e = np.exp(-t * 22)
    for k in (0.0, 0.011, 0.022):
        e += np.where(t >= k, np.exp(-(t - k) * 160), 0) * 0.6
    return n * e * level * 0.6


def pluck(freq, length=0.32, cutoff=3200, level=1.0):
    t = t_axis(length)
    s = saw(freq, t) * 0.6 + saw(freq * 1.005, t, 0.3) * 0.4
    e = np.exp(-t * 9)
    # filter envelope approximated by mixing a bright and a dark version
    bright, dark = lp(s, cutoff), lp(s, cutoff * 0.25)
    fe = np.exp(-t * 18)
    return (bright * fe + dark * (1 - fe)) * e * level


def pad(freqs, length, level=1.0, cutoff=2200):
    t = t_axis(length)
    s = np.zeros(len(t))
    for f in freqs:
        for d in (-0.12, 0.0, 0.12):
            s += saw(f * 2 ** (d / 12), t, rng.random())
    s = lp(s / (len(freqs) * 3), cutoff)
    e = env_adsr(len(t), 0.6, 0.4, 0.8, 1.2, length - 1.2)
    return s * e * level


def bass_note(freq, length, level=1.0):
    t = t_axis(length)
    s = np.sign(np.sin(2 * np.pi * freq * t)) * 0.35 + saw(freq, t) * 0.4 + np.sin(2 * np.pi * freq * t) * 0.7
    s = lp(s, 420)
    e = env_adsr(len(t), 0.005, 0.12, 0.6, 0.06, length)
    return s * e * level


# ----------------------------------------------------------------------------
# harmony: Am – F – C – G, one bar each (vi–IV–I–V in C)

CHORDS = [
    (57, [57, 60, 64, 69]),  # Am
    (53, [53, 57, 60, 65]),  # F
    (48, [55, 60, 64, 67]),  # C
    (55, [55, 59, 62, 67]),  # G
]


def chord_at(bar):
    return CHORDS[int(bar) % 4]


def build_music():
    n = int((DUR + 0.5) * SR)
    drums = np.zeros((2, n))
    bass = np.zeros((2, n))
    keys = np.zeros((2, n))
    pads = np.zeros((2, n))
    fx = np.zeros((2, n))
    nbars = int(DUR / BAR)

    for bar in range(nbars + 1):
        t0 = bar * BAR
        root, notes = chord_at(bar)
        if t0 >= 54.0:
            break

        # pads all the way (swelling in the intro)
        lvl = 0.6 if t0 < 5 else 0.5
        add(pads, pan(pad([midi(x) for x in notes], BAR + 1.0, lvl, 1800 if t0 < 5 else 2600), 0), t0)

        # arpeggio: 16ths over chord tones, cutoff opening with the story
        for i in range(16):
            ts = t0 + i * BEAT / 4
            if ts < 1.0:
                continue
            seq = [0, 1, 2, 3, 2, 1, 3, 2]
            note = notes[seq[i % 8]] + 12
            if ts < 5:
                cut, lv = 900 + ts * 250, 0.18
            elif ts < 21:
                cut, lv = 1600 + (ts - 5) * 70, 0.22
            elif ts < 39:
                cut, lv = 3200, 0.24
            else:
                cut, lv = 4200, 0.26
            p = -0.35 if i % 2 else 0.35
            add(keys, pan(pluck(midi(note), 0.3, cut, lv), p), ts)

        # rhythm section from 5 s
        if t0 >= 4.0:
            for b in range(4):
                tb = t0 + b * BEAT
                if tb < 5.0:
                    continue
                breakdown = 31.0 <= tb < 33.0 or 47.0 <= tb < 50.0
                if not breakdown:
                    add(drums, kick(0.62), tb)
                add(drums, pan(hat(False, 0.22), 0.25), tb + BEAT / 2)
                if tb >= 13.0:
                    add(drums, pan(hat(False, 0.12), -0.25), tb + BEAT / 4)
                    add(drums, pan(hat(False, 0.12), -0.25), tb + 3 * BEAT / 4)
                if tb >= 21.0 and b in (1, 3) and not breakdown:
                    add(drums, pan(clap(0.5), 0.0), tb)
                if tb >= 39.0 and b == 3:
                    add(drums, pan(hat(True, 0.12), 0.3), tb + BEAT / 2)
                # bass: 8ths on the root, ducked on the beat
                if not (31.0 <= tb < 32.0):
                    for e8 in range(2):
                        lv = 0.42 if e8 else 0.28
                        f = midi(root - 12 + (12 if (e8 and b == 3) else 0))
                        add(bass, bass_note(f, BEAT / 2 * 0.92, lv), tb + e8 * BEAT / 2)

    # snare roll + build into the final hit (50 → 54)
    for k in range(32):
        tk = 50.0 + k * (4.0 / 32)
        add(drums, pan(clap(0.12 + 0.5 * k / 32), 0), tk)
    for b in range(8):
        add(drums, kick(0.3 + b * 0.04), 50.0 + b * BEAT)

    # final chord at 54: big pad + low C, long tail
    add(pads, pan(pad([midi(x) for x in [48, 55, 60, 64, 67, 72]], 6.0, 0.9, 3000), 0), 54.0)
    add(bass, bass_note(midi(36), 3.0, 0.6), 54.0)
    for i, note in enumerate([72, 76, 79, 84]):
        add(keys, pan(pluck(midi(note), 1.2, 5000, 0.25), (-0.4, 0.4, -0.2, 0.2)[i]), 54.0 + i * BEAT / 4)

    # sidechain-style duck of pads/keys/bass under the kick
    duck = np.ones(n)
    for bar in range(nbars):
        for b in range(4):
            tb = bar * BAR + b * BEAT
            if 5.0 <= tb < 54.0 and not (31.0 <= tb < 33.0 or 47.0 <= tb < 50.0):
                i = int(tb * SR)
                L = int(0.22 * SR)
                curve = 1 - 0.45 * np.exp(-np.arange(L) / SR * 18)
                duck[i:i + L] = np.minimum(duck[i:i + L], curve[: len(duck[i:i + L])])

    mix = drums * 1.0 + bass * duck + reverb(keys, 0.35) * duck + reverb(pads, 0.3) * duck + fx
    mix = hp(mix, 25)
    # glue: normalize, then a soft saturating limiter so transients don't
    # dictate the level of the whole bed
    mix = mix / np.abs(mix).max()
    mix = np.tanh(mix * 2.2) / np.tanh(2.2)
    # gentle master fades
    mix[:, : int(0.05 * SR)] *= np.linspace(0, 1, int(0.05 * SR))
    tail = int(59.0 * SR)
    mix[:, tail:] *= np.linspace(1, 0, mix.shape[1] - tail) ** 1.5
    return mix[:, : int(DUR * SR)]


# ----------------------------------------------------------------------------
# sound effects

def sfx_click():
    t = t_axis(0.05)
    s = np.sin(2 * np.pi * 2400 * t) * np.exp(-t * 180) + hp(rng.standard_normal(len(t)), 3000) * np.exp(-t * 400) * 0.4
    return s


def sfx_tap():
    t = t_axis(0.09)
    s = np.sin(2 * np.pi * (900 + 600 * np.exp(-t * 60)) * t) * np.exp(-t * 60)
    return s + hp(rng.standard_normal(len(t)), 2500) * np.exp(-t * 300) * 0.25


def sfx_select():
    t = t_axis(0.16)
    a = np.sin(2 * np.pi * 1320 * t) * np.exp(-t * 40)
    b = np.where(t > 0.055, np.sin(2 * np.pi * 1760 * t) * np.exp(-(t - 0.055) * 40), 0)
    return (a + b) * 0.6


def sfx_pop():
    t = t_axis(0.14)
    f = 300 + 900 * np.exp(-t * 35)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 30)


def sfx_snap():
    """Block snapping into place: woody click + short low thump."""
    t = t_axis(0.18)
    wood = bp(rng.standard_normal(len(t)), 1200, 4200) * np.exp(-t * 160)
    thump = np.sin(2 * np.pi * (180 + 120 * np.exp(-t * 50)) * t) * np.exp(-t * 35) * 0.9
    tick = np.sin(2 * np.pi * 3100 * t) * np.exp(-t * 260) * 0.3
    return wood * 0.8 + thump + tick


def sfx_whoosh(length=0.7, up=True):
    t = t_axis(length)
    n = rng.standard_normal(len(t))
    out = np.zeros(len(t))
    steps = 24
    seg = len(t) // steps
    for k in range(steps):
        x = k / (steps - 1)
        c = 400 + (5200 if up else 3600) * (x if up else 1 - x) ** 1.6
        chunk = slice(k * seg, (k + 1) * seg if k < steps - 1 else len(t))
        out[chunk] = bp(n, max(80, c * 0.6), c * 1.4)[chunk]
    e = np.sin(np.pi * np.clip(t / length, 0, 1)) ** 1.5
    st = np.stack([out * e * np.linspace(1.0, 0.6, len(t)), out * e * np.linspace(0.6, 1.0, len(t))])
    return st


def sfx_confirm():
    t = t_axis(0.6)
    s = np.zeros(len(t))
    for i, f in enumerate([midi(76), midi(83), midi(88)]):
        s += np.where(t > i * 0.07, np.sin(2 * np.pi * f * t) * np.exp(-(t - i * 0.07) * 7), 0)
    return reverb(np.stack([s, s]) * 0.4, 0.4)


def sfx_type():
    t = t_axis(0.05)
    return bp(rng.standard_normal(len(t)), 1800, 6000) * np.exp(-t * 220) + np.sin(2 * np.pi * 500 * t) * np.exp(-t * 120) * 0.3


def sfx_impact():
    t = t_axis(3.0)
    f = 38 + 70 * np.exp(-t * 9)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.2)
    crack = lp(rng.standard_normal(len(t)), 5000) * np.exp(-t * 12) * 0.35
    st = np.stack([boom + crack, boom + crack])
    return reverb(st, 0.5)


def sfx_riser(length=3.5):
    t = t_axis(length)
    n = rng.standard_normal(len(t))
    out = np.zeros(len(t))
    steps = 40
    seg = len(t) // steps
    for k in range(steps):
        x = k / (steps - 1)
        c = 300 + 7000 * x ** 2
        chunk = slice(k * seg, (k + 1) * seg if k < steps - 1 else len(t))
        out[chunk] = bp(n, c * 0.5, c * 1.5)[chunk]
    tone = saw(110 * 2 ** (t / length * 2), t) * 0.15
    e = (t / length) ** 2
    return reverb(np.stack([out + lp(tone, 3000), out * 0.9 + lp(tone, 3000)]) * e, 0.3)


def sfx_shimmer():
    t = t_axis(1.6)
    s = np.zeros(len(t))
    for i, f in enumerate([midi(84), midi(88), midi(91), midi(96)]):
        s += np.where(t > i * 0.05, np.sin(2 * np.pi * f * t) * np.exp(-(t - i * 0.05) * 3.5), 0) * 0.25
    return reverb(np.stack([s, s]), 0.6)


def main():
    out = sys.argv[1] if len(sys.argv) > 1 else "."
    os.makedirs(os.path.join(out, "music"), exist_ok=True)
    os.makedirs(os.path.join(out, "sfx"), exist_ok=True)
    write_wav(os.path.join(out, "music", "sketchware-ia-theme.wav"), build_music(), 0.89)
    effects = {
        "click": sfx_click(),
        "tap": sfx_tap(),
        "select": sfx_select(),
        "pop": sfx_pop(),
        "snap": sfx_snap(),
        "whoosh": sfx_whoosh(0.7, True),
        "whoosh-soft": sfx_whoosh(0.9, False),
        "confirm": sfx_confirm(),
        "type": sfx_type(),
        "impact": sfx_impact(),
        "riser": sfx_riser(3.5),
        "shimmer": sfx_shimmer(),
    }
    for name, sig in effects.items():
        write_wav(os.path.join(out, "sfx", f"{name}.wav"), sig, 0.9)
    print("audio written to", out)


if __name__ == "__main__":
    main()
