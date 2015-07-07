// background.js

// Called when the user clicks on the browser action.
// Doesn't console log anything, but alerts work
chrome.browserAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    // console.log("Icon has been clicked!");
    // alert("Hello from background.js");
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  });
});