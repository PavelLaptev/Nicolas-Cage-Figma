////////////////////////////////////////////////////////////////
///////////////////////// UI AND DATA //////////////////////////
////////////////////////////////////////////////////////////////

// UI
figma.showUI(__html__, { width: 300, height: 300 });

////////////////////////////////////////////////////////////////
////////////////////////////  FOO //////////////////////////////
////////////////////////////////////////////////////////////////

//
const findByHash = (group, hash) => {
  group.children.map(item => {
    if (item.fills) {
      item.fills = item.fills.filter(fill => fill.imageHash !== hash);

      if (item.children && item.children.length > 0) {
        findByHash(item, hash);
      }
    }
  });
};

//
const removebyHash = group => {
  // get Hash Array and clean it from duplicates
  let hashArray = [
    ...new Set(figma.root.getPluginData("cageHashArray").split(","))
  ];
  figma.root.setPluginData("cageHashArray", "");

  hashArray.map(hash => {
    findByHash(group, hash);
  });
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

  let hashArray = [
    ...new Set(
      figma.root
        .getPluginData("cageHashArray")
        .concat(`,${newFill.imageHash}`)
        .split(",")
    )
  ];
  // console.log(hashArray);

  figma.root.setPluginData("cageHashArray", JSON.stringify(hashArray));
};

//
const findImageByFill = (group, imgArray) => {
  group.children.map((item: any) => {
    if (item.fills) {
      let cageFillIndexes = (item.fills as any)
        .map(fill => {
          if (fill.type === "IMAGE" && fill.visible) {
            return true;
          }
        })
        .filter(Boolean);

      if (cageFillIndexes.length > 0) {
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
