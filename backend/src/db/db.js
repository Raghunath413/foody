const mongoose = require("mongoose");

// Serverless (Vercel) par har request par naya connection na bane,
// isliye ek hi connection promise cache karte hain.
let connectionPromise = null;

function connectDB() {
    if (mongoose.connection.readyState === 1) return Promise.resolve();
    if (!connectionPromise) {
        connectionPromise = mongoose
            .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 })
            .then(() => console.log("MongoDB connected"))
            .catch((err) => {
                connectionPromise = null; // agli request par dobara try
                throw err;
            });
    }
    return connectionPromise;
}

module.exports = connectDB;
