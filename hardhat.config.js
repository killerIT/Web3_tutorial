require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify"); // 确保在配置文件中引入插件

// require("dotenv").config()
require("@chainlink/env-enc").config()
 require("@nomicfoundation/hardhat-verify");
 require("./tasks")
 require("hardhat-deploy")
const SEPOLIA_URL = process.env.SEPOLIA_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const PRIVATE_KEY_1 = process.env.PRIVATE_KEY_1
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks:{
    sepolia:{
      url:SEPOLIA_URL,
      accounts:[PRIVATE_KEY,PRIVATE_KEY_1],
      chainId: 11155111,
    }
  },
    etherscan: {
      // 使用新的 v2 API 配置格式
      apiKey: ETHERSCAN_API_KEY
      // 移除 customChains 配置，使用默认值
  },
  namedAccounts:{
    firstAccount:{
      default:0
    },
    secondAccount:{
      default:1
    }
  }
};
