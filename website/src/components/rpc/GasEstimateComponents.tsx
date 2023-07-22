import React, { CSSProperties, useState } from 'react';
import { ethers } from 'ethers';

export const GasEstimate = () => {
  const [result, setResult] = useState<string | null>(null);

  const handleGasEstimate = async () => {
    const toAddress = (document.getElementById("toAddress-input") as HTMLInputElement).value;
    const contractCreationInput = (document.getElementById("contractCreation-input") as HTMLSelectElement).value === "true";
    const dataInput = (document.getElementById("data-input") as HTMLInputElement).value;

    const contractAddress = "0x00000000000000000000000000000000000000C8";
    const iface = new ethers.utils.Interface(["function gasEstimateL1Component(address,bool,bytes) external payable returns (uint64,uint256,uint256)"]);
    const data = iface.encodeFunctionData("gasEstimateL1Component", [toAddress, contractCreationInput, ethers.utils.arrayify(dataInput)]);

    const payload = {
      id: 1,
      jsonrpc: "2.0",
      params: [{ from: null, to: contractAddress, data }, "latest"],
      method: "eth_call"
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
      <h4 style={styles.header}>Gas Estimate</h4>
      <label style={styles.label}>To Address</label>
      <input id="toAddress-input" style={styles.input} type="text" placeholder="Enter the to address" />
      <label style={styles.label}>Contract Creation</label>
      <select id="contractCreation-input" style={styles.input}>
        <option value="true">True</option>
        <option value="false">False</option>
      </select>
      <label style={styles.label}>Data</label>
      <input id="data-input" style={styles.input} type="text" placeholder="Enter the data" />
      <button id="gas-estimate" style={styles.button} onClick={handleGasEstimate}>Estimate Gas</button>
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
