import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import getWeb3 from "../getWeb3";
import PropertyFactory from "../contracts/PropertyFactory.json";

class AddProperty extends Component {
    state = { storageValue: 0, web3: null, accounts: null, contract: null, marketPlace: null, title: '', description:'', propertyAddress: '', price: 0, surface: 0};

    componentDidMount = async () => {
        try {
          // Get network provider and web3 instance.
          const web3 = await getWeb3();
    
          // Use web3 to get the user's accounts.
          const accounts = await web3.eth.getAccounts();
          console.log(accounts);
    
          // Get the contract instance.
          const networkId = await web3.eth.net.getId();
        
          const deployedNetworkPropertyFactory = PropertyFactory.networks[networkId];
          const PropertyFactoryInstance = new web3.eth.Contract(
            PropertyFactory.abi,
            deployedNetworkPropertyFactory && deployedNetworkPropertyFactory.address,
          );
    
          // Set web3, accounts, and contract to the state, and then proceed with an
          // example of interacting with the contract's methods.
          this.setState({ web3, accounts, PropertyFactory: PropertyFactoryInstance });

        } catch (error) {
          // Catch any errors for any of the above operations.
          alert(
            `Failed to load web3, accounts, or contract. Check console for details.`,
          );
          console.error(error);
        }
      };

      AddPropertyHandler = async (event) => {
        try{
            console.log("Ajout d'une proprieté")
            console.log(event.target)
            this.state.PropertyFactory.methods.createProperty(
                    this.state.title,
                    this.state.price,
                    this.state.propertyAddress,
                    "/path",
                    this.state.description,
                    this.state.surface,
                    "hashdocument"
                ).send({ from: this.state.accounts[0] });
        }
        catch (error){
            console.log("error while trying to create property!" + error)
        }
        finally
        {
            console.log("success");
        }
      };

      handleChangeTitle = (event) => {
        this.setState({title: event.target.value});
      };

      handleChangeDescription = (event) => {
        this.setState({description: event.target.value});
      }

      handleChangeAddress = (event) => {
        this.setState({propertyAddress: event.target.value});
      };

      handleChangePrice = (event) => {
        this.setState({price: event.target.value});
      };

      handleChangeSurface = (event) => {
        this.setState({surface: event.target.value});
      };

      render() {
          return (
            <div className="container">
                <form onSubmit={this.AddPropertyHandler}>
                    <div className="form-row">
                        <label htmlFor="title">Titre</label>
                        <input type="text" name= "title" className="form-control" value={this.state.title} onChange={this.handleChangeTitle}/>
                    </div>
                    <div className="form-row">
                        <label htmlFor="description">Description</label>
                        <input type="text" name="description" className="form-control" value={this.state.description} onChange={this.handleChangeDescription}/>
                    </div>
                    <div className="form-row">
                        <label htmlFor="propertyAddress"> L'adresse de la propriété</label>
                        <input type="text" name="propertyAddress" className="form-control"  value={this.state.propertyAddress} onChange={this.handleChangeAddress}/>
                    </div>
                    <div className="form-row">
                        <label htmlFor="price">Prix </label>
                        <input type="number" name="price" className="form-control" value={this.state.price} onChange={this.handleChangePrice}/>
                    </div>
                    <div className="form-row">
                        <label htmlFor="surface">Surface</label>
                        <input type="number" name="surface" className="form-control" value={this.state.surface} onChange={this.handleChangeSurface}/>
                    </div>
                    <div className="form-row">
                        <button type="submit" className="btn btn-primary"> Mettre en vente</button>
                    </div>
                    
                </form>
            </div>
          )
      }
}


export default AddProperty;
