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

app.get("/data", (req, res) => {
    const options = {
        method: "GET",
        url: `https://steamcommunity.com/market/priceoverview/?appid=730&market_hash_name=SG%20553%20|%20Cyberforce%20(Factory%20New)&currency=3`
    };

    axios
        .request(options)
        .then((response) => {
            res.json(response.data);
        })
        .catch((error) => {
            res.json(error);
        });
});

// function callApi(url) {
//     const options = {
//         method: "GET",
//         url: "http://localhost:8080/",
//     };

//     axios.request(options)
//         .then((response) => {
//             console.log(response.data);
//         })
//         .catch((error) => {
//             console.log(error);
//         });
// }



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});