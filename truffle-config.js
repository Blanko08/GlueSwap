require('babel-register');
require('babel-polyfill');

const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');
const mnemonic = require("./secrets.json").mnemonic;

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    bscTestnet: {
      provider: () => new HDWalletProvider(mnemonic, `https://speedy-nodes-nyc.moralis.io/d5d6d79207875bb28e087eb8/bsc/testnet`),
      network_id: 97,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    bsc: {
      provider: () => new HDWalletProvider(mnemonic, `https://bsc-dataseed1.binance.org`),
      network_id: 56,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: "0.8.6",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  plugins: [
    'truffle-contract-size'
  ]
}
