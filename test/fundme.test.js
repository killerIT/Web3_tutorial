const { ethers, deployments, getNamedAccounts } = require("hardhat")

const { expect } = require("chai")

describe("test fundme contract",async function () {
    let fundMe
    let firstAccount
    beforeEach(async function () {
        await deployments.fixture(["all"])
        firstAccount =(await getNamedAccounts()).firstAccount
        const fundMeDeployment = await deployments.get("FundMe")
        fundMe = await ethers.getContractAt("FundMe",fundMeDeployment.address)
    })

    it("test if the owner is mag.sender",async function() {
        await fundMe.waitForDeployment()
        expect(await fundMe.owner()).to.equal(firstAccount)
    })

    it("test if the dataFeed is assigned correctly",async function() {
        await fundMe.waitForDeployment()
       expect(await fundMe.dataFeed()).to.equal("0x694AA1769357215DE4FAC081bf1f309aDC325306")
    })
})