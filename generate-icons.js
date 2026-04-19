const fs = require('fs');
const path = require('path');

/**
 * 生成简单的PNG图标（使用base64编码的简化方案）
 * 这是一个简化的PNG生成器，用于创建应用图标
 */

// PNG文件头
function createPNG(width, height, pixels) {
    const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

    // IHDR chunk
    const ihdrData = Buffer.alloc(13);
    ihdrData.writeUInt32BE(width, 0);
    ihdrData.writeUInt32BE(height, 4);
    ihdrData[8] = 8; // bit depth
    ihdrData[9] = 6; // color type (RGBA)
    ihdrData[10] = 0; // compression
    ihdrData[11] = 0; // filter
    ihdrData[12] = 0; // interlace

    const ihdr = createChunk('IHDR', ihdrData);

    // IDAT chunk (image data)
    const rawData = Buffer.alloc((width * 4 + 1) * height);
    for (let y = 0; y < height; y++) {
        rawData[y * (width * 4 + 1)] = 0; // filter byte
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const pixel = pixels[y * width + x];
            rawData[y * (width * 4 + 1) + 1 + idx] = pixel[0];     // R
            rawData[y * (width * 4 + 1) + 2 + idx] = pixel[1];     // G
            rawData[y * (width * 4 + 1) + 3 + idx] = pixel[2];     // B
            rawData[y * (width * 4 + 1) + 4 + idx] = pixel[3];     // A
        }
    }

    const compressed = require('zlib').deflateSync(rawData);
    const idat = createChunk('IDAT', compressed);

    // IEND chunk
    const iend = createChunk('IEND', Buffer.alloc(0));

    return Buffer.concat([signature, ihdr, idat, iend]);
}

function createChunk(type, data) {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length, 0);

    const typeBuffer = Buffer.from(type);

    const crc = Buffer.alloc(4);
    const crcData = Buffer.concat([typeBuffer, data]);
    crc.writeUInt32BE(crc32(crcData), 0);

    return Buffer.concat([length, typeBuffer, data, crc]);
}

function crc32(data) {
    let crc = 0xFFFFFFFF;
    const table = getCRC32Table();

    for (let i = 0; i < data.length; i++) {
        crc = table[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
    }

    return (crc ^ 0xFFFFFFFF) >>> 0;
}

function getCRC32Table() {
    const table = [];
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) {
            c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
        }
        table[n] = c >>> 0;
    }
    return table;
}

// 生成渐变背景色
function getGradientColor(x, y, size) {
    // 紫色渐变: #667eea -> #764ba2
    const ratio = (x + y) / (size * 2);

    const r1 = 102, g1 = 126, b1 = 234; // #667eea
    const r2 = 118, g2 = 75, b2 = 162;  // #764ba2

    const r = Math.round(r1 + (r2 - r1) * ratio);
    const g = Math.round(g1 + (g2 - g1) * ratio);
    const b = Math.round(b1 + (b2 - b1) * ratio);

    return [r, g, b, 255];
}

// 绘制飞机图标
function drawPlane(pixels, size, centerX, centerY, scale) {
    const planePath = [
        // 机身
        {x: 0, y: -120}, {x: 15, y: -100}, {x: 15, y: 80}, {x: 80, y: 100},
        {x: 80, y: 120}, {x: 15, y: 100}, {x: 15, y: 140}, {x: 40, y: 150},
        {x: 40, y: 170}, {x: 0, y: 160}, {x: -40, y: 170}, {x: -40, y: 150},
        {x: -15, y: 140}, {x: -15, y: 100}, {x: -80, y: 120}, {x: -80, y: 100},
        {x: -15, y: 80}, {x: -15, y: -100}
    ];

    // 简单填充（使用边界框近似）
    for (let py = -150; py <= 180; py++) {
        for (let px = -100; px <= 100; px++) {
            // 检查点是否在飞机范围内（简化版）
            const scaledX = px * scale;
            const scaledY = py * scale;

            // 机身（简化为矩形区域）
            if (Math.abs(px) < 20 && py >= -120 && py <= 160) {
                const x = Math.round(centerX + scaledX);
                const y = Math.round(centerY + scaledY);
                if (x >= 0 && x < size && y >= 0 && y < size) {
                    pixels[y * size + x] = [255, 255, 255, 240];
                }
            }

            // 机翼
            if (py >= -50 && py <= 50) {
                const wingWidth = 100 - Math.abs(py) * 0.5;
                if ((px >= 20 && px <= wingWidth) || (px <= -20 && px >= -wingWidth)) {
                    const x = Math.round(centerX + scaledX);
                    const y = Math.round(centerY + scaledY);
                    if (x >= 0 && x < size && y >= 0 && y < size) {
                        pixels[y * size + x] = [255, 255, 255, 230];
                    }
                }
            }
        }
    }
}

// 生成图标
function generateIcon(size, filename) {
    console.log(`生成 ${size}x${size} 图标...`);

    const pixels = new Array(size * size);
    const centerX = size / 2;
    const centerY = size / 2;
    const scale = size / 512;

    // 填充背景
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            pixels[y * size + x] = getGradientColor(x, y, size);
        }
    }

    // 绘制飞机（简化版 - 白色圆形代表）
    const radius = size * 0.3;
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const dx = x - centerX;
            const dy = y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= radius) {
                // 飞机主体 - 白色
                pixels[y * size + x] = [255, 255, 255, 255];
            } else if (distance <= radius + 5) {
                // 边缘柔化
                const alpha = Math.max(0, 255 - (distance - radius) * 50);
                if (pixels[y * size + x][3] === 255) {
                    pixels[y * size + x] = [255, 255, 255, alpha];
                }
            }
        }
    }

    // 添加简单的飞机符号 ✈
    const fontSize = size * 0.4;
    // 由于无法直接绘制文字，使用简化的十字形表示
    const crossSize = size * 0.15;
    const crossWidth = size * 0.04;

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const dx = x - centerX;
            const dy = y - centerY;

            // 垂直线
            if (Math.abs(dx) < crossWidth && Math.abs(dy) < crossSize) {
                pixels[y * size + x] = [102, 126, 234, 255]; // 紫色
            }
            // 水平线
            if (Math.abs(dy) < crossWidth && Math.abs(dx) < crossSize) {
                pixels[y * size + x] = [102, 126, 234, 255]; // 紫色
            }
        }
    }

    const png = createPNG(size, size, pixels);
    fs.writeFileSync(filename, png);
    console.log(`✓ 已保存: ${filename}`);
}

// 主函数
function main() {
    const dir = __dirname;

    try {
        generateIcon(192, path.join(dir, 'icon-192.png'));
        generateIcon(512, path.join(dir, 'icon-512.png'));

        console.log('\n✅ 图标生成完成！');
        console.log('📍 文件位置:');
        console.log('   - icon-192.png (192x192)');
        console.log('   - icon-512.png (512x512)');
        console.log('\n现在可以部署PWA了！');
    } catch (error) {
        console.error('❌ 生成图标时出错:', error.message);
        process.exit(1);
    }
}

main();
