import React, { CSSProperties } from 'react';

export const GetTransaction = () => {
  class Web2TransactionCheckerClient {
    async getTransaction(hashValue) {
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
              params: [hashValue],
              method: "eth_getTransactionByHash"
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

  const transactionCheckerClient = new Web2TransactionCheckerClient();

  const handleGetTransaction = async () => {
    const hashInput = document.getElementById("hash-input") as HTMLInputElement;
    const hashValue = hashInput.value;
    const transaction = await transactionCheckerClient.getTransaction(hashValue);
    const transactionEl = document.getElementById("transaction");
    transactionEl.textContent = transaction;
  };
  
  return (
    <div style={styles.container}>
      <h4 style={styles.header}>Transaction Checker</h4>
      <label style={styles.label}>Transaction Hash</label>
      <input id="hash-input" style={styles.input} type="text" placeholder="Enter your transaction hash" />
      <button id="check-transaction" style={styles.button} onClick={handleGetTransaction}>Check Transaction</button>
      <pre id='transaction' style={styles.transaction}></pre>
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
  transaction: {
    alignSelf: 'flex-start',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: '#f8f9fa',
    padding: '10px',
    borderRadius: '5px',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    width: '100%',
    marginTop: '10px',
  },
};
