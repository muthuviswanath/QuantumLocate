chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
      id: "inspectWithQuantumLocate",
      title: "Inspect with QuantumLocate",
      contexts: ["all"]
  });
});

// ✅ Listen for the context menu click event
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "inspectWithQuantumLocate") {
      // ✅ Send a message to content.js to highlight the stored element
      chrome.tabs.sendMessage(tab.id, { action: "highlightElement" });
  }
});