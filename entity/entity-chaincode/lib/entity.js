'use strict';

const stringify = require("json-stringify-deterministic");
const sortKeysRecursive = require("sort-keys-recursive");
const {Contract} = require("fabric-contract-api");

class Entity extends Contract {
    async VerifyPatient(ctx, publicKey, hashData) {
        // TODO: Sign hashed data
        const chaincodeResponse = await ctx.stub.invokeChaincode("patientCC", ["CreatePatient", publicKey, hashData], "main");
        return chaincodeResponse.payload.toString()
    }


}

module.exports = Entity;