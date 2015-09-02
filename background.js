// background.js
//chrome storage reset
chrome.storage.local.clear(function() {
  console.log("CLEARED CHROME STORAGE!!!!!");
});

// var testRedirectURL = "http://demo.tremorvideo.com/proddev/vast/vast_inline_linear.xml";

//var infiniteLoopURL = https://rtr.innovid.com/r1.55e4831dc3b3c3.17762631;cb=[timestamp]
var redirectUrl;

var vastRedirectAddListener = function(details) {
  if (details.type === "script" || details.url.includes("crossdomain.xml")) {
    return;
  }

  var blockingResponse = {};
  var responseHeaders = details.responseHeaders;
  var statusFlag = false;
  var locationFlag = false;

  for (var i = 0; i < responseHeaders.length; i++) {
    if (responseHeaders[i].name === "Status" || responseHeaders[i].name === "status") {
      responseHeaders[i].value = "302";
      statusFlag = true;
    } else if (responseHeaders[i].name === "Location" || responseHeaders[i].name === "location") {
      responseHeaders[i].value = redirectUrl;
      locationFlag = true;
    } 
  }
  if (!locationFlag) {
    responseHeaders.push({"name": "Location", "value": redirectUrl});
  }
  if (!statusFlag) {
    responseHeaders.push({"name": "Status", "value": "302"});
  }
  //not adding the responseHeaders seem to make no difference
  blockingResponse.responseHeaders = responseHeaders;
  blockingResponse.redirectUrl = redirectUrl;
  return blockingResponse;
};

var inputVastRedirectUrlCheck = function(inputVastTag) {
  var baseBlockedUrls = [
    ".telemetryverification.net/",
    ".vindicosuite.com/",
    ".tidaltv.com/",
    ".mookie1.com/",
    ".doubleclick.net/",
    "rtr.innovid.com/r1",
    ".freewheel.tv/",
    "optimized-by.rubiconproject.com/a/api/vast",
    "uswvideo.adsrvr.org/data/vast/",
    ".liverail.com/",
    "ads.adaptv.advertising.com/",
    "search.spotxchange.com/vast/",
    "vpc.altitude-arena.com/",
    ".tubemogul.com/",
    "vast.yashi.com/",
    "dbam.dashbida.com/kitaramedia/vast/",
    "app.scanscout.com/",
    ".amazon-adsystem.com/"
  ];

  for (var i = 0; i < baseBlockedUrls.length; i++) {
    if (inputVastTag.includes(baseBlockedUrls[i])) {
      return i;
    }
  }
};


chrome.runtime.onConnect.addListener(function(port) {
  // console.log("Connected...", port);
  var removedBlockUrl;
  var removedBlockUrlIndex;
  port.onMessage.addListener(function(message) {
    // console.log("message received: ", message);
    blockedUrls = [
      '*://*.telemetryverification.net/*',
      '*://*.vindicosuite.com/*',
      '*://*.tidaltv.com/*',
      '*://*.mookie1.com/*',
      '*://*.doubleclick.net/*',
      '*://rtr.innovid.com/r1*',
      '*://*.freewheel.tv/*',
      '*://optimized-by.rubiconproject.com/a/api/vast*',
      '*://uswvideo.adsrvr.org/data/vast/*',
      '*://*.liverail.com/*',
      '*://ads.adaptv.advertising.com/*',
      '*://search.spotxchange.com/vast/*',
      '*://vpc.altitude-arena.com/*',
      '*://*.tubemogul.com/*',
      '*://vast.yashi.com/*',
      '*://dbam.dashbida.com/kitaramedia/vast/*',
      '*://app.scanscout.com/*',
      '*://*.amazon-adsystem.com/*'
    ];


    if (message.redirectUrl) {
      // console.log("content.js: ", message.redirectUrl);
      //receive redirectURL
      redirectUrl = message.redirectUrl;
      removedBlockUrlIndex = inputVastRedirectUrlCheck(redirectUrl);
      removedBlockUrl = blockedUrls[removedBlockUrlIndex];
      blockedUrls.splice(removedBlockUrlIndex, 1);
      console.log(blockedUrls);
      //add event listener 
      chrome.webRequest.onHeadersReceived.addListener(
        vastRedirectAddListener,
        {
          urls: blockedUrls,
          types: ['other']
        },  //event filtering 
        ["blocking", "responseHeaders"]
      );  
    } else {
      chrome.webRequest.onHeadersReceived.removeListener(vastRedirectAddListener);
    }

    blockedUrls.splice(removedBlockUrlIndex, 0, removedBlockUrl);
    console.log(blockedUrls);
  });
});
