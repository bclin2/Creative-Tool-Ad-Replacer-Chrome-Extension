// content.js
// alert("Hello from the chrome extension!");
// HAVING default_popup ENABLED IN THE manifest.json causes all other js to not run

//Plan: Overlay div with given 

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      // alert("Ad Replacer is active.");
      var originalBackgroundColor, adHeight, adWidth;

      console.log("Content.js is running!");
      $("*").not("body, html").hover(function(e) {
        if ($(this).css("background")) {
          originalBackgroundColor = $(this).css("background");
        } else {
          originalBackgroundColor = "none";
        }
        $(this).css("border", "1px solid #000");
        // $(this).css("background", "rgba(0,0,0.75"); //needs to target overlay
        e.stopPropagation();
        adHeight = $(this).height();
        adWidth = $(this).width();
        console.log('width: ' + adWidth + ', height: ' + adHeight;
      }, function(e) {
        $(this).css("border", "0px"); 
        // $(this).css("background", originalBackgroundColor); //needs to target overlay
        e.stopPropagation();
      });

      // $('*').on('click', function(event) {
        // add .not("body, html") to on click
      //  // $(this).css('background-color', '#B0D6FD'); 
      //   event.preventDefault();
      //   console.log('width: ' + $(this).height() + ', height: ' + $(this).width());
      // });
    }
  }
);