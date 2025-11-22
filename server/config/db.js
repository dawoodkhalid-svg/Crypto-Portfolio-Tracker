const mongoose = require('mongoose'); //Import Mongoose library

module.exports = () => { // Export a function to connect to MongoDB
 
  mongoose.connect(process.env.MONGO_URI, { // MongoDB connection options
    useNewUrlParser: true, //Updated option name
    useUnifiedTopology: true //Updated option name
  })
  
  .then(() => console.log('MongoDB Connected!')) //Successful connection
  
  .catch((err) => console.log('MongoDB ERROR: ', err)); //Catch connection error
};