import React, { CSSProperties, useState } from 'react';
import { ethers } from 'ethers';

export const LegacyLookup = () => {
  const [result, setResult] = useState<string | null>(null);

  const handleLegacyLookup = async () => {
    const batchNumInput = (document.getElementById("batchNum-input") as HTMLInputElement).value;
    const indexInput = (document.getElementById("index-input") as HTMLInputElement).value;
    const rpcUrlInput = (document.getElementById("rpcUrl-input") as HTMLInputElement).value;

    const contractAddress = "0x00000000000000000000000000000000000000C8";
    const iface = new ethers.utils.Interface([
        "function legacyLookupMessageBatchProof(uint256,uint64) external view returns (bytes32[],uint256,address,address,uint256,uint256,uint256,uint256,bytes)"
    ]);
    const data = iface.encodeFunctionData("legacyLookupMessageBatchProof", [batchNumInput, indexInput]);

    const payload = {
      id: 1,
      jsonrpc: "2.0",
      params: [{ from: null, to: contractAddress, data }, "latest"],
      method: "eth_call"
    };

    try {
      const response = await fetch(rpcUrlInput, {
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
      <h4 style={styles.header}>Legacy Lookup</h4>
      <label style={styles.label}>Batch Number</label>
      <input id="batchNum-input" style={styles.input} type="text" placeholder="Enter the batch number" />
      <label style={styles.label}>Index</label>
      <input id="index-input" style={styles.input} type="text" placeholder="Enter the index" />
      <label style={styles.label}>RPC URL (Should be Archive)</label>
      <input id="rpcUrl-input" style={styles.input} type="text" placeholder="Enter the RPC URL" />
      <button id="legacy-lookup" style={styles.button} onClick={handleLegacyLookup}>Get Data</button>
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
