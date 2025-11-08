const {task} = require("hardhat/config")

task("interact-fundme", "interact with fundme contract")
    .addParam("addr","fundme contract address")
    .setAction(async(taskArgs,hre) =>{
       const fundMeFactory = await ethers.getContractFactory("FundMe")
       const fundMe = fundMeFactory.attach(taskArgs.addr)
       // init 2 accounts
       const [firstAccount, secondAccount] = await ethers.getSigners()
        
        // fund contract with first account
        console.log(`Funding with first account: ${firstAccount.address}`)
        const fundTx = await fundMe.connect(firstAccount).fund({value: ethers.parseEther("0.00001")})
        await fundTx.wait()
        
        // check balance of contract
        const balanceOfContract = await ethers.provider.getBalance(fundMe.target)
        console.log(`Balance of the contract is ${balanceOfContract}`)
        
        // fund contract with second account
        console.log(`Funding with second account: ${secondAccount.address}`)
        const fundTxWithSecondAccount = await fundMe.connect(secondAccount).fund({value: ethers.parseEther("0.00001")})
        await fundTxWithSecondAccount.wait()
        
        // check balance of contract
        const balanceOfContractAfterSecondFund = await ethers.provider.getBalance(fundMe.target)
        console.log(`BalanceSecond of the contract is ${balanceOfContractAfterSecondFund}`)
        
        // check mapping fundersToAmount
        const firstAccountBalanceInFundMe = await fundMe.fundersAmount(firstAccount.address)
        const secondAccountBalanceInFundMe = await fundMe.fundersAmount(secondAccount.address)
        
        console.log(`Balance of first account ${firstAccount.address} is ${firstAccountBalanceInFundMe}`)
        console.log(`Balance of second account ${secondAccount.address} is ${secondAccountBalanceInFundMe}`)
})

module.exports = {}