// content.js
// alert("Hello from the chrome extension!");
// HAVING default_popup ENABLED IN THE manifest.json causes all other js to not run
// capturing click events on an iframe from a different domain is impossible

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      alert("Ad Replacer is active.");
      var adHeight, adWidth, $iFrameParentDiv, containsiFrame = false, placeholder, placeholderDimensions, inspectOverlay;
      console.log("Content.js is running!");



      // $('iframe').parent().not('body, html').hover(function(e) {
      //   $(this).children('iframe').css("border", "3px solid yellow");
      //   e.stopPropagation();
      //   adHeight = $(this).children('iframe').height();
      //   adWidth = $(this).children('iframe').width();
      //   console.log('width: ' + adWidth + ', height: ' + adHeight);
      //   console.log($(this));
      //   $(this).attr('tabindex', '0');
      //   $(this).focus();
      // }, function(e) {
      //   $(this).children('iframe').css("border", "0px"); 
      //   e.stopPropagation();
      //   $(this).blur();
      // }).on('keydown', function(event) {
      //   var ctrl = 17;
      //   console.log('Keydown recognized');
      //   placeholderDimensions = '<div class="placeholderDimensions" style="color: white; font-size: 1vw; text-align: center; padding-top: 20%">' + adWidth + 'X' + adHeight + '</div>';
      //   placeholder = '<div class=placeholder style="background-color: rgb(0,0,0); height: ' + adHeight + 'px; width: ' + adWidth + 'px">' + placeholderDimensions + '</div>';

      //   if (event.keyCode === ctrl) {
      //     console.log('keydown for ctrl recognized');
      //     $(this).html(placeholder);
      //   }
      // });


      //if iframe is hovered over, target parent div and set the parent's tabindex to 0
      //


      $('body').css('cursor', 'crosshair');

      $('*').not('body, html').hover(function(e) {
        e.stopPropagation();
        e.preventDefault();
        if ($(this).is('iframe')) {
          containsiFrame = true;
          console.log("IFRAME DETECTED", containsiFrame)
          $iFrameParentDiv = $(this).parent().not('body, html');
          $iFrameParentDiv.attr('tabindex', '0');
          $iFrameParentDiv.focus();
          adHeight = $iFrameParentDiv.height();
          adWidth = $iFrameParentDiv.width();
        } else {
          adHeight = $(this).height();
          adWidth = $(this).width();  
        }

        $(this).css('border', '1px solid black');
        inspectOverlay = '<div class=inspectOverlay style="position: absolute; opacity: 0.75; z-index: 1000; background-color: #93CFF4; height: ' + adHeight + 'px; width: ' + adWidth + 'px"></div>';
        placeholderDimensions = '<div class="placeholderDimensions" style="position: relative, z-index: 1200; background-color: yellow; color: black; font-size: 1vw; text-align: center; opacity: 1.0">' + adWidth + 'X' + adHeight + '</div>';

        $(this).prepend(inspectOverlay);
        // $(this).append(placeholderDimensions);
        $('.inspectOverlay').html(placeholderDimensions);
        console.log($(this));
      }, function(e) {
        $(this).css('border', "0px");
        if (containsiFrame) {
          containsiFrame = false;
          $iFrameParentDiv.blur();
          console.log('LEAVING IFRAME', containsiFrame);
        }
        $($(this).children('.inspectOverlay')).remove();
        $($(this).children('.placeholderDimensions')).remove();

      });

      //     .on('keydown', function(event) {
      //     var ctrl = 17;
      //     console.log('Keydown recognized');
      //     placeholderDimensions = '<div class="placeholderDimensions" style="color: white; font-size: 1vw; text-align: center; padding-top: 20%">' + adWidth + 'X' + adHeight + '</div>';
      //     placeholder = '<div class=placeholder style="background-color: rgb(0,0,0); height: ' + adHeight + 'px; width: ' + adWidth + 'px">' + placeholderDimensions + '</div>';

      //     if (event.keyCode === ctrl && containsiFrame) {
      //       console.log('keydown for ctrl recognized');
      //       $iFrameParentDiv.html(placeholder);
      //     }

      // });


      //PROBLEM: 
        //The problem is that it covers the entire parent div on mouseover. We can't see the smaller divs that become highlighted. 
          //Increase z-index of all child divs?
        //Problem is how hover works. Remember the hover border technique and how the border stays until I move completely out of the div
          //I need to find a way to change focus
        //Also, I can't overlay over iframes because of the same origin policy
          //If the iframes get their ads from a different domain, then I can't interact with the divs
        //images in a list don't get inspected; the overlay gets appended to the image, not the <li> itself
          //causes graphical errors







      //PROBLEMS: for the first iFrame, adHeight isn't being applied correctly
                //By removing the iFrame, the collection is also being removed

    }
  }
);