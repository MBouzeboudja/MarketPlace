import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import PropertyFactory from "./contracts/PropertyFactory.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, marketPlace: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log(accounts);

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      const deployedNetworkMarketPlace = PropertyFactory.networks[networkId];
      const marketPlaceInstance = new web3.eth.Contract(
        PropertyFactory.abi,
        deployedNetworkMarketPlace && deployedNetworkMarketPlace.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance, PropertyFactory: marketPlaceInstance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract, PropertyFactory } = this.state;

    //Get balance of current account.
    this.state.web3.eth.getBalance(this.state.accounts[0], (error, wei) => {
      this.setState({amount: wei});
    });

    //crete a new property
    await PropertyFactory.methods.createProperty(12, "1' rue de la confluence 93200", "/path", "une belle maison", 14, "kshdfvkjfdvjfbdv", true).send({ from: accounts[0] });
    await PropertyFactory.methods.createProperty(12, "1' rue de la confluence 93200", "/path", "une belle maison", 14, "kshdfvkjfdvjfbdv", true).send({ from: accounts[0] });
    
    await PropertyFactory.methods.buyProperty(0, accounts[0]).send({ from: accounts[0] });;

    let allProperties = await PropertyFactory.methods.getAllProperties().call();
    this.setState({allProperties: allProperties});

    var x = await  PropertyFactory.methods.getOwnerPropertiesCount(this.state.accounts[0]).call();
    this.setState({ propertiesCount: x});

    const count = await PropertyFactory.methods.getPropertiesCount().call();
    this.setState({count: count});

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 40</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
        <div> Value 5 =  {this.state.count}</div>
        <div> propertiesCount account 0 :  {this.state.propertiesCount}</div>
    <div> Toutes les proprietés :  {this.state.allProperties}</div>

      </div>
    );
  }
}

export default App;
