// () => {

let canvas;
let canvasMeta = {
  identifier: {
    // simple identifier
    id: 'canvas-area',
    containerArea: 'canvas-inner-container',
    // specific identifier
    dropArea: '#canvas-droparea'
  },
  value: {
    canter: {},
    aspectRatio: (16 / 9).toFixed(2),
    zoomValue: 1,
    zoomFactor: 0.1,
    borderColor: 'blue',
    cornerSize: 10,
    cornerColor: 'red',
    transparentCorners: false,
    cloneOffset: 20,
    textControl: {
      tl: true,
      tr: true,
      bl: true,
      br: true,
      ml: true,
      mt: false,
      mr: true,
      mb: false,
      mtr: true
    },
    imageControl: {
      tl: true,
      tr: true,
      bl: true,
      br: true,
      ml: false,
      mt: false,
      mr: false,
      mb: false,
      mtr: true
    },
    propertiesToInclude: [
      'transparentCorners',
      'borderColor',
      'cornerSize',
      'cornerColor',
      'referenceObject'
    ],
    crop: {
      control: {
        tl: true,
        tr: true,
        bl: true,
        br: true,
        ml: true,
        mt: true,
        mr: true,
        mb: true,
        mtr: false
      },
      active: false,
      copy: false,
      box: false
    }
  },

  configuration: {},

  currentHistoryIndex: -1,
  currentHistory: [],

  flag: {
    isDirty: false,
    panningEnabled: false,
    cropEnabled: false,
    isZoomed: false,
    isCurrentObjectText: false,
    isCurrentObjectImage: false,
    isCurrentObjectTransparentable: false,
    isCurrentObjectTransparentSelected: false
  }
};
let appMeta = {
  asset: [],
  board: {
    data: [],
    currentIndex: 0,
    update: {
      method: false,
      delay: 2000
    }
  },
  flag: {
    isFontToolbarDirty: false,
    // isBoardDirty: false,
    isAssetDirty: false,
    isProductPanelDirty: false,
    isBoardItemDirty: false,
    isBoot: true,
    isPreviewEnabled: false
  },
  value: {
    fontFamily: 'Arial',
    fontSize: '14',
    userID: 1,
    currentSelectedItem: 0,
    lastVisitedTab: ''
  },
  identifier: {
    customProduct: '.product-image[type="custom"]',

    boardTitle: '.board-title',
    tab: '.nav-link',
    currentDragableObject: '.dragging',

    fontFamily: '.js-font-select',
    fontSize: '.js-font-select-size',

    completeToolbarElement: '.top-panel',
    completeTitleElement: '.d-flex:has(.canvas-title-bar)',

    fontToolbarElement: '.editor-icons',
    imageToolbarElement: '.image-icons',
    cropToolbarElement: '.crop-toolbar',
    transparentToolbarElement: '.do-transparent',
    undoTransparentToolbarElement: '.undo-transparent',

    dropzoneElement: '.add-new',

    uploadByURL: "input[name='url']",
    uploadByURLName: "input[name='name']",
    uploadByURLPrice: "input[name='price']",
    uploadByURLIsPrivate: "input[name='is_private']",
    uploadByURLSubmit: '#step3 .red-button',

    backgroundColorElement: '.canvas-pallete-color',
    floorPatternElement: '.canvas-pallete-wood-patterns',

    manualDrop: '.manual-drop'
  },
  template: {
    privateProduct: {
      template: '#products',
      container: '#myItems > .flex-grid',
      renderer: () => {}
    },
    publicProduct: {
      template: '#products',
      container: '#allUploads > .flex-grid',
      renderer: () => {}
    },
    productPanel: {
      template: '#bottom-panel',
      container: '.bottom-panel-custom',
      renderer: () => {}
    },
    boardItem: {
      template: '#board-items-template',
      container: '#board',
      renderer: () => {}
    }
  },
  endpoint: {
    api: 'server.php',
    configuration: './configurations.json',
    boardView: 'myboards.html'
  }
};

// main entry point
$(() => {
  getConfig(() => {
    // initialize canvas area and set up all handlers
    initializeCanvas(() => {
      // initialize toolbar and other area and set up all handlers
      initializeAppMeta();
      // get all user boards
      getBoards();
      // get all user assets
      getAssets();
      // setup upload methods
      initializeUploadMethods();
    });
  });

  initializeTemplates();
});

let getConfig = callback => {
  $.getJSON(appMeta.endpoint.configuration, response => {
    canvasMeta.configuration = response;
    if (callback) callback();
  });
};
let getBoards = () => {
  $.post(
    appMeta.endpoint.api,
    {
      operation: 'select',
      entity: 'board',
      data: {
        user_id: appMeta.value.userID
      }
    },
    response => {
      let boardFound = false;
      appMeta.board.data = response;
      appMeta.board.data.forEach((boardObject, objectIndex) => {
        // convert state back to json
        appMeta.board.data[objectIndex].state = JSON.parse(boardObject.state);
        if (boardObject.board_id == Cookies.get('board_id')) {
          boardFound = true;
          appMeta.board.currentIndex = objectIndex;
          $(appMeta.identifier.boardTitle).val(boardObject.title);
          canvasMeta.currentHistory.push(boardObject.state);
          canvasMeta.currentHistoryIndex++;
          updateStateFromHistory();
        }
      });

      // if board does not exist redirect user to board list
      if (boardFound == false)
        window.location.replace(appMeta.endpoint.boardView);
      else {
        if (Cookies.get('backgroundColor').length > 0) {
          canvas.setBackgroundColor(Cookies.get('backgroundColor'), function() {
            canvas.renderAll();
            saveHistory();
          });
          Cookies.set('backgroundColor', '');
        }
        if (Cookies.get('backgroundImage').length > 0) {
          fb.Image.fromURL(Cookies.get('backgroundImage'), function(img) {
            img.set({
              originX: 'left',
              originY: 'top',
              scaleX: canvas.width / img.width,
              scaleY: canvas.height / img.height
            });
            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
            saveHistory();
          });
          Cookies.set('backgroundImage', '');
        }
      }
    }
  );
};
let getAssets = () => {
  $.post(
    appMeta.endpoint.api,
    {
      operation: 'select',
      entity: 'asset',
      data: {
        user_id: appMeta.value.userID
      },
      order: 'modified_at desc'
    },
    function(response) {
      if (response.length > 0) {
        appMeta.asset = response;
        appMeta.flag.isAssetDirty = true;
        appMeta.flag.isProductPanelDirty = true;
        renderAppMeta();
      }
    }
  );
};

let initializeCanvas = callback => {
  canvas = new fb.Canvas(canvasMeta.identifier.id, {
    containerClass: canvasMeta.identifier.containerArea,
    preserveObjectStacking: true,
    width: $(canvasMeta.identifier.dropArea)
      .parent()
      .width(),
    height:
      $(canvasMeta.identifier.dropArea)
        .parent()
        .width() / canvasMeta.value.aspectRatio,
    selection: true
  });

  // add class for detection
  $(this).on('dragstart dragend', e => {
    $(e.target).toggleClass(
      appMeta.identifier.currentDragableObject.replace('.', '')
    );
  });

  // setup of responsive handlers
  $(this).resize(handleResize);

  // update canvas center point
  updateCanvasCenter();

  // bind drop area events
  $(canvasMeta.identifier.dropArea).bind('drop', e => {
    let draggedObject = $(appMeta.identifier.currentDragableObject);
    let dropType = draggedObject.attr('drop-type');
    let referenceID = draggedObject.parent().attr('data-product');
    let referenceType = draggedObject.parent().attr('type');
    handleDrop(e, draggedObject, dropType, referenceID, referenceType);
  });

  // handle canvas events
  canvas.on('selection:created', handleSelection);
  canvas.on('selection:updated', handleSelection);

  // stop objects from going out of canvas area
  canvas.on('object:moving', e => {
    return;
    var obj = e.target;
    var boundingRect = obj.getBoundingRect();
    // if object is too big ignore
    if (
      obj.currentHeight > obj.canvas.height ||
      obj.currentWidth > obj.canvas.width ||
      obj.clipPath
    )
      return;

    obj.setCoords();

    if (!canvasMeta.flag.cropEnabled) {
      if (boundingRect.top < 0 || boundingRect.left < 0) {
        obj.top = Math.max(obj.top, obj.top - boundingRect.top);
        obj.left = Math.max(obj.left, obj.left - boundingRect.left);
      }

      if (
        boundingRect.top + boundingRect.height > obj.canvas.height ||
        boundingRect.left + boundingRect.width > obj.canvas.width
      ) {
        obj.top = Math.min(
          obj.top,
          obj.canvas.height - boundingRect.height + obj.top - boundingRect.top
        );
        obj.left = Math.min(
          obj.left,
          obj.canvas.width - boundingRect.width + obj.left - boundingRect.left
        );
      }
    }
  });
  canvas.on('object:modified', saveHistory);

  canvas.on('mouse:down', e => {
    if (canvasMeta.flag.isZoomed && !canvas.getActiveObject()) {
      canvasMeta.flag.panningEnabled = true;
      canvas.defaultCursor = 'move';
      canvas.selection = false;
    } else if (canvasMeta.flag.cropEnabled)
      if (canvasMeta.value.crop.box && e.target == null) {
        // if cropbox exist and empty area was clicked
        canvas.setActiveObject(canvasMeta.value.crop.box);
        handleCrop(true);
      }
  });
  canvas.on('mouse:up', e => {
    canvasMeta.flag.panningEnabled = false;
    canvas.defaultCursor = 'default';
    canvas.selection = true;
  });
  canvas.on('mouse:move', e => {
    if (canvasMeta.flag.panningEnabled && e && e.e) {
      let delta = new fb.Point(e.e.movementX, e.e.movementY);
      canvas.relativePan(delta);
      if (canvasMeta.value.zoomValue > 1) keepPositionInBounds(canvas);
    }
  });

  if (callback) callback();
};
let initializeAppMeta = () => {
  // Initialize font values
  $(appMeta.identifier.fontFamily).change(e => {
    appMeta.value.fontFamily = $(e.currentTarget)
      .val()
      .replace('+', ' ');
    appMeta.flag.isFontToolbarDirty = true;
    updateCurrentObject();
  });
  $(appMeta.identifier.fontSize).change(e => {
    appMeta.value.fontSize = $(e.currentTarget).val();
    appMeta.flag.isFontToolbarDirty = true;
    updateCurrentObject();
  });
  $(appMeta.identifier.backgroundColorElement).click(e => {
    let backgroundColor = $(e.currentTarget).css('background-color');
    canvas.setBackgroundColor(backgroundColor, function() {
      canvas.renderAll();
      saveHistory();
    });
  });
  $(appMeta.identifier.floorPatternElement).click(e => {
    let src = $(e.currentTarget).attr('src');
    fb.Image.fromURL(src, function(img) {
      img.set({
        originX: 'left',
        originY: 'top',
        scaleX: canvas.width / img.width,
        scaleY: canvas.height / img.height
      });
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
    });
  });

  $(appMeta.identifier.boardTitle).change(e => {
    appMeta.board.data[appMeta.board.currentIndex].title = $(
      appMeta.identifier.boardTitle
    ).val();

    if (appMeta.board.update.method == false)
      appMeta.board.update.method = debounce(
        updateBoard,
        appMeta.board.update.delay
      );

    appMeta.board.update.method();
  });

  // handle custom product click for bottom sheet render
  $(document).on('click', appMeta.identifier.customProduct, e => {
    appMeta.flag.isProductPanelDirty = true;
    appMeta.value.currentSelectedItem = $(e.currentTarget).attr('data-product');
    renderAppMeta();
  });

  // handle board tab or preview mode
  $(appMeta.identifier.tab).click(e => togglePreviewMode(e));

  // handle manual add
  $(document).on('click', appMeta.identifier.manualDrop, e => {
    let dropType = $(e.currentTarget).attr('drop-type');
    if (dropType == 'image') {
      let referenceID = $(e.currentTarget).attr('data-product');
      let referenceType = $(e.currentTarget).attr('type');
      let draggedObject = $(
        '.product-image[type="' +
          referenceType +
          '"][data-product="' +
          referenceID +
          '"] img'
      );
      // console.log(draggedObject, dropType, referenceID, referenceType);
      handleDrop(false, draggedObject, dropType, referenceID, referenceType);
    } else if (dropType == 'text') handleDrop(false, $(e.target), dropType);
  });

  // Render first updates
  updateToolbar();
};

let initializeUploadMethods = () => {
  // #1 Using Dropzone
  let myDropzone = new Dropzone(appMeta.identifier.dropzoneElement, {
    url: appMeta.endpoint.api,
    autoProcessQueue: true,
    maxFilesize: 20,
    acceptedFiles:
      'image/bmp, image/x-bmp, image/x-bitmap, image/x-xbitmap, image/x-win-bitmap, image/x-windows-bmp, image/ms-bmp, image/x-ms-bmp, image/gif, image/x-icon, image/x-ico, image/vnd.microsoft.icon, image/jpx, image/jpm, image/jpeg, image/pjpeg, image/png,image/x-png, image/tiff',
    sending: (file, xhr, formData) => {
      formData.append('operation', 'file');
      formData.append('user_id', appMeta.value.userID);
      formData.append('data[name]', 'custom');
      formData.append('data[brand]', 'custom');
    },
    success: (file, response) => {
      // remove preview
      myDropzone.removeFile(file);
      appMeta.asset.unshift(response);
      appMeta.flag.isAssetDirty = true;
      renderAppMeta();
    },
    error: (file, error, xhr) => {
      myDropzone.removeFile(file);
    }
  });

  // #2 Upload by URL
  $(appMeta.identifier.uploadByURLSubmit).click(function() {
    // Not empty
    if ($(appMeta.identifier.uploadByURL).val().length > 0) {
      $.post(
        appMeta.endpoint.api,
        {
          operation: 'fetch',
          url: $(appMeta.identifier.uploadByURL).val(),
          user_id: appMeta.value.userID,
          data: {
            name: $(appMeta.identifier.uploadByURLName).val(),
            price: $(appMeta.identifier.uploadByURLPrice).val(),
            is_private: $(appMeta.identifier.uploadByURLIsPrivate).is(
              ':checked'
            )
              ? 1
              : 0
          }
        },
        response => {
          $(appMeta.identifier.uploadByURL).val('');
          $(appMeta.identifier.uploadByURLName).val('');
          $(appMeta.identifier.uploadByURLPrice).val('');
          appMeta.asset.unshift(response);
          appMeta.flag.isAssetDirty = true;
          renderAppMeta();
        }
      );
    }
  });
};
let initializeTemplates = () => {
  appMeta.template.privateProduct.renderer = Handlebars.compile(
    $(appMeta.template.privateProduct.template).html()
  );
  appMeta.template.publicProduct.renderer = Handlebars.compile(
    $(appMeta.template.publicProduct.template).html()
  );
  appMeta.template.productPanel.renderer = Handlebars.compile(
    $(appMeta.template.productPanel.template).html()
  );
  appMeta.template.boardItem.renderer = Handlebars.compile(
    $(appMeta.template.boardItem.template).html()
  );
};

let updateCanvasCenter = () => {
  let center = canvas.getCenter();
  canvasMeta.value.center = {
    x: center.left,
    y: center.top
  };
};
let updateCurrentObject = () => {
  let activeObject = canvas.getActiveObject();
  if (activeObject) {
    if (activeObject.type == 'textbox') {
      if (appMeta.flag.isFontToolbarDirty)
        activeObject.set('fontFamily', appMeta.value.fontFamily);
      activeObject.set('fontSize', appMeta.value.fontSize);
    } else if (activeObject.type == 'image') {
    }
  }

  // request render at the end
  canvas.requestRenderAll();
  // mark all actions completed
  Object.keys(appMeta.flag).map(flag => (appMeta.flag[flag] = false));
};
let updateStateFromHistory = () => {
  return canvas.loadFromJSON(
    canvasMeta.currentHistory[canvasMeta.currentHistoryIndex],
    () => {
      if (appMeta.flag.isBoot) {
        appMeta.flag.isBoot = false;
        handleResize(false, true);
      }
    }
  );
};

let handleSelection = () => {
  let activeObject = canvas.getActiveObject();
  // reset selection
  canvasMeta.flag.isCurrentObjectText = canvasMeta.flag.isCurrentObjectImage = canvasMeta.flag.isCurrentObjectTransparentSelected = false;

  if (activeObject) {
    if (activeObject.type == 'textbox') {
      appMeta.value.fontFamily = activeObject.fontFamily;
      appMeta.value.fontSize = activeObject.fontSize;
      appMeta.flag.isFontToolbarDirty = true;
      canvasMeta.flag.isCurrentObjectText = true;
    } else if (activeObject.type == 'image') {
      canvasMeta.flag.isCurrentObjectImage = true;
      canvasMeta.flag.isCurrentObjectTransparentable =
        activeObject.referenceObject.type == 'custom';
      canvasMeta.flag.isCurrentObjectTransparentSelected = activeObject
        .getSrc()
        .includes(activeObject.referenceObject.transparentPath);
    }
    updateToolbar();
  }
};
let handleDrop = (e, draggedObject, dropType, referenceID, referenceType) => {
  if (dropType == 'image') {
    let referenceObjectValue = {
      type: referenceType
    };

    if (referenceType == 'custom') {
      referenceObjectValue.id = appMeta.asset[referenceID].asset_id;
      referenceObjectValue.path = appMeta.asset[referenceID].path;
      referenceObjectValue.transparentPath =
        appMeta.asset[referenceID].transparent_path;
      referenceObjectValue.name = appMeta.asset[referenceID].name;
      referenceObjectValue.price = appMeta.asset[referenceID].price;
      referenceObjectValue.brand = appMeta.asset[referenceID].brand;
    } else if (referenceType == 'default') {
      referenceObjectValue.id = remoteProducts[referenceID].id;
      referenceObjectValue.isTransparent = 1;
      referenceObjectValue.path = remoteProducts[referenceID].main_image;
      referenceObjectValue.transparentPath = '';
      referenceObjectValue.name = remoteProducts[referenceID].name;
      referenceObjectValue.price = remoteProducts[referenceID].is_price;
      referenceObjectValue.brand = remoteProducts[referenceID].site;
    }

    imageToInsert = new fb.Image(draggedObject[0], {
      lockScalingFlip: true,
      referenceObject: referenceObjectValue
    });
    applyDrop(e, imageToInsert);
    // fb.util.loadImage(draggedObject[0].src,
    //   (img) => {
    //     imageToInsert = new fb.Image(img, {
    //       lockScalingFlip: true
    //     });
    //     imageToInsert.scale(canvasMeta.value.scaleFactor);
    //     imageToInsert.setControlsVisibility(canvasMeta.value.imageControl);
    //     applyDrop(e, imageToInsert);
    //   }, null, {
    //     // crossOrigin: 'anonymous'
    //   }
    // );
  } else if (dropType == 'text') {
    let textToInsert = new fb.Textbox(draggedObject.text(), {
      fontFamily: draggedObject.text(),
      fontSize: 24
    });
    textToInsert.setControlsVisibility(canvasMeta.value.textControl);
    applyDrop(e, textToInsert);
  }
};
let applyDrop = (e, objectToInsert) => {
  if (objectToInsert) {
    let x = (y = 0);

    // if object is more then 30% size on canvas then make it 30%
    if (objectToInsert.width / canvas.getWidth() >= 0.3)
      objectToInsert.scale((canvas.getWidth() * 0.3) / objectToInsert.width);
    else if (objectToInsert.height / canvas.getHeight() >= 0.3)
      objectToInsert.scale((canvas.getHeight() * 0.3) / objectToInsert.height);

    if (e) {
      let offset = $('#' + canvasMeta.identifier.id).offset();
      x = e.clientX - offset.left;
      y = e.clientY - offset.top;
    } else {
      x =
        canvasMeta.value.center.x -
        (objectToInsert.width * objectToInsert.scaleX) / 2;
      y =
        canvasMeta.value.center.y -
        (objectToInsert.height * objectToInsert.scaleY) / 2;
    }

    objectToInsert.set({
      left: x,
      top: y,
      transparentCorners: canvasMeta.value.transparentCorners,
      borderColor: canvasMeta.value.borderColor,
      cornerSize: canvasMeta.value.cornerSize,
      cornerColor: canvasMeta.value.cornerColor
    });
    canvas.add(objectToInsert);
    canvas.setActiveObject(objectToInsert);
    canvas.requestRenderAll();
    saveHistory();
  }
};

let updateCanvasState = () => {
  appMeta.board.data[appMeta.board.currentIndex].state = canvas.toJSON(
    canvasMeta.value.propertiesToInclude
  );
  appMeta.board.data[appMeta.board.currentIndex].state.canvas = {
    width: canvas.width,
    height: canvas.height
  };
  return appMeta.board.data[appMeta.board.currentIndex].state;
};
let handleResize = (event, forceUpdate = false) => {
  let previousWidth = forceUpdate
    ? appMeta.board.data[appMeta.board.currentIndex].state.canvas.width
    : canvas.width;
  let currentWidth = $(canvasMeta.identifier.dropArea)
    .parent()
    .width();

  appMeta.value.scaleFactor = currentWidth / previousWidth;

  canvas.setWidth(currentWidth);
  canvas.setHeight(currentWidth / canvasMeta.value.aspectRatio);

  if (canvas.backgroundImage) {
    canvas.backgroundImage.scaleX *= appMeta.value.scaleFactor;
    canvas.backgroundImage.scaleY *= appMeta.value.scaleFactor;
  }

  // scale objects
  canvas.getObjects().map(function(o) {
    o.scaleX *= appMeta.value.scaleFactor;
    o.scaleY *= appMeta.value.scaleFactor;
    o.top *= appMeta.value.scaleFactor;
    o.left *= appMeta.value.scaleFactor;
    o.setCoords();
  });

  // update canvas center point
  updateCanvasCenter();
};

let saveHistory = () => {
  if (canvasMeta.flag.cropEnabled) return;

  let currentState = canvas.toJSON(canvasMeta.value.propertiesToInclude);

  canvasMeta.flag.isDirty = true;

  if (appMeta.board.update.method == false)
    appMeta.board.update.method = debounce(
      updateBoard,
      appMeta.board.update.delay
    );

  // If a modification took place while under undo/redo state
  if (canvasMeta.currentHistoryIndex !== canvasMeta.currentHistory.length - 1)
    canvasMeta.currentHistory.splice(canvasMeta.currentHistoryIndex + 1);

  canvasMeta.currentHistory.push(currentState);
  canvasMeta.currentHistoryIndex++;

  appMeta.board.data[appMeta.board.currentIndex].state = currentState;
  // call the method
  appMeta.board.update.method();
};
let updateBoard = () => {
  if (canvasMeta.flag.cropEnabled) return;

  let previewObject = '';
  try {
    previewObject = canvas.toDataURL({
      format: 'image/jpeg',
      quality: 0.2
      // multiplier: 0.2
    });
  } catch (err) {
    previewObject =
      'data:image/png;base64,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';
    console.log(err);
  }

  $.post(
    appMeta.endpoint.api,
    {
      operation: 'update',
      entity: 'board',
      data: {
        title: appMeta.board.data[appMeta.board.currentIndex].title,
        state: JSON.stringify(updateCanvasState()),
        // state: JSON.stringify(canvas.toJSON(canvasMeta.value.propertiesToInclude)),
        preview: previewObject
      },
      where: {
        board_id: appMeta.board.data[appMeta.board.currentIndex].board_id
      }
    },
    data => {
      // canvas_boards.unshift(JSON.parse(data));
      // console.log(canvas_boards);
      // $('#board .catalog-content').prepend( userBoardTemplate( { boards: canvas_boards[0] } ) );
      canvasMeta.flag.isDirty = false;
    }
  );
};

let updateToolbar = () => {
  if (appMeta.flag.isFontToolbarDirty) {
    $(appMeta.identifier.fontFamily)
      .val(appMeta.value.fontFamily)
      .attr('selected', true);
    $(appMeta.identifier.fontSize)
      .val(appMeta.value.fontSize)
      .attr('selected', true);
  }

  // toggle visibility of toolbar elements based on flag
  $(appMeta.identifier.fontToolbarElement).toggle(
    canvasMeta.flag.isCurrentObjectText
  );
  $(appMeta.identifier.imageToolbarElement).toggle(
    canvasMeta.flag.isCurrentObjectImage
  );
  $(appMeta.identifier.transparentToolbarElement).toggle(
    canvasMeta.flag.isCurrentObjectTransparentable &&
      !canvasMeta.flag.isCurrentObjectTransparentSelected
  );
  $(appMeta.identifier.undoTransparentToolbarElement).toggle(
    canvasMeta.flag.isCurrentObjectTransparentable &&
      canvasMeta.flag.isCurrentObjectTransparentSelected
  );
  $(appMeta.identifier.completeToolbarElement).toggle(
    !appMeta.flag.isPreviewEnabled
  );
  // had to do it this way because of css important on flex
  $(appMeta.identifier.completeTitleElement).css(
    'visibility',
    appMeta.flag.isPreviewEnabled ? 'hidden' : 'visible'
  );
  $(appMeta.identifier.cropToolbarElement).toggle(canvasMeta.flag.cropEnabled);
};
let renderAppMeta = () => {
  if (appMeta.flag.isAssetDirty) {
    appMeta.flag.isAssetDirty = false;
    $(appMeta.template.privateProduct.container).html(
      appMeta.template.privateProduct.renderer({
        products: appMeta.asset
          .filter(x => x.user_id == appMeta.value.userID)
          .map(x => {
            return {
              main_image: x.transparent_path ? x.transparent_path : x.path,
              type: 'custom'
            };
          })
      })
    );
    $(appMeta.template.publicProduct.container).html(
      appMeta.template.publicProduct.renderer({
        products: appMeta.asset
          .filter(x => !x.is_private)
          .map(x => {
            return {
              main_image: x.transparent_path ? x.transparent_path : x.path,
              type: 'custom'
            };
          })
      })
    );
  }

  if (appMeta.flag.isProductPanelDirty) {
    appMeta.flag.isProductPanelDirty = false;
    $(appMeta.template.productPanel.container).html(
      appMeta.template.productPanel.renderer({
        index: appMeta.value.currentSelectedItem,
        main_image: appMeta.asset[appMeta.value.currentSelectedItem]
          .transparent_path
          ? appMeta.asset[appMeta.value.currentSelectedItem].transparent_path
          : appMeta.asset[appMeta.value.currentSelectedItem].path,
        type: 'custom',
        name: appMeta.asset[appMeta.value.currentSelectedItem].name,
        site: 'custom',
        is_price: appMeta.asset[appMeta.value.currentSelectedItem].price
      })
    );
  }

  if (appMeta.flag.isBoardItemDirty) {
    appMeta.flag.isBoardItemDirty = false;

    let imageObjects = canvas.getObjects('image');

    imageObjects.forEach((object, index) => {
      let objectCenter = object.getCenterPoint();
      let textToInsert = new fb.Text(` ${index + 1} `, {
        left: objectCenter.x,
        top: objectCenter.y,
        fontSize: 20,
        fill: '#fff',
        backgroundColor: '#b76e79',
        controlVisible: false,
        selectable: false
      });

      canvas.add(textToInsert);
    });

    if (imageObjects.length > 0) {
      $(appMeta.template.boardItem.container).html(
        appMeta.template.boardItem.renderer(
          imageObjects.map((x, y) => {
            return {
              index: y + 1,
              name: x.referenceObject.name,
              brand: x.referenceObject.brand,
              price: x.referenceObject.price
                ? '$' + x.referenceObject.price
                : ''
            };
          })
        )
      );
    }
  }

  // if (appMeta.flag.isBoardDirty) {
  //   $('#board .catalog-content').html(
  //     userBoardTemplate({
  //       boards: appMeta.boards
  //     })
  //   );
  // }
};

let debounce = (func, wait, immediate) => {
  var timeout;

  return function() {
    var context = this,
      args = arguments;
    var callNow = immediate && !timeout;
    clearTimeout(timeout);

    // Set the new timeout
    timeout = setTimeout(function() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    }, wait);
    if (callNow) func.apply(context, args);
  };
};
let keepPositionInBounds = () => {
  let zoom = canvas.getZoom();
  let xMin = ((2 - zoom) * canvas.getWidth()) / 2;
  let xMax = (zoom * canvas.getWidth()) / 2;
  let yMin = ((2 - zoom) * canvas.getHeight()) / 2;
  let yMax = (zoom * canvas.getHeight()) / 2;

  let point = new fb.Point(canvas.getWidth() / 2, canvas.getHeight() / 2);
  let center = fb.util.transformPoint(point, canvas.viewportTransform);

  let clampedCenterX = clamp(center.x, xMin, xMax);
  let clampedCenterY = clamp(center.y, yMin, yMax);

  let diffX = clampedCenterX - center.x;
  let diffY = clampedCenterY - center.y;

  if (diffX != 0 || diffY != 0) {
    canvas.relativePan(new fb.Point(diffX, diffY));
  }
};
let clamp = (value, min, max) => {
  return Math.max(min, Math.min(value, max));
};

let zoomIn = () => {
  canvasMeta.flag.isZoomed = true;
  canvasMeta.value.zoomValue += canvasMeta.value.zoomFactor;
  canvas.zoomToPoint(canvasMeta.value.center, canvasMeta.value.zoomValue);
  handleResize();
};
let zoomOut = () => {
  if (canvasMeta.value.zoomValue > 0.5) {
    // set default color
    canvas.setBackgroundColor('#f2f3f4');
    canvasMeta.value.zoomValue -= canvasMeta.value.zoomFactor;
    canvas.zoomToPoint(canvasMeta.value.center, canvasMeta.value.zoomValue);
    // handling a glitch in zooming out with background
    // keepPositionInBounds();
  } else canvasMeta.flag.isZoomed = false;

  handleResize();
};

let undo = () => {
  // Undo is possible
  if (canvasMeta.currentHistoryIndex > 0) {
    canvasMeta.currentHistoryIndex--;
    updateStateFromHistory();
  }
};
let redo = () => {
  // Redo is possible
  if (canvasMeta.currentHistoryIndex < canvasMeta.currentHistory.length - 1) {
    canvasMeta.currentHistoryIndex++;
    updateStateFromHistory();
  }
};

let handleCrop = (action, secondaryAction) => {
  let activeObject = canvas.getActiveObject();
  if (activeObject) {
    canvas.selection = true;

    if (canvasMeta.value.crop.box) {
      canvas.remove(canvasMeta.value.crop.box);
      canvasMeta.value.crop.box = false;
    }

    switch (action) {
      case true:
        canvasMeta.flag.cropEnabled = false;
        appMeta.flag.isPreviewEnabled = false;
        canvasMeta.value.crop.active.angle = canvasMeta.value.crop.copy.angle;
        canvasMeta.value.crop.active.flipX = canvasMeta.value.crop.copy.flipX;
        canvasMeta.value.crop.active.top = canvasMeta.value.crop.copy.top;
        canvasMeta.value.crop.active.left = canvasMeta.value.crop.copy.left;
        saveHistory();
        break;
      case false:
        if (secondaryAction) canvasMeta.value.crop.active.clipPath = false;
        else
          canvasMeta.value.crop.active.clipPath =
            canvasMeta.value.crop.copy.clipPath;

        canvasMeta.value.crop.active.dirty = true;
        canvasMeta.flag.cropEnabled = false;
        appMeta.flag.isPreviewEnabled = false;
        break;
      case undefined:
        canvas.selection = false;

        canvasMeta.flag.cropEnabled = true;
        appMeta.flag.isPreviewEnabled = true;

        canvasMeta.value.crop.copy = Object.assign({}, activeObject);

        activeObject.angle = 0;
        activeObject.flipX = false;
        // activeObject.referenceObject.isCropped = true;
        // activeObject.referenceObject.originalSrc = canvasMeta.value.crop.copy.src;
        canvasMeta.value.crop.active = activeObject;

        canvasMeta.value.crop.box = new fb.Rect({
          width: activeObject.width,
          height: activeObject.height,
          scaleX: activeObject.scaleX,
          scaleY: activeObject.scaleY,
          top: activeObject.top,
          left: activeObject.left,
          fill: '',
          transparentCorners: false
        });

        if (canvasMeta.value.crop.active.clipPath) {
          let center = activeObject.getCenterPoint();
          canvasMeta.value.crop.box.width =
            canvasMeta.value.crop.active.clipPath.width;
          canvasMeta.value.crop.box.height =
            canvasMeta.value.crop.active.clipPath.height;
          canvasMeta.value.crop.box.left =
            center.x +
            canvasMeta.value.crop.active.clipPath.left * activeObject.scaleX;
          canvasMeta.value.crop.box.top =
            center.y +
            canvasMeta.value.crop.active.clipPath.top * activeObject.scaleY;
        }

        canvasMeta.value.crop.box.on('scaling', applyCrop);
        canvasMeta.value.crop.box.on('mouseup', applyCrop);
        canvasMeta.value.crop.box.on('moving', applyCrop);

        canvasMeta.value.crop.box.setControlsVisibility(
          canvasMeta.value.crop.control
        );

        canvas.add(canvasMeta.value.crop.box);
        canvas.setActiveObject(canvasMeta.value.crop.box);

        break;
    }

    canvas
      .getObjects()
      .forEach(object => (object.selectable = canvas.selection));
    canvas.renderAll();
    updateToolbar();
  }
};
let applyCrop = e => {
  let rect = canvasMeta.value.crop.box;
  let image = canvasMeta.value.crop.active;

  let maxScaleX = (image.width * image.scaleX) / rect.width;
  let maxScaleY = (image.height * image.scaleY) / rect.height;

  if (rect.scaleX > maxScaleX || rect.scaleY > maxScaleY) {
    rect.scaleX = Math.min(rect.scaleX, maxScaleX);
    rect.scaleY = Math.min(rect.scaleY, maxScaleY);
  }

  if (rect.top < image.top || rect.left < image.left) {
    rect.top = Math.max(rect.top, image.top);
    rect.left = Math.max(rect.left, image.left);
  }

  if (
    rect.top + rect.height * rect.scaleY >
      image.top + image.height * image.scaleY ||
    rect.left + rect.width * rect.scaleX >
      image.left + image.width * image.scaleX
  ) {
    rect.top = Math.min(
      rect.top,
      image.top + image.height * image.scaleY - rect.height * rect.scaleY
    );
    rect.left = Math.min(
      rect.left,
      image.left + image.width * image.scaleY - rect.width * rect.scaleX
    );
  }

  offsetX = (rect.left - image.left) / image.scaleX;
  offsetY = (rect.top - image.top) / image.scaleY;

  offsetX = offsetX <= 1 ? 0 : offsetX;
  offsetY = offsetY <= 1 ? 0 : offsetY;

  mask = new fb.Rect({
    width: (rect.width * rect.scaleX) / image.scaleX,
    height: (rect.height * rect.scaleY) / image.scaleY,
    left: (image.width / 2) * -1 + offsetX,
    top: (image.height / 2) * -1 + offsetY
  });

  image.clipPath = mask;
  image.dirty = true;
};

let action = type => {
  let activeObject = canvas.getActiveObject();

  switch (type) {
    case 'flip':
      activeObject.set('flipX', !activeObject.flipX);
      break;
    case 'bringForward':
      activeObject.bringForward();
      break;
    case 'sendBackward':
      activeObject.sendBackwards();
      break;
    case 'delete':
      canvas.remove(activeObject);
      break;
    case 'duplicate':
      activeObject.clone(clone => {
        clone.set({
          left: clone.left + canvasMeta.value.cloneOffset,
          top: clone.top + canvasMeta.value.cloneOffset
        });

        canvas.add(clone);
        clone.setControlsVisibility(canvasMeta.value.hideControls);
        canvas.setActiveObject(clone);
      }, canvasMeta.value.propertiesToInclude);

      break;
    case 'transparent':
      if (activeObject.referenceObject.type == 'custom') {
        var dimentionBefore = {
          width: activeObject.width,
          height: activeObject.height,
          scaleX: activeObject.scaleX,
          scaleY: activeObject.scaleY
        };
        canvasMeta.flag.isCurrentObjectTransparentable = false;
        canvasMeta.flag.isCurrentObjectTransparentSelected = false;
        updateToolbar();
        $.post(
          appMeta.endpoint.api,
          {
            operation: 'transparent',
            asset_id: activeObject.referenceObject.id,
            user_id: appMeta.value.userID
          },
          response => {
            activeObject.referenceObject.transparentPath =
              response.transparent_path;
            activeObject.setSrc(response.transparent_path, () => {
              activeObject.scaleX =
                (dimentionBefore.width * dimentionBefore.scaleX) /
                activeObject.width;
              activeObject.scaleY =
                (dimentionBefore.height * dimentionBefore.scaleY) /
                activeObject.height;
              canvasMeta.flag.isCurrentObjectTransparentSelected = true;
              canvas.discardActiveObject();
              updateToolbar();
              canvas.renderAll();
            });
          }
        );
      }
      break;
    case 'undoTransparent':
      if (activeObject.referenceObject.type == 'custom') {
        var dimentionBefore = {
          width: activeObject.width,
          height: activeObject.height,
          scaleX: activeObject.scaleX,
          scaleY: activeObject.scaleY
        };
        canvasMeta.flag.isCurrentObjectTransparentable = false;
        canvasMeta.flag.isCurrentObjectTransparentSelected = false;
        updateToolbar();
        activeObject.setSrc(activeObject.referenceObject.path, () => {
          activeObject.scaleX =
            (dimentionBefore.width * dimentionBefore.scaleX) /
            activeObject.width;
          activeObject.scaleY =
            (dimentionBefore.height * dimentionBefore.scaleY) /
            activeObject.height;
          canvasMeta.flag.isCurrentObjectTransparentSelected = false;
          canvas.discardActiveObject();
          updateToolbar();
          canvas.renderAll();
        });
      }
      break;
  }

  canvas.requestRenderAll();
  saveHistory();
};

let togglePreviewMode = e => {
  let targetLink = $(e.currentTarget).attr('href');
  let toggle = targetLink == '#board';

  // if a different tab was clicked and preview was enabled or disabled
  if (targetLink == '#board' || appMeta.value.lastVisitedTab == '#board') {
    appMeta.value.lastVisitedTab = targetLink;

    // check if state has changed
    if (appMeta.flag.isPreviewEnabled !== toggle)
      appMeta.flag.isPreviewEnabled = toggle;

    updateToolbar();
    canvas.selection = !toggle;
    canvas.discardActiveObject();

    canvas.getObjects().forEach(object => {
      object.selectable = !toggle;
      if (object.type == 'text' && !toggle) canvas.remove(object);
    });

    if (toggle) {
      appMeta.flag.isBoardItemDirty = true;
      renderAppMeta();
    }

    canvas.renderAll();
  }
};

// };
