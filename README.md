# 鼠标手势 Chrome 扩展

[English](#english) | 中文

一个轻量级的 Chrome 浏览器扩展，通过鼠标手势快速执行浏览器操作。

![Chrome Web Store](https://img.shields.io/badge/Chrome-Extension-blue)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-green)

## 功能特性

- 🖱️ **鼠标手势检测**：按住鼠标右键并移动，实时显示轨迹
- 🎨 **Canvas 轨迹绘制**：使用 HTML5 Canvas 绘制平滑的手势轨迹
- ⚡ **预设手势**：支持 8 种常用手势操作
- 📑 **侧边栏控制**：在 chrome:// 页面也能通过侧边栏执行操作
- 🏠 **自定义新标签页**：替换默认新标签页，支持手势操作

## 支持的手势

| 手势 | 操作 | 说明 |
|------|------|------|
| `←` | 返回 | 返回上一页 |
| `→` | 前进 | 前进到下一页 |
| `↑` | 顶部 | 滚动到页面顶部 |
| `↓` | 底部 | 滚动到页面底部 |
| `↓→` | 关闭标签 | 关闭当前标签页 |
| `↓←` | 新建标签 | 打开新标签页 |
| `↑↓` | 刷新 | 重新加载页面 |
| `↓↑` | 停止 | 停止页面加载 |

## 安装方法

### 从源码安装

1. 克隆仓库
```bash
git clone https://github.com/laberat/my-mouse-gesture.git
```

2. 打开 Chrome 浏览器，访问 `chrome://extensions/`

3. 开启右上角的「开发者模式」

4. 点击「加载已解压的扩展程序」

5. 选择 `my-mouse-gesture` 文件夹

## 使用方法

### 鼠标手势
1. 在任意网页按住鼠标右键
2. 移动鼠标绘制手势轨迹
3. 松开右键，执行对应操作

### 侧边栏控制
1. 点击浏览器工具栏的插件图标
2. 在侧边栏中点击对应按钮执行操作
3. 适用于 chrome:// 等无法使用鼠标手势的页面

## 项目结构

```
my-mouse-gesture/
├── manifest.json          # Manifest V3 配置文件
├── content.js             # 内容脚本（核心手势检测逻辑）
├── content.css            # 轨迹样式
├── background.js          # 后台服务工作线程
├── sidepanel.html         # 侧边栏界面
├── sidepanel.js           # 侧边栏脚本
├── newtab.html            # 自定义新标签页
└── icons/                 # 插件图标
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## 核心文件说明

### content.js
核心手势检测逻辑，包含以下主要函数：

- `createCanvas()` - 创建全屏 Canvas 元素用于绘制轨迹
- `startGesture(x, y)` - 开始手势，记录起始点
- `updateGesture(x, y)` - 更新手势轨迹
- `endGesture()` - 结束手势并识别动作
- `drawTrace()` - 绘制手势轨迹线条
- `recognizeGesture()` - 识别手势方向
- `detectSegments()` - 检测组合手势的方向段
- `detectSingleDirection(dx, dy)` - 检测单一方向（上下左右）

### background.js
后台服务工作线程，处理扩展级别的操作：

- `executeAction(action, tabId)` - 执行手势对应的操作
- 支持的操作：返回、前进、滚动、关闭标签、新建标签、刷新、停止
- `chrome.action.onClicked` - 点击图标打开侧边栏

### sidepanel.js
侧边栏控制脚本：

- `initGestures()` - 初始化手势按钮点击事件
- 通过 `chrome.runtime.sendMessage` 与 background 通信

## 权限说明

| 权限 | 用途 |
|------|------|
| `tabs` | 管理标签页（关闭、新建、切换） |
| `activeTab` | 访问当前活动标签页 |
| `scripting` | 执行脚本（滚动、停止加载等） |
| `sidePanel` | 显示侧边栏控制面板 |

## 注意事项

- Chrome 内置页面（chrome://）无法使用鼠标手势，但可通过侧边栏操作
- macOS/Linux 系统需双击右键才能打开右键菜单
- 手势需要移动一定距离（默认 50px）才会触发
- 新标签页、历史记录末尾等页面无法执行「前进」操作

## 许可证

MIT License

---

<a name="english"></a>
# Mouse Gesture Chrome Extension

English | [中文](#鼠标手势-chrome-扩展)

A lightweight Chrome browser extension for executing browser operations quickly through mouse gestures.

![Chrome Web Store](https://img.shields.io/badge/Chrome-Extension-blue)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-green)

## Features

- 🖱️ **Mouse Gesture Detection**: Hold right-click and move to display real-time trace
- 🎨 **Canvas Trace Drawing**: Smooth gesture trace using HTML5 Canvas
- ⚡ **Preset Gestures**: Supports 8 common gesture operations
- 📑 **Side Panel Control**: Execute operations via side panel on chrome:// pages
- 🏠 **Custom New Tab**: Replace default new tab page with gesture support

## Supported Gestures

| Gesture | Action | Description |
|---------|--------|-------------|
| `←` | Back | Go back to previous page |
| `→` | Forward | Go forward to next page |
| `↑` | Top | Scroll to page top |
| `↓` | Bottom | Scroll to page bottom |
| `↓→` | Close Tab | Close current tab |
| `↓←` | New Tab | Open new tab |
| `↑↓` | Refresh | Reload current page |
| `↓↑` | Stop | Stop page loading |

## Installation

### Install from Source

1. Clone the repository
```bash
git clone https://github.com/laberat/my-mouse-gesture.git
```

2. Open Chrome browser and go to `chrome://extensions/`

3. Enable "Developer mode" in the top right

4. Click "Load unpacked"

5. Select the `my-mouse-gesture` folder

## Usage

### Mouse Gestures
1. Hold right-click on any webpage
2. Move mouse to draw gesture trace
3. Release right-click to execute the corresponding action

### Side Panel Control
1. Click the extension icon in the browser toolbar
2. Click buttons in the side panel to execute actions
3. Works on chrome:// pages where mouse gestures cannot be used

## Project Structure

```
my-mouse-gesture/
├── manifest.json          # Manifest V3 configuration
├── content.js             # Content script (core gesture detection logic)
├── content.css            # Trace styles
├── background.js          # Background service worker
├── sidepanel.html         # Side panel interface
├── sidepanel.js           # Side panel script
├── newtab.html            # Custom new tab page
└── icons/                 # Extension icons
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## Core Files

### content.js
Core gesture detection logic with main functions:

- `createCanvas()` - Create full-screen Canvas for trace drawing
- `startGesture(x, y)` - Start gesture, record start point
- `updateGesture(x, y)` - Update gesture trace
- `endGesture()` - End gesture and recognize action
- `drawTrace()` - Draw gesture trace lines
- `recognizeGesture()` - Recognize gesture direction
- `detectSegments()` - Detect direction segments for combined gestures
- `detectSingleDirection(dx, dy)` - Detect single direction (up/down/left/right)

### background.js
Background service worker for extension-level operations:

- `executeAction(action, tabId)` - Execute gesture corresponding action
- Supported actions: back, forward, scroll, close tab, new tab, refresh, stop
- `chrome.action.onClicked` - Open side panel on icon click

### sidepanel.js
Side panel control script:

- `initGestures()` - Initialize gesture button click events
- Communicates with background via `chrome.runtime.sendMessage`

## Permissions

| Permission | Purpose |
|------------|---------|
| `tabs` | Manage tabs (close, new, switch) |
| `activeTab` | Access current active tab |
| `scripting` | Execute scripts (scroll, stop loading) |
| `sidePanel` | Display side panel control |

## Notes

- Chrome internal pages (chrome://) cannot use mouse gestures, but side panel operations are available
- macOS/Linux systems require double right-click to open context menu
- Gestures need to move a certain distance (default 50px) to trigger
- Cannot execute "forward" on new tab, end of history, etc.

## License

MIT License
