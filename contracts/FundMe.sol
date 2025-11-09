// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";


// 1.创建一个收款函数

// 2.记录投资人并且查看

// 3.在锁定期内，达到目标值，生产商可以提款

// 4.在锁定期内，没有达到标准值，投资人在锁定期以后可以退款
contract FundMe {
  mapping (address => uint256) public  fundersAmount;
  uint256 constant MININUM_VALUE = 100 * 10 * 18; // USD
  AggregatorV3Interface public dataFeed;

  uint256 constant TARGET = 100 * 10 * 18; // USD

  address public owner;

  // 时间戳
  uint256 deploymentTimestamp;
  // 锁定期
  uint256 lockTime;

  address erc20Addr;

  bool public getFundSuccess = false;
  constructor(uint256 _lockTime){
    // sepolia testnet
    dataFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
    owner = msg.sender;
    // 当前合约时间戳
    deploymentTimestamp = block.timestamp;
    lockTime =_lockTime;
  }

  function fund() external payable {
    require(convertEthToUsd(msg.value) >= MININUM_VALUE,"Send more ETH");
    require(block.timestamp < deploymentTimestamp + lockTime,"window is closed");
    fundersAmount[msg.sender] = msg.value;
  }
  
  /**
     * Returns the latest answer.
     */
    function getChainlinkDataFeedLatestAnswer() public view returns (int) {
        // prettier-ignore
        (
            /* uint80 roundId */,
            int256 answer,
            /*uint256 startedAt*/,
            /*uint256 updatedAt*/,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        return answer;
    }

    function convertEthToUsd(uint256 ethAmount) internal view returns (uint256){
        uint256 ethPrice = uint256(getChainlinkDataFeedLatestAnswer());
        // ethAmount 单位：wei,ethPrice:单位：
        // ETH : USD precision = 10 ** 8
        // X : ETH precision = 10 ** 18
        return (ethAmount * ethPrice) / (10 ** 8);
    }

    function transferOwnerShip(address newOwner) public onlyOwner{
        owner = newOwner;
    }


    function getFund() external windowClosed onlyOwner{
      require(convertEthToUsd(address(this).balance) >= TARGET,"Target is not reached");
      // tranfer
    //   payable(msg.sender).transfer(address(this).balance);
      // send
    //    bool isSuccess = payable(msg.sender).send(address(this).balance);
    //    require(isSuccess,"tx failed");

      // call transfer ETH with data return  value of function and bool
      bool success;
      (success, ) = payable(msg.sender).call{value:address(this).balance}("");
      require(success,"tx failed");
      // 防止同一个账号重复退款
      fundersAmount[msg.sender] = 0;
      getFundSuccess = true; // flag
    }

    function refund() external windowClosed{
      require(convertEthToUsd(address(this).balance) < TARGET,"Target is reached");
      require(fundersAmount[msg.sender] !=0,"there is no fund for you");
      bool success;
      (success, ) = payable(msg.sender).call{value:fundersAmount[msg.sender]}("");
      require(success,"tx failed");
      // 防止同一个账号重复退款
      fundersAmount[msg.sender] = 0;
    }

    function setFunderToAmount(address funder,uint256 amountToUpdate) external {
      require(msg.sender ==erc20Addr,"You do not have permission to call this funtion");
      fundersAmount[funder] = amountToUpdate;
    }
    function setErc20Addr(address _erc20Addr)public onlyOwner{
      erc20Addr = _erc20Addr;
    }

    // 修改器,可以被函数继承
    modifier windowClosed(){
        require(block.timestamp >= deploymentTimestamp + lockTime,"window is not closed");
        // _的意义是快速失败，省下gas帮用户
        _;
    }

    modifier onlyOwner(){
        require(msg.sender == owner,"this function can only called by owner");
        _;
    }
  
  }