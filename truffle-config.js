require('babel-register');
require('babel-polyfill');

const path = require("path");
const fs = require("fs")
const provider = require("@truffle/hdwallet-provider")
const secrets = JSON.parse(fs.readFileSync('.secrets.json').toString().trim())

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*" // Match any network id
    },
    kovan: {
      provider: () => 
        new provider(secrets.privateKey, secrets.infuraApi,
          0,
          1
        ),
      network_id: 42
    }
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: "^0.8.0",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
