const { transactions } = require("../dummyData/data");
const Transaction = require('../models/transaction.model')
const transactionResolver = {
    Query: {
        transactions: async (_, __, context) => {
            try {
                if (!context.getUser()) {
                    throw new Error('Unauthorized');
                }
                const userId = await context.getUser()._id;
                const transactions = await Transaction.find({ userId });
                return transactions;
            } catch (error) {
                console.log(error);
            }
        },
        transaction: async (_, { transactionId }) => {
            try {
                const transaction = await Transaction.findById(transactionId);
                return transaction;
            } catch (error) {
                console.log(error);
            }
        }
    },
    Mutation: {
        createTransaction: async (_, { input }, context) => {
            try {
                const newTransaction = new Transaction({
                    ...input,
                    userId: context.getUser()._id
                })
                await newTransaction.save();
                return newTransaction;
            } catch (error) {
                console.log(error);
            }
        },
        updateTransaction: async (_, { input }) => {
            try {
                const updatedTransaction = await Transaction.findByIdAndUpdate(input.transactionId, input, { new: true });
                return updatedTransaction;
            } catch (error) {
                console.log(error);
            }
        },
        deleteTransaction: async (_, { transactionId }) => {
            try {
                const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
                return deletedTransaction;
            } catch (error) {
                console.log(error);
            }
        }
    }
}

module.exports = {
    transactionResolver
}