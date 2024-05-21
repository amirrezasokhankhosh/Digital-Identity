'use strict';

const { TextDecoder } = require("util");

class EntityApp {

    constructor() {
        this.utf8Decoder = new TextDecoder();
    }
    async createEntity(contract, id, publicKey) {
        try {
            await (await contract).submitTransaction("CreateEntity", id, publicKey);
            return "Entity was successfully created.";
        } catch (error) {
            console.log(error)
            return error;
        }
    }

    async readEntity(contract, id, publicKey) {
        try {
            const entityBytes = await (await contract).evaluateTransaction("ReadEntity", id);
            const entityString = this.utf8Decoder.decode(entityBytes);
            return JSON.parse(entityString);
        } catch (error) {
            console.log(error)
            return error;
        }
    }

    async updateEntity(contract, id, publicKey) {
        try {
            await (await contract).submitTransaction("UpdateEntity", id, publicKey);
            return "Entity was successfully updated..";
        } catch (error) {
            console.log(error)
            return error;
        }
    }

    async deleteEntity(contract, id, publicKey) {
        try {
            await (await contract).submitTransaction("DeleteEntity", id);
            return "Entity was successfully deleted.";
        } catch (error) {
            console.log(error)
            return error;
        }
    }
}

module.exports = {
    EntityApp
}
