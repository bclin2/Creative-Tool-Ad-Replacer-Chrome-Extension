// content.js
// alert("Hello from the chrome extension!");
// HAVING default_popup ENABLED IN THE manifest.json causes all other js to not run
// capturing click events on an iframe from a different domain is impossible

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      alert("Ad Replacer is active.");
      var adHeight, adWidth, placeholder, placeholderDimensions;
      console.log("Content.js is running!");

      $('iframe').parent().not('body, html').hover(function(e) {
        $(this).children('iframe').css("border", "3px solid yellow");
        e.stopPropagation();
        adHeight = $(this).children('iframe').height();
        adWidth = $(this).children('iframe').width();
        console.log('width: ' + adWidth + ', height: ' + adHeight);
        console.log($(this));
        $(this).attr('tabindex', '0');
        $(this).focus();
      }, function(e) {
        $(this).children('iframe').css("border", "0px"); 
        e.stopPropagation();
        $(this).blur();
      }).on('keydown', function(event) {
        var ctrl = 17;
        console.log('Keydown recognized');
        placeholderDimensions = '<div class="placeholderDimensions" style="color: white; font-size: 1vw; text-align: center; padding-top: 20%">' + adWidth + 'X' + adHeight + '</div>';
        placeholder = '<div class=placeholder style="background-color: rgb(0,0,0); height: ' + adHeight + 'px; width: ' + adWidth + 'px">' + placeholderDimensions + '</div>';

        if (event.keyCode === ctrl) {
          console.log('keydown for ctrl recognized');
          $(this).html(placeholder);
        }
      });




      //PROBLEMS: for the first iFrame, adHeight isn't being applied correctly
                //By removing the iFrame, the collection is also being removed

    }
  }
);