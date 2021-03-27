////////////////////////////////////////////////////////////////
///////////////////////// UI AND DATA //////////////////////////
////////////////////////////////////////////////////////////////

// UI
figma.showUI(__html__, { width: 280, height: 350 });

// CAGE LINES
const cageLines = [
  "🐝 Not the Bees!",
  "😈 Cage Rampage!",
  "🦈 What's in the bag? A shark or something?",
  "🤘 Sir, that was totally cool!",
  "🙏 HALLELUJAH!"
];

////////////////////////////////////////////////////////////////
//////////////////////////// FOO ///////////////////////////////
////////////////////////////////////////////////////////////////

let pluginHashDataKey = `cageHashArray-${figma.currentPage.id}`;
let pluginImgsDataKey = `cageImgsArray-${figma.currentPage.id}`;

// RECONNECT PLUGIN DATA IF PAGE WAS CHANGED
figma.on("currentpagechange", () => {
  pluginHashDataKey = `cageHashArray-${figma.currentPage.id}`;
  pluginImgsDataKey = `cageImgsArray-${figma.currentPage.id}`;
});

//
const findByHash = (imgsArray, hash) => {
  imgsArray.map(item => {
    return (item.fills = item.fills.filter(fill => fill.imageHash !== hash));
  });
};

//
const removebyHash = () => {
  // get Hash Array and clean it from duplicates
  let imgsIdsArray = figma.root
    .getPluginData(pluginImgsDataKey)
    .split(",")
    .map(id => {
      return figma.currentPage.findOne(l => l.id === id);
    })
    .filter(Boolean);

  let hashArray = figma.root.getPluginData(pluginHashDataKey).split(",");

  hashArray.map(hash => {
    findByHash(imgsIdsArray, hash);
  });

  figma.root.setPluginData(pluginImgsDataKey, "");
  figma.root.setPluginData(pluginHashDataKey, "");
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

  // HASH and IMGs IDs
  let imgIdsArray = Array.from(
    new Set(
      figma.root
        .getPluginData(pluginImgsDataKey)
        .concat(`,${img.id}`)
        .split(",")
    )
  ).toString();

  let hashArray = Array.from(
    new Set(
      figma.root
        .getPluginData(pluginHashDataKey)
        .concat(`,${newFill.imageHash}`)
        .split(",")
    )
  ).toString();

  // Set to the plugin storage
  figma.root.setPluginData(pluginImgsDataKey, imgIdsArray);
  figma.root.setPluginData(pluginHashDataKey, hashArray);
};

//
let isImageFrameFound = [false];
const findImageByFill = (group, imgArray) => {
  group.children.forEach((item: any) => {
    let itemFills = JSON.stringify(item.fills);

    if (typeof itemFills !== "undefined") {
      if (JSON.stringify(item.fills).includes("IMAGE")) {
        addCageToImage(item, imgArray);
        isImageFrameFound.push(true);
      }
    }

    if (item.children && item.children.length > 0) {
      findImageByFill(item, imgArray);
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

    if (!isImageFrameFound.includes(true)) {
      figma.notify("👽 No images found. Add an image");
    } else {
      figma.notify(cageLines[Math.floor(Math.random() * cageLines.length)]);
    }
  }

  if (msg.type === "removeGage!") {
    removebyHash();
  }
};
