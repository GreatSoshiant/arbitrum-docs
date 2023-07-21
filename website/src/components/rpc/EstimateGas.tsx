import React, { CSSProperties } from 'react';
import {ethers} from 'ethers';

export const EstimateGas = () => {
  class Web2GasEstimatorClient {
    async estimateGas(fromAddress, toAddress, value, data) {
      try {
        const response = await fetch('https://goerli-rollup.arbitrum.io/rpc', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          },
          body: JSON.stringify({
              id: 1,
              jsonrpc: "2.0",
              params: [{
                "from": fromAddress,
                "to": toAddress,
                "value": value,
                "data": data
              }],
              method: "eth_estimateGas"
          })
        });
        const json = await response.json();
        if (json.error) {
          return 'An error occurred: ' + json.error.message;
        } else {
          return  ethers.utils.formatUnits(ethers.BigNumber.from(json.result).toString(),9);
        }
      } catch (error) {
        return 'An error occurred: ' + error.message;
      }
    }
  }

  const gasEstimatorClient = new Web2GasEstimatorClient();

  const handleEstimateGas = async () => {
    const fromInput = document.getElementById("from-input") as HTMLInputElement;
    const fromAddress = fromInput.value;
    const toInput = document.getElementById("to-input") as HTMLInputElement;
    const toAddress = toInput.value;
    const valueInput = document.getElementById("value-input") as HTMLInputElement;
    const valueEther = valueInput.value;

    // Convert Ether to Wei and format as hexadecimal
    const valueWei = ethers.utils.parseEther(valueEther);
    const valueHex = ethers.utils.hexlify(valueWei);

    const dataInput = document.getElementById("data-input") as HTMLInputElement;
    const data = dataInput.value;
    const estimatedGas = await gasEstimatorClient.estimateGas(fromAddress, toAddress, valueHex, data);
    const gasEl = document.getElementById("gas");
    gasEl.textContent = `Estimated Gas: ${estimatedGas} in gwei`;
  };

  
  return (
    <div style={styles.container}>
      <h4 style={styles.header}>Gas Estimator</h4>
      <label style={styles.label}>From Address</label>
      <input id="from-input" style={styles.input} type="text" placeholder="Enter From address" />
      <label style={styles.label}>To Address</label>
      <input id="to-input" style={styles.input} type="text" placeholder="Enter To address" />
      <label style={styles.label}>Value</label>
      <input id="value-input" style={styles.input} type="text" placeholder="Enter Value" />
      <label style={styles.label}>Data</label>
      <input id="data-input" style={styles.input} type="text" placeholder="Enter Data" />
      <button id="estimate-gas" style={styles.button} onClick={handleEstimateGas}>Estimate Gas</button>
      <p id='gas' style={styles.gas}></p>
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
  gas: {
    alignSelf: 'flex-start',
    fontSize: '16px',
    fontWeight: 'bold',
  },
};
