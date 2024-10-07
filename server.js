const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 3000;

// MongoDB connection setup
const url = "mongodb+srv://johnnyhermitano02:o3awZpQZJ5D7YMCr@itso.zngrn.mongodb.net/"; // Replace with your MongoDB connection string
const databaseName = 'itsodb';

app.use(express.static('public')); // Serve static files from 'public' directory

// When a client connects
io.on('connection', (socket) => {
    console.log('A user connected');

    // Fetch data and send it to the connected client
    async function fetchDataAndEmit() {
        try {
            const client = await MongoClient.connect(url);
            const db = client.db(databaseName);
            const students = await db.collection('logs').find({}).toArray();
            socket.emit('updateData', students); // Send the data to the client
        } catch (error) {
            console.error(error);
        }
    }

    // Initial fetch when a client connects
    fetchDataAndEmit();

    // Set an interval to fetch data every 5 seconds
    const intervalId = setInterval(fetchDataAndEmit, 3000);

    // Clear interval when the client disconnects
    socket.on('disconnect', () => {
        console.log('User disconnected');
        clearInterval(intervalId);
    });
});

// Start the server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
