
let PORT = 8080;
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const caseData = require('../data/final_join.json');
const path = require('path');

const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
});

let itemPriceMap = new Map();
let casePriceMap = new Map();

const app = express();


caseData.sort((caseA, caseB) => (caseA.first_sale_date < caseB.first_sale_date ? 1 : -1));
app.use(express.static(path.join(__dirname, '..', 'dist')));
if (process.env.NODE_ENV === 'production') {
  PORT = process.env.PORT;
  
}

app.use(cors());
app.use(express.json());


app.get('/data/price', (req, res) => {

  const queryParams = req.query;

  const itemId = queryParams.itemID + queryParams.wear;

  const mapItem = itemPriceMap.get(itemId);

  if (mapItem) {
    console.log('Item found in map');
    res.json(mapItem);
    return;
  }

  let weaponName = queryParams.weapon;

  if(queryParams.category === 'Knives' || queryParams.category === 'Gloves')
    weaponName = '★ ' + weaponName;

  let url = `https://steamcommunity.com/market/priceoverview/?appid=730&market_hash_name=${weaponName} | ${queryParams.skin} (${queryParams.wear})&currency=3`;

  const encodedUrl = url.replace(/ /g, '%20');

  const options = {
    method: 'GET',
    url: encodedUrl
  };

  axios
    .request(options)
    .then((response) => {
      const data = convertToSkinObj(response.data);
      console.log(data);
      res.json(data);

      if(data.lowest_price) {
        itemPriceMap.set(itemId, data);
        console.log('Item added to map: ', itemId, queryParams.weapon, queryParams.skin);
      }
      
    })
    .catch((error) => {
      console.log('Item being processed: ', itemId, queryParams.weapon, queryParams.skin);
      console.log(error);
      res.status(500).json({ error: error.message });
    });
});

app.get('/data/cases', async (req, res) => {

  fetchCasePrices()
    .then((res) => {
      console.log('successfully fetched prices');
      res.json(caseData);
    })
    .catch((err) => {
      console.log(`failed to get case prices ${err}, continuing`);
      res.json(caseData);
    });  
});

app.post('/send-email', async (req, res) => {

  // res is for responding to requests
  // req is the incoming request with parameters

  const { name, email, text } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER, // sender address
    to: process.env.EMAIL_USER, // list of receivers  
    subject: 'Feedback', // Subject line
    text: `Name: ${name}\n ${email ? 'Email: ' + email : 'Email not provided'}\n\nReport:\n${text}`, // plain text body
    html: `<b>Incoming feedback from case opening simulator</b><p>Name: ${name}</p><p>${email ? 'Email: ' + email : 'Email not provided'}<p>Report: ${text}</p>`, // html body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email: %s', error);
    res.status(500).send('Error sending email');
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Running in ${process.env.NODE_ENV}`);
  
});


async function fetchCasePrices() {

  let caseLink = `https://www.steamwebapi.com/steam/api/cs/containers?key=${process.env.KEYONE}&type=case`;
  
  try {
    if(casePriceMap.size > 0)
      return;

    const response = await axios.get(caseLink);
  
    response.data.forEach(fetchedCrate => {
      casePriceMap.set(fetchedCrate.casename, fetchedCrate.pricelatest);
    }); 

    caseData.forEach(crate => {
      crate.price = casePriceMap.get(crate.name);
    });
  }
  catch(error) {
    console.log(error);
  }
}

function convertToSkinObj(data) {
  return {
    success: data.success,
    lowest_price: data.lowest_price,
    volume: data.volume,
    median_price: data.median_price
  };
}



