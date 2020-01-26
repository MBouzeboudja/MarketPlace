const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");

const mnemonic = "select scout crash enforce riot rival spring whale hollow radar rule sentence";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),

  networks: {
    ganache: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 8545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },
    kovan: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://kovan.infura.io/v3/d2924a996b794fa7a33760fc015491ed")
      },
      network_id: 42,
      gas: 300000,
    }
  }
};
