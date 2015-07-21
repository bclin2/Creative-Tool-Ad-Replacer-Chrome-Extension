// background.js


//on reload check local storage for redirectURL
//Have to check if redirectURL exists, if it does it means user is using video replacer and not image replacer
var redirectURL;
chrome.storage.local.get('redirectURL', function(result) {
  redirectURL = result;
  console.log(result);
})

//CHECK if event filtering is set to on/off
  //if ON, set event filters to ON, tell content.js to reload the page, and prompt users for a redirect URL in content.js
  //DEFAULT is OFF

function vastRedirect() {
  //Let user know the video ads have been replaced with alert
  //replace video ad VAST request
  //delete redirectURL from storage

}




// chrome.webRequest.onHeadersReceived.addListener(
//   function(data) {
//     // if (data.url.includes("telemetry") || data.url.includes("innovid")) {
//     //   console.log("received: ", data);
//     // }

//     $.each($(data.responseHeaders), function(index, header) {
//       // console.log(header.value);
//       if (header.name.includes("Content-Type") && header.value.includes('xml') && !data.url.includes('crossdomain')) {

//         //I KNOW this is a vast response
//         if (data.url.includes('vast')) {
//           console.log(data.url);
//         }

//         //possibly a vast reponse
//         console.log(data.url);
//       }
//     });
//   },
//   {urls: ["<all_urls>"]},
//   ["responseHeaders"]
// );  

// Called when the user clicks on the browser action.
// Doesn't console log anything, but alerts work
chrome.browserAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    // console.log("Icon has been clicked!");
    // alert("Hello from background.js");
    // chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  });
});