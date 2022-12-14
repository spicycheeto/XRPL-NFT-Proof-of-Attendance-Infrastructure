import xrpl from 'xrpl';
import fs  from 'fs'; //used for storage of token metadata in devmode

export class XrplNFTHelper { 

   constructor(details){


    
    this.transactionDetails = details;
    this.clientDetails = "wss://xls20-sandbox.rippletest.net:51233" //nft-devnet *Change as needed
    
  }



  /* Mint Single token

  * @Params (required)
  -TransactionType: this.transactionDetails.TransactionType,
  -Account: this.transactionDetails.Account,
  -URI: this.transactionDetails.URI,
  -Flags: this.transactionDetails.Flags,
   -NFTokenTaxon: this.transactionDetails.NFTokenTaxon,
   
  @returns array of NFTokenID strings
  * @returns NFTokenID string
  */
  async mintToken(){
    try {
     
      
    const wallet = xrpl.Wallet.fromSeed(this.transactionDetails.Secret) //secret
    const client = new xrpl.Client(this.clientDetails) 
    await client.connect()
    console.log("Connected to server..minting single token.")



   
  
    const transactionData = {
    TransactionType: this.transactionDetails.TransactionType,
		Account: this.transactionDetails.Account,
		URI: this.transactionDetails.URI,
		Flags: this.transactionDetails.Flags,
		NFTokenTaxon: this.transactionDetails.NFTokenTaxon,
    }
    
    //submit minting transaction
    const tx = await client.submitAndWait(transactionData,{wallet})

    /*
      function firstFunction(_callback){
        client.request({
          method: "account_nfts",
          account: this.transactionDetails.Account
          }).then( (result) => { 
  
            console.log('result')
          })
        _callback();    
    }

    firstFunction(function() {
      client.disconnect()
        console.log("disconnected")
        return result
  });  */

  const result = await client.request({
    method: "account_nfts",
    account: this.transactionDetails.Account
    })

   return result.result.account_nfts[result.result.account_nfts.length -1].NFTokenID

   
  /* Check transaction results -------------------------------------------------
    console.log("Transaction result:", tx.result.meta.TransactionResult)
	  console.log("Balance changes:",
	  JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))
  */
	

}
catch(err) {
  console.log("Error occured during minToken() call" + err)
  return;
}
  
  }

/* Mint X number of identical tokens
* Assign all to same wallet


  @Params (required)
  -TransactionType: this.transactionDetails.TransactionType,
  -Account: this.transactionDetails.Account,
  -URI: this.transactionDetails.URI,
  -Flags: this.transactionDetails.Flags,
   -NFTokenTaxon: this.transactionDetails.NFTokenTaxon,

  @returns array of NFTokenID strings
*/
  async mintX(){
    try {
     
      const wallet = xrpl.Wallet.fromSeed(this.transactionDetails.Secret) //secret
      const client = new xrpl.Client(this.clientDetails) 
      await client.connect()
      
      const origTokenArr = [];
      const newArr = [];


      //get list of NFTokenID's to compare and create new array for return.
      await client.request({
        method: "account_nfts",
        account: this.transactionDetails.Account
        }).then((result)=>{
          result.result.account_nfts.forEach( (e) => {
            origTokenArr.push(e.NFTokenID)
          })
        })

        
      console.log("Connected to server..minting " + this.transactionDetails.Memos.numberOfTokens + " tokens")


      const transactionData = {
        TransactionType: this.transactionDetails.TransactionType,
        Account: this.transactionDetails.Account,
        URI: this.transactionDetails.URI,
        Flags: this.transactionDetails.Flags,
        NFTokenTaxon: this.transactionDetails.NFTokenTaxon,
        }

        for (let index = 0; index < this.transactionDetails.Memos.numberOfTokens; index++) {
          
          //submit minting transaction
          console.log("Minting token " + index)
          let tx = await client.submitAndWait(transactionData,{wallet})

        
          if(index === this.transactionDetails.Memos.numberOfTokens -1){
           
          //get list of NFTokenID's and push to new array.
           await client.request({
            method: "account_nfts",
            account: this.transactionDetails.Account
            }).then((result)=>{
              result.result.account_nfts.forEach( (e) => {
               
                newArr.push(e.NFTokenID)
              })
            })
              
           
            
          }
           
        }

        let temp = [];

        for (let index = 1; index <= this.transactionDetails.Memos.numberOfTokens; index++) {
            
            temp.push(newArr[newArr.length-index])

        }

   

        client.disconnect()
        console.log("disconnected from server")
        return temp
        
       

      
}
catch(err) {
  console.log("Error occured during mintX() call" + err)
  return;
}
  
  }


  /*getTokens
  *
  *@returns array of NFTokenID's
  */
async getTokensFromLedger(){
  try {

    console.log("Connected to Sandbox..getting all NFT's.")

      const wallet = xrpl.Wallet.fromSeed(this.transactionDetails.Secret)
      const client = new xrpl.Client(this.clientDetails)
      await client.connect()


      let nfts = await client.request({
        method: "account_nfts",
        account: this.transactionDetails.Account
        })


        await client.disconnect()
        console.log("disconnecting")

        return nfts.result.account_nfts


}
catch(err) {
console.log("Error occured during getTokens() call" + err)
return;
}

}


/* Burn specified NFT
* Params (required): 
          - TransactionType: this.transactionDetails.TransactionType,
          - Account: this.transactionDetails.Account,
          - NFTokenID: this.transactionDetails.NFTokenID

  Returns: Transaction Result string.
*
*/
  async burnNFT(){
    try {
     

      const wallet = xrpl.Wallet.fromSeed(this.transactionDetails.Secret)
      const client = new xrpl.Client(this.clientDetails)
      await client.connect()

      console.log("Connected to Sandbox..burning single NFT.")

   
    
    const transactionData = {
          TransactionType: this.transactionDetails.TransactionType,
          Account: this.transactionDetails.Account,
          NFTokenID: this.transactionDetails.NFTokenID
      }
      
    
      
      const tx = await client.submitAndWait(transactionData,{wallet})
  
      // Check transaction results -------------------------------------------------
      /*
      console.log("Transaction result:", tx.result.meta.TransactionResult)
      console.log("Balance changes:",
        JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))
      
      console.log("Disconnected..Done burning single NFT.")
        */

      client.disconnect()
      return tx.result.meta.TransactionResult

}
catch(err) {
  console.log("Error occured during minToken() call" + err)
  return;
}
  
  }


  /*Burn all NFTs in the account

  Params (required): 
  - transactionDetails.Secret
  - transactionDetails.Account

  Returns: 
  Array of NFTokenID's for removal of metadata storage


  */


  async burnAllNFT(){
    try {
     
      const wallet = xrpl.Wallet.fromSeed(this.transactionDetails.Secret)
      const client = new xrpl.Client(this.clientDetails)
      await client.connect()

      console.log("Connected to Sandbox..burning ALL NFT's for specified account.")

      let nfts = await client.request({
        method: "account_nfts",
        account: this.transactionDetails.Account
        })

        console.log("Attempting to burn " + nfts.result.account_nfts.length + " NFT's..")
              
        for (let index = 0; index < nfts.result.account_nfts.length; index++) {


          const transactionData = {
            TransactionType: this.transactionDetails.TransactionType,
            Account: this.transactionDetails.Account,
            NFTokenID: nfts.result.account_nfts[index].NFTokenID
        }


          const tx = await client.submitAndWait(transactionData,{wallet})
          console.log("Burnt " + nfts.result.account_nfts[index].NFTokenID + " ")
      
        }
        
        console.log("END.. All NFT's burned")
        return nfts.result.account_nfts;

}
catch(err) {
  console.log("Error occured during burnAllNFT() call" + err)
  return;
}
  
  }




}



export default XrplNFTHelper
