
const cases = []
const allSkins = []


// cases.forEach(caseItem => {
//     let items = caseItem.contains;
//     items.forEach((item) => {

//         switch (item.rarity) {
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

// cases.forEach(crate => {
//     let items = crate.contains_rare;
//     knives.forEach((knife) => {
//         knife.odds = 0.26;
//     })
// });


/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////

let joinedInfo = [];

// cases.forEach(caseItem => {
//     let caseSkins = caseItem.contains; // Get the skins within the case
//     caseSkins.forEach((caseSkin, index) => { // Loop through each skin in the case
//         allSkins.forEach(skin => {
//             if (caseSkin.id === skin.id)
//                 caseSkins[index] = skin; // Update the specific skin in the caseSkins array
//         });
//     });
//     joinedInfo.push(caseItem); // Push the updated case to the joinedInfo array
// });

cases.forEach(crate => {
    let caseKnives = crate.contains_rare; // Get the knives within the case
    caseKnives.forEach((caseKnife, index) => { // Loop through each skin in the case
        allSkins.forEach(skin => {
            if (caseKnife.id === skin.id) {
                caseKnives[index] = skin;
                caseKnives[index].odds = 0.26;
            } // Update the specific skin in the caseSkins array
        });
    });
    joinedInfo.push(crate); // Push the updated case to the joinedInfo array
});



// Data which will be written to the file.
let data = JSON.stringify(joinedInfo, null, 2); // Convert the array to a JSON string

// Create a Blob containing the data
const blob = new Blob([data], { type: 'application/json' });

// Create a URL for the Blob
const url = URL.createObjectURL(blob);

// Create a link element to trigger the download
const link = document.createElement('a');
link.href = url;
link.download = 'Output.json'; // Use .json extension since it's JSON data
link.textContent = 'Download File';

// Append the link to the DOM
document.body.appendChild(link);