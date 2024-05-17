'use strict';

const stringify = require('json-stringify-deterministic');
const sortKeysRecursive = require('sort-keys-recursive');
const { Contract } = require("fabric-contract-api");

class Patient extends Contract {

    async PatientExists(ctx, publicKey) {
        const patientBinary = await ctx.stub.getState(publicKey);
        return patientBinary & patientBinary.length > 0;
    }

    async CreatePatient(ctx, publicKey, dataHash) {
        const patientExists = await this.PatientExists(ctx, publicKey);
        if (patientExists) {
            throw Error(`A Patient with public key ${publicKey} already exists.`);
        }

        const patient = {
            publicKey : publicKey,
            dataHash : dataHash
        }
        await ctx.stub.putState(publicKey, Buffer.from(stringify(sortKeysRecursive(patient))));
        return patient.toString();
    }


}

module.exports = Patient;