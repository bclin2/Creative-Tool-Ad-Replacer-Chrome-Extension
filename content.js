// content.js
// alert("Hello from the chrome extension!");
// HAVING default_popup ENABLED IN THE manifest.json causes all other js to not run
// capturing click events on an iframe from a different domain is impossible

var $overlay = $('<div class="inspectOverlay" id="drop" style="position: absolute; background-color: rgba(255, 255, 0, 0.4); z-index: 99999999;"></div>');

var $closeOverlay = $('<button class="closeOverlay" border style="position: absolute; border: none; right: 0; padding: 2px 4px; background: rgb(0,0,0); color: white; z-index:100000000">X</button>');
var $pasteOverlay = $('<button class="pasteOverlay" data-toggle="modal" data-target="#pasteModal" style="position: absolute; right: 20px; padding: 2px 4px; border: none; background: rgb(0,0,0); color: white; z-index:100000000">P</button>');
var $dimensions = $('<div class="overlayDimensions" style="display: block; position: absolute; z-index: 100000000; background-color: black; color: white"></div>');

//Append Close Option
$overlay.append($closeOverlay);
closeOverlayEventBinder();

//Append Paste Option
$overlay.append($pasteOverlay);
pasteOverlayEventBinder();

$overlay.append($dimensions);

var $topOfStack;
var elementsStack;
var arrowUp = 38; 
var divHeight;
var divWidth;
var offset;
var overlayDimensions;

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
};

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

        if (file.type.includes("image")) {
          var img = document.createElement('img');
          img.file = file;
          img.src = readerData;
          replaceOriginalContent($topOfStack, '<img src="' + readerData + '">');
        } else if (file.type.includes("text")) {
          replaceOriginalContent($topOfStack, readerData);
        }
      });
    }
    return false;
  });
};

function replaceOriginalContent($targetElement, data) {

  var $newContent = $('<iframe frameborder="0" scrolling="no"></iframe>');

  $newContent.css({
    width: divWidth,
    height: divHeight
  });

  $targetElement.replaceWith($newContent);

  $newContent[0].contentWindow.document.open('text/html', 'replace');
  $newContent[0].contentWindow.document.write(data);
  $newContent[0].contentWindow.document.close();

  $newContent.contents().find("body").css({
    padding: 0,
    margin: 0,
    border: 0
  });

  removeOverlay();
};

function renderOverlay() {
  offset = $topOfStack.offset();
  divHeight = $topOfStack.innerHeight();
  divWidth = $topOfStack.innerWidth();

  if (divHeight === 0 || divWidth === 0) {
    return;
  }

  // console.log($topOfStack[0]);
  var position = $topOfStack[0].getBoundingClientRect();

  removeOverlay();

  //add window.pageYOffset to account for scrolling
  $overlay.css({
    width: divWidth,
    height: divHeight,
    top: position.top + window.pageYOffset,
    left: position.left
  });

  $('body').append($overlay);

  $dimensions.text(divWidth + 'X' + divHeight);
};

function removeOverlay() {
  $overlay.detach();
};

function closeOverlayEventBinder() {
  $closeOverlay.on({
    'click': function(event) {
      $(window).off('keydown.screenshot');
      removeOverlay();
    }
  });
};

function pasteOverlayEventBinder() {
  $pasteOverlay.on('click', function(event) {
    var content = window.prompt('Paste replacement content');

    if (content) {
      replaceOriginalContent($topOfStack, content);
    }
    //$('#pasteModal').modal('show');
  });
};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if ( request.message === "clicked_browser_action" ) {

      console.log("Content.js is running!");

      //debugging purposes, removes all hrefs from anchors
      // $('a').removeAttr('href');

      //prevent drag from redirecting
      $('body').bind('drag', function(event) {
        event.preventDefault();
      });

      $overlay.off('click');

      $overlay.one('click', function(event) {
        event.stopPropagation();
        event.preventDefault();

        $('body').off('mousemove.screenshot');

        //Set focus on overlay so keydowns can be captured
        $(this).attr('tabindex', '0');
        $(this).focus();

        //Initialize drop
        drop = document.getElementById('drop');
        bindDragEvents();

        $(window).on('keydown.screenshot', function(event) {
          var pendingTopOfStack;
          //capture keydowns
          if (event.keyCode === arrowUp) {

            pendingTopOfStack = elementsStack.shift();

            // Test for presence of $overlay object?
            if ($(pendingTopOfStack).is('.inspectOverlay')) {
              pendingTopOfStack = elementsStack.shift();
            }

            $topOfStack = $(elementsStack[0]);

            renderOverlay();

            $('.inspectOverlay').focus();
          }
        });
      });

      $('body').on('mousemove.screenshot', function(event) {
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

function saveRedirectURL(redirectUrl) {
  chrome.storage.local.set({"redirectUrl": redirectUrl});
};

//webRequests can't be called from the content script; needs to communicate with the background.js
//use event filtering


var contentPort = chrome.runtime.connect({name: "contentToBackground"});

chrome.runtime.onConnect.addListener(function(port) {
  console.log("Connected!", port);
  port.onMessage.addListener(function(message) {
    console.log("message received: ", message);
    if (message.videoToggleListenersActive) {
      console.log('onHeadersReceived Listeners Active');
      var redirectUrl = prompt("Please input your redirect URL here");
      //send redirectUrl to background.js
      contentPort.postMessage({redirectUrl: redirectUrl});
      //refresh
      window.location.reload();
    }
  });
});



//Try connect
// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     if ( request.message === "video_replacer_activated" ) {
//       var redirectURL = prompt("Please enter the redirect URL");
//       if (redirectURL.length === 0) {
//         alert("Please enter a valid URL.");
//       } else {
//         saveRedirectURL(redirectURL);
//       }
//       console.log(chrome.runtime);
//     }
//     //reload WITHOUT cache
//     // window.location.reload(true);
//   }
// );