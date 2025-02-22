const { mergeTypeDefs } = require('@graphql-tools/merge');
const { userTypeDef } = require('./user.typedefs');
const { transactionTypeDef } = require('./transaction.typedefs');

const mergedTypeDefs = mergeTypeDefs([userTypeDef, transactionTypeDef]);

module.exports = { mergedTypeDefs };
