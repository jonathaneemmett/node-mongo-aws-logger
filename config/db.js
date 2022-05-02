const mongoose = require('mongoose');

const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (err) {
        // write this to a file in an s3 bucket, but for now.
        console.log(`Error: ${err.message}`);
        process.exit(1);
    }
}

module.exports = { dbConnect }