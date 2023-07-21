import React, { CSSProperties } from 'react';
import {ethers} from "ethers";
export const BalanceChecker = () => {
  class Web2BalanceCheckerClient {
    async checkBalance(userAddress) {
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
              params: [userAddress, "latest"],
              method: "eth_getBalance"
          })
        });
        const json = await response.json();
        if (json.error) {
          return 'An error occurred: ' + json.error.message;
        } else {
          return 'Balance: ' + ethers.utils.formatUnits(ethers.BigNumber.from(json.result).toString(),18);
        }
      } catch (error) {
        return 'An error occurred: ' + error.message;
      }
    }
  }

  const balanceCheckerClient = new Web2BalanceCheckerClient();

  const handleCheckBalance = async () => {
    const addressInput = document.getElementById("address-input") as HTMLInputElement;
    const address = addressInput.value;
    const balance = await balanceCheckerClient.checkBalance(address);
    const balanceEl = document.getElementById("balance");
    balanceEl.textContent = balance;
  };
  
  
    return (
      <div style={styles.container}>
        <h4 style={styles.header}>Balance Checker</h4>
        <label style={styles.label}>Address</label>
        <input id="address-input" style={styles.input} type="text" placeholder="Enter your address" />
        <button id="check-balance" style={styles.button} onClick={handleCheckBalance}>Check Balance</button>
        <p id='balance' style={styles.balance}></p>
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
    balance: {
      alignSelf: 'flex-start',
      fontSize: '16px',
      fontWeight: 'bold',
    },
  };
  