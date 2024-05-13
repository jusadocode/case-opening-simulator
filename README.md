# case-opening-simulator

A simulator created to imitate CS2 case opening system, to track how much money would have been spent if the person chose to proceed with buying keys to open cases.

Application checks the obtained item's value and accordingly updates the state of the money spent so you can see the tendency.

Real item data price from steam market (price overview API )is used to provide accurate representation of real world scenario.

![caseOpeningSim](https://github.com/jusadocode/case-opening-simulator/assets/77744027/8553541f-069b-4d45-8a50-d55f5c8c71ee)

With the click of Open, it goes through the process of distrubuting each item chances of being obtained based on its rarity in the container.

The server uses caching to minimize the API requests users would initiate (used API highly limits the requests per minute). 
