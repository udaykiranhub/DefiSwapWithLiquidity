import React, { useState } from 'react';
import { Button, Form, Alert, Card, Container, Row, Col } from 'react-bootstrap';
import Web3 from 'web3';

// ERC-20 Token ABI (example, replace with your contract's ABI)
import TOKEN_ABI from "./token.json";

function Token({ contract, account }) {
  const [approveSpender, setApproveSpender] = useState('');
  const [approveAmount, setApproveAmount] = useState('');
  const [transferRecipient, setTransferRecipient] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [balance, setBalance] = useState('');
  const [balanceAddress, setBalanceAddress] = useState(account); // Default to the connected account
  const [allowance, setAllowance] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Approve Function
  const handleApprove = async () => {
    try {
      if (!approveAmount || !approveSpender) {
        setError("Please provide both spender and amount.");
        return;
      }

      const tokenDecimals = await contract.methods.decimals().call();
      const decimals = parseInt(tokenDecimals);

      const approveAmountInSmallestUnit = (approveAmount * Math.pow(10, decimals)).toString();

      console.log("Approve amount in smallest unit is:", approveAmountInSmallestUnit);

      // Approve the spender for the calculated amount
      await contract.methods.approve(approveSpender, approveAmountInSmallestUnit).send({
        from: account,
      });

      setSuccessMessage("Approval successful!");
      setError("");
    } catch (err) {
      console.error("Error in handleApprove:", err);
      setError("Failed to approve.");
      setSuccessMessage("");
    }
  };

  // Transfer Function
  const handleTransfer = async () => {
    try {
      if (!transferRecipient || !transferAmount) {
        setError("Please provide both recipient and amount.");
        return;
      }

      const tokenDecimals = await contract.methods.decimals().call();
      const decimals = parseInt(tokenDecimals);

      const transferAmountInSmallestUnit = (transferAmount * Math.pow(10, decimals)).toString();

      console.log("Transfer amount in smallest unit is:", transferAmountInSmallestUnit);

      // Transfer tokens to the recipient
      await contract.methods.transfer(transferRecipient, Web3.utils.toWei(transferAmount,"ether")).send({
        from: account,
        gas:200000
      });

      setSuccessMessage("Transfer successful!");
      setError("");
    } catch (err) {
      console.error("Error in handleTransfer:", err);
      setError("Failed to transfer.");
      setSuccessMessage("");
    }
  };

  // BalanceOf Function
  const handleCheckBalance = async () => {
    try {
      const tokenDecimals = await contract.methods.decimals().call();
      const decimals = parseInt(tokenDecimals);

      // Get balance of the specified address
      const balanceInSmallestUnit = await contract.methods.balanceOf(balanceAddress).call();
      const balanceInTokens = balanceInSmallestUnit.toString();

      console.log("Balance in tokens:", balanceInTokens.toString());

      setBalance(Web3.utils.fromWei(balanceInTokens,"ether"));
      setError("");
      setSuccessMessage("Balance fetched successfully!");
    } catch (err) {
      console.error("Error in handleCheckBalance:", err);
      setError("Failed to fetch balance.");
      setSuccessMessage("");
    }
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-4 shadow-sm">
            <Card.Body>
              <h2 className="mb-4 text-center">Interact with MTK Token</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              {successMessage && <Alert variant="success">{successMessage}</Alert>}

              <Form>
                {/* Approve Spender */}
                <Form.Group className="mb-3">
                  <Form.Label>Spender Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter spender address"
                    value={approveSpender}
                    onChange={(e) => setApproveSpender(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Amount to Approve</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter amount to approve"
                    value={approveAmount}
                    onChange={(e) => setApproveAmount(e.target.value)}
                  />
                </Form.Group>

                <div className="d-grid gap-2 mb-4">
                  <Button variant="primary" onClick={handleApprove}>
                    Approve
                  </Button>
                </div>

                {/* Transfer Tokens */}
                <Form.Group className="mb-3">
                  <Form.Label>Recipient Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter recipient address"
                    value={transferRecipient}
                    onChange={(e) => setTransferRecipient(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Amount to Transfer</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter amount to transfer"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                  />
                </Form.Group>

                <div className="d-grid gap-2 mb-4">
                  <Button variant="primary" onClick={handleTransfer}>
                    Transfer
                  </Button>
                </div>

                {/* Check Balance */}
                <Form.Group className="mb-3">
                  <Form.Label>Check Balance of Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter address"
                    value={balanceAddress}
                    onChange={(e) => setBalanceAddress(e.target.value)}
                  />
                </Form.Group>

                <div className="d-grid gap-2 mb-4">
                  <Button variant="primary" onClick={handleCheckBalance}>
                    Check Balance
                  </Button>
                </div>

                {balance && (
                  <Alert variant="info">
                    Balance: {balance} MTK
                  </Alert>
                )}

              </Form>
              </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Token;