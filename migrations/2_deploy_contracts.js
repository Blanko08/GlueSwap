const Bank = artifacts.require("Bank");
// const TokenV1 = artifacts.require("TokenV1");
// const BurningMoon = artifacts.require("BurningMoon");

module.exports = async function(deployer, network, accounts) {
  // Deploy TokenV1
  /*await deployer.deploy(TokenV1);
  const tokenV1 = await TokenV1.deployed();*/

  // Deploy TokenV2
  /*await deployer.deploy(BurningMoon);
  const burningMoon = await BurningMoon.deployed();*/
  
  // Deploy Bank
  await deployer.deploy(Bank, "0xce0694b5D6432056e00E4aF788098586EAaC72Ae", "0x3C9f0274D76E2a374A60aE2514197F6fE702d6d2", '100');
  const bank = await Bank.deployed();

  // Transfiere todos los token de la Versión 2 a Bank (1 million)
  // await burningMoon.transfer(bank.address, '1000000000000000000000000');

  // Transfer 1000 tokens de la versión 1 a la cuenta de inversor
  // await tokenV1.transfer(accounts[1], '1000000000000000000000');
};
