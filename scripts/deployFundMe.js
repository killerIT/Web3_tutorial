// import ethers
const {ethers} = require("hardhat")

// create main function
async function main(){
    const fundMeFactory = await ethers.getContractFactory("FundMe")
    const fundMe = await fundMeFactory.deploy(300)
    await fundMe.waitForDeployment()
    console.log(`contract has been deployed successfully, contract address is ${fundMe.target}`)

    if(hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY){
        // 等待几个区块确认（推荐）
        console.log("Waiting for 5 block confirmations...");
        await fundMe.deploymentTransaction().wait(5);
        // 验证合约
        await verifyContract(fundMe.target, [300])
    }else{
        console.log("no waiting block")
        return
    }

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
}

// 验证函数
async function verifyContract(fundMeAddr, args) {
    try {
        await hre.run("verify:verify", {
            address: fundMeAddr,
            constructorArguments: args,
        });
        console.log("Contract verified successfully");
    } catch (error) {
        if (error.message.toLowerCase().includes("already verified")) {
            console.log("Contract already verified!");
        } else {
            console.error("Verification failed:", error);
        }
    }
}

// execute main function
main().then(() => {
    process.exit(0)
}).catch((error) => {
    console.error(error)
    process.exit(1)
})