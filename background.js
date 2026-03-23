// 鼠标手势插件 - 后台服务工作线程
console.log('后台脚本已加载');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('收到消息:', message, '来自:', sender);
  
  if (message.type === 'GESTURE_ACTION') {
    // 获取当前活动的标签页
    const tabId = sender.tab ? sender.tab.id : null;
    executeAction(message.action, tabId);
    sendResponse({ success: true });
  }
  
  return true;
});

// 执行手势操作
async function executeAction(action, tabId) {
  console.log('执行操作:', action, '标签页ID:', tabId);
  
  try {
    // 如果没有 tabId，获取当前活动标签页
    if (!tabId) {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      tabId = tab.id;
      console.log('获取当前标签页:', tabId);
    }
    
    const tab = await chrome.tabs.get(tabId);
    
    switch (action) {
      case 'goBack':
        await chrome.tabs.goBack(tabId);
        break;
        
      case 'goForward':
        await chrome.tabs.goForward(tabId);
        break;
        
      case 'scrollToTop':
        await chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: () => window.scrollTo(0, 0)
        });
        break;
        
      case 'scrollToBottom':
        await chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: () => window.scrollTo(0, document.body.scrollHeight)
        });
        break;
        
      case 'closeTab':
        await chrome.tabs.remove(tabId);
        break;
        
      case 'newTab':
        await chrome.tabs.create({ index: tab.index + 1 });
        break;
        
      case 'refresh':
        await chrome.tabs.reload(tabId);
        break;
        
      case 'stop':
        await chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: () => window.stop()
        });
        break;
    }
  } catch (error) {
    console.error('执行操作失败:', action, error);
  }
}

// 点击插件图标时打开侧边栏
chrome.action.onClicked.addListener((tab) => {
  console.log('点击了插件图标');
  chrome.sidePanel.open({ windowId: tab.windowId });
});
