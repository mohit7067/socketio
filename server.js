// server.js

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const http = require('http').createServer(app);


const io = require('socket.io')(http, {
  cors: {
    origin: '*',

  },
});

// Connect to MongoDB
mongoose.connect('mongodb+srv://mohitpatil:moh2000it@cluster0.4ds5naa.mongodb.net/LocationTracker?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create Rider schema
const riderSchema = new mongoose.Schema({
  riderId: { type: String, required: true },
  name:{type: String, required: true},
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
});

// Create Rider model
const Rider = mongoose.model('rider', riderSchema);

// server.js

// ...

// Set up Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Function to fetch and emit rider data from the database
  const fetchAndEmitRiderData = async () => {
    try {
      // Fetch all rider data from the database
      const riders = await Rider.find();
      // Emit the rider data to all connected clients
      io.emit('riderData', riders);
    } catch (error) {
      console.error('Error fetching rider data:', error);
    }
  };

  // Event for a rider updating their location
  socket.on('locationUpdate', async (data) => {
    try {
      const { riderId, latitude, longitude } = data;

      // Update rider's location in the database
      await Rider.findOneAndUpdate({ riderId }, { latitude, longitude });

      // Fetch and emit updated rider data to all connected clients
      fetchAndEmitRiderData();
    } catch (error) {
      console.error('Error updating rider location:', error);
    }
  });

  // Emit the initial rider data when a client connects
  fetchAndEmitRiderData();

  // ...
});

app.get("/",(req,res)=>{
  res.send("homepage")
})



// Start the server
http.listen(9090, () => {
  console.log('Server is running on port 9090');
});




