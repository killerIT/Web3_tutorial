const {DECIMAL,INITAL_ANSWER,developmentChains} = require("../helper-hardhat-config")

module.exports = async({getNamedAccounts,deployments})=>{
     if(developmentChains.includes(network.name)){
         const {firstAccount} = await getNamedAccounts()
         const {deploy} = deployments
         await deploy("MockV3Aggregator",{
            from:firstAccount,
            args:[DECIMAL,INITAL_ANSWER],
            log:true
        })
        console.log(`first account is ${firstAccount}`)
     }else{
        console.log("environment is not local,mock contract deployment is skipped")
     }
   
}

module.exports.tags = ["all","mock"]