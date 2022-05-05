import fs from 'node:fs';
import https from 'node:https';
import axios from 'axios';
import { parse } from 'node-html-parser';

let root;
let divs;

// create a folder called memes. add recursive so it can load multiple times without giving error

fs.mkdir('./memes', { recursive: true }, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('New directory successfully created.');
  }
});

// define variable for the link with memes

const url = 'https://memegen-link-examples-upleveled.netlify.app/';

// use package axios to extract the html then filter all images url and trim the link to remove parts. Extract 10 urls and download them to the folder.

axios
  .get(url)

  .then((response) => {
    root = parse(response.data);
    divs = root.querySelectorAll('#images img');
    const filtered = divs.map((el) => el.rawAttrs);
    for (let i = 0; i < 10; i++) {
      function download() {
        https.get(filtered[i].split('src="')[1].split('"')[0], (res) => {
          const fileIndex = i + 1;
          const path = `./memes/${'0' + fileIndex}.png`;
          const writeStream = fs.createWriteStream(path);
          res.pipe(writeStream);
          writeStream.on('finish', () => {
            writeStream.close();
            console.log('Download Completed');
          });
        });
      }
      download();
    }
  })
  .catch((error) => {
    console.log(error);
  });
