import React, { Component } from 'react';
import Navbar from './Navbar';
import Main from './Main';
import Web3 from 'web3';
import XXT from '../abis/XXT.json';
import Swap from '../abis/Swap.json';

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } else if(window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('No ethereum browser is installed. Try it installing MetaMask.');
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
	
    // Cargar cuenta
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const networkId = await web3.eth.net.getId();

    // Recoger contrato 'Bank'
    const swapData = Swap.networks[networkId];
    if(swapData) {
      // Asignar contracto
      const swap = new web3.eth.Contract(Swap.abi, swapData.address);
      this.setState({ swap });
    }else {
      window.alert('Swap contract not deployed to detected network.');
    }

    const xxtData = XXT.networks[networkId];
    if(xxtData) {
      // Asignar contracto
      const xxt = new web3.eth.Contract(XXT.abi, xxtData.address);
      this.setState({ xxt });
    }else {
      window.alert('XXT contract not deployed to detected network.');
    }

    this.setState({ loading: false });
  }

  swap = (amount) => {
    this.setState({ loading: true });

    this.state.swap.methods.swapTokens().send({ value: amount, from: this.state.account })
    .on('confirmation', (confirmationNumber) => {
      this.setState({ loading: false });
      window.location.reload();
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      xxt: {},
      swap: {},
      loading: true
    }
  }

  render() {
    let content;
    if(this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>
    } else {
      content = <Main 
        swap={ this.swap }        
      />
    }

    return (
      <div>
        <Navbar account={ this.state.account } />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
