# Render các tư thế mascot Mượn ra frontend/public/brand/ từ mascot-master.png (ảnh A1 đã tách nền, 594x705).
# Cắt ảnh thành càng trái, càng phải, 4 chân, thân; mỗi phần cử động riêng, mắt chớp bằng mí vẽ đè.
# Cần magick, img2webp, cwebp. Chạy từ gốc repo:
#   python3 docs/brand/make_mascot.py
import math, os, subprocess, tempfile

ROOT = os.path.dirname(os.path.abspath(__file__))
MASTER = os.path.join(ROOT, 'mascot-master.png')
OUT = os.path.join(ROOT, '..', '..', 'frontend', 'public', 'brand')
H = 240  # chiều cao nhân vật trong khung (2x của 120px hiển thị)
CH = 300  # chiều cao khung, chừa chỗ cho nhảy
BODY = '#84a3e2'  # màu thân lấy mẫu từ ảnh gốc, dùng cho mí mắt
EYES = [(225, 480, 51), (370, 480, 54)]  # tâm và bán kính tròng trắng (toạ độ ảnh gốc)
LEGS = [(135, 215), (215, 300), (300, 385), (385, 465)]  # cột x của 4 chân, nằm dưới y = LEG_Y
LEG_Y = 655
CLAW_Y = (505, LEG_Y)  # trên 505 là mép vỏ
CLAW_L, CLAW_R = 165, 430  # càng trái lấy x < 165, càng phải x > 430
SEAM_L, SEAM_R = 120, 474  # thân giữ x trong khoảng này; phần chồng lên nhau che khe khi xoay càng
PIVOT_L, PIVOT_R = (140, 590), (454, 590)


def magick(*args):
    subprocess.run(['magick', *map(str, args)], check=True)


def cut_parts(d):
    """Tách ảnh gốc thành các lớp cùng khung 594x705."""
    # bỏ bóng đổ dưới chân (xám, độ đậm màu thấp) để nhấc chân không kéo theo bóng
    src = f'{d}/master.png'
    magick(MASTER, '-channel', 'A', '-fx', 'j >= 650 && max(max(r,g),b) - min(min(r,g),b) < 0.15 ? 0 : a', '+channel', src)
    def keep(name, *rects, soft=False):
        draw = ' '.join(f'rectangle {x0},{y0} {x1},{y1}' for x0, y0, x1, y1 in rects)
        # soft: làm mềm mép dọc (kernel Blur 1 chiều ngang) để đường nối với càng hoà vào nhau
        blur = ['-channel', 'A', '-morphology', 'Convolve', 'Blur:0x6', '+channel'] if soft else []
        magick(src, '(', '-size', '594x705', 'xc:none', '-fill', 'white', '-draw', draw, *blur, ')',
               '-compose', 'DstIn', '-composite', f'{d}/{name}.png')

    # đáy càng thò xuống ngang chân: lấy thêm phần ngoài cột chân
    keep('clawL', (0, CLAW_Y[0], CLAW_L, CLAW_Y[1] - 1), (0, LEG_Y, LEGS[0][0] - 1, 680))  # dưới 680 là bóng đổ, bỏ
    keep('clawR', (CLAW_R, CLAW_Y[0], 593, CLAW_Y[1] - 1), (LEGS[-1][1], LEG_Y, 593, 680))
    for i, (x0, x1) in enumerate(LEGS):
        keep(f'leg{i}', (x0, LEG_Y, x1 - 1, 704))
    keep('body', (0, 0, 593, CLAW_Y[0] - 1), (SEAM_L, CLAW_Y[0], SEAM_R, LEG_Y - 1), soft=True)


def compose(d, path, clawL=0, clawR=0, legs=(0, 0, 0, 0), blink=0.0):
    """Ghép một sprite: càng và chân nằm sau thân. clawL/clawR: độ xoay (dương = giơ lên). legs: số px nhấc chân. blink: 0..1."""
    args = ['-size', '594x705', 'xc:none', '-compose', 'Over']
    args += ['(', f'{d}/clawL.png', '-virtual-pixel', 'transparent', '-distort', 'SRT', f'{PIVOT_L[0]},{PIVOT_L[1]} 1 {clawL}', ')', '-composite']
    args += ['(', f'{d}/clawR.png', '-virtual-pixel', 'transparent', '-distort', 'SRT', f'{PIVOT_R[0]},{PIVOT_R[1]} 1 {-clawR}', ')', '-composite']
    for i, lift in enumerate(legs):
        args += ['(', f'{d}/leg{i}.png', '-virtual-pixel', 'transparent', '-distort', 'SRT', f'0,0 1 0 0,{-lift}', ')', '-composite']
    args += [f'{d}/body.png', '-composite']
    if blink > 0:
        # mí trên kéo xuống che tròng, khi nhắm hẳn thì còn một vạch cong
        for cx, cy, r in EYES:
            top = cy - r - 2
            bottom = top + (2 * r + 4) * blink
            args += ['(', '-size', '594x705', 'xc:none', '-fill', BODY, '-draw', f'circle {cx},{cy} {cx},{cy - r - 2}',
                     '(', '-size', '594x705', 'xc:none', '-fill', 'white', '-draw', f'rectangle 0,{top} 593,{bottom}', ')',
                     '-compose', 'DstIn', '-composite', ')', '-compose', 'Over', '-composite']

    if blink >= 0.95:
        for cx, cy, r in EYES:
            args += ['-fill', 'none', '-stroke', '#1b2233', '-strokewidth', '7', '-draw', f'arc {cx - r * 0.6},{cy - 12} {cx + r * 0.6},{cy + 18} 20,160']
    magick(*args, path)


def place(src, path, cw, x=0, y=0, rot=0, sx=1, sy=1):
    """Đặt sprite vào khung cw x CH: đáy giữa tại (cw/2 + x, CH - 4 + y), xoay/co giãn quanh đáy giữa."""
    s = H / 705
    magick('-size', f'{cw}x{CH}', 'xc:none', '(', src, '-background', 'none', '-virtual-pixel', 'transparent',
           '-set', 'option:distort:viewport', f'{cw}x{CH}+0+0', '-distort', 'SRT',
           f'297,705 {s * sx},{s * sy} {rot} {cw / 2 + x},{CH - 4 + y}', ')', '-composite', path)


def wave(t, freq=1.0):
    return math.sin(2 * math.pi * freq * t)


def blink_at(t, start=0.78, length=0.12):
    u = (t - start) / length
    return max(0.0, 1 - abs(2 * u - 1)) * 1.0 if 0 <= u <= 1 else 0.0


POSES = {
    # idle: nhún nhẹ, càng đung đưa, chớp mắt cuối chu kỳ
    'idle': (32, 220, lambda t: (
        dict(clawL=4 * wave(t), clawR=4 * wave(t + 0.25), blink=blink_at(t)),
        dict(y=-5 * (1 - math.cos(2 * math.pi * t)) / 2, sx=1 + 0.02 * math.cos(2 * math.pi * t), sy=1 - 0.02 * math.cos(2 * math.pi * t)))),
    # walk: đi ngang, chân nhấc so le, càng vung ngược nhịp
    'walk': (48, 380, lambda t: (
        dict(clawL=7 * wave(t, 4), clawR=-7 * wave(t, 4),
             legs=tuple(max(0, 18 * wave(t, 4) * (1 if i % 2 else -1)) for i in range(4)), blink=blink_at(t, 0.4, 0.08)),
        dict(x=70 * wave(t), y=-3 * abs(wave(t, 4)), rot=3 * wave(t, 4)))),
    # shake: giơ hai càng lên, run rồi đứng yên, nhắm mắt lúc run
    'shake': (32, 240, lambda t: (
        dict(clawL=8 * max(0, 1 - t * 2) + 4, clawR=8 * max(0, 1 - t * 2) + 4, blink=1.0 if t < 0.4 else 0.0),
        dict(rot=6 * max(0, 1 - t * 2) * wave(t, 6), sx=1 - 0.05 * max(0, 1 - t * 2), sy=1 - 0.05 * max(0, 1 - t * 2)))),
    # jump: nhún, nhảy giơ càng, rơi xuống
    'jump': (30, 220, lambda t: jump(t)),
}


def jump(t):
    if t < 0.2:
        s = math.sin(math.pi * t / 0.2)
        return dict(clawL=-6 * s, clawR=-6 * s), dict(sx=1 + 0.08 * s, sy=1 - 0.1 * s)
    if t < 0.7:
        u = (t - 0.2) / 0.5
        up = math.sin(math.pi * u)
        return dict(clawL=12 * up, clawR=12 * up, legs=(12 * up,) * 4), dict(y=-40 * up, sx=0.96, sy=1.05)
    s = math.sin(math.pi * (t - 0.7) / 0.3)
    return dict(blink=0.0), dict(sx=1 + 0.06 * s, sy=1 - 0.08 * s)


def main():
    with tempfile.TemporaryDirectory() as d:
        cut_parts(d)
        for name, (n, cw, fn) in POSES.items():
            frames = []
            for i in range(n):
                parts, body = fn(i / n)
                compose(d, f'{d}/sprite.png', **parts)
                frames.append(f'{d}/{name}{i:03}.png')
                place(f'{d}/sprite.png', frames[-1], cw, **body)
            subprocess.run(['img2webp', '-loop', '0', '-lossy', '-q', '75', '-m', '6', '-d', '50', *frames, '-o', f'{OUT}/mascot-{name}.webp'],
                           check=True, capture_output=True)
            if name == 'idle':
                subprocess.run(['cwebp', '-q', '85', '-alpha_q', '100', '-m', '6', frames[0], '-o', f'{OUT}/mascot.webp'], check=True, capture_output=True)
            print(name, n)


if __name__ == '__main__':
    main()
