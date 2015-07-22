// background.js
//chrome storage reset
chrome.storage.local.clear(function() {
  console.log("CLEARED CHROME STORAGE!!!!!");
});

// chrome.runtime.onConnect.addListener(function(port) {
//   console.log("Connected...", port);
//   //connect to content.js
//   var backgroundPort;
//   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     var activeTab = tabs[0];
//     backgroundPort = chrome.tabs.connect(activeTab.id, {name: "backgroundToContent"});
//   });
//   port.onMessage.addListener(function(message) {
//     console.log("message received: ", message);
//     if (message.videoToggle) {
//       console.log("Activating onHeadersReceived Listeners...");
//       //addListeners for filters
//       backgroundPort.postMessage({videoToggleListenersActive: true});
//     } else {
//       console.log("Deacivating onHeadersReceived Listeners");
//       //removeEventListeners for Filters
//     }

//     if (message.redirectURL) {
//       console.log("content.js: ", message.redirectURL);
//       //receive redirectURL and tell listeners to redirect to it
//     }
//   });
// });

//CHECK if event filtering is set to on/off
  //if ON, set event filters to ON, tell content.js to reload the page, and prompt users for a redirect URL in content.js
  //DEFAULT is OFF

// function vastRedirect() {
//   //Let user know the video ads have been replaced with alert
//   //replace video ad VAST request
//   //delete redirectURL from storage

// }

var testRedirectURL = "http://demo.tremorvideo.com/proddev/vast/vast_inline_linear.xml";

var testRedirectURL2 = "http://demo.tremorvideo.com/proddev/vast/vast_wrapper_linear_1.xml"
chrome.webRequest.onHeadersReceived.addListener(
  function(details) {
    var blockingResponse = {};
    var responseHeaders = details.responseHeaders;
    var statusFlag = false;
    var locationFlag = false;

    if (details.type === "script") {
      return;
    }

    for (var i = 0; i < responseHeaders.length; i++) {
      if (responseHeaders[i].name === "Status" || responseHeaders[i].name === "status") {
        responseHeaders[i].value = "302";
        statusFlag = true;
      } else if (responseHeaders[i].name === "Location" || responseHeaders[i].name === "location") {
        responseHeaders[i].value = testRedirectURL;
        locationFlag = true;
      } 
    }
    if (!locationFlag) {
      responseHeaders.push({"name": "Location", "value": testRedirectURL});
    }
    if (!statusFlag) {
      responseHeaders.push({"name": "Status", "value": "302"});
    }
    console.log(details);
    blockingResponse.responseHeaders = responseHeaders;
    blockingResponse.redirectUrl = testRedirectURL;
    return blockingResponse;
  },
  {urls: [ '*://*.telemetryverification.net/*',
   '*://*.vindicosuite.com/*',
   '*://*.tidaltv.com/*',
   '*://*.mookie1.com/*',
   '*://*.doubleclick.net/*',
   '*://rtr.innovid.com/r1*',
   '*://*.freewheel.tv/*',
   '*://optimized-by.rubiconproject.com/a/api/vast*',
   '*://uswvideo.adsrvr.org/data/vast/*'
  ]},  //event filtering 
  ["blocking", "responseHeaders"]
);  
