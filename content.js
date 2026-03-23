// 鼠标手势插件 - 核心逻辑
(function() {
  'use strict';

  // 配置常量
  const CONFIG = {
    MIN_DISTANCE: 50,           // 最小移动距离（像素）
    DIRECTION_THRESHOLD: 0.5,   // 方向判断阈值
    TRACE_COLOR: '#007AFF',     // 轨迹颜色
    TRACE_WIDTH: 3,             // 轨迹宽度
    TRACE_OPACITY: 0.8          // 轨迹透明度
  };

  // 手势-操作映射表
  const GESTURE_ACTIONS = {
    'LEFT': 'goBack',
    'RIGHT': 'goForward',
    'UP': 'scrollToTop',
    'DOWN': 'scrollToBottom',
    'DOWN_RIGHT': 'closeTab',
    'DOWN_LEFT': 'newTab',
    'UP_DOWN': 'refresh',
    'DOWN_UP': 'stop'
  };

  // 手势显示名称
  const GESTURE_NAMES = {
    'LEFT': '返回上一页',
    'RIGHT': '前进到下一页',
    'UP': '滚动到顶部',
    'DOWN': '滚动到底部',
    'DOWN_RIGHT': '关闭标签页',
    'DOWN_LEFT': '新建标签页',
    'UP_DOWN': '刷新页面',
    'DOWN_UP': '停止加载'
  };

  // 状态变量
  let isGesturing = false;
  let canvas = null;
  let ctx = null;
  let points = [];
  let startX = 0;
  let startY = 0;

  // 创建Canvas元素
  function createCanvas() {
    if (canvas) return;
    
    canvas = document.createElement('canvas');
    canvas.id = 'mouse-gesture-canvas';
    document.body.appendChild(canvas);
    
    ctx = canvas.getContext('2d');
    resizeCanvas();
    
    window.addEventListener('resize', resizeCanvas);
  }

  // 调整Canvas大小
  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // 开始手势
  function startGesture(x, y) {
    isGesturing = true;
    startX = x;
    startY = y;
    points = [{x, y}];
    
    createCanvas();
    clearCanvas();
  }

  // 更新手势轨迹
  function updateGesture(x, y) {
    if (!isGesturing) return;
    
    points.push({x, y});
    drawTrace();
  }

  // 结束手势
  function endGesture() {
    if (!isGesturing) return;
    
    isGesturing = false;
    const gesture = recognizeGesture();
    
    if (gesture && GESTURE_ACTIONS[gesture]) {
      executeAction(GESTURE_ACTIONS[gesture]);
    }
    
    clearCanvas();
    points = [];
  }

  // 绘制轨迹
  function drawTrace() {
    if (!ctx || points.length < 2) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    
    ctx.strokeStyle = CONFIG.TRACE_COLOR;
    ctx.lineWidth = CONFIG.TRACE_WIDTH;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = CONFIG.TRACE_OPACITY;
    ctx.stroke();
  }

  // 清空Canvas
  function clearCanvas() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // 识别手势
  function recognizeGesture() {
    if (points.length < 2) return null;
    
    const endPoint = points[points.length - 1];
    const deltaX = endPoint.x - startX;
    const deltaY = endPoint.y - startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // 距离太短，不识别
    if (distance < CONFIG.MIN_DISTANCE) return null;
    
    // 检测组合手势（多个方向段）
    const segments = detectSegments();
    
    if (segments.length >= 2) {
      // 组合手势
      return segments.join('_');
    } else {
      // 单一手势
      return detectSingleDirection(deltaX, deltaY);
    }
  }

  // 检测方向段
  function detectSegments() {
    const segments = [];
    const segmentLength = 30; // 每段最小长度
    
    let currentStart = 0;
    let currentDirection = null;
    
    for (let i = 1; i < points.length; i++) {
      const dx = points[i].x - points[currentStart].x;
      const dy = points[i].y - points[currentStart].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist >= segmentLength) {
        const dir = detectSingleDirection(dx, dy);
        
        if (dir && dir !== currentDirection) {
          segments.push(dir);
          currentDirection = dir;
          currentStart = i;
        }
      }
    }
    
    return segments;
  }

  // 检测单一方向
  function detectSingleDirection(dx, dy) {
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    
    if (absDx > absDy) {
      // 水平移动
      if (dx < -CONFIG.MIN_DISTANCE) return 'LEFT';
      if (dx > CONFIG.MIN_DISTANCE) return 'RIGHT';
    } else {
      // 垂直移动
      if (dy < -CONFIG.MIN_DISTANCE) return 'UP';
      if (dy > CONFIG.MIN_DISTANCE) return 'DOWN';
    }
    
    return null;
  }

  // 执行操作
  function executeAction(action) {
    // 发送消息给background script执行操作
    chrome.runtime.sendMessage({
      type: 'GESTURE_ACTION',
      action: action
    });
  }

  // 鼠标事件处理
  document.addEventListener('mousedown', function(e) {
    // 检测右键按下
    if (e.button === 2) {
      e.preventDefault();
      startGesture(e.clientX, e.clientY);
    }
  }, true);

  document.addEventListener('mousemove', function(e) {
    if (isGesturing) {
      e.preventDefault();
      updateGesture(e.clientX, e.clientY);
    }
  }, true);

  document.addEventListener('mouseup', function(e) {
    if (e.button === 2 && isGesturing) {
      e.preventDefault();
      endGesture();
    }
  }, true);

  // 阻止右键菜单
  document.addEventListener('contextmenu', function(e) {
    if (isGesturing) {
      e.preventDefault();
    }
  }, true);

  // 初始化
  if (document.body) {
    createCanvas();
  } else {
    document.addEventListener('DOMContentLoaded', createCanvas);
  }
})();
