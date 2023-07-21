import React, { CSSProperties, useState } from 'react';

export const GetBlockByHash = () => {
  const [details, setDetails] = useState([]);
  const [showMore, setShowMore] = useState(false);

  class Web3BlockClient {
    async getBlockByHash(blockHash, returnFullTransactionObjects) {
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
            params: [blockHash, returnFullTransactionObjects],
            method: "eth_getBlockByHash"
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

  const blockClient = new Web3BlockClient();

  const handleGetBlockByHash = async () => {
    const hashInput = document.getElementById("hash-input") as HTMLInputElement;
    const hash = hashInput.value;
    const returnFullTransactionObjects = (document.getElementById("return-objects-select") as HTMLSelectElement).value === 'true';
    const blockDetails = await blockClient.getBlockByHash(hash, returnFullTransactionObjects);
    setDetails(blockDetails.split('\n'));
  };

  const renderShowMore = () => {
    const maxLines = 8; // change this to show more or less lines
    const displayedDetails = showMore ? details.join('\n') : details.slice(0, maxLines).join('\n');

    if (!showMore && details.length > maxLines) {
      return (
        <>
          <pre id='details' style={styles.details}>{displayedDetails}</pre>
          <button onClick={() => setShowMore(true)}>Show More</button>
        </>
      )
    }
    return (
      <>
        <pre id='details' style={styles.details}>{displayedDetails}</pre>
        <button onClick={() => setShowMore(false)}>Show Less</button>
      </>
    )
  }

  return (
    <div style={styles.container}>
      <h4 style={styles.header}>Block Details</h4>
      <label style={styles.label}>Block Hash</label>
      <input id="hash-input" style={styles.input} type="text" placeholder="Enter block hash" />
      <label style={styles.label}>Return Full Transaction Objects</label>
      <select id="return-objects-select" style={styles.select}>
        <option value="false">False</option>
        <option value="true">True</option>
      </select>
      <button id="get-details" style={styles.button} onClick={handleGetBlockByHash}>Get Block Details</button>
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
  select: {
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '100%',
    boxSizing: 'border-box',
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
  details: {
    alignSelf: 'flex-start',
    fontSize: '16px',
    fontWeight: 'bold',
    whiteSpace: 'pre-wrap', // This allows the text to wrap to next line
    wordBreak: 'break-all', // This breaks the word at the end of the line
  },
};
