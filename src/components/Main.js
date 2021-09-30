import React, { Component } from 'react';

class Main extends Component {
    render() {
        return(
            <div id="content" className="mt-3">
                <div className="card mb-4" >
                    <div className="card-body">
                        <form className="mb-3" onSubmit={(event) => {
                            event.preventDefault();
                            let amount;
                            amount = this.input.value.toString();
                            amount = window.web3.utils.toWei(amount, 'Ether');
                            this.props.swap(amount);
                        }}>
                            <div>
                                <label className="float-left"><b>Swap BNB to XXT</b></label>
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
                                        BNB
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary btn-block btn-lg">SWAP</button>
                        </form>
                    </div>
                </div>
            </div>    
        );
    }
}

export default Main;