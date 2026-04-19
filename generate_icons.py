#!/usr/bin/env python3
"""
生成PWA应用图标
创建紫色渐变背景的圆角矩形，中间有飞机符号
"""

import struct
import zlib
import math
import os

def create_png(width, height, pixels):
    """创建PNG文件"""
    # PNG签名
    signature = b'\x89PNG\r\n\x1a\n'

    # IHDR chunk
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    ihdr = create_chunk(b'IHDR', ihdr_data)

    # IDAT chunk (图像数据)
    raw_data = bytearray()
    for y in range(height):
        raw_data.append(0)  # 过滤器字节
        for x in range(width):
            idx = (y * width + x) * 4
            raw_data.extend(pixels[idx:idx+4])

    compressed = zlib.compress(bytes(raw_data))
    idat = create_chunk(b'IDAT', compressed)

    # IEND chunk
    iend = create_chunk(b'IEND', b'')

    return signature + ihdr + idat + iend

def create_chunk(chunk_type, data):
    """创建PNG chunk"""
    length = struct.pack('>I', len(data))
    crc = struct.pack('>I', zlib.crc32(chunk_type + data) & 0xffffffff)
    return length + chunk_type + data + crc

def get_gradient_color(x, y, size):
    """获取渐变颜色 (#667eea -> #764ba2)"""
    ratio = (x + y) / (size * 2)

    r1, g1, b1 = 102, 126, 234  # #667eea
    r2, g2, b2 = 118, 75, 162   # #764ba2

    r = int(r1 + (r2 - r1) * ratio)
    g = int(g1 + (g2 - g1) * ratio)
    b = int(b1 + (b2 - b1) * ratio)

    return [r, g, b, 255]

def draw_rounded_rect(pixels, size, radius=50):
    """绘制圆角矩形背景（实际上是整个填充）"""
    pass  # 背景已经在主函数中填充

def draw_plane_icon(pixels, size, center_x, center_y, icon_size):
    """绘制简化的飞机图标"""
    # 绘制白色圆形背景
    radius = icon_size * 0.35
    for y in range(size):
        for x in range(size):
            dx = x - center_x
            dy = y - center_y
            distance = math.sqrt(dx * dx + dy * dy)

            if distance <= radius:
                pixels[(y * size + x) * 4:(y * size + x) * 4 + 4] = [255, 255, 255, 255]
            elif distance <= radius + 3:
                # 边缘抗锯齿
                alpha = max(0, int(255 * (1 - (distance - radius) / 3)))
                idx = (y * size + x) * 4
                if pixels[idx + 3] == 255:  # 只覆盖背景色
                    pixels[idx] = 255
                    pixels[idx + 1] = 255
                    pixels[idx + 2] = 255
                    pixels[idx + 3] = alpha

    # 绘制飞机符号（简化的十字形）
    cross_size = int(icon_size * 0.2)
    cross_width = int(icon_size * 0.04)

    for y in range(size):
        for x in range(size):
            dx = x - center_x
            dy = y - center_y

            # 垂直线
            if abs(dx) < cross_width and abs(dy) < cross_size:
                idx = (y * size + x) * 4
                pixels[idx] = 102    # R
                pixels[idx + 1] = 126  # G
                pixels[idx + 2] = 234  # B
                pixels[idx + 3] = 255  # A

            # 水平线
            if abs(dy) < cross_width and abs(dx) < cross_size:
                idx = (y * size + x) * 4
                pixels[idx] = 102
                pixels[idx + 1] = 126
                pixels[idx + 2] = 234
                pixels[idx + 3] = 255

def generate_icon(size, filename):
    """生成指定尺寸的图标"""
    print(f"生成 {size}x{size} 图标...")

    # 初始化像素数组 (RGBA)
    pixels = bytearray(size * size * 4)

    center_x = size // 2
    center_y = size // 2

    # 填充渐变背景
    for y in range(size):
        for x in range(size):
            color = get_gradient_color(x, y, size)
            idx = (y * size + x) * 4
            pixels[idx] = color[0]     # R
            pixels[idx + 1] = color[1] # G
            pixels[idx + 2] = color[2] # B
            pixels[idx + 3] = color[3] # A

    # 绘制飞机图标
    draw_plane_icon(pixels, size, center_x, center_y, size)

    # 创建PNG
    png_data = create_png(size, size, pixels)

    # 保存文件
    with open(filename, 'wb') as f:
        f.write(png_data)

    print(f"✓ 已保存: {filename}")

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))

    try:
        generate_icon(192, os.path.join(script_dir, 'icon-192.png'))
        generate_icon(512, os.path.join(script_dir, 'icon-512.png'))

        print("\n✅ 图标生成完成！")
        print("📍 文件位置:")
        print("   - icon-192.png (192x192)")
        print("   - icon-512.png (512x512)")
        print("\n现在可以部署PWA了！")

    except Exception as e:
        print(f"❌ 生成图标时出错: {e}")
        import traceback
        traceback.print_exc()
        exit(1)

if __name__ == '__main__':
    main()
