const PORT = process.env.PORT;
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const caseData = require('./data/final_join.json');

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
	app.use(express.static('client/build'));
}

app.get('*', (request, response) => {
	response.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.use(
    cors({
        // origin: 'http://localhost:8080/data'
    })
)

app.get("/data/price", (req, res) => {

    const queryParams = req.query;
    // console.log(queryParams);

    // currency (Euro) = index 3 

    const itemId = queryParams.itemID;

    const mapItem = itemPriceMap.get(itemId);

    if (mapItem) {
        res.json(mapItem);
        return;
    }

    let skinLink = `https://steamcommunity.com/market/priceoverview/?appid=730&market_hash_name=${queryParams.weapon} | ${queryParams.skin} (${queryParams.wear})&currency=3`
    let caseLink = `https://steamcommunity.com/market/priceoverview/?appid=730&market_hash_name=${queryParams.case}&currency=3`

    let url = queryParams.case ? caseLink : skinLink;

    const encodedUrl = url.replace(/ /g, '%20');


    const options = {
        method: "GET",
        url: encodedUrl
        // url: `https://steamcommunity.com/market/priceoverview/?appid=730&market_hash_name=SG%20553%20|%20Cyberforce%20(Factory%20New)&currency=3`
        // url: `https://steamcommunity.com/market/priceoverview/?appid=730&market_hash_name=SG%20553%20|%20Cyberforce%20(Factory%20New)&currency=3`
    };

    axios
        .request(options)
        .then((response) => {
            res.json(response.data);
            itemPriceMap.set(itemId, response.data);
            console.log('ITEM ADDED TO MAP');
        })
        .catch((error) => {
            console.log(error);
            res.json(error);
        });
});

app.get("/data/cases", (req, res) => {
    res.json(caseData);
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




function fetchCasePrices() {
    caseData.map(async (crate, index) => {
        if (index === 19)
            return;
        let caseLink = `https://steamcommunity.com/market/priceoverview/?appid=730&market_hash_name=${crate.name}&currency=3`
        axios.request(caseLink)
            .then((data) => {
                crate.price = data.lowest_price;
            })
            .catch((error) => {
                console.log(error);
            })
    })
}



