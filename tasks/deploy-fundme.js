const { TASK_COMPILE_GET_REMAPPINGS } = require("hardhat/builtin-tasks/task-names")
const {task} = require("hardhat/config")

task("deploy-fundme", "deploy and verify fundme contract").setAction(async(TASK_COMPILE_GET_REMAPPINGS,hre) =>{
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
})

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

module.exports = {}