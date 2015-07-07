// content.js
// alert("Hello from the chrome extension!");
// HAVING default_popup ENABLED IN THE manifest.json causes all other js to not run
// capturing click events on an iframe from a different domain is impossible

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      alert("Ad Replacer is active.");
      var originalBackgroundColor, adHeight, adWidth;
      console.log("Content.js is running!");

      $('iframe').parent().hover(function(e) {
        if ($(this).css("background")) {
          originalBackgroundColor = $(this).css("background");
        } else {
          originalBackgroundColor = "none";
        }
        $(this).css("border", "3px solid yellow");
        e.stopPropagation();
        adHeight = $(this).height();
        adWidth = $(this).width();
        console.log('width: ' + adWidth + ', height: ' + adHeight);
        console.log($(this));
        // debugger;
        $(this).attr('tabindex', '0');
        $(this).focus();
      }, function(e) {
        $(this).css("border", "0px"); 
        e.stopPropagation();
        $(this).blur();
      }).on('keydown', function(event) {
        var ctrl = 17;
        console.log('Keydown recognized');
        if (event.keyCode === ctrl) {
          console.log('keydown for ctrl recognized')
          
        }
      });




      //PROBLEMS: for the first iFrame, adHeight isn't being applied correctly
                //By removing the iFrame, the collection is also being removed

    }
  }
);