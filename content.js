// content.js
// alert("Hello from the chrome extension!");
// HAVING default_popup ENABLED IN THE manifest.json causes all other js to not run
// capturing click events on an iframe from a different domain is impossible

var $overlay = $('<div class="inspectOverlay" id="drop" style="position: absolute; background-color: rgba(255, 255, 0, 0.4); z-index: 99999999;"></div>');
var $dimensions = $('<div class="overlayDimensions" style="position: relative, z-index: 100000000; background-color: yellow; color: black; font-size: 1vw; text-align: center; opacity: 1.0"></div>');
var $topOfStack;
var elementsStack;
var arrowUp = 38; 
var divHeight;
var divWidth;
var offset;
var overlayDimensions;

// File Upload
var drop;
var $replacerContent;

// File Upload Handlers
function cancelDefaultDrop(event) {
  if (event.preventDefault) { 
    event.preventDefault();
    event.stopPropagation();
  }
  return false;
}

function bindDragEvents() {
  drop.addEventListener('dragover', cancelDefaultDrop);
  drop.addEventListener('dragenter', cancelDefaultDrop);

  drop.addEventListener('drop', function(event) {
    event.preventDefault();
    var data = event.dataTransfer;
    var files = data.files;

    for (var index = 0; index < files.length; index++) {
      var file = files[index];
      var reader = new FileReader();

      //Determine MIME type here
      if (file.type.includes("image")) {
        reader.readAsDataURL(file);      
      } else if (file.type.includes("text")) {
        reader.readAsText(file);
      } else {
        alert("File Type not recognized");
      }

      var $originalContentParent = $($topOfStack.parent());
      $replacerContent = $('<div class="replacerContent"></div>'); 

      reader.addEventListener('loadend', function(event) {

        // console.log("reader result: ", this.result);
        // console.log("FILE: ", file, "type: ", file.type);

        var readerData = this.result;

        if (file.type.includes("image")) {
          var bin = readerData;
          var img = document.createElement('img');
          img.file = file;
          img.src = bin;
          replaceOriginalContent($replacerContent, img);
          $originalContentParent.append($replacerContent);
          removeOverlay();
        } else if (file.type.includes("text")) {
          var textContents = readerData;
          replaceOriginalContent($replacerContent, textContents);
          $originalContentParent.append($replacerContent);

          // $.parseHTML(textContents, '.replacerContent', true);

          removeOverlay();
        }

        //replace original content
          //replacerContent has to have same properties(width/height) of original content
          //assumes original content would have the right pixel size
          //check if file is an image or an html/txt file. 
            //if image, create a div and inject image into div
            //if file, parse and inject html5 into replacer content
        //remove overlay
      });
    }
    return false;
  });
};

function replaceOriginalContent($content, data) {
  $topOfStack.remove();
  $content.html(data);
  $content.css({
    width: divWidth,
    height: divHeight
  });
}

// Overlay
function disableArrowKeys() {
  window.addEventListener("keydown", function(e) {
    if ([arrowUp].indexOf(e.keyCode) > -1) {
      e.preventDefault();
    }
  }, false);
};

function renderOverlay() {
  $('body').append($overlay);
  offset = $topOfStack.offset();
  divHeight = $topOfStack.innerHeight();
  divWidth = $topOfStack.innerWidth();

  if (divHeight === 0 || divWidth === 0) {
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

// Overlay Handlers
$('body').on({
  'click': function(event) {
    $('*').off('mousemove');
    event.stopPropagation();
    event.preventDefault();
    //Set focus on overlay so keydowns can be captured
    $(this).attr('tabindex', '0');
    $(this).focus();
    //disable up keydowns(ex: arrowUp)
    disableArrowKeys();

    //Initialize drop
    drop = document.getElementById('drop');
    bindDragEvents();
    console.log($topOfStack);
  }, 
  'keydown': function(event) {
    $('*').off('mousemove');
    var pendingTopOfStack;
    //capture keydowns
    if (event.keyCode === arrowUp) {

      pendingTopOfStack = elementsStack.shift();

      if ($(pendingTopOfStack).is('.inspectOverlay')) {
        pendingTopOfStack = elementsStack.shift();
      }

      $topOfStack = $(elementsStack[0]);

      removeOverlay();
      renderOverlay();

      $('.inspectOverlay').focus();
    }
  }
}, '.inspectOverlay');

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if ( request.message === "clicked_browser_action" ) {
      alert("Creative Tool is active.");

      console.log("Content.js is running!");

      // Don't need another visual aid to tell the extension is active. The yellow overlays are enough
      // $('body').css('cursor', 'crosshair');

      //debugging purposes, removes all hrefs from anchors
      $('a').removeAttr('href');

      $('div').not('body, html').mousemove(function(event) {
        event.stopPropagation();

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

        renderOverlay();

      });
    }
  }
);