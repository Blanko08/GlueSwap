const Swap = artifacts.require("Swap");
const XXT = artifacts.require("XXT");
	
require('chai')
  .use(require('chai-as-promised'))
  .should();

function tokens(n) {
    return web3.utils.toWei(n, 'Ether');
}

contract('Swap', ([owner, investor]) => {
    let token, swap;

    before(async () => {
        // Load Contracts
        token = await XXT.new();
        swap = await Swap.new(token.address);
      
        // Transfiere 2000 tokens XXT al Swap.
        await token.transfer(swap.address, tokens('2000'));
    });

    describe('Deployment', async () => {
        it('Swap Deploys Successfully', async () => {
            const address = await swap.address;
            assert.notEqual(address, 0x0);
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        });

        it('Token Deploys Successfully', async () => {
            const address = await token.address;
            assert.notEqual(address, 0x0);
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        });

        it('Swap has tokens', async () => {
            let balance = await token.balanceOf(swap.address);
            assert.equal(balance.toString(), tokens('1998')); // 1998 tokens porque al hacer transferencias el 0.10% de los tokens son quemados.
        });
    });

    describe('Swap', async () => {
        it('Swap Tokens', async () => {
            let result;

            // Comprobar el balance del inversor antes de hacer el swap.
            result = await token.balanceOf(investor);
            assert.equal(result.toString(), tokens('0'), 'El balance del inversor tiene que ser correcto antes de hacer el swap');

            await swap.swapTokens({from: investor, value: tokens('1')});

            // Comprobar que el balance de tokens XXT en la cuenta del inversor han aumentado.
            result = await token.balanceOf(investor);
            assert.equal(result.toString(), '88911000000000000000', 'El balance del inversor tiene que ser correcto después de hacer el swap');
        });

        it('Withdraw Tokens', async () => {
            let bnbBalance, tokenBalance;

            await swap.withdrawTokens({from: owner});

            bnbBalance = await web3.eth.getBalance(swap.address);
            tokenBalance = await token.balanceOf(swap.address);

            assert.equal(bnbBalance.toString(), '0', 'El balance de BNB del swap tiene que ser correcto después de hacer el withdraw.');
            assert.equal(tokenBalance.toString(), '0', 'El balance de XXT del swap tiene que ser correcto después de hacer el withdraw.');
            
            // Comprobación de que un inversor no puede retirar el balance del contrato.
            await swap.withdrawTokens({from: investor}).should.be.rejected;
        });

        it('Set Owner', async () => {
            await swap.setOwner(investor, {from: investor}).should.be.rejected;
            await swap.setOwner(investor, {from: owner});

            const newOwner = await swap.owner();
            assert.equal(newOwner, investor, 'El owner tiene que haber cambiado.');
        });
    });
});