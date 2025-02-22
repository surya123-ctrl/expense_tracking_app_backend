const { transactions } = require("../dummyData/data");

const transactionResolver = {
    Query: {
        transactions: () => {
            return transactions;
        }
    }
    // Mutation: {}
}

module.exports = {
    transactionResolver
}