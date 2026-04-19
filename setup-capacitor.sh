#!/bin/bash

# 旅行备忘录 - Capacitor打包快速设置脚本
# 使用方法: chmod +x setup-capacitor.sh && ./setup-capacitor.sh

echo "🚀 开始设置Capacitor打包环境..."

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 未检测到Node.js"
    echo "请先安装Node.js: https://nodejs.org/"
    echo "macOS用户可以使用: brew install node"
    exit 1
fi

echo "✅ Node.js版本: $(node -v)"
echo "✅ npm版本: $(npm -v)"

# 初始化npm项目（如果尚未初始化）
if [ ! -f "package.json" ]; then
    echo "📦 初始化npm项目..."
    npm init -y
else
    echo "✅ package.json已存在"
fi

# 安装Capacitor依赖
echo "📥 安装Capacitor依赖..."
npm install @capacitor/core @capacitor/cli @capacitor/android

# 初始化Capacitor
echo "⚙️  初始化Capacitor配置..."
npx cap init "旅行清单" com.travel.checklist --web-dir=. --force

# 检查是否已添加Android平台
if [ ! -d "android" ]; then
    echo "🤖 添加Android平台..."
    npx cap add android
else
    echo "✅ Android平台已存在"
fi

# 同步文件
echo "🔄 同步文件到Android项目..."
npx cap sync

echo ""
echo "✨ 设置完成！"
echo ""
echo "接下来的步骤："
echo "1. 安装Android Studio: https://developer.android.com/studio"
echo "2. 运行以下命令在Android Studio中打开项目："
echo "   npx cap open android"
echo "3. 在Android Studio中点击Run按钮测试应用"
echo "4. 选择 Build → Generate Signed Bundle / APK 生成安装包"
echo ""
echo "详细指南请查看: 打包安卓App指南.md"
