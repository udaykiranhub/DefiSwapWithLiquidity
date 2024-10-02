import React, { useState, useEffect } from 'react';
import { Button, Form, Card, Container, Row, Col, Alert } from 'react-bootstrap';
import Web3 from 'web3';

// Assuming you have the ABI and contract address for your DeFi contract
import DEFI_ABI from './Defi.json';
import { swap } from "./addresses";
import Token_abi from "./token.json";
import { token } from './addresses';

function Defi() {
  const [web3, setWeb3] = useState(null);
  const [defiContract, setDefiContract] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [ethReserve, setEthReserve] = useState('');
  const [tokenReserve, setTokenReserve] = useState('');
  const [liquidityEth, setLiquidityEth] = useState('');
  const [liquidityTokens, setLiquidityTokens] = useState('');
  const [ethToSwap, setEthToSwap] = useState('');
  const [tokensToSwap, setTokensToSwap] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [account, setAccount] = useState('');

  useEffect(() => {
    if (window.ethereum) {
      async function initialize() {
        const _web3 = new Web3(window.ethereum);
        const accounts = await _web3.eth.requestAccounts();
        setAccount(accounts[0]);
        setWeb3(_web3);

        const _defiContract = new _web3.eth.Contract(DEFI_ABI.abi, swap);
        setDefiContract(_defiContract);

        const _tokenContract = new _web3.eth.Contract(Token_abi.abi, token);
        setTokenContract(_tokenContract);

        fetchReserves(_defiContract);
      }
      initialize();
    }
  }, []);

  // Fetch ETH and token reserves
  const fetchReserves = async (contract) => {
    try {
      const ethReserve = await contract.methods.ethReserve().call();
      const tokenReserve = await contract.methods.tokenReserve().call();
      setEthReserve(web3.utils.fromWei(ethReserve, 'ether'));
      setTokenReserve(web3.utils.fromWei(tokenReserve, 'ether'));
    } catch (err) {
      setError('Failed to fetch reserves');
    }
  };

  const handleProvideLiquidity = async () => {
    try {
        const ethValue = web3.utils.toWei(liquidityEth, 'ether');
        const tokenValue = web3.utils.toWei(liquidityTokens, 'ether');

  
        console.log("next!!!!!!!!!!!!!!!!");
var x=await tokenContract.methods.allowance(account,swap).call();
console.log("allowance is:",x)
console.log("...................")
        // Provide liquidity
        await defiContract.methods.provideLiquidity(tokenValue).send({
            from: account,
            value: ethValue,
            gas: 200000 // Adjust gas limit as necessary
        });

        setSuccessMessage('Liquidity provided successfully!');
        setError('');
        fetchReserves(defiContract); // Refresh reserves after providing liquidity
    } catch (err) {
        console.log('Error in handleProvideLiquidity:', err);
        setError('Failed to provide liquidity');
        setSuccessMessage('');
    }
};


  // Swap ETH for Tokens
  const handleSwapEthForTokens = async () => {
    try {
      const ethValue = web3.utils.toWei(ethToSwap, 'ether');

      // Swap ETH for tokens
      await defiContract.methods.swapETHForTokens().send({
        from: account,
        value: ethValue,
        gas: 500000,
      });

      setSuccessMessage('Swap ETH for Tokens successful!');
      setError('');
      fetchReserves(defiContract);
    } catch (err) {
      console.log('Error in handleSwapEthForTokens:', err);
      setError('Failed to swap ETH for tokens');
      setSuccessMessage('');
    }
  };

  // Swap Tokens for ETH
  const handleSwapTokensForEth = async () => {
    try {
      const tokenValue = web3.utils.toWei(tokensToSwap, 'ether');

      // Approve token transfer to DeFi contract
      await tokenContract.methods.approve(swap, tokenValue).send({
        from: account,
        gas: 100000 // Set a gas limit
      });

      // Swap tokens for ETH
      await defiContract.methods.swapTokensForETH(tokenValue).send({
        from: account,
        gas: 150000 // Set a gas limit for the swap
      });

      setSuccessMessage('Swap Tokens for ETH successful!');
      setError('');
      fetchReserves(defiContract);
    } catch (err) {
      console.log('Error in handleSwapTokensForEth:', err);
      setError('Failed to swap tokens for ETH');
      setSuccessMessage('');
    }
  };

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <Card className="p-4 shadow-sm">
            <h2 className="mb-4 text-center">DeFi Swap</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}

            <Form>
              <h5>Provide Liquidity</h5>
              <Form.Group className="mb-3">
                <Form.Label>ETH Amount</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter ETH amount"
                  value={liquidityEth}
                  onChange={(e) => setLiquidityEth(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Token Amount</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Token amount"
                  value={liquidityTokens}
                  onChange={(e) => setLiquidityTokens(e.target.value)}
                />
              </Form.Group>
              <Button 
    variant="primary" 
    onClick={handleProvideLiquidity} 
    disabled={!liquidityEth || !liquidityTokens || Number(liquidityEth) <= 0 || Number(liquidityTokens) <= 0}
>
    Provide Liquidity
</Button>

            </Form>

            <hr />

            <Form>
              <h5>Swap ETH for Tokens</h5>
              <Form.Group className="mb-3">
                <Form.Label>ETH Amount</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter ETH to swap"
                  value={ethToSwap}
                  onChange={(e) => setEthToSwap(e.target.value)}
                />
              </Form.Group>

              <Button variant="success" onClick={handleSwapEthForTokens}>
                Swap ETH for Tokens
              </Button>
            </Form>

            <hr />

            <Form>
              <h5>Swap Tokens for ETH</h5>
              <Form.Group className="mb-3">
                <Form.Label>Token Amount</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Tokens to swap"
                  value={tokensToSwap}
                  onChange={(e) => setTokensToSwap(e.target.value)}
                />
              </Form.Group>

              <Button variant="warning" onClick={handleSwapTokensForEth}>
                Swap Tokens for ETH
              </Button>
            </Form>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="p-4 shadow-sm">
            <h4 className="mb-3 text-center">Reserves</h4>
            <p><strong>ETH Reserve:</strong> {ethReserve} ETH</p>
            <p><strong>Token Reserve:</strong> {tokenReserve} MTK</p>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Defi;
