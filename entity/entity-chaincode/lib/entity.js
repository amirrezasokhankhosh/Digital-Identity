'use strict';

const stringify = require("json-stringify-deterministic");
const sortKeysRecursive = require("sort-keys-recursive");
const {Contract} = require("fabric-contract-api");

class Entity extends Contract {

    async EntityExists(ctx, id) {
        const entityBytes = await ctx.stub.getState(id);
        return entityBytes && entityBytes.length > 0;
    }

    async CreateEntity(ctx, id, publicKey) {
        const exists = await this.EntityExists(ctx, id)
        if (exists) {
            throw Error(`An entity already exists with id ${id}.`)
        }

        const entity = {
            id : id,
            publicKey : publicKey
        }

        await ctx.stub.putState(entity.id, Buffer.from(stringify(sortKeysRecursive(entity))));
    }

    async ReadEntity(ctx, id) {
        const entityBytes = await ctx.stub.getState(id);
        if ( !entityBytes || entityBytes.length === 0 ) {
            throw Error(`No entity exists with id ${id}.`);
        }
        return entityBytes.toString();
    }

    async UpdateEntity(ctx, id, publicKey) {
        const exists = await this.EntityExists(ctx, id);
        if (!exists) {
            throw Error(`No entity exists with id ${id}.`);
        }

        const entity = {
            id : id,
            publicKey : publicKey
        }

        await ctx.stub.putState(entity.id, Buffer.from(stringify(sortKeysRecursive(entity))));
    }

    async DeleteEntity(ctx, id) {
        const exists = await this.EntityExists(ctx, id);
        if (!exists) {
            throw Error(`No entity exists with id ${id}.`);
        }
        await ctx.stub.deleteState(id);
    }
}

module.exports = Entity;