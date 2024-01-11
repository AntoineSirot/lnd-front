const fs = require('fs');
const request = require('request');
const axios = require('axios');
const https = require('https');

const tlsPath = "YOUR TLS CERT PATH";
const macaroonPath = "YOUR ADMIN MACAROON PATH";

let tlsCert;
let macaroon;

try {
    tlsCert = fs.readFileSync(tlsPath);
    macaroon = fs.readFileSync(macaroonPath).toString('hex');
} catch (err) {
    console.error(`Error with admin.macaroon or tls.cert : ${err.message}`);
    throw err;
}

const apiUrl = 'https://localhost:8080';

const axiosInstance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
        ca: tlsCert,
    }),
});

const getChannelBalance = (req, res) => {
    axiosInstance.get(`${apiUrl}/v1/balance/channels`, {
        headers: {
            'Grpc-Metadata-macaroon': macaroon,
        },
    })
        .then(response => {
            res.status(200).json(response.data);
            // output:
            //  {
            //    "balance": <string>, // <int64> 
            //    "pending_open_balance": <string>, // <int64> 
            //    "local_balance": <object>, // <Amount> 
            //    "remote_balance": <object>, // <Amount> 
            //    "unsettled_local_balance": <object>, // <Amount> 
            //    "unsettled_remote_balance": <object>, // <Amount> 
            //    "pending_open_local_balance": <object>, // <Amount> 
            //    "pending_open_remote_balance": <object>, // <Amount> 
            //  }
        })
        .catch(error => {
            res.status(500).json({ message: error.message });
        });
};

const getInfo = (req, res) => {
    axiosInstance.get(`${apiUrl}/v1/getinfo`, {
        headers: {
            'Grpc-Metadata-macaroon': macaroon,
        },
    })
        .then(response => {
            res.status(200).json(response.data);
            // output:
            //  {
            //    "version": <string>, // <string> 
            //    "commit_hash": <string>, // <string> 
            //    "identity_pubkey": <string>, // <string> 
            //    "alias": <string>, // <string> 
            //    "color": <string>, // <string> 
            //    "num_pending_channels": <integer>, // <uint32> 
            //    "num_active_channels": <integer>, // <uint32> 
            //    "num_inactive_channels": <integer>, // <uint32> 
            //    "num_peers": <integer>, // <uint32> 
            //    "block_height": <integer>, // <uint32> 
            //    "block_hash": <string>, // <string> 
            //    "best_header_timestamp": <string>, // <int64> 
            //    "synced_to_chain": <boolean>, // <bool> 
            //    "synced_to_graph": <boolean>, // <bool> 
            //    "testnet": <boolean>, // <bool> 
            //    "chains": <array>, // <Chain> 
            //    "uris": <array>, // <string> 
            //    "features": <object>, // <FeaturesEntry> 
            //    "require_htlc_interceptor": <boolean>, // <bool> 
            //    "store_final_htlc_resolutions": <boolean>, // <bool> 
            //  }
        })
        .catch(error => {
            res.status(500).json({ message: error.message });
        });
};

const getChannelsList = (req, res) => {
    axiosInstance.get(`${apiUrl}/v1/channels`, {
        headers: {
            'Grpc-Metadata-macaroon': macaroon,
        },
    })
        .then(response => {
            res.status(200).json(response.data);
            // output:
            //  {
            //    "channels": <array>, // <Channel> 
            //  }
        })
        .catch(error => {
            res.status(500).json({ message: error.message });
        });
};


const getInvoices = (req, res) => {
    axiosInstance.get(`${apiUrl}/v1/invoices`, {
        headers: {
            'Grpc-Metadata-macaroon': macaroon,
        },
    })
        .then(response => {
            res.status(200).json(response.data);
            // output:
            //  {
            //    "invoices": <array>, // <Invoice>   
            //  }
        })
        .catch(error => {
            res.status(500).json({ message: error.message });
        });
};

const getWalletBalance = (req, res) => {
    axiosInstance.get(`${apiUrl}/v1/balance/blockchain`, {
        headers: {
            'Grpc-Metadata-macaroon': macaroon,
        },
    })
        .then(response => {
            res.status(200).json(response.data);
            // output:
            //  {
            //    "total_balance": <string>, // <int64> 
            //    "confirmed_balance": <string>, // <int64> 
            //    "unconfirmed_balance": <string>, // <int64> 
            //    "locked_balance": <string>, // <int64> 
            //    "reserved_balance_anchor_chan": <string>, // <int64> 
            //    "account_balance": <object>, // <AccountBalanceEntry> 
            //  }
        })
        .catch(error => {
            res.status(500).json({ message: error.message });
        });
};

function openChannel(requestBody) {
    const options = {
        url: `https://${apiUrl}/v1/channels/stream`,
        rejectUnauthorized: false,
        json: true,
        headers: {
            'Grpc-Metadata-macaroon': macaroon,
        },
        form: JSON.stringify(requestBody),
    };

    return new Promise((resolve, reject) => {
        request.post(options, function (error, response, body) {
            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        });
    });
}

function sendCoins(requestBody) {
    const options = {
        url: `https://${apiUrl}/v1/transactions`,
        rejectUnauthorized: false,
        json: true,
        headers: {
            'Grpc-Metadata-macaroon': macaroon,
        },
        form: JSON.stringify(requestBody),
    };

    return new Promise((resolve, reject) => {
        request.post(options, function (error, response, body) {
            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        });
    });
}

module.exports = { getChannelBalance, getInfo, getChannelsList, getInvoices, getWalletBalance, openChannel, sendCoins };
