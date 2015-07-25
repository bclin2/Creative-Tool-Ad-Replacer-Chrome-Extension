// content.js

function SelectionOverlay($targetElement) {
  this.$overlay = $('<div class="selectionOverlay" style="position: fixed; background-color: rgba(255, 255, 0, 0.4); z-index: 99999999;"></div>');
  this.$dimensions = $('<div class="overlayDimensions" style="display: block; position: absolute; z-index: 100000000; background-color: black; color: white; font-family: Helvetica; padding: 1px"></div>');
  this.$targetElement = $targetElement;
  this.height = 0;
  this.width = 0;
  this.top = 0;
  this.left = 0;
};

SelectionOverlay.prototype.getTargetElementProperties = function() {
  //get properties from $targetElement and assign them to SelectionOverlay Properties
  var clientRect = this.$targetElement[0].getBoundingClientRect();
  this.width = this.$targetElement.innerWidth();
  this.height = this.$targetElement.innerHeight();
  this.top = clientRect.top;
  this.left = clientRect.left
};

SelectionOverlay.prototype.addDimensions = function() {
  //add this.$dimensions to this.$overlay by appending it.
  this.$overlay.append(this.$dimensions);
};

SelectionOverlay.prototype.modifyOverlayProperties = function($targetElement) {
  //use .css() to modify $overlay and $dimensions
  this.$overlay.css({
    width: this.width,
    height: this.height,
    top: this.top,
    left: this.left
  });

  this.$dimensions.text(this.width + 'x' + this.height);
  this.addDimensions();
};

SelectionOverlay.prototype.removeEventHandlers = function() {
  //removes all event handlers that are related to selectionOverlay
    //remove mousemove.screenshot in the browserAction function?

};

SelectionOverlay.prototype.bindEventHandlers = function() {
  //set the .one('click') event
    //this event binder will remove the current $overlay and tell something to instantiate PlacementOverlay
};

SelectionOverlay.prototype.remove = function() {
  //use .detach() to this.$overlay
  this.$overlay.detach();
};

SelectionOverlay.prototype.render = function() {
  //remove any this.$overlays on the DOM and append new this.$overlays
};




function PlacementOverlay($targetElement) {
  this.$overlay = $('<div class="placementOverlay" style="position: fixed; background-color: rgba(255, 255, 0, 0.4); z-index: 99999999;"></div>');
  this.$dimensions = $('<div class="overlayDimensions" style="display: block; position: absolute; z-index: 100000000; background-color: black; color: white; font-family: Helvetica; padding: 1px"></div>');
  this.$paste = $('<button class="pasteOverlay" data-toggle="modal" data-target="#pasteModal" style="position: absolute; right: 20px; padding: 2px 4px; border: none; background: rgb(0,0,0); color: white; z-index:100000000">P</button>');
  this.$close = $('<button class="closeOverlay" border style="position: absolute; border: none; right: 0; padding: 2px 4px; background: rgb(0,0,0); color: white; z-index:100000000">X</button>');
  this.$targetElement = $targetElement;
  this.width;
  this.height;
  this.top;
  this.left;
};

PlacementOverlay.prototype.getTargetElementProperties = function($targetElement) {
  //get properties from $targetElement and assign them to PlacementOverlay Properties
  var clientRect = this.$targetElement[0].getBoundingClientRect();
  this.width = this.$targetElement.innerWidth();
  this.height = this.$targetElement.innerHeight();
  this.top = clientRect.top;
  this.left = clientRect.left
};

PlacementOverlay.prototype.modifyOverlayProperties = function() {
  //use .css() to modify $overlay and $dimensions
};

PlacementOverlay.prototype.addOptionsDimensions = function() {
  //append $dimensions, $paste, $close to $overlay
};

PlacementOverlay.prototype.bindEventHandlers = function() {
  //Drag/Drop
  //Window Keydown (arrowUp)
  //window scroll
  //paste event
  //exit event
  //call after addOptionsDimensions
};

PlacementOverlay.prototype.removeEventHandlers = function() {
  //use .off() for all event handlers in this instance
};

PlacementOverlay.prototype.remove = function() {
  //use .detach() to remove this.$overlay from the DOM
  this.$overlay.detach();
};

PlacementOverlay.prototype.render = function() {
  //remove Overlay
  //append this.$overlay to body after modifyOverlayProperties has been called
};







var $overlay = $('<div class="inspectOverlay" style="position: fixed; background-color: rgba(255, 255, 0, 0.4); z-index: 99999999;"></div>');

var $closeOverlay = $('<button class="closeOverlay" border style="position: absolute; border: none; right: 0; padding: 2px 4px; background: rgb(0,0,0); color: white; z-index:100000000">X</button>');
var $pasteOverlay = $('<button class="pasteOverlay" data-toggle="modal" data-target="#pasteModal" style="position: absolute; right: 20px; padding: 2px 4px; border: none; background: rgb(0,0,0); color: white; z-index:100000000">P</button>');
var $dimensions = $('<div class="overlayDimensions" style="display: block; position: absolute; z-index: 100000000; background-color: black; color: white; font-family: Helvetica; padding: 1px"></div>');

//Append Close Option
$overlay.append($closeOverlay);
closeOverlayEventBinder();

//Append Paste Option
$overlay.append($pasteOverlay);
pasteOverlayEventBinder();

$overlay.append($dimensions);

var elementsStack;
var arrowUp = 38; 

// File Upload Handlers
function cancelDefaultDrop(event) {
  if (event.preventDefault) { 
    event.preventDefault();
    event.stopPropagation();
  }
  return false;
};

function bindDragEvents($targetElement) {
  $('body').on('drag.screenshot', function(event) {
    event.preventDefault();
  });

  $overlay.on('dragover', cancelDefaultDrop);
  $overlay.on('dragenter', cancelDefaultDrop);

  $overlay.on('drop', function(event) {
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
          replaceOriginalContent($targetElement, '<img src="' + readerData + '">');
        } else if (file.type.includes("text")) {
          replaceOriginalContent($targetElement, readerData);
        }
      });
    }
    return false;
  });
};

function replaceOriginalContent($targetElement, data) {

  var $newContent = $('<iframe frameborder="0" scrolling="no"></iframe>');

  $newContent.css({
    width: $targetElement.innerWidth(),
    height: $targetElement.innerHeight()
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

function renderOverlay($targetElement) {
  var position;

  var offset = $targetElement.offset();
  var divHeight = $targetElement.innerHeight();
  var divWidth = $targetElement.innerWidth();

  if (divHeight === 0 || divWidth === 0) {
    return;
  }

  // console.log($topOfStack[0]);
  position = $targetElement[0].getBoundingClientRect();

  removeOverlay();

  //add window.pageYOffset to account for scrolling
  $overlay.css({
    width: divWidth,
    height: divHeight,
    top: position.top,
    left: position.left
  });

  $('body').append($overlay);

  $dimensions.text(divWidth + 'x' + divHeight);
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
  });
};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if ( request.message === "clicked_browser_action" ) {

      //create new instance here
      var currentSelectionOverlay;
      var currentPlacementOverlay;
      //get instance of SelectionOverlay and PlacementOverlay and make them call their removeBindEvents function
        //use an if statement to determine if they exist yet or not
          //if (currentSelectionOverlay)
            //SelectionOverly.unbindEvents
          //else, no need to unbind anything because it doesn't exist
        //SAME with currentPlacementOverlay  



      console.log("Content.js is running!");

      $(window).off('scroll.screenshot');
      $('body').off('drag.screenshot');
      $overlay.off('click');      
      $overlay.off('dragover');
      $overlay.off('dragenter');
      $overlay.off('drop');

      //separate this into two states, selecting and placement
      //that includes event binding
      //Selection: 
        //.one('click')
          //This will call for its own removal and for the instantiation of the placementOverlay
          //it will also remove the mousemove.screenshot event

      //Placement: 
        //keydown to go up parents, refactor to not use the stack, but to use targetElement's parents
        //bindDragEvents, call it when selectionOverlay has been removed and placement has been instantiated
        //ScrollEvents, this will make sure the placementOverlay will stay where it needs to stay
          //use a setTimeout to prevent massive lag. Calculate actions per frame in milliseconds so it will save processing power, but still look good.
        //when instantiating placement, also have a function instantiate event binders and append paste and exit option overlays into the PlacementOverlay
        //paste and exit event binders

      $overlay.one('click', function(event) {
        event.stopPropagation();
        event.preventDefault();

        $(window).on('scroll.screenshot', function(e) {
          var position = $(elementsStack[0])[0].getBoundingClientRect();

          $overlay.css({
            top: position.top,
            left: position.left
          });
        });

        $('body').off('mousemove.screenshot');

        //Set focus on overlay so keydowns can be captured
        $(this).attr('tabindex', '0');
        $(this).focus();

        //Initialize drop
        bindDragEvents();

        $(window).on('keydown.screenshot', function(event) {
          var $topOfStack;

          var pendingTopOfStack;
          //capture keydowns
          if (event.keyCode === arrowUp) {

            pendingTopOfStack = elementsStack.shift();

            // Test for presence of $overlay object?
            if ($(pendingTopOfStack).is('.inspectOverlay')) {
              pendingTopOfStack = elementsStack.shift();
            }

            $topOfStack = $(elementsStack[0]);

            renderOverlay($topOfStack);

            $('.inspectOverlay').focus();
          }
        });
      });

      //NOT apart of any class, this determine stack and selectedElement to pass to instantiations of SelectionOverlay and PlacementOverlay

      $('body').on('mousemove.screenshot', function(event) {
        var $targetElement;

        event.stopPropagation();

        //get coordinates
        //subtracted offset to fix scrolling issue
        var mouseCoordinateX = event.pageX - window.pageXOffset;
        var mouseCoordinateY = event.pageY - window.pageYOffset;

        //maybe use elementFromPoint to just get one element instead of the whole stack?

        //get elements on point from coordinates, this provides me the stack
        elementsStack = document.elementsFromPoint(mouseCoordinateX, mouseCoordinateY);

        if ($(elementsStack[0]).is('.inspectOverlay')) {
          $targetElement = $(elementsStack[1]);
        } else {
          $targetElement = $(elementsStack[0]);
        }

        //modify currentSelectionOverlay instance to accept new $targetElement
        //currentSelectionOverlay.render();

        renderOverlay($targetElement);
      });
    }
  }
);


//VIDEO
function saveRedirectURL(redirectUrl) {
  chrome.storage.local.set({"redirectUrl": redirectUrl});
};

var contentPort = chrome.runtime.connect({name: "contentToBackground"});

chrome.runtime.onConnect.addListener(function(port) {
  console.log("Connected!", port);
  port.onMessage.addListener(function(message) {
    console.log("message received: ", message);
    if (message.videoToggle) {

      var redirectUrl = prompt("Please input your redirect URL here");
      //send redirectUrl to background.js
      if (redirectUrl) {
        contentPort.postMessage({redirectUrl: redirectUrl});
      } else {
        return;
      }
      //refresh
      window.location.reload();
    } else {
      //this is when the box is UNCHECKED
      contentPort.postMessage({redirectUrl: null});
    }
  });
});
