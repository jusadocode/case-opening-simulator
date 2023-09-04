const PORT = 8080;
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(
    cors({
        // origin: 'http://localhost:8080/data'
    })
)

app.get("/data/price", (req, res) => {

    const queryParams = req.query;
    // console.log(queryParams);

    let link = `https://steamcommunity.com/market/priceoverview/?appid=730&market_hash_name=${queryParams.weapon} | ${queryParams.skin} (${queryParams.wear})&currency=${3}`
    const encodedUrl = link.replace(/ /g, '%20');


    const options = {
        method: "GET",
        url: encodedUrl
        // url: `https://steamcommunity.com/market/priceoverview/?appid=730&market_hash_name=SG%20553%20|%20Cyberforce%20(Factory%20New)&currency=3`
    };

    axios
        .request(options)
        .then((response) => {

            res.json(response.data);
        })
        .catch((error) => {
            console.log(error);
            res.json(error);
        });
});

app.get("/data/cases", (req, res) => {

    const path = 'file:///C:/Users/justa/source/repos/CaseOpeningSim/case-opening-simulator/data/cases.json'

    axios
        .get(path)
        .then((response) => {
            res.json(response.data);
        })
        .catch((error) => {
            console.log(error);
            res.json(error);
        });
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});