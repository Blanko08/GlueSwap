import React, { Component } from 'react';
import './App.css';
import Navbar from './Navbar';
import Main from './Main';
import Web3 from 'web3';
import TokenV2 from '../abis/TokenV2.json';
import Bank from '../abis/Bank.json';
import TokenV1 from './TokenV1';
import TokenV2b from './TokenV2';

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
    const bankData = Bank.networks[networkId];
    if(bankData) {
      // Asignar contracto
      const bank = new web3.eth.Contract(Bank.abi, bankData.address);
      this.setState({ bank });

      // Recoger los TokensV2 del usuario en la DApp.
      let tokenV2DAppBalance = await bank.methods.balanceV2(this.state.account).call();
      this.setState({ tokenV2DAppBalance: tokenV2DAppBalance.toString() });

      // Contrato TokenV1.
      const tokenV1 = new web3.eth.Contract(TokenV1.abi, TokenV1.address);
      this.setState({ tokenV1 });
      let tokenV1Balance = await tokenV1.methods.balanceOf(this.state.account).call();
      this.setState({ tokenV1Balance: tokenV1Balance.toString() });

      // Contrato TokenV2.
      const tokenV2 = new web3.eth.Contract(TokenV2.abi, TokenV2b.address);
      this.setState({ tokenV2 });
      let tokenV2Balance = await tokenV2.methods.balanceOf(this.state.account).call();
      this.setState({ tokenV2Balance: tokenV2Balance.toString() });
      
      // Revisar si está dentro de la whitelist.
      let whitelist = await bank.methods.whitelist(this.state.account).call();
      if(whitelist === true) {
        this.setState({
          swapAvailable: false
        });
      }

      // Recoger tiempo en el que se va a poder hacer claim.
      let cooldownTime = await bank.methods.claimReady(this.state.account).call();
      let actualTime = Date.now() / 1000 | 0;
      if(cooldownTime.toNumber() <= actualTime && whitelist === true) {
        this.setState({ claimAvailable: false });
      }
    }else {
      window.alert('Bank contract not deployed to detected network.');
    }

    this.setState({ loading: false });
  }

  swapVersions = (amount) => {
    this.setState({ loading: true });

    this.state.tokenV1.methods.approve(this.state.bank.address, amount).send({ from: this.state.account })
    .on('confirmation', (confirmationNumber) => {
      if(confirmationNumber === 1) {
        this.state.bank.methods.swapVersions(amount).send({ from: this.state.account })
        .on('confirmation', (confirmationNumber) => {
          this.setState({ loading: false });
          window.location.reload();
        })
      }
    });
  }

  releaseTokens = () => {
    this.setState({ loading: true });

    this.state.bank.methods.releaseTokens().send({ from: this.state.account })
    .on('confirmation', (confirmationNumber) => {
      this.setState({ loading: false });
      window.location.reload();
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      tokenV1: {},
      tokenV2: {},
      bank: {},
      tokenV1Balance: '0',
      tokenV2Balance: '0',
      tokenV2DAppBalance: '0',
      swapAvailable: true,
      claimAvailable: true,
      loading: true
    }
  }

  render() {
    let content;
    if(this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>
    } else {
      content = <Main 
        tokenV1Balance={ this.state.tokenV1Balance }
        tokenV2Balance={ this.state.tokenV2Balance }
        tokenV2DAppBalance={ this.state.tokenV2DAppBalance }
        swapVersions={ this.swapVersions }
        releaseTokens={ this.releaseTokens }
        claimAvailable={ this.state.claimAvailable }
        swapAvailable={ this.state.swapAvailable }          
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
