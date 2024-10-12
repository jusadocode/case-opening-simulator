# Case Opening Simulator


# Introduction

A simulator created to imitate CS2 case opening system, to track how much money would have been spent if the person chose to proceed with buying keys in game to open cases.

Application checks the obtained item's value and accordingly updates the state of the money spent so you can see the tendency.

Real item data price from steam market (price overview API) is used to provide accurate representation of real world scenario together with SteamWebApi to integrate case price into the spendings.

**You can try out the deployed application here:** http://www.shouldiopen.xyz/

# Installation and Setup

Coming soon

# Usage
Once the application is set up and running, follow these steps to use it:

Click the "Open" button to start the case opening process.

(Projects UI is a work in progress)

![image](https://github.com/user-attachments/assets/9a674718-aec7-422b-af46-915bcf203afd)

The simulator will distribute each item's chances of being obtained based on its rarity in the container and publicly available data and tests on chances to open specific rarity items.

After the rolling animation, a random item from the opening process will be provided. 
The total amount of money spent on a single open is calculated by taking into account the recent price of the unboxed item and the price of the item's collection container.

# Backend
To minimize API requests for skin prices and improve performance, the server utilizes caching (used API's highly limit the requests per minute).

Two steam market api services are used together to make the data fetching process as smooth as possible for varying user traffic.



