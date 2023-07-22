import React, { useState, CSSProperties } from 'react';
import { ethers } from 'ethers';

export const OutboxProof = () => {
  const [size, setSize] = useState('');
  const [leaf, setLeaf] = useState('');
  const [result, setResult] = useState<string[]>([]);

  const handleEthCall = async () => {
    const fixedAddress = '0x00000000000000000000000000000000000000C8';

    // Define the function we want to call and its arguments
    const abi = [
      "function constructOutboxProof(uint64 size, uint64 leaf) external view returns (bytes32 send, bytes32 root, bytes32[] memory proof)"
    ];
    const iface = new ethers.utils.Interface(abi);
    const data = iface.encodeFunctionData("constructOutboxProof", [size, leaf]);

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
          method: "eth_call",
          params: [{
            from: null,
            to: fixedAddress,
            data: data,
          }, "latest"]
        })
      });
      const json = await response.json();
      
      if (json.error) {
        setResult(['An error occurred: ' + json.error.message]);
      } else {
        const decodedResult = iface.decodeFunctionResult("constructOutboxProof", json.result);
        setResult([
          `Send: ${decodedResult.send}`,
          `Root: ${decodedResult.root}`,
          `Proof: ${decodedResult.proof}`
        ]);
      }
    } catch (error) {
      setResult(['An error occurred: ' + error.message]);
    }
  };

  return (
    <div style={styles.container}>
      <h4 style={styles.header}>Outbox Proof</h4>
      <label style={styles.label}>Size</label>
      <input id="size-input" style={styles.input} type="text" value={size} onChange={e => setSize(e.target.value)} />
      <label style={styles.label}>Leaf</label>
      <input id="leaf-input" style={styles.input} type="text" value={leaf} onChange={e => setLeaf(e.target.value)} />
      <button id="eth-call" style={styles.button} onClick={handleEthCall}>Call</button>
      <p id='result' style={styles.result}>{result.map((line, index) => <span key={index}>{line}<br/></span>)}</p>
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
    whiteSpace: 'pre-wrap', // This allows the text to wrap to next line
    wordBreak: 'break-all'
  },
};
