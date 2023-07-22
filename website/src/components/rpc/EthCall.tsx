import React, { CSSProperties, useState } from 'react';

export const EthCall = () => {
  const [result, setResult] = useState<string[]>([]);
  const [showMore, setShowMore] = useState(false);

  class Web3EthCallClient {
    async ethCall(fromAddress, toAddress, data) {
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
            params: [{ from: fromAddress, to: toAddress, data: data }, "latest"],
            method: "eth_call"
          })
        });
        const json = await response.json();
        if (json.error) {
          return 'An error occurred: ' + json.error.message;
        } else {
          return JSON.stringify(json.result, null, 2);
        }
      } catch (error) {
        return 'An error occurred: ' + error.message;
      }
    }
  }

  const callClient = new Web3EthCallClient();

  const handleEthCall = async () => {
    const fromInput = document.getElementById("from-input") as HTMLInputElement;
    const fromAddress = fromInput.value;
    const toInput = document.getElementById("to-input") as HTMLInputElement;
    const toAddress = toInput.value;
    const dataInput = document.getElementById("data-input") as HTMLInputElement;
    const data = dataInput.value;

    const callResult = await callClient.ethCall(fromAddress, toAddress, data);
    setResult(callResult.split('\n'));
  };

  const renderShowMore = () => {
    const maxLines = 7; // change this to show more or less lines
    const displayedResult = showMore ? result.join('\n') : result.slice(0, maxLines).join('\n');

    if (!showMore && result.length > maxLines) {
      return (
        <>
          <pre id='result' style={styles.result}>{displayedResult}</pre>
          <button onClick={() => setShowMore(true)}>Show More</button>
        </>
      )
    }
    return (
      <>
        <pre id='result' style={styles.result}>{displayedResult}</pre>
        <button onClick={() => setShowMore(false)}>Show Less</button>
      </>
    )
  }

  return (
    <div style={styles.container}>
      <h4 style={styles.header}>Eth Call</h4>
      <label style={styles.label}>From Address</label>
      <input id="from-input" style={styles.input} type="text" placeholder="Enter from address" />
      <label style={styles.label}>To Address</label>
      <input id="to-input" style={styles.input} type="text" placeholder="Enter to address" />
      <label style={styles.label}>Data</label>
      <input id="data-input" style={styles.input} type="text" placeholder="Enter data" />
      <button id="call" style={styles.button} onClick={handleEthCall}>Call</button>
      {renderShowMore()}
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
    wordWrap: 'break-word',
    maxWidth: '100%'
  },
};
