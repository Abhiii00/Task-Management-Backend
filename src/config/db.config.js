const mongoose = require('mongoose');
const config = require('./config');


exports.dbConnection = async () => {
    try {
        await mongoose.connect(config.DB_STRING, {
            useNewUrlParser: true,      
            useUnifiedTopology: true    
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};
