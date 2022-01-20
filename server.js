// API Data from CDC:
// https://data.cdc.gov/Case-Surveillance/United-States-COVID-19-Cases-and-Deaths-by-State-o/9mfq-cb36

console.log('running');
const express = require('express');
const request = require('request');
const path = require('path');

const app = express();

// app.use(express.static('public'))
app.use(express.static(path.resolve(__dirname, './build')));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// app.get('/', (req,res) => {
//     res.sendFile('index.html', { root: "./public/"});
// })

// var query = "https://covidtracking.com/api/v1/us/" + date + ".json";

app.get('/usa/:date', (req, res) => {
    let date = req.params.date;
  request(
    { url: `https://data.cdc.gov/resource/9mfq-cb36.json?submission_date=${date}`},
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: 'error', error });
      }
      console.log(res.json)
      res.json(JSON.parse(body));
    }
  )
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './build', 'index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));