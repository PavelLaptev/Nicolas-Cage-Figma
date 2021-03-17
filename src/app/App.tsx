import * as React from "react";
import styles from "./app.module.scss";

// Import imgages
import nc1img from "./../images/nc1.jpg";
import nc2img from "./../images/nc2.jpg";
import nc3img from "./../images/nc3.jpg";
import nc4img from "./../images/nc4.jpg";
import nc5img from "./../images/nc5.jpg";
import nc6img from "./../images/nc6.jpg";
import nc7img from "./../images/nc7.jpg";
import nc8img from "./../images/nc8.jpg";

// Img and Video arrays
const cageImgArray = [
  nc1img,
  nc2img,
  nc3img,
  nc4img,
  nc5img,
  nc6img,
  nc7img,
  nc8img
];
const videoClipsArray = [
  "https://cdn.glitch.com/604ccd24-6c39-4492-b5ee-72a22eb071c0%2Fnc1.mp4",
  "https://cdn.glitch.com/604ccd24-6c39-4492-b5ee-72a22eb071c0%2Fnc2.mp4",
  "https://cdn.glitch.com/604ccd24-6c39-4492-b5ee-72a22eb071c0%2Fnc3.mp4",
  "https://cdn.glitch.com/604ccd24-6c39-4492-b5ee-72a22eb071c0%2Fnc4.mp4",
  "https://cdn.glitch.com/604ccd24-6c39-4492-b5ee-72a22eb071c0%2Fnc5.mp4",
  "https://cdn.glitch.com/604ccd24-6c39-4492-b5ee-72a22eb071c0%2Fnc6.mp4",
  "https://cdn.glitch.com/604ccd24-6c39-4492-b5ee-72a22eb071c0%2Fnc7.mp4",
  "https://cdn.glitch.com/604ccd24-6c39-4492-b5ee-72a22eb071c0%2Fnc8.mp4",
  "https://cdn.glitch.com/604ccd24-6c39-4492-b5ee-72a22eb071c0%2Fnc9.mp4"
];

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
  const [videoLinkState, setVideoLinkState] = React.useState(
    videoClipsArray[Math.floor(Math.random() * videoClipsArray.length)]
  );

  const changeTheVideo = () => {
    setVideoLinkState(
      videoClipsArray[Math.floor(Math.random() * videoClipsArray.length)]
    );
  };

  return (
    <div className={styles.app}>
      <section className={styles.ui} onDoubleClick={changeTheVideo}>
        <button
          className={styles.button}
          onClick={() => {
            fetchImages();
          }}
        >
          <span> Cage on the page!</span>
        </button>
        <button
          className={styles.button}
          onClick={() => {
            parent.postMessage({ pluginMessage: { type: "removeGage!" } }, "*");
          }}
        >
          <span>Remove all Cages</span>
        </button>
      </section>
      <video key={videoLinkState} className={styles.video} autoPlay loop>
        <source src={videoLinkState} type="video/mp4" />
      </video>
    </div>
  );
};

export default App;
