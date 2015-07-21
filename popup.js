var port = chrome.runtime.connect({name: "popupToBackground"});

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

  // var videoReplacerButton = document.getElementById('videoReplacer');
  // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  //   var activeTab = tabs[0];
  //   chrome.tabs.sendMessage(activeTab.id, {"message": "video_replacer_activated"});
  // });
  // document.getElementById('videoReplacer').checked;

function videoToggle() { 
  var checked = document.getElementById('videoToggle').checked;
  console.log("STATUS: ", checked);
  chrome.storage.local.set({"videoToggleStatus": checked});
  port.postMessage({videoToggle: checked});
};

function checkAndAssignVideoToggleStatus() {
  var toggle;
  chrome.storage.local.get("videoToggleStatus", function(obj) {
    console.log("...can anyone hear me?");
    toggle = obj;
    console.log(toggle);
    if (toggle) {
      console.log("toggle exists!")
      if (toggle.videoToggleStatus) {
        console.log("toggle is true!");
        document.getElementById('videoToggle').checked = true;
      } else {
      document.getElementById('videoToggle').checked = false;
      }
    }
  });
};

checkAndAssignVideoToggleStatus();

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById('imageReplacer').addEventListener("click", imageReplacer);
  document.getElementById('videoToggle').addEventListener('click', videoToggle);

  // document.getElementById('videoReplacer').addEventListener("click", videoReplacer);
});
