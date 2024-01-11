import React, { useState, useEffect } from 'react';
import {
  getChannelBalance,
  getInfo,
  getChannelsList,
  getInvoices,
  getWalletBalance,
  openChannel,
  sendCoins,
} from '.../api/api';

function App() {
  const [channelBalance, setChannelBalance] = useState({
    balance: '0',
    pending_open_balance: '0',
    local_balance: {
      amount: '0',
      milli_sat: '0',
    },
    remote_balance: {
      amount: '0',
      milli_sat: '0',
    },
    unsettled_local_balance: {
      amount: '0',
      milli_sat: '0',
    },
    unsettled_remote_balance: {
      amount: '0',
      milli_sat: '0',
    },
    pending_open_local_balance: {
      amount: '0',
      milli_sat: '0',
    },
    pending_open_remote_balance: {
      amount: '0',
      milli_sat: '0',
    },
  });
  const [info, setInfo] = useState({
    version: '',
    commit_hash: '',
    identity_pubkey: '',
    alias: '',
    color: '',
    num_pending_channels: 0,
    num_active_channels: 0,
    num_inactive_channels: 0,
    num_peers: 0,
    block_height: 0,
    block_hash: '',
    best_header_timestamp: '0',
    synced_to_chain: false,
    synced_to_graph: false,
    testnet: false,
    chains: [],
    uris: [],
    features: {},
    require_htlc_interceptor: false,
    store_final_htlc_resolutions: false,
  });
  const [channelsList, setChannelsList] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [walletBalance, setWalletBalance] = useState({
    total_balance: 0,
    confirmed_balance: 0,
    unconfirmed_balance: 0,
    locked_balance: 0,
    reserved_balance_anchor_chan: 0,
    account_balance: {
      default: {
        confirmed_balance: 0,
        unconfirmed_balance: 0,
      },
    },
  });
  const [openChannelForm, setOpenChannelForm] = useState({
    satPerVbyte: '',
    nodePubkey: '',
    localFundingAmount: '',
    pushSat: '',
  });

  const [sendCoinsForm, setSendCoinsForm] = useState({
    addr: '',
    amount: '',
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchChannelBalance();
        await fetchInfo();
        await fetchChannelsList();
        await fetchInvoices();
        await fetchWalletBalance();
        await performOpenChannel();
        await performSendCoins();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const fetchChannelBalance = async () => {
    try {
      const response = await getChannelBalance();
      setChannelBalance(response);
    } catch (error) {
      console.error('Error fetching channel balance:', error);
    }
  };

  const fetchInfo = async () => {
    try {
      const response = await getInfo();
      setInfo(response);
    } catch (error) {
      console.error('Error fetching node info:', error);
    }
  };

  const fetchChannelsList = async () => {
    try {
      const response = await getChannelsList();
      setChannelsList(response.channels);
    } catch (error) {
      console.error('Error fetching channels list:', error);
    }
  };

  const fetchInvoices = async () => {
    try {
      const response = await getInvoices();
      setInvoices(response.invoices);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const fetchWalletBalance = async () => {
    try {
      const response = await getWalletBalance();
      setWalletBalance(response);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  };

  const performOpenChannel = async () => {
    try {
      const openChannelResponse = await openChannel(openChannelForm);
      console.log('Open Channel Response:', openChannelResponse);
    } catch (error) {
      console.error('Error performing openChannel:', error);
    }
  };

  const performSendCoins = async () => {
    try {
      const sendCoinsResponse = await sendCoins(sendCoinsForm);
      console.log('Send Coins Response:', sendCoinsResponse);
    } catch (error) {
      console.error('Error performing sendCoins:', error);
    }
  };

  const handleOpenChannelChange = (e) => {
    setOpenChannelForm({ ...openChannelForm, [e.target.name]: e.target.value });
  };

  const handleSendCoinsChange = (e) => {
    setSendCoinsForm({ ...sendCoinsForm, [e.target.name]: e.target.value });
  };

  const handleOpenChannelSubmit = (e) => {
    e.preventDefault();
    performOpenChannel();
  };

  const handleSendCoinsSubmit = (e) => {
    e.preventDefault();
    performSendCoins();
  };


  return (
    <div className="App">
      <header className="App-header">
        <h1>LND Node Information</h1>
      </header>
      <div className="App-body">
        <div className="Balance-info">
          <h2>Channel Balance</h2>
          <p>Total: {channelBalance.balance}</p>
          <p>Pending Open: {channelBalance.pending_open_balance}</p>
          <p>Local Balance: {channelBalance.local_balance.amount}</p>

          {info && (
            <div>
              <h2>Node Information</h2>
              <p>Version: {nodeInfo.version}</p>
              <p>Number of pending Channels: {nodeInfo.num_pending_channels}</p>
              <p>Number of active Channels: {nodeInfo.num_active_channels}</p>
              <p>Number of inactive Channels: {nodeInfo.num_inactive_channels}</p>
              <p>Is Synced to chain: {nodeInfo.synced_to_chain}</p>
            </div>
          )}

          {channelsList.length > 0 && (
            <div>
              <h2>Channels List</h2>
              <ul>
                {channelsList.map((channel) => (
                  <li key={channel.channel_id}>
                    <p>Channel Point: {channel.channel_point}</p>
                    <p>Is Active: {channel.active}</p>
                    <p>Capacity: {channel.capacity}</p>
                    <p>Local Balance: {channel.local_balance}</p>
                    <p>Remote Balance: {channel.remote_balance}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {invoices.length > 0 && (
            <div>
              <h2>Invoices</h2>
              <ul>
                {invoices.map((invoice) => (
                  <li key={invoice.invoice_id}>
                    <p>Invoice ID: {invoice.invoice_id}</p>
                    <p>Value: {invoice.value}</p>
                    <p>Creation Date: {invoice.creation_date}</p>
                    <p>Settle Date: {invoice.settle_date}</p>
                    <p>Expiry {invoice.expiry}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <h2>Wallet Balance</h2>
          <p>Total: {walletBalance.total_balance}</p>
          <p>Confirmed: {walletBalance.confirmed_balance}</p>
          <p>Unconfirmed: {walletBalance.unconfirmed_balance}</p>
          <p>Locked: {walletBalance.locked_balance}</p>

          <div>
            <div>
              <h2>Open Channel Form</h2>
              <form onSubmit={handleOpenChannelSubmit}>
                <label>Sat Per Vbyte:</label>
                <input
                  type="text"
                  name="satPerVbyte"
                  value={openChannelForm.satPerVbyte}
                  onChange={handleOpenChannelChange}
                />
                <label>Node Pubkey:</label>
                <input
                  type="text"
                  name="nodePubkey"
                  value={openChannelForm.nodePubkey}
                  onChange={handleOpenChannelChange}
                />
                <label>Local Funding Amount:</label>
                <input
                  type="text"
                  name="localFundingAmount"
                  value={openChannelForm.localFundingAmount}
                  onChange={handleOpenChannelChange}
                />
                <label>Push Sat:</label>
                <input
                  type="text"
                  name="pushSat"
                  value={openChannelForm.pushSat}
                  onChange={handleOpenChannelChange}
                />
                <button type="submit">Open Channel</button>
              </form>
            </div>
            <div>
              <h2>Send Coins Form</h2>
              <form onSubmit={handleSendCoinsSubmit}>
                <label>Address:</label>
                <input
                  type="text"
                  name="addr"
                  value={sendCoinsForm.addr}
                  onChange={handleSendCoinsChange}
                />
                <label>Amount:</label>
                <input
                  type="text"
                  name="amount"
                  value={sendCoinsForm.amount}
                  onChange={handleSendCoinsChange}
                />
                <button type="submit">Send Coins</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}

export default App;
