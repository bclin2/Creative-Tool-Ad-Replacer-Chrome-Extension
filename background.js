// background.js
//chrome storage reset
chrome.storage.local.clear(function() {
  console.log("CLEARED CHROME STORAGE!!!!!");
});

// var testRedirectURL = "http://demo.tremorvideo.com/proddev/vast/vast_inline_linear.xml";

//var infiniteLoopURL = https://rtr.innovid.com/r1.55e4831dc3b3c3.17762631;cb=[timestamp]
var redirectUrl;
var blockedUrls;
var counter = 0;

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

  counter++;

  if (counter > 5) {
    counter = 0;
    chrome.webRequest.onHeadersReceived.removeListener(vastRedirectAddListener);
    setTimeout(vastWebRequestRedirect, 5000);
  }

  //not adding the responseHeaders seem to make no difference
  blockingResponse.responseHeaders = responseHeaders;
  blockingResponse.redirectUrl = redirectUrl;  
  return blockingResponse;
};

var vastWebRequestRedirect = function() {
  chrome.webRequest.onHeadersReceived.addListener(
    vastRedirectAddListener,
    {
      urls: blockedUrls,
      types: ['other']
    },  //event filtering 
    ["blocking", "responseHeaders"]
  );  
};

chrome.runtime.onConnect.addListener(function(port) {
  var removedBlockUrl;
  var removedBlockUrlIndex;
  port.onMessage.addListener(function(message) {
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
      //receive redirectURL
      redirectUrl = message.redirectUrl;
      //add event listener 
      vastWebRequestRedirect();
    } else {
      chrome.webRequest.onHeadersReceived.removeListener(vastRedirectAddListener);
    }

  });
});
