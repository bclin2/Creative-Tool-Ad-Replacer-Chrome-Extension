var arrowUp = 38; 

function SelectionOverlay() {
  this.$overlay = $('<div class="selectionOverlay" style="position: fixed; background-color: rgba(255, 255, 0, 0.4); z-index: 99999999"></div>');
  this.$dimensions = $('<div class="overlayDimensions" style="display: block; position: absolute; z-index: 100000000; background-color: black; color: white; font-family: Helvetica; padding: 1px"></div>');
};

SelectionOverlay.prototype.initialize = function() {
  //initializes object by appending dimensions to overlay
  this.$overlay.append(this.$dimensions);
};

SelectionOverlay.prototype.modifyOverlay = function(targetElementPosition, targetElementDimensions) {
  //make css changes to this.$overlay
  this.$overlay.css({
    width: targetElementDimensions.width,
    height: targetElementDimensions.height,
    top: targetElementPosition.top,
    left: targetElementPosition.left
  });
};

SelectionOverlay.prototype.remove = function() {
  this.$overlay.detach();
};

SelectionOverlay.prototype.render = function(targetElementPosition, targetElementDimensions) {
  if (targetElementDimensions.top === 0 || targetElementDimensions.left === 0) {
    return;
  }

  //modify self overlay
  this.modifyOverlay(targetElementPosition, targetElementDimensions);
  //remove overlay, append overlay
  $('body').append(this.$overlay);
  this.$dimensions.text(targetElementDimensions.width + 'x' + targetElementDimensions.height);
};

SelectionOverlay.prototype.bindClick = function() {

  this.$overlay.one('click.screenshot', function(event) {
    event.preventDefault();
    event.stopPropagation();
    this.remove(); 
    $('body').off('mousemove.screenshot');
    renderPlacement();
  });
};

///////////////////////////////////////////////////////////////////////

function PlacementOverlay() {
  this.$overlay = $('<div class="placementOverlay" style="position: fixed; background-color: rgba(255, 255, 0, 0.4); z-index: 99999999;"></div>');
  this.$dimensions = $('<div class="overlayPlacementDimensions" style="display: block; position: absolute; z-index: 100000000; background-color: black; color: white; font-family: Helvetica; padding: 1px; pointer-events: none"></div>');
  this.$paste = $('<button class="pasteOverlay" data-toggle="modal" data-target="#pasteModal" style="position: absolute; right: 20px; padding: 2px 4px; border: none; background: rgb(0,0,0); color: white; z-index:100000000">P</button>');
  this.$close = $('<button class="closeOverlay" border style="position: absolute; border: none; right: 0; padding: 2px 4px; background: rgb(0,0,0); color: white; z-index:100000000">X</button>');
  this.$targetElement;
  this.position;
  this.dimensions;
};

PlacementOverlay.prototype.initialize = function() {
  this.$overlay.append(this.$dimensions);
  this.$overlay.append(this.$paste);
  this.$overlay.append(this.$close);
};

PlacementOverlay.prototype.getProperties = function($targetElement) {
  this.$targetElement = $targetElement;
  if (!($targetElement)[0]) {
    return;
  }
  this.targetElementPosition = $targetElement[0].getBoundingClientRect();
  this.targetElementDimensions = {
    width: $targetElement.innerWidth(),
    height: $targetElement.innerHeight()
  };
};

PlacementOverlay.prototype.cancelDefaultDrop = function() {
  if (event.preventDefault) { 
    event.preventDefault();
    event.stopPropagation();
  }
  return false;
};

PlacementOverlay.prototype.modifyOverlay = function() {

  if (this.targetElementDimensions.top === 0 || this.targetElementDimensions.left === 0) {
    return;
  }

  this.$overlay.css({
    width: this.targetElementDimensions.width,
    height: this.targetElementDimensions.height,
    top: this.targetElementPosition.top,
    left: this.targetElementPosition.left
  })
};

PlacementOverlay.prototype.replaceOriginalContent = function(data) {
  var $newContent = $('<iframe frameborder="0" scrolling="no"></iframe>');

  $newContent.css({
    width: this.targetElementDimensions.width,
    height: this.targetElementDimensions.height
  });

  this.$targetElement.replaceWith($newContent);

  $newContent[0].contentWindow.document.open('text/html', 'replace');
  $newContent[0].contentWindow.document.write(data);
  $newContent[0].contentWindow.document.close();

  $newContent.contents().find("body").css({
    padding: 0,
    margin: 0,
    border: 0
  });

  this.remove();
};

PlacementOverlay.prototype.dragDrop = function() {
  $('body').on('drag.screenshot', function(event) {
    event.preventDefault();
  });

  var placementThat = this;

  placementThat.$overlay.on('dragover', this.cancelDefaultDrop);
  placementThat.$overlay.on('dragenter', this.cancelDefaultDrop);

  placementThat.$overlay.on('drop', function(event) {
    event.preventDefault();
    var data = event.originalEvent.dataTransfer;
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
          placementThat.replaceOriginalContent('<img src="' + readerData + '">');
        } else if (file.type.includes("text")) {
          placementThat.replaceOriginalContent(readerData);
        }
      });
    }
    return false;
  });
};

PlacementOverlay.prototype.moveToParent = function() {
  var overlayThat = this;
  $(window).on('keydown.screenshot', function(event) {
    //capture keydowns
    if (event.keyCode === arrowUp) {
      overlayThat.getProperties(overlayThat.$targetElement.parent());
      overlayThat.render();
    }
  });
};

PlacementOverlay.prototype.scrollReposition = function() {
  var placementThat = this;
  var timer;
  $(window).on('scroll.screenshot', function(e) {

    if (timer) {
      window.clearTimeout(timer);
    }

    console.log("top: ", placementThat.targetElementPosition.top);

    timer = window.setTimeout(function() {

      placementThat.$overlay.css({
        top: placementThat.$targetElement.offset().top - window.pageYOffset,
        left: placementThat.targetElementPosition.left
      });
    }, 30);
    //16 is about 60fps
  });
};

PlacementOverlay.prototype.paste = function() {
  var placementThat = this;
  this.$paste.on('click', function(event) {
    var content = window.prompt('Paste replacement content');

    if (content) {
      placementThat.replaceOriginalContent(content);
    }
  });
};

PlacementOverlay.prototype.exit = function() {
  var placementThat = this;
  this.$close.on('click', function() {
    $(window).off('keydown.screenshot');
    placementThat.unbindEvents();
    placementThat.remove();
  });
};

PlacementOverlay.prototype.bindEvents = function() {
  //drag/Drop
  this.dragDrop();
  //keydown
  this.moveToParent();
  //window scroll
  this.scrollReposition();
  //paste event
  this.paste();
  //exit event
  this.exit();
};

PlacementOverlay.prototype.unbindEvents = function() {
  $(window).off('keydown.screenshot');
  $('body').off('mousemove.screenshot');
  $(window).off('scroll.screenshot');
  $('body').off('drag.screenshot');
  this.$overlay.off('click');
  this.$overlay.off('dragover');
  this.$overlay.off('dragenter');
  this.$overlay.off('drop');
  this.$paste.off('click');
};

PlacementOverlay.prototype.remove = function() {
  this.$overlay.detach();
};

PlacementOverlay.prototype.render = function() {
  if (this.targetElementDimensions.top === 0 || this.targetElementDimensions.left === 0) {
    return;
  }
  this.unbindEvents();
  this.remove();
  this.modifyOverlay();
  $('body').append(this.$overlay);
  this.$dimensions.text(this.targetElementDimensions.width + 'x' + this.targetElementDimensions.height);
  this.$overlay.attr('tabindex', '0');
  this.$overlay.focus();
  this.bindEvents();
};


var selectionOverlay = new SelectionOverlay();
selectionOverlay.initialize();
var placementOverlay = new PlacementOverlay();
placementOverlay.initialize();

function renderPlacement() {
  placementOverlay.render();
};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if ( request.message === "clicked_browser_action" ) {

      console.log("Content.js is running!");

      //on browser action click, remove all event binds
      placementOverlay.remove();
      placementOverlay.unbindEvents();
      var targetElementPosition;
      var targetElementDimensions;

      //bindClick must set placementFlag to true
      selectionOverlay.bindClick(targetElementPosition, targetElementDimensions);

      $('body').on('mousemove.screenshot', function(event) {
        var $targetElement;

        event.stopPropagation();

        //get coordinates
        //subtracted offset to fix scrolling issue
        var mouseCoordinateX = event.pageX - window.pageXOffset;
        var mouseCoordinateY = event.pageY - window.pageYOffset;

        //maybe use elementFromPoint to just get one element instead of the whole stack?

        //get elements on point from coordinates, this provides me the stack
        var elementsStack = document.elementsFromPoint(mouseCoordinateX, mouseCoordinateY);

        if ($(elementsStack[0]).is('.selectionOverlay')) {
          $targetElement = $(elementsStack[1]);
        } else {
          $targetElement = $(elementsStack[0]);
        }

        targetElementPosition = $targetElement[0].getBoundingClientRect();
        targetElementDimensions = {
          width: $targetElement.innerWidth(),
          height: $targetElement.innerHeight()
        };

        //modify selectionOverlay instance to accept new $targetElement
        placementOverlay.getProperties($targetElement);
        selectionOverlay.render(targetElementPosition, targetElementDimensions);

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
