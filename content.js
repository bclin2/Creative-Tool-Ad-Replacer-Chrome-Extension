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
var $closeOverlay = $('<button class="closeOverlay" border style="position: absolute; border: none; right: 0; padding: 2px 4px; background: rgb(0,0,0); color: white; z-index:100000000">X</button>');
var $pasteOverlay = $('<button class="pasteOverlay" data-toggle="modal" data-target="#pasteModal" style="position: absolute; right: 20px; padding: 2px 4px; border: none; background: rgb(0,0,0); color: white; z-index:100000000">P</button>')

//Get Template for Paste Modal
var pasteModalURL = chrome.extension.getURL("templates/modal_template.html");
var pasteModalTemplate;
$.get(pasteModalURL, function(data) {
  pasteModalTemplate = data;
});
var pasteContentTags;

// File Upload
var drop;

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


      reader.addEventListener('loadend', function(event) {

        var readerData = this.result;
        var $replacerContent = $('<iframe class="replacerContent"></iframe>');

        // debugger;
        var currentReplacerContentID = generateRandomID();
        $replacerContent.attr('id', currentReplacerContentID);
        $replaceOriginalContent = $('#' + currentReplacerContentID);
        var $originalContentParent = $($topOfStack.parent());
        var originalBackgroundColor = $originalContentParent.css('background-color');

        if (file.type.includes("image")) {
          var img = document.createElement('img');
          img.file = file;
          img.src = readerData;
          replaceOriginalContent($replacerContent, img, $originalContentParent);
          // $replacerContent.contents().find("body").css({
          //   padding: 0,
          //   margin: 0,
          //   border: 0
          // });
          // $replacerContent.contents().find("body").html(img);
          injectIframeData($replacerContent, img);

        } else if (file.type.includes("text")) {
          replaceOriginalContent($replacerContent, readerData, $originalContentParent);
          // $replacerContent.contents().find("body").css({
          //   padding: 0,
          //   margin: 0,
          //   border: 0
          // });
          // $replacerContent.contents().find("body").html(readerData);
          injectIframeData($replacerContent, readerData);
          //still grey
          $.parseHTML(readerData, '.replacerContent', true); 

        }
      });
    }
    return false;
  });
};

function injectIframeData($replacerContent, data) {
  $replacerContent.contents().find("body").css({
    padding: 0,
    margin: 0,
    border: 0
  });

  $replacerContent.contents().find("body").html(data);

};

function replaceOriginalContent($content, data, $originalContentParent) {
  // debugger;
  $topOfStack.remove();
  //on refactor, put bottom line back in but with a callback function
  // $content.contents().find("body").html(data);
  $content.css({
    width: divWidth,
    height: divHeight,
    border: "none"
  });
  //turn scrolling off?
  // $content.attr('scrolling', 'no');
  // debugger;
  $originalContentParent.append($content);
  removeOverlay();
};

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
  
  //offset may be off because it doesn't take into account of body. 
  //jquery .offset() doesn't take into account margin, padding, border, and offset of body

  // bodyOffsetLeft = +$('body').css('margin-left')[0] + +$('body').css('border-left')[0] + +$('body').css('padding-left')[0] + $('body').offset().left;
  // bodyOffsetTop = +$('body').css('margin-top')[0] + +$('body').css('border-top')[0] + +$('body').css('padding-top')[0] + $('body').offset().top;
  bodyOffsetLeft = $('body').offset().left;
  bodyOffsetTop = $('body').offset().top;

  // console.log("stack: ", elementsStack, "top: ", $topOfStack);

  $overlay.css({
    width: divWidth,
    height: divHeight,
    top: offset.top - bodyOffsetTop,
    left: offset.left - bodyOffsetLeft
  });

  var dimensions = '<div class="overlayDimensions" style="display: block; position: absolute; z-index: 100000000; background-color: black; color: white">' + divWidth + 'X' + divHeight + '</div>';
  $overlay.html(dimensions);

};

function removeOverlay() {
  $('.inspectOverlay').remove();
};

function closeOverlayEventBinder() {
  $('.closeOverlay').on({
    'click': function(event) {
      removeOverlay();
    }
  });
};

//Paste Modal functions
function injectPasteModal() {
  var pasteModalDoesNotExists = $('body').find('#pasteModal').length === 0 ? true : false;
  if (pasteModalDoesNotExists) {
    $('body').append(pasteModalTemplate);
  }
};

function pasteOverlayEventBinder() {
  $('.pasteOverlay').on('click', function(event) {
    $('#pasteModal').modal('show');
  });
};

function getPasteContent() {
  pasteContentTags = $('.pasteContent').val();
};

function bindPasteEvent() {
  $('.pasteSubmit').on('click', function(event) {
    //get paste content
    //inject that content into selected/highlighted div
    //run any scripts that may be inside
  });
};

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

    //Append Close Option
    $overlay.append($closeOverlay);
    closeOverlayEventBinder();

    //Append Paste Option
    $overlay.append($pasteOverlay);
    pasteOverlayEventBinder();

    //Initialize drop
    drop = document.getElementById('drop');
    bindDragEvents();
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

//Helper Functions
function generateRandomID() {
  return '_' + Math.random().toString(36).substr(2, 9);
};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if ( request.message === "clicked_browser_action" ) {

      console.log("Content.js is running!");

      //debugging purposes, removes all hrefs from anchors
      $('a').removeAttr('href');

      //prevent drag from redirecting
      $('body').bind('drag', function(event) {
        event.preventDefault();
      });

      //Inject Paste Modal
      injectPasteModal();
      bindPasteEvent();

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