# 将旅行备忘录网页打包为安卓App

本文档提供两种主流方案，推荐根据你的需求选择。

---

## 方案对比

### 方案1：PWA（已完成配置）⭐ 推荐新手
**优点：**
- 无需安装开发环境
- 更新即时生效，无需审核
- 支持离线访问
- 可以添加到桌面，体验接近原生App

**缺点：**
- 无法发布到应用商店
- 部分原生功能受限

**使用方法：**
1. 将文件部署到HTTPS服务器（如GitHub Pages、Vercel等）
2. 用户在Chrome浏览器中打开
3. 点击菜单 → "添加到主屏幕"
4. 即可像App一样使用

---

### 方案2：Capacitor打包 ⭐ 推荐正式发布

Capacitor是目前最流行的混合应用打包工具，由Ionic团队开发。

#### 前置要求

1. **安装Node.js** (v16+)
   ```bash
   # macOS
   brew install node

   # Windows: 从 https://nodejs.org/ 下载安装
   ```

2. **安装Android Studio**
   - 下载地址：https://developer.android.com/studio
   - 安装时勾选 "Android SDK" 和 "Android Virtual Device"
   - 首次启动后，在SDK Manager中安装 Android SDK Platform 33+

3. **设置环境变量**（macOS/Linux）
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
   ```

#### 打包步骤

**第1步：初始化项目**

在项目目录打开终端，执行：

```bash
# 初始化npm项目
npm init -y

# 安装Capacitor核心包
npm install @capacitor/core @capacitor/cli @capacitor/android

# 初始化Capacitor
npx cap init "旅行清单" com.travel.checklist --web-dir=.
```

**第2步：添加安卓平台**

```bash
# 添加Android平台
npx cap add android
```

**第3步：构建应用**

```bash
# 同步文件到Android项目
npx cap sync
```

**第4步：在Android Studio中打开并打包**

```bash
# 用Android Studio打开项目
npx cap open android
```

在Android Studio中：
1. 等待Gradle同步完成
2. 连接安卓手机或启动模拟器
3. 点击 "Run" 按钮测试
4. 选择 Build → Generate Signed Bundle / APK 生成安装包

**第5步：生成签名APK（发布用）**

1. 在Android Studio中选择 `Build` → `Generate Signed Bundle / APK`
2. 选择 `APK`
3. 创建新的密钥库（Keystore）
   - 记住密码，妥善保管
4. 选择 `release` 构建类型
5. 生成的APK位于 `app/release/app-release.apk`

---

### 方案3：使用在线打包服务（最简单）

如果不想配置开发环境，可以使用在线服务：

#### 选项A：WebIntoApp
1. 访问 https://www.webintoapp.com/
2. 上传你的HTML文件或输入URL
3. 设置应用名称、图标等
4. 下载生成的APK文件

#### 选项B：AppsGeyser
1. 访问 https://appsgeyser.com/
2. 选择 "Website" 模板
3. 输入你的网页URL
4. 自定义图标和名称
5. 下载APK

**注意：** 在线服务可能有水印或功能限制。

---

## 快速开始：使用Capacitor的完整命令

```bash
# 进入项目目录
cd "/Users/leontovey/Desktop/旅行备忘录软件"

# 1. 初始化npm
npm init -y

# 2. 安装Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# 3. 初始化Capacitor配置
npx cap init "旅行清单" com.travel.checklist --web-dir=.

# 4. 添加Android平台
npx cap add android

# 5. 同步文件
npx cap sync

# 6. 在Android Studio中打开
npx cap open android
```

---

## 常见问题

### Q1: 打包后页面空白？
确保 `capacitor.config.json` 中的 `webDir` 设置为 `"."`（当前目录）

### Q2: 如何更新应用内容？
修改HTML文件后，重新执行：
```bash
npx cap sync
npx cap open android
```

### Q3: 如何调试安卓App？
1. 在手机开发者选项中开启 "USB调试"
2. Chrome浏览器访问 `chrome://inspect`
3. 可以看到连接的设备并进行调试

### Q4: 应用权限问题？
在 `android/app/src/main/AndroidManifest.xml` 中添加所需权限：
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

---

## 推荐方案总结

| 场景 | 推荐方案 |
|------|----------|
| 个人使用/快速部署 | PWA（已配置好） |
| 分享给朋友 | Capacitor打包APK |
| 发布到应用商店 | Capacitor + 正式签名 |
| 不想配置环境 | 在线打包服务 |

**建议：** 先使用PWA方案测试，确认功能满意后再用Capacitor打包发布。
