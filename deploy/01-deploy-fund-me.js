// function deployFunction(){
//     console.log("this is a deploy function")
// }

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
   await deploy("FundMe",{
        from:firstAccount,
        args:[180],
        log:true
    })
    console.log(`first account is ${firstAccount}`)

     // 注意这里的括号 ()必须有
    //   const { firstAccount } = await getNamedAccounts() 
    //   console.log(`first account is ${firstAccount}`)
}

module.exports.tags = ["all","fundme"]