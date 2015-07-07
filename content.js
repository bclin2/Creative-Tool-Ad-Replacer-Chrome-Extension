// content.js
// alert("Hello from the chrome extension!");
// HAVING default_popup ENABLED IN THE manifest.json causes all other js to not run
// capturing click events on an iframe from a different domain is impossible

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      alert("Ad Replacer is active.");
      var originalBackgroundColor, adHeight, adWidth, blurListener;
      console.log("Content.js is running!");
      // $("*").not("body, html").hover(function(e) {
      //   if ($(this).css("background")) {
      //     originalBackgroundColor = $(this).css("background");
      //   } else {
      //     originalBackgroundColor = "none";
      //   }
      //   $(this).css("border", "1px solid #000");
      //   // $(this).css("background", "rgba(0,0,0,0.75)"; //needs to target overlay
      //   e.stopPropagation();
      //   adHeight = $(this).height();
      //   adWidth = $(this).width();
      //   // $(this).html(overlay);
      //   // $('.overlay').css('background', 'rgba(0,0,0.75)');
      //   console.log('width: ' + adWidth + ', height: ' + adHeight);
      // }, function(e) {
      //   $(this).css("border", "0px"); 
      //   // $(this).css("background", originalBackgroundColor); //needs to target overlay
      //   e.stopPropagation();
      // });
      
      var iFrameCollection = document.getElementsByTagName('IFRAME');
      var iFrameCounter = 0;
      console.log(iFrameCollection);
      while (iFrameCollection.length > 0) {
        //each iteration removes the first element in iFrameCollection, so the next iFrame is the new first element
        var adWidth = $(iFrameCollection[0]).width();         
        var adHeight = $(iFrameCollection[0]).height();
        console.log("width: " + adWidth + ", height: " + adHeight);
        var $iFrameParent = $($(iFrameCollection[0]).parent());
        $iFrameParent.html('<div class="placeholder" id="iframe-' + iFrameCounter + '" style="height: ' + adHeight + 'px; background-color: rgba(0,0,0,0.85)"></div>');
        iFrameCounter++;
      }

      //PROBLEMS: for the first iFrame, adHeight isn't being applied correctly
                //By removing the iFrame, the collection is also being removed

      // focus();
      // blurListener = addEventListener('blur', function() {
      //   if (document.activeElement === document.getElementsByTagName('iframe')) {
      //     console.log("click event SUCCESSFULLY CAPTURED")
      //   }
      // });

      // $('*').not("body, html").on('click', function(e){
      //   e.preventDefault();
      //   e.stopPropagation();
      //   e.stopImmediatePropagation();
      //   adHeight = $(this).height();
      //   adWidth = $(this).width();
      //   console.log("click event registered");

      // });
    }
  }
);