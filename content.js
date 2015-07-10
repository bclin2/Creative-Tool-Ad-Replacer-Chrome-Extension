// content.js
// alert("Hello from the chrome extension!");
// HAVING default_popup ENABLED IN THE manifest.json causes all other js to not run
// capturing click events on an iframe from a different domain is impossible
//The position

//for overlay, in case I want to try the tooltip. Needs bootstrap.
//data-toggle="tooltip" title="TESTDIV"

var $overlay = $('<div class="inspectOverlay" style="position: absolute; background-color: rgba(255, 255, 0, 0.4); z-index: 99999999;"></div>');
var $dimensions = $('<div class="overlayDimensions" style="position: relative, z-index: 100000000; background-color: yellow; color: black; font-size: 1vw; text-align: center; opacity: 1.0"></div>');

$overlay.on('click', function(event) {
  $('*').off('mousemove');

  event.stopPropagation();
  event.preventDefault();
  console.log('clicked');
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      alert("Ad Replacer is active.");
      var divHeight;
      var divWidth;
      var offset;
      var overlayDimensions;

      console.log("Content.js is running!");

      $('body').css('cursor', 'crosshair');

      //debugging purposes, removes all hrefs from anchor
      $('a').removeAttr('href');

      $('div').not('body, html').mousemove(function(event) {
        event.stopPropagation();
        // $('[data-toggle="tooltip"]').tooltip();

        //get coordinates
        //subtracted offset to fix scrolling issue
        var mouseCoordinateX = event.pageX - window.pageXOffset;
        var mouseCoordinateY = event.pageY - window.pageYOffset;
        //get elements on point from coordinates, this provides me the stack
        var elementsStack = document.elementsFromPoint(mouseCoordinateX, mouseCoordinateY);

        if ($(elementsStack[0]).is('.inspectOverlay')) {
          var $topOfStack = $(elementsStack[1]);
        } else {
          $topOfStack = $(elementsStack[0]);
        }


        //set overlay under body and find the position of the $topOfStack
        // console.log($(topOfStack));


        $('body').before($overlay);

        offset = $topOfStack.offset();
        //maybe use a combination of position and offset to get the exact position
        divHeight = $topOfStack.innerHeight();
        divWidth = $topOfStack.innerWidth();
        $overlay.css({
          width: divWidth,
          height: divHeight,
          top: offset.top,
          bottom: offset.bottom,
          left: offset.left,
          right: offset.right
        });

        $overlay.html('<div class="overlayDimensions" style="display: block; position: absolute; z-index: 100000000; background-color: black; color: white">' + divWidth + 'X' + divHeight + '</div>');

        console.log("stack:", elementsStack);
        console.log("element: ", $topOfStack);
        console.log("x:", mouseCoordinateX, "y:", mouseCoordinateY);

        //remove overlay on everything else
      })

      // problems: 
        //divHeight


      // $('body').on('mouseenter.creativeTool', '*:not(.inspectOverlay):not(.overlayDimensions)', function(event) {
      //   selectedElement.push($(event.target));
      //   updateSelectedElement();
      // })
      // .on('mouseleave.creativeTool', '*:not(.inspectOverlay):not(.overlayDimensions)', function(event) {
      //   selectedElement.pop();
      //   updateSelectedElement();
      // });

      /*var inspectOverlayTemplates = function(divWidth, divHeight) {
        this._inspectOverlay = '<div class="inspectOverlay" style="position: absolute; opacity: 0.75; background-color: #93CFF4; height: ' + divHeight + 'px; width: ' + divWidth + 'px"></div>';
        this._overlayDimensions = '<div class="overlayDimensions" style="position: relative, z-index: 1200; background-color: yellow; color: black; font-size: 1vw; text-align: center; opacity: 1.0">' + divWidth + 'X' + divHeight + '</div>';
      };

      var divObject = function(jQueriedDiv) {
        this.$div = jQueriedDiv;
        this.renderOverlay = function() {
          var divWidth = this.$div.width();
          var divHeight = this.$div.height();
          inspectOverlay = new inspectOverlayTemplates(divWidth, divHeight);
          this.$div.prepend(inspectOverlay._inspectOverlay);
          $('.inspectOverlay').html(inspectOverlay._overlayDimensions);
        };
        this.removeOverlay = function() {
          this.$div.children().remove('.inspectOverlay');
        }
      };

      var divStack = function() {
        this.stack = [];
        this.$currentFocus;
        this.updateFocus = function() {
          this.$currentFocus = this.stack[this.stack.length - 1];
          if (this.$currentFocus) {
            this.$currentFocus.renderOverlay();
          }
        };
        this.push = function(div) {
          this.stack.push(div);
          if (this.$currentFocus) {
            this.$currentFocus.removeOverlay();
          }
          this.updateFocus();
        };
        this.pop = function() {
          if (this.$currentFocus) {
            this.$currentFocus.removeOverlay();
          }
          this.stack.pop();
          this.updateFocus();
        }; 
      };

      var globalStackTracker = new divStack();

      $('*').not('body, html, .inspectOverlay, .overlayDimensions').on({
        mouseenter: function(e) {
          e.stopPropagation();
          e.preventDefault();
          currentDiv = new divObject($(this));
          globalStackTracker.push(currentDiv);
          console.log(globalStackTracker.stack[globalStackTracker.stack.length - 1]);
        },
        mouseleave: function(e) {
          globalStackTracker.pop();
        },
        click: function(e) {
          e.preventDefault();
        }
      });*/
      



      // $('*').not('body, html, .inspectOverlay, .overlayDimensions').hover(function(e) {
      //   e.stopPropagation();
      //   e.preventDefault();
      //   if ($(this).is('iframe')) {
      //     containsiFrame = true;
      //     console.log("IFRAME DETECTED", containsiFrame)
      //     $iFrameParentDiv = $(this).parent().not('body, html');
      //     $iFrameParentDiv.attr('tabindex', '0');
      //     $iFrameParentDiv.focus();
      //     divHeight = $iFrameParentDiv.height();
      //     divWidth = $iFrameParentDiv.width();
      //   } else {
      //     divHeight = $(this).height();
      //     divWidth = $(this).width();  
      //   }

      //   $(this).css('border', '1px solid black');
      //   inspectOverlay = '<div class=inspectOverlay style="position: absolute; opacity: 0.75; z-index: 1000; background-color: #93CFF4; height: ' + divHeight + 'px; width: ' + divWidth + 'px"></div>';
      //   overlayDimensions = '<div class="overlayDimensions" style="position: relative, z-index: 1200; background-color: yellow; color: black; font-size: 1vw; text-align: center; opacity: 1.0">' + divWidth + 'X' + divHeight + '</div>';

      //   $(this).prepend(inspectOverlay);
      //   $('.inspectOverlay').html(overlayDimensions);

      //   console.log('This:', $(this));
      //   console.log('children: ', $(this).children());
      // }, function(e) {
      //   $(this).css('border', "0px");
      //   if (containsiFrame) {
      //     containsiFrame = false;
      //     $iFrameParentDiv.blur();
      //     console.log('LEAVING IFRAME', containsiFrame);
      //   }
      //   $($(this).children('.inspectOverlay')).remove();
      //   $($(this).children('.overlayDimensions')).remove();

      // });

      //     .on('keydown', function(event) {
      //     var ctrl = 17;
      //     console.log('Keydown recognized');
      //     overlayDimensions = '<div class="overlayDimensions" style="color: white; font-size: 1vw; text-align: center; padding-top: 20%">' + divWidth + 'X' + divHeight + '</div>';
      //     placeholder = '<div class=placeholder style="background-color: rgb(0,0,0); height: ' + divHeight + 'px; width: ' + divWidth + 'px">' + overlayDimensions + '</div>';

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


    }
  }
);







//commit where tool works like inspect for chrome devtools
//454b7e644abc2de3970def51954eb1e05c3de42a