// function deployFunction(){
//     console.log("this is a deploy function")
// }

const { network } = require("hardhat")
const {developmentChains,networkConfig,LOCK_TIME,CONFIRMATIONS} = require("../helper-hardhat-config")

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
    if(developmentChains.includes(network.name)){
         const mockV3Aggregator = await deployments.get("MockV3Aggregator")
         dataFeedAddr = mockV3Aggregator.address
    }else{
        dataFeedAddr = networkConfig[network.config.chainId].ethUsdDataFeed
    }
   const fundMe = await deploy("FundMe",{
        from:firstAccount,
        args:[LOCK_TIME,dataFeedAddr],
        log:true,
        // 等待5个区块确认
        waitConfirmations:CONFIRMATIONS
    })

     if(hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY){
        // 因为合约刚部署完，Etherscan 还没来得及索引到合约的字节码，就尝试验证合约了，会导致失败
        await hre.run("verify:verify", {
            address: fundMe.address,
            constructorArguments: [LOCK_TIME,dataFeedAddr],
        });
     }else{
        console.log("Network is not sepolia,verification skipped")
     }
    console.log(`first account is ${firstAccount}`)

     // 注意这里的括号 ()必须有
    //   const { firstAccount } = await getNamedAccounts() 
    //   console.log(`first account is ${firstAccount}`)
}

module.exports.tags = ["all","fundme"]