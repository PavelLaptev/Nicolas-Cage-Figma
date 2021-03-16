import * as React from "react";
// import styles from "./app.module.scss";

import nc1 from "./../images/nc1.jpg";
import nc2 from "./../images/nc2.jpg";
import nc3 from "./../images/nc3.jpg";
import nc4 from "./../images/nc4.jpg";
import nc5 from "./../images/nc5.jpg";

const cageImgArray = [nc1, nc2, nc3, nc4, nc5];

/////////////////////////
////// APPLICATION //////
/////////////////////////

const convertDataURIToBinary = dataURI => {
  let BASE64_MARKER = ";base64,";
  let base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  let base64 = dataURI.substring(base64Index);
  let raw = window.atob(base64);
  let rawLength = raw.length;
  let array = new Uint8Array(new ArrayBuffer(rawLength));

  for (let i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
};

const fetchImages = async () => {
  let fetchArr = await Promise.all(cageImgArray.map(img => fetch(img))).then(
    resultArray => {
      return resultArray.map(img => {
        return img;
      });
    }
  );

  let unit8Array = fetchArr.map(item => {
    return convertDataURIToBinary(item.url);
  });

  parent.postMessage(
    { pluginMessage: { type: "makeGage!", data: unit8Array } },
    "*"
  );
};

const App = ({}) => {
  return (
    <div>
      <h1>Hello Stats!</h1>
      <button
        onClick={() => {
          fetchImages();
        }}
      >
        Cage on the page
      </button>
      <button
        onClick={() => {
          parent.postMessage({ pluginMessage: { type: "removeGage!" } }, "*");
        }}
      >
        Remove all Cages
      </button>
    </div>
  );
};

export default App;
