////////////////////////////////////////////////////////////////
///////////////////////// UI AND DATA //////////////////////////
////////////////////////////////////////////////////////////////

// UI
figma.showUI(__html__, { width: 300, height: 300 });

////////////////////////////////////////////////////////////////
//////////////////////////// FOO ///////////////////////////////
////////////////////////////////////////////////////////////////

//
const findByHash = (group, hash) => {
  group.children.map(item => {
    if (item.fills) {
      if (item.fills.length > 0 && item.fills[0].type === "IMAGE") {
        item.fills = item.fills.filter(fill => fill.imageHash !== hash);
      }
      if (item.children && item.children.length > 0) {
        findByHash(item, hash);
      }
    }
  });
};

//
const removebyHash = group => {
  // get Hash Array and clean it from duplicates
  let plugindataKey = `cageHashArray-${figma.currentPage.id}`;
  let hashArray = figma.root.getPluginData(plugindataKey).split(",");

  hashArray.map(hash => {
    findByHash(group, hash);
  });

  figma.root.setPluginData(plugindataKey, "");
};

//
const addCageToImage = (img, imgArr) => {
  let cageHash = figma.createImage(
    imgArr[Math.floor(Math.random() * imgArr.length)]
  ).hash;

  let currentImageFills = img["fills"];
  let newFill = {
    scaleMode: "FILL",
    type: "IMAGE",
    imageHash: cageHash
  };
  img["fills"] = [...currentImageFills, ...[newFill]];

  let plugindataKey = `cageHashArray-${figma.currentPage.id}`;

  let hashArray = Array.from(
    new Set(
      figma.root
        .getPluginData(plugindataKey)
        .concat(`,${newFill.imageHash}`)
        .split(",")
    )
  ).toString();

  figma.root.setPluginData(plugindataKey, hashArray);
};

//
const findImageByFill = (group, imgArray) => {
  group.children.forEach((item: any) => {
    if (item.fills) {
      if (item.fills.length > 0 && item.fills[0].type === "IMAGE") {
        addCageToImage(item, imgArray);
      }

      if (item.children && item.children.length > 0) {
        findImageByFill(item, imgArray);
      }
    }
  });
};

////////////////////////////////////////////////////////////////
///////////////////////// ON MESSAGE ///////////////////////////
////////////////////////////////////////////////////////////////

figma.ui.onmessage = async msg => {
  // UPDATE ON BY ONE
  if (msg.type === "makeGage!") {
    findImageByFill(figma.currentPage, msg.data);
  }

  if (msg.type === "removeGage!") {
    removebyHash(figma.currentPage);
  }
};
