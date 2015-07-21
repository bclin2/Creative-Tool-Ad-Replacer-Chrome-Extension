
function imageReplacer() {
  var imageReplacerButton = document.getElementById('imageReplacer');
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  });
  window.close();
};

//Need to change to a checkbox or on/off switch
//talk to background.js to remove/add event filter listener
function videoReplacer() {
  // var videoReplacerButton = document.getElementById('videoReplacer');
  // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  //   var activeTab = tabs[0];
  //   chrome.tabs.sendMessage(activeTab.id, {"message": "video_replacer_activated"});
  // });
  window.close();
};

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById('imageReplacer').addEventListener("click", imageReplacer);
  document.getElementById('videoReplacer').addEventListener("click", videoReplacer);
});