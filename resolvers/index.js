const {mergeResolvers} = require('@graphql-tools/merge');
const {userResolver} = require('./user.resolver');
const {transactionResolver} = require('./transaction.resolver');

const mergedResolvers = mergeResolvers([userResolver, transactionResolver]);
module.exports = {
    mergedResolvers
}