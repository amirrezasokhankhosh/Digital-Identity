'use strict';

const { TextDecoder } = require("util");

class IdentityApp {

    constructor() {
        this.utf8Decoder = new TextDecoder();
    }
    async createIdentity(contract, id, publicKey) {
        try {
            await (await contract).submitTransaction("CreateIdentity", id, publicKey);
            return "Identity was successfully created.";
        } catch (error) {
            console.log(error)
            return error;
        }
    }

    async readIdentity(contract, id, publicKey) {
        try {
            const identityBytes = await (await contract).evaluateTransaction("ReadIdentity", id);
            const identityString = this.utf8Decoder.decode(identityBytes);
            return JSON.parse(identityString);
        } catch (error) {
            console.log(error)
            return error;
        }
    }

    async updateIdentity(contract, id, publicKey) {
        try {
            await (await contract).submitTransaction("UpdateIdentity", id, publicKey);
            return "Identity was successfully updated.";
        } catch (error) {
            console.log(error)
            return error;
        }
    }

    async deleteIdentity(contract, id, publicKey) {
        try {
            await (await contract).submitTransaction("DeleteIdentity", id);
            return "Identity was successfully deleted.";
        } catch (error) {
            console.log(error)
            return error;
        }
    }
}

module.exports = {
    IdentityApp
}
