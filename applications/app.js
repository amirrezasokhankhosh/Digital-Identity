'use strict';

const { IdentityApp } = require("../identity/identity-application/identityApp");
const identityApp = new IdentityApp();

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const jsonParser = bodyParser.json();
const port = 3000;

const crypto = require("crypto");
const grpc = require("@grpc/grpc-js");
const {connect, Contract, Identity, Signer, signers} = require("@hyperledger/fabric-gateway");
const fs = require("fs/promises");
const path = require("path");

const mspId = "Org1MSP";

const cryptoPath = path.resolve(__dirname, '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com');
const keyDirPath = path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'keystore');
const certPath = path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'signcerts', 'User1@org1.example.com-cert.pem');
const tlsCertPath = path.resolve(cryptoPath, 'peers', 'peer0.org1.example.com', 'tls', 'ca.crt');

const peerEndPoint = "localhost:7051";
const peerHostAlias = "peer0.org1.example.com";

const contractIdentity = InitConnection("identity", "identityCC");

const axios = require("axios");

async function newGrpcConnection() {
    const tlsRootCert = await fs.readFile(tlsCertPath);
    const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
    return new grpc.Client(peerEndPoint, tlsCredentials, {
        'grpc.ssl_target_name_override': peerHostAlias,
        'grpc.max_send_message_length' : 100 * 1024 * 1024,
        'grpc.max_receive_message_length' : 100 * 1024 * 1024
    });
}

async function newIdentity() {
    const credentials = await fs.readFile(certPath);
    return { mspId, credentials };
}

async function newSigner() {
    const files = await fs.readdir(keyDirPath);
    const keyPath = path.resolve(keyDirPath, files[0]);
    const privateKeyPem = await fs.readFile(keyPath);
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    return signers.newPrivateKeySigner(privateKey);
}

async function InitConnection(channelName, chaincodeName) {
    /*
    * Returns a contract for a given channel and chaincode.
    * */
    const client = await newGrpcConnection();

    const gateway = connect({
        client,
        identity: await newIdentity(),
        signer: await newSigner(),
        // Default timeouts for different gRPC calls
        evaluateOptions: () => {
            return { deadline: Date.now() + 500000 }; // 5 seconds
        },
        endorseOptions: () => {
            return { deadline: Date.now() + 1500000 }; // 15 seconds
        },
        submitOptions: () => {
            return { deadline: Date.now() + 500000 }; // 5 seconds
        },
        commitStatusOptions: () => {
            return { deadline: Date.now() + 6000000 }; // 1 minute
        },
    });

    const network = gateway.getNetwork(channelName);

    return network.getContract(chaincodeName);
}

app.get('/', (req, res) => {
    res.send("Hello World!");
});

app.post('/api/identity', jsonParser, async (req, res) => {
    const message = await identityApp.createIdentity(contractIdentity, req.body.id, req.body.publicKey);
    res.send(message);
})

app.get('/api/identity', jsonParser, async (req, res) => {
    const identity = await identityApp.readIdentity(contractIdentity, req.body.id);
    res.send(identity);
});

app.put('/api/identity', jsonParser, async (req, res) => {
    const message = await identityApp.updateIdentity(contractIdentity, req.body.id, req.body.publicKey);
    res.send(message);
})

app.delete('/api/identity', jsonParser, async (req, res) => {
    const message = await identityApp.deleteIdentity(contractIdentity, req.body.id);
    res.send(message);
})

app.listen(port, () => {
    console.log(`Server is listening on localhost:${port}.\n`);
});