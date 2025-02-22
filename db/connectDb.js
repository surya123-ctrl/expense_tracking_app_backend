const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log('Mongo DB connected: ', connection.connection.host);
    }
    catch (error) {
        console.log("Error in connecting to Mongo DB: ", error.message);
        process.exit(1);
    }
}

module.exports = {
    connectDb
}