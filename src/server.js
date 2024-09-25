
let PORT = 8080;
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const caseData = require('../data/Output.json');
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
let cratePriceMap = new Map();

const app = express();


caseData.sort((caseA, caseB) => (caseA.first_sale_date < caseB.first_sale_date ? 1 : -1));
app.use(express.static(path.join(__dirname, '..', 'dist')));
if (process.env.NODE_ENV === 'production') {
  PORT = process.env.PORT;
  
}

app.use(cors());
app.use(express.json());

let casesArray = [];
let capsulesArray = [];
let souvenirsArray = [];
let graffitisArray = [];
let autographsArray = [];
let pinsArray = [];

app.get('/data/price', (req, res) => {

  let { caseType, item, skin, wear, itemID, category } = req.query;

  itemID = itemID + wear;

  const mapItem = itemPriceMap.get(itemID);

  if (mapItem) {
    console.log('Item found in map');
    res.json(mapItem);
    return;
  }

  if(category === 'Knives' || category === 'Gloves')
    item = '★ ' + item;

  let marketHashName;

  switch (caseType) {
    case 'Pins':
      marketHashName = `${item}`;
      break;
    case 'Sticker Capsule':
      marketHashName = `Sticker | ${item}`; 
      break;
    case 'Autograph Capsule':
      marketHashName = `Sticker | ${item}`; 
      break;
    case 'Graffiti':
      marketHashName = `Sealed Graffiti | ${item}`; 
      break;
    case 'Souvenir':
      marketHashName = `Souvenir ${item} (${wear})`; 
      break;
    case 'Case':
      marketHashName = `${item} (${wear})`; 
      break;
    default:
      throw new Error('Unknown case type');
  }

// Construct the full URL
let url = `https://steamcommunity.com/market/priceoverview/?appid=730&market_hash_name=${encodeURIComponent(marketHashName)}&currency=1`;

  const options = {
    method: 'GET',
    url: url
  };

  axios
    .request(options)
    .then((response) => {
      const data = convertToSkinObj(response.data);
      res.json(data);

      if(data.lowest_price) {
        itemPriceMap.set(itemID, data);
        console.log('Item added to map: ', itemID, item, skin);
      }
      
    })
    .catch((error) => {
      console.log('Item being processed: ', itemID, item, skin);
      console.log(error);
      res.status(500).json({ error: error.message });
    });
});

app.get('/data/cases', async (req, res) => {

  fetchCasePrices()
    .then((res) => {
      console.log('successfully fetched prices');
      res.json(casesArray);
    })
    .catch((err) => {
      console.log(`failed to get case prices ${err}, continuing`);
      res.json(casesArray);
    });  

});

app.get('/data/capsules', (req, res) => {
  res.json(capsulesArray);
});

app.get('/data/souvenirs', (req, res) => {
  res.json(souvenirsArray);
});

app.get('/data/autograph_capsules', (req, res) => {
  res.json(autographsArray);
});

app.get('/data/graffitis', (req, res) => {
  res.json(graffitisArray);
});

app.get('/data/pins', (req, res) => {
  res.json(pinsArray);
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
  prepareData();
  
});


async function fetchCasePrices() {

  let caseLink = `https://www.steamwebapi.com/steam/api/cs/containers?key=${process.env.KEYONE}&type=all`;
  
  try {
    if(cratePriceMap.size > 0)
      return;

    const response = await axios.get(caseLink);
  
    response.data.forEach(fetchedCrate => {
      cratePriceMap.set(fetchedCrate.casename, fetchedCrate.pricelatest);
    }); 

    caseData.forEach(crate => {
      crate.price = cratePriceMap.get(crate.name);
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

function prepareData() {
  casesArray = caseData.filter(crate => crate.type === 'Case');
  capsulesArray = caseData.filter(crate => crate.type === 'Sticker Capsule');
  souvenirsArray = caseData.filter(crate => crate.type === 'Souvenir');
  autographsArray = caseData.filter(crate => crate.type === 'Autograph Capsule');
  pinsArray = caseData.filter(crate => crate.type === 'Pins'); 
  graffitisArray = caseData.filter(crate => crate.type === 'Graffiti'); 
  console.log(`Prepared ${casesArray.length} cases, ${capsulesArray.length} capsules, ${souvenirsArray.length} souvenirs, and other items.`);
}



