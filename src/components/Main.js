import React, { Component } from 'react';

class Main extends Component {
    render() {
        return(
            <div id="content" className="mt-3">
                <table className="table table-borderless text-muted text-center">
                    <thead>
                        <tr>
                            <th scope="col">PizzaDoge Wallet Balance</th>
                            <th scope="col">PhoenixDoge DApp Balance</th>
                            <th scope="col">PhoenixDoge Wallet Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{window.web3.utils.fromWei(this.props.tokenV1Balance, 'Ether')} PizzaDoge</td>
                            <td>{window.web3.utils.fromWei(this.props.tokenV2DAppBalance, 'Ether')} PhoenixDoge</td>
                            <td>{window.web3.utils.fromWei(this.props.tokenV2Balance, 'Ether')} PhoenixDoge</td>
                        </tr>
                    </tbody>
                </table>

                <div className="card mb-4" >
                    <div className="card-body">
                        <form className="mb-3" onSubmit={(event) => {
                            event.preventDefault();
                            let amount;
                            amount = this.input.value.toString();
                            amount = window.web3.utils.toWei(amount, 'Ether');
                            this.props.swapVersions(amount);
                        }}>
                            <div>
                                <label className="float-left"><b>Swap PizzaDoge to PhoenixDoge</b></label>
                            </div>
                            <div className="input-group mb-4">
                                <input
                                type="text"
                                ref={(input) => { this.input = input }}
                                className="form-control form-control-lg"
                                placeholder="0"
                                required />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        PizzaDoge
                                    </div>
                                </div>
                            </div>
                            <button disabled={ this.props.swapAvailable } type="submit" className="btn btn-primary btn-block btn-lg">SWAP</button>
                        </form>

                        <button 
                        disabled={ this.props.claimAvailable }
                        type="submit" 
                        className="btn btn-outline-primary btn-block"
                        onClick={(event) => {
                            event.preventDefault();
                            this.props.releaseTokens();
                        }}>
                        
                            CLAIM PhoenixDoge
                        </button>
                    </div>
                </div>
            </div>    
        );
    }
}

export default Main;