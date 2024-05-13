# Case Opening Simulator

Projects UI is work in progress.

# Introduction

A simulator created to imitate CS2 case opening system, to track how much money would have been spent if the person chose to proceed with buying keys to open cases.

Application checks the obtained item's value and accordingly updates the state of the money spent so you can see the tendency.

Real item data price from steam market (price overview API ) is used to provide accurate representation of real world scenario.

# Installation and Setup

Coming soon

# Usage
Once the application is set up and running, follow these steps to use it:

Click the "Open" button to start the case opening process.

![caseOpeningSim](https://github.com/jusadocode/case-opening-simulator/assets/77744027/8553541f-069b-4d45-8a50-d55f5c8c71ee)

The simulator will distribute each item's chances of being obtained based on its rarity in the container.

After a rolling animation, a random item from the opening process will be provided.


To minimize API requests and improve performance, the server utilizes caching (used API highly limits the requests per minute).

