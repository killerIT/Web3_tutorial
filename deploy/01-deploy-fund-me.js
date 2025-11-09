// function deployFunction(){
//     console.log("this is a deploy function")
// }

const { network } = require("hardhat")
const {developmentChains,LOCK_TIME} = require("../helper-hardhat-config")

// module.exports.default=deployFunction
// 匿名函数
// module.exports = async(hre)=>{
//     const getNamdeAccounts = hre.getNamdeAccounts
//     const deployments = hre.deployments
//     console.log("this is a deploy function")
// }

module.exports = async({getNamedAccounts,deployments})=>{
    const {firstAccount} = await getNamedAccounts()
    const {deploy} = deployments
    let dataFeedAddr
    if(developmentChains.contains(network.name)){
         const mockV3Aggregator = await deployments.get("MockV3Aggregator")
         dataFeedAddr = mockV3Aggregator.address
    }else{
        dataFeedAddr = networkConfig[network.config.chainId].ethUsdDataFeed
    }
   await deploy("FundMe",{
        from:firstAccount,
        args:[LOCK_TIME,dataFeedAddr],
        log:true
    })
    console.log(`first account is ${firstAccount}`)

     // 注意这里的括号 ()必须有
    //   const { firstAccount } = await getNamedAccounts() 
    //   console.log(`first account is ${firstAccount}`)
}

module.exports.tags = ["all","fundme"]