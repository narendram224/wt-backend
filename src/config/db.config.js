// Bring Mongoose into the app
import mongoose from 'mongoose';
import { MONGODB_USER_NAME, MONGODB_PASSWORD, MONGODB_URL } from '.';
import consoleLogger from './consoleLogger';
const console = consoleLogger(module);
// Build the connection string
const dbURI = `mongodb+srv://${MONGODB_USER_NAME}:${MONGODB_PASSWORD}@${MONGODB_URL}`;
const dbConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

// Create the database connection
mongoose.connect(dbURI, dbConfig);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    console.info('Mongodb connection established');
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
    console.error(`Mongoose default connection error: ${err}`);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.info('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.info(
            'Mongoose default connection disconnected through app termination'
        );
        process.exit(0);
    });
});

export default mongoose;
