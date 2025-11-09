const {DECIMAL,INITAL_ANSWER} = require("../helper-hardhat-config")

module.exports = async({getNamedAccounts,deployments})=>{
    const {firstAccount} = await getNamedAccounts()
    const {deploy} = deployments
   await deploy("MockV3Aggregator",{
        from:firstAccount,
        args:[DECIMAL,INITAL_ANSWER],
        log:true
    })
    console.log(`first account is ${firstAccount}`)
}

module.exports.tags = ["all","mock"]