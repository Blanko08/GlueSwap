const Token = artifacts.require("XXT");
const Swap = artifacts.require("Swap");

module.exports = async function(deployer, network, accounts) {
    // Deploy Token
    await deployer.deploy(Token);
    const token = await Token.deployed();
    
    // Deploy Swap
    await deployer.deploy(Swap, token.address);
    const swap = await Swap.deployed();
};