// content.js
// alert("Hello from the chrome extension!");
// HAVING default_popup ENABLED IN THE manifest.json causes all other js to not run
// capturing click events on an iframe from a different domain is impossible
//The position

//for overlay, in case I want to try the tooltip. Needs bootstrap.
//data-toggle="tooltip" title="TESTDIV"

var $overlay = $('<div class="inspectOverlay" style="position: absolute; background-color: rgba(255, 255, 0, 0.4); z-index: 99999999;"></div>');
var $dimensions = $('<div class="overlayDimensions" style="position: relative, z-index: 100000000; background-color: yellow; color: black; font-size: 1vw; text-align: center; opacity: 1.0"></div>');
var $topOfStack;
var elementsStack;
var keyDownStack = [];
var arrowUp = 38; 
var divHeight;
var divWidth;
var offset;
var overlayDimensions;

function disableArrowKeys() {
  window.addEventListener("keydown", function(e) {
      // arrow keys
      if ([arrowUp].indexOf(e.keyCode) > -1) {
          e.preventDefault();
      }
  }, false);
};

function renderOverlay() {
  $('body').append($overlay);
  // debugger;
  offset = $topOfStack.offset();
  //maybe use a combination of position and offset to get the exact position
  divHeight = $topOfStack.innerHeight();
  divWidth = $topOfStack.innerWidth();
  //REAL problem is why $topOfStack sometimes reads as 0x0

  if (divHeight === 0 || divWidth === 0) {
    debugger;
    return;
  }
  $overlay.css({
    width: divWidth,
    height: divHeight,
    top: offset.top,
    bottom: offset.bottom,
    left: offset.left,
    right: offset.right
  });

  $overlay.html('<div class="overlayDimensions" style="display: block; position: absolute; z-index: 100000000; background-color: black; color: white">' + divWidth + 'X' + divHeight + '</div>');
}

function removeOverlay() {
  $('.inspectOverlay').remove();
}

$('body').on({
  'click': function(event) {
    $('*').off('mousemove');
    event.stopPropagation();
    event.preventDefault();
    //Set focus on overlay so keydowns can be captured
    $(this).attr('tabindex', '0');
    $(this).focus();
    //disable up and down keydowns
    disableArrowKeys();
    console.log('clicked');
  }, 
  'keydown': function(event) {
    $('*').off('mousemove');
    var pendingTopOfStack;
    //capture keydowns
    if (event.keyCode === arrowUp) {
      //go up DOM tree
        //pop off $topOfStack and insert into keyDownStack
      console.log("ARROW UP!!!!");
      console.log("before: ", elementsStack);

      pendingTopOfStack = elementsStack.shift();

      if ($(pendingTopOfStack).is('.inspectOverlay')) {
        pendingTopOfStack = elementsStack.shift();
      }

      if (!(pendingTopOfStack === undefined)) {
        keyDownStack.push(pendingTopOfStack);
      }
      $topOfStack = $(elementsStack[0]);

      console.log("after: ", elementsStack);
      console.log("keyDownStack: ", keyDownStack);
      console.log("TopOfStack: ", $topOfStack);
      removeOverlay();
      renderOverlay();

      $('.inspectOverlay').focus();
    }
  }
}, '.inspectOverlay');

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      alert("Creative Tool is active.");
      //resets keyDownStack so it won't overflow to the next session
      keyDownStack = [];

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
        elementsStack = document.elementsFromPoint(mouseCoordinateX, mouseCoordinateY);

        if ($(elementsStack[0]).is('.inspectOverlay')) {
          $topOfStack = $(elementsStack[1]);
        } else {
          $topOfStack = $(elementsStack[0]);
        }

        //set overlay under body and find the position of the $topOfStack
        renderOverlay();

        console.log("stack:", elementsStack);
        console.log("element: ", $topOfStack);
        console.log("x:", mouseCoordinateX, "y:", mouseCoordinateY);

      })

    }
  }
);