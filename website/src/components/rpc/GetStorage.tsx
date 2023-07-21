import React, { CSSProperties } from 'react';

export const GetStorage = () => {
  class Web2ValueCheckerClient {
    async getStorage(contractAddress, storageSlot) {
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
              params: [contractAddress, storageSlot,"latest"],
              method: "eth_getStorageAt"
          })
        });
        const json = await response.json();
        if (json.error) {
          return 'An error occurred: ' + json.error.message;
        } else {
          return json.result;
        }
      } catch (error) {
        return 'An error occurred: ' + error.message;
      }
    }
  }

  const valueCheckerClient = new Web2ValueCheckerClient();

  const handleGetStorage = async () => {
    const addressInput = document.getElementById("address-input") as HTMLInputElement;
    const address = addressInput.value;
    
    const storageSlotInput = document.getElementById("storage-slot-input") as HTMLInputElement;
    const storageSlot = storageSlotInput.value;
    
    const value = await valueCheckerClient.getStorage(address, storageSlot);
    const valueEl = document.getElementById("value");
    valueEl.textContent = value;
  };
  
  return (
    <div style={styles.container}>
      <h4 style={styles.header}>Value Checker</h4>
      <label style={styles.label}>Address</label>
      <input id="address-input" style={styles.input} type="text" placeholder="Enter your address" />
      <label style={styles.label}>Storage Slot</label>
      <input id="storage-slot-input" style={styles.input} type="text" placeholder="Enter storage slot" />
      <button id="check-value" style={styles.button} onClick={handleGetStorage}>Check Value</button>
      <pre id='value' style={styles.value}></pre>
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
  value: {
    alignSelf: 'flex-start',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: '#f8f9fa',
    padding: '10px',
    borderRadius: '5px',
    whiteSpace: 'pre-wrap', // This line wraps the text in <pre> tag
    wordWrap: 'break-word', // Break the word in case of long text
    width: '100%',
    marginTop: '10px',
  },
};
