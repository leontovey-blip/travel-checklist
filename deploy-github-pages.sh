#!/bin/bash

# 旅行备忘录 - GitHub Pages快速部署脚本
# 使用方法: ./deploy-github-pages.sh

echo "🚀 开始部署到GitHub Pages..."
echo ""

# 检查是否在正确的目录
if [ ! -f "travel-checklist.html" ]; then
    echo "❌ 错误: 请在项目目录下运行此脚本"
    exit 1
fi

# 检查git是否安装
if ! command -v git &> /dev/null; then
    echo "❌ 错误: 未检测到Git"
    echo "请先安装Git: https://git-scm.com/"
    exit 1
fi

# 检查是否已初始化git
if [ ! -d ".git" ]; then
    echo "📦 初始化Git仓库..."
    git init
    echo "✓ Git仓库已初始化"
    echo ""
fi

# 添加所有文件
echo "📝 添加文件到Git..."
git add .

# 创建提交
echo "💾 创建提交..."
git commit -m "Deploy PWA: $(date '+%Y-%m-%d %H:%M:%S')"

echo ""
echo "✅ Git提交完成！"
echo ""
echo "接下来的步骤："
echo ""
echo "1️⃣  在GitHub上创建新仓库"
echo "   访问: https://github.com/new"
echo "   仓库名建议: travel-checklist"
echo "   选择: Public（公开）"
echo ""
echo "2️⃣  关联远程仓库并推送"
echo "   运行以下命令（替换YOUR_USERNAME为你的GitHub用户名）："
echo ""
echo "   git remote add origin https://github.com/YOUR_USERNAME/travel-checklist.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3️⃣  启用GitHub Pages"
echo "   - 进入仓库的 Settings → Pages"
echo "   - Source 选择: main 分支"
echo "   - 点击 Save"
echo ""
echo "4️⃣  等待1-2分钟，访问你的应用："
echo "   https://YOUR_USERNAME.github.io/travel-checklist/travel-checklist.html"
echo ""
echo "5️⃣  在手机浏览器打开，添加到主屏幕即可使用！"
echo ""
echo "详细指南请查看: PWA部署指南.md"
echo ""
