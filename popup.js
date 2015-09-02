var port;
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  var activeTab = tabs[0];
  port = chrome.tabs.connect(activeTab.id, {name: "popupToContent"});
});

function imageReplacer() {
  var imageReplacerButton = document.getElementById('imageReplacer');
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  });
  window.close();
}

function videoToggle() { 
  var checked = document.getElementById('videoToggle').checked;
  console.log("STATUS: ", checked);
  chrome.browserAction.setBadgeBackgroundColor({color: "red"});
  if (checked) {
    chrome.browserAction.setBadgeText({text: "vON"});
  } else {
    chrome.browserAction.setBadgeText({text: "vOFF"});
  }
  chrome.storage.local.set({"videoToggleStatus": checked});

  port.postMessage({videoToggle: checked});
}

function checkAndAssignVideoToggleStatus() {
  var toggle;
  chrome.storage.local.get("videoToggleStatus", function(obj) {
    toggle = obj;
    console.log(toggle);
    if (toggle) {
      if (toggle.videoToggleStatus) {
        document.getElementById('videoToggle').checked = true;
      } else {
      document.getElementById('videoToggle').checked = false;
      }
    }
  });
}

checkAndAssignVideoToggleStatus();

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById('imageReplacer').addEventListener("click", imageReplacer);
  document.getElementById('videoToggle').addEventListener('click', videoToggle);
});
