// 侧边栏控制脚本
console.log('侧边栏脚本开始加载');

function initGestures() {
  console.log('初始化手势按钮');
  
  // 为所有手势按钮添加点击事件
  const gestureItems = document.querySelectorAll('.gesture-item');
  console.log('找到手势按钮数量:', gestureItems.length);
  
  gestureItems.forEach(item => {
    item.addEventListener('click', function() {
      const action = this.getAttribute('data-action');
      console.log('点击了手势按钮:', action);
      
      if (action) {
        chrome.runtime.sendMessage({
          type: 'GESTURE_ACTION',
          action: action
        }, response => {
          console.log('消息发送结果:', response);
        });
      }
    });
  });
}

// 确保 DOM 加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGestures);
} else {
  initGestures();
}
