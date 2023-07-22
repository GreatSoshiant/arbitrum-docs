import React, { CSSProperties, useState } from 'react';
import { ethers } from 'ethers';

export const EstimateRetryableTicket = () => {
  const [result, setResult] = useState<string | null>(null);

  const handleEstimateRetryableTicket = async () => {
    const senderInput = (document.getElementById("sender-input") as HTMLInputElement).value;
    const depositInput = ethers.utils.parseEther((document.getElementById("deposit-input") as HTMLInputElement).value);
    const toInput = (document.getElementById("to-input") as HTMLInputElement).value;
    const l2CallValueInput = ethers.utils.parseEther((document.getElementById("l2CallValue-input") as HTMLInputElement).value);
    const excessFeeRefundAddressInput = (document.getElementById("excessFeeRefundAddress-input") as HTMLInputElement).value;
    const callValueRefundAddressInput = (document.getElementById("callValueRefundAddress-input") as HTMLInputElement).value;
    const dataInput = ethers.utils.arrayify((document.getElementById("data-input") as HTMLInputElement).value);

    const contractAddress = "0x00000000000000000000000000000000000000C8";
    const iface = new ethers.utils.Interface([
        "function estimateRetryableTicket(address,uint256,address,uint256,address,address,bytes) external"
    ]);
    const data = iface.encodeFunctionData("estimateRetryableTicket", [senderInput, depositInput, toInput, l2CallValueInput, excessFeeRefundAddressInput, callValueRefundAddressInput, dataInput]);

    const payload = {
      id: 1,
      jsonrpc: "2.0",
      params: [{ from: null, to: contractAddress, data }],
      method: "eth_estimateGas"
    };

    try {
      const response = await fetch('https://goerli-rollup.arbitrum.io/rpc', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const json = await response.json();
      if (json.error) {
        setResult('An error occurred: ' + json.error.message);
      } else {
        setResult('Result: ' + json.result);
      }
    } catch (error) {
      setResult('An error occurred: ' + error.message);
    }
  };

  return (
    <div style={styles.container}>
      <h4 style={styles.header}>Estimate Retryable Ticket</h4>
      <label style={styles.label}>Sender</label>
      <input id="sender-input" style={styles.input} type="text" placeholder="Enter the sender address" />
      <label style={styles.label}>Deposit</label>
      <input id="deposit-input" style={styles.input} type="text" placeholder="Enter the deposit" />
      <label style={styles.label}>To</label>
      <input id="to-input" style={styles.input} type="text" placeholder="Enter the to address" />
      <label style={styles.label}>L2 Call Value</label>
      <input id="l2CallValue-input" style={styles.input} type="text" placeholder="Enter the L2 call value" />
      <label style={styles.label}>Excess Fee Refund Address</label>
      <input id="excessFeeRefundAddress-input" style={styles.input} type="text" placeholder="Enter the excess fee refund address" />
      <label style={styles.label}>Call Value Refund Address</label>
      <input id="callValueRefundAddress-input" style={styles.input} type="text" placeholder="Enter the call value refund address" />
      <label style={styles.label}>Data</label>
      <input id="data-input" style={styles.input} type="text" placeholder="Enter the data" />
      <button id="estimate-retryable-ticket" style={styles.button} onClick={handleEstimateRetryableTicket}>Estimate Gas</button>
      <p id='result' style={styles.result}>{result}</p>
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)',
    maxWidth: '500px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '10px',
  },
  label: {
    alignSelf: 'flex-start',
  },
  input: {
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '100%',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '10px',
  },
  result: {
    alignSelf: 'flex-start',
    fontSize: '16px',
    fontWeight: 'bold',
    whiteSpace: 'pre-wrap',
    overflowX: 'auto',
  },
};
