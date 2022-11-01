# XRPL-NFT-Proof-of-Attendance-Infrastructure

XRPL-NFT-Proof-of-Attendance-Infrastructure is a MERN stack application that contains functionality to allow event organizers to mint and distribute Attendance NFTs on the XRP Ledger. The core parts of this application consist of a React frontend, Express backend, **Rest API**, and **XrplNFTHelper.js**. Please note, mongo has been disconnected. Any db solution can replace it but isn't needed at this point. All metadata storage for the NFT's is currently stored locally is JSON object files. In a live version these files will need to be stored in a location with a public URI. 

**XrplNFTHelper.js** is Javascript class that is meant to be used within any NodeJS project. It contains functionality that allows event organizers to mint and distribute Attendance NFTs on the XRP Ledger. It is meant to be imported and instantiated inside the routes file of your project.

**Instantiating XrpNFTHelper.js**
Please note, the XrpNFTHelper class has a constructor that takes a javascript object. Before performing a transaction on the ledger certain details are required, depending on the type of transaction (All required paramaters are listed in the comments). These details are passed during the instantiation of XrpNFTHelper class.

```
import XrplNFTHelper from './XrplNFTHelper.js';

router.route('/burnAllNFT').get((req, res) => {

  const nftManager = new XrplNFTHelper({TransactionType: "NFTokenBurn", 
  Account: body.account, 
  Secret:  body.secret,});

  nftManager.burnAllNFT().then( (result) => { return result }) 
  
  })
```

# Install and use the developer example

1) Install all packages. Do three npm installs in all three directories. 
```
XRPL-NFT-Proof-of-Attendance-Infrastructure-main/XRPL-NFT-Proof-of-Attendance-Infrastructure-main/ npm install
XRPL-NFT-Proof-of-Attendance-Infrastructure-main/XRPL-NFT-Proof-of-Attendance-Infrastructure-main/backend/ npm install
XRPL-NFT-Proof-of-Attendance-Infrastructure-main/XRPL-NFT-Proof-of-Attendance-Infrastructure-main/frontend npm install

```

2) Run backend then frontend. 

```
../backend/npm start
../frontend/npm start

```

3) Adjust App.js axios get call to call different backend routes. Observe output and responses from backend.



# Current Functionality

- Mint Single NFT.

- Mint X number of identical NFT's and assign to same account.

- get All NFT's for specified account.

- Burn specified NFT.

- Burn all NFTs in the account.
