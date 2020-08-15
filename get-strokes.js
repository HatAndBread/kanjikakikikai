const express = require('express');
const fetch = require('node-fetch');
const urlFixer = require('url').URL;
const getStrokes = new express.Router();

getStrokes.get('/', (req, res) => {
  console.log(req);
  res.send('HI!');
});
getStrokes.get('/:kanji', async (req, res) => {
  const kanji = new urlFixer(req.params.kanji, 'https://kanjialive-api.p.rapidapi.com/api/public/kanji/').href;
  const request = {
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'kanjialive-api.p.rapidapi.com',
      'x-rapidapi-key': process.env.KANJI_KEY,
      useQueryString: true
    }
  };

  const response = await fetch(kanji, request);
  const data = await response.json();
  if (data.error) {
    res.send({ link: false });
  } else {
    res.send({ link: data.kanji.video.mp4 });
  }
});

module.exports = getStrokes;
