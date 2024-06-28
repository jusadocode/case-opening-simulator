// for testing, open the file instead of live server

let PORT = 8080;
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const caseData = require('../data/final_join.json');

const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
});
// hashMap for reoccuring item price requests
// should save requests

let itemPriceMap = new Map();

// map1.set('a', 1);
// map1.set('b', 2);
// map1.set('c', 3);

const app = express();


caseData.sort((caseA, caseB) => (caseA.first_sale_date < caseB.first_sale_date ? 1 : -1));


/////////////////////
// 429 error from too many requests
// make case price search periodical
//////////////////////
//fetchCasePrices();


if (process.env.NODE_ENV === 'production') {
  PORT = process.env.PORT;
  app.use(express.static(__dirname));
}

app.use(cors());
app.use(express.json())

app.get('/data/price', (req, res) => {

  const queryParams = req.query;
  // console.log(queryParams);

  // currency (Euro) = index 3 

  const itemId = queryParams.itemID;

  const mapItem = itemPriceMap.get(itemId);

  if (mapItem) {
    res.json(mapItem);
    return;
  }

  let skinLink = `https://steamcommunity.com/market/priceoverview/?appid=730&market_hash_name=${queryParams.weapon} | ${queryParams.skin} (${queryParams.wear})&currency=3`;
  let caseLink = `https://steamcommunity.com/market/priceoverview/?appid=730&market_hash_name=${queryParams.case}&currency=3`;

  let url = queryParams.case ? caseLink : skinLink;

  const encodedUrl = url.replace(/ /g, '%20');


  const options = {
    method: 'GET',
    url: encodedUrl
    // url: `https://steamcommunity.com/market/priceoverview/?appid=730&market_hash_name=SG%20553%20|%20Cyberforce%20(Factory%20New)&currency=3`
    // url: `https://steamcommunity.com/market/priceoverview/?appid=730&market_hash_name=SG%20553%20|%20Cyberforce%20(Factory%20New)&currency=3`
  };

  axios
    .request(options)
    .then((response) => {
      const data = res.json(response.data);
      console.log(data)
      itemPriceMap.set(itemId, data);
      console.log('Item added to map: ', itemId, queryParams.weapon, queryParams.skin, queryParams.wear);
    })
    .catch((error) => {
      console.log(error);
      res.json(error);
    });
});

app.get('/data/cases', (req, res) => {
  res.json(caseData);
});

app.post('/send-email', async (req, res) => {

  // res is for responding to requests
  // req is the incoming request with parameters

  console.log(req.body);
  const { name, email, text } = req.body;



  const mailOptions = {
    from: process.env.EMAIL_USER, // sender address
    to: process.env.EMAIL_USER, // list of receivers
    subject: "Feedback", // Subject line
    text: `Name: ${name}\n ${email ? 'Email: ' + email : 'Email not provided'}\n\nReport:\n${text}`, // plain text body
    html: `<b>Incoming feedback from case opening simulator</b><p>Name: ${name}</p><p>${email ? 'Email: ' + email : 'Email not provided'}<p>Report: ${text}</p>`, // html body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error("Error sending email: %s", error);
    res.status(500).send('Error sending email');
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


function fetchCasePrices() {
  caseData.map(async (crate, index) => {
    if (index === 19)
      return;
    let caseLink = `https://steamcommunity.com/market/priceoverview/?appid=730&market_hash_name=${crate.name}&currency=3`;
    axios.request(caseLink)
      .then((data) => {
        crate.price = data.lowest_price;
      })
      .catch((error) => {
        console.log(error);
      });
  });
}




