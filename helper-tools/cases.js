
const cases = require('./Output.json');

const fs = require('fs');
const allSkins = require('./skins.json');

// // Skin chances
// cases.forEach(crate => {
//     let items = crate.contains;
//     if(crate.type === 'Case')
//     items.forEach((item) => {

//         switch (item.rarity.name) {
//             case ("Mil-Spec Grade"):
//                 item.odds = 79.92;
//                 break;
//             case ("Restricted"):
//                 item.odds = 15.98;
//                 break;
//             case ("Classified"):
//                 item.odds = 3.2;
//                 break;
//             case ("Covert"):
//                 if (item.category === "Knives")
//                     item.odds = 0.26;
//                 else
//                     item.odds = 0.64;
//                 break;
//             default:
//                 item.odds = 0;
//         };

//     })
// });


// // Sticker chances

// cases.forEach(crate => {
//     if(crate.type === 'Sticker Capsule' || crate.type === 'Autograph Capsule' || crate.type === 'Pins') {
//         let items = crate.contains;
//         items.forEach((item) => {
//             switch (item.rarity.name) {
//                 case ("High Grade"):
//                     item.odds = 80.00;
//                     break;
//                 case ("Remarkable"):
//                     item.odds = 16.00;
//                     break;
//                 case ("Exotic"):
//                     item.odds = 3.2;
//                     break;
//                 case ("Extraordinary"):
//                     item.odds = 0.64;
//                     break;
//                 default:
//                     item.odds = 0;
//             };
//         })
//     }
// });



// cases.forEach(crate => {
//     if(crate.type === 'Souvenir') {
//         let items = crate.contains;
//         items.forEach((item) => {
//             switch (item.rarity.name) {
//                 case ("Consumer Grade"):
//                     item.odds = 80.00;
//                     break;
//                 case ("Industrial Grade"):
//                     item.odds = 16.00;
//                     break;
//                 case ("Mil-Spec"):
//                     item.odds = 3.2;
//                     break;
//                 case ("Restricted"):
//                     item.odds = 0.64;
//                     break;
//                 case ("Classified"):
//                     item.odds = 0.128;
//                     break;
//                 case ("Covert"):
//                     item.odds = 0.025;
//                     break;
//                 default:
//                     item.odds = 0;
//             };
//         })
//     }
// });

// cases.forEach(crate => {
//     if(crate.type === 'Graffiti') {
//         let items = crate.contains;
//         items.forEach((item) => {
//             switch (item.rarity.name) {
//                 case ("High Grade"):
//                     item.odds = 80.00;
//                     break;
//                 case ("Remarkable"):
//                     item.odds = 16.00;
//                     break;
//                 case ("Exotic"):
//                     item.odds = 4.00;
//                     break;
//                 default:
//                     item.odds = 0;
//             };
//         })
//     }
// });
// let joinedInfo = [...cases];


// cases.forEach(crate => {
//     let items = crate.contains_rare;
//     knives.forEach((knife) => {
//         knife.odds = 0.26;
//     })
// });

let joinedInfo = [];


cases.forEach(crate => {
    if(crate.type == 'Souvenir')
        joinedInfo.push(crate);
});




/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////


// cases.forEach(crate => {
//     let caseSkins = crate.contains; // Get the skins within the case
//     caseSkins.forEach((caseSkin, index) => { // Loop through each skin in the case
//         allSkins.forEach(skin => {
//             if (caseSkin.id === skin.id)
//                 caseSkins[index] = skin; // Update the specific skin in the caseSkins array
//         });
//     });
//     joinedInfo.push(crate); // Push the updated case to the joinedInfo array
// });

// cases.forEach(crate => {
//   let caseKnives = crate.contains_rare; // Get the knives within the case
//   caseKnives.forEach((caseKnife, index) => { // Loop through each skin in the case
//     allSkins.forEach(skin => {
//       if (caseKnife.id === skin.id) {
//         caseKnives[index] = skin;
//         caseKnives[index].odds = 0.26;
//       } // Update the specific skin in the caseSkins array
//     });
//   });
//   joinedInfo.push(crate); // Push the updated case to the joinedInfo array
// });



// Convert the array to a JSON string
let data = JSON.stringify(joinedInfo, null, 2);

// Write the data to a JSON file
fs.writeFile('./helper-tools/souvenirs.json', data, (err) => {
    if (err) {
        console.error('Error writing to file', err);
    } else {
        console.log('File has been saved as Output.json');
    }
});