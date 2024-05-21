'use strict';

const stringify = require("json-stringify-deterministic");
const sortKeysRecursive = require("sort-keys-recursive");
const {Contract} = require("fabric-contract-api");

class Identity extends Contract {

    async IdentityExists(ctx, id) {
        const identityBytes = await ctx.stub.getState(id);
        return identityBytes && identityBytes.length > 0;
    }

    async CreateIdentity(ctx, id, publicKey) {
        const exists = await this.IdentityExists(ctx, id)
        if (exists) {
            throw Error(`An identity already exists with id ${id}.`)
        }

        const identity = {
            id : id,
            publicKey : publicKey
        }

        await ctx.stub.putState(identity.id, Buffer.from(stringify(sortKeysRecursive(identity))));
    }

    async ReadIdentity(ctx, id) {
        const identityBytes = await ctx.stub.getState(id);
        if ( !identityBytes || identityBytes.length === 0 ) {
            throw Error(`No identity exists with id ${id}.`);
        }
        return identityBytes.toString();
    }

    async UpdateIdentity(ctx, id, publicKey) {
        const exists = await this.IdentityExists(ctx, id);
        if (!exists) {
            throw Error(`No identity exists with id ${id}.`);
        }

        const identity = {
            id : id,
            publicKey : publicKey
        }

        await ctx.stub.putState(identity.id, Buffer.from(stringify(sortKeysRecursive(identity))));
    }

    async DeleteIdentity(ctx, id) {
        const exists = await this.IdentityExists(ctx, id);
        if (!exists) {
            throw Error(`No identity exists with id ${id}.`);
        }
        await ctx.stub.deleteState(id);
    }
}

module.exports = Identity;