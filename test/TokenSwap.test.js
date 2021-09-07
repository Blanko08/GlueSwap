const Bank = artifacts.require("Bank");
const TokenV1 = artifacts.require("TokenV1");
const TokenV2 = artifacts.require("TokenV2");

require('chai')
  .use(require('chai-as-promised'))
  .should()

function tokens(n) {
    return web3.utils.toWei(n, 'Ether');
}

contract('TokenFarm', ([owner, investor]) => {
    let tokenV1, tokenV2, bank;

    before(async () => {
        // Load Contracts
        tokenV1 = await TokenV1.new();
        tokenV2 = await TokenV2.new();
        bank = await Bank.new(tokenV1.address, tokenV2.address);
      
        // Transfiere todos los token de la Versión 2 a Bank (1 million)
        await tokenV2.transfer(bank.address, tokens('1000000'));
    
        // Transfer 1000 tokens de la versión 1 a la cuenta de inversor
        await tokenV1.transfer(investor, tokens('1000'), { from: owner });
    });

    describe('TokenV1 Deployment', async () => {
        it('Tiene nombre', async () => {
          const name = await tokenV1.name();
          assert.equal(name, 'Token V1');
        });
      });
    
      describe('TokenV2 Deployment', async () => {
        it('Tiene nombre', async () => {
          const name = await tokenV2.name();
          assert.equal(name, 'Token V2');
        });
      });
    
      describe('Bank Deployment', async () => {
        it('Tiene nombre', async () => {
          const name = await bank.name();
          assert.equal(name, 'Bank');
        });
    
        it('El contrato tiene tokens', async () => {
            let balance = await tokenV2.balanceOf(bank.address);
            assert.equal(balance.toString(), tokens('1000000'));
          });
      });

      describe('Swapear Versiones', async () => {
        it('Cambiar TokenV1 por TokenV2', async () => {
          let result;

          // Comprobar el balance del inversor antes de hacer el swap.
          result = await tokenV1.balanceOf(investor);
          assert.equal(result.toString(), tokens('1000'), 'El balance del inversor tiene que ser correcto antes de hacer el swap');
          
          await tokenV1.approve(bank.address, tokens('1000'), { from: investor });
          await bank.swapVersions(tokens('1000'), { from: investor });
          
          // Comprobar que el balance de los TokensV1 del contrato ha aumentado.
          result = await tokenV1.balanceOf(bank.address);
          assert.equal(result.toString(), tokens('1000'), 'El balance del contrato de los TokensV1 tiene que aumentar');

          // Comprobar que el balance de los TokensV1 del inversor ha disminuído.
          result = await tokenV1.balanceOf(investor);
          assert.equal(result.toString(), tokens('0'), 'El balance del inversor de los TokensV1 tiene que disminuir');

          // TODO: Comprobar el cooldown y los balances para el release.

          // Comprobar que no hace el swap si le mandas 0 tokens.
          await bank.swapVersions(tokens('0'), { from: investor }).should.be.rejected;
        });
      });

      xdescribe('Liberar Tokens', async () => {
        xit('Liberar TokensV2', async () => {
          let result;

          // TODO

          // Comprobar que el balance de los TokensV2 del contrato ha disminuído.
          result = await tokenV2.balanceOf(bank.address);
          assert.equal(result.toString(), tokens('999000'), 'El balance del contrato de los TokensV2 tiene que disminuir');

          // Comprobar que el balance de los TokensV2 del inversor ha aumentado.
          result = await tokenV2.balanceOf(investor);
          assert.equal(result.toString(), tokens('1000'), 'El balance del inversor de los TokensV2 tiene que aumentar');
        });
      });
});