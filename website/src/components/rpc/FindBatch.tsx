import React, { useState, CSSProperties } from 'react';
import { ethers } from 'ethers';

export const EthCallFixed = () => {
  const [blockNum, setBlockNum] = useState('');
  const [result, setResult] = useState<string[]>([]);

  const handleEthCall = async () => {
    const fixedAddress = '0x00000000000000000000000000000000000000C8';

    // Define the function we want to call and its arguments
    const abi = ["function findBatchContainingBlock(uint64 blockNum) external view returns (uint64 batch)"];
    const iface = new ethers.utils.Interface(abi);
    const data = iface.encodeFunctionData("findBatchContainingBlock", [blockNum]);

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
        const formattedResult = json.result ? ethers.BigNumber.from(json.result).toString() : '0';
        setResult([`Batch Number is: ${formattedResult}`]);
      }
    } catch (error) {
      setResult(['An error occurred: ' + error.message]);
    }
  };

  return (
    <div style={styles.container}>
      <h4 style={styles.header}>Ethereum Call</h4>
      <label style={styles.label}>Block Number</label>
      <input id="blocknum-input" style={styles.input} type="number" value={blockNum} onChange={e => setBlockNum(e.target.value)} />
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
  },
};
