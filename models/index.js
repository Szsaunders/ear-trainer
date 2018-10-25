//Connect to Mongo database
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

//our local database url
//mongoDB port
const uri = process.env.MONGODB_URI || 'mongodb://localhost/scores' 


mongoose.connect(uri).then(
    () => { 
        /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ 
        console.log('Connected to Mongo');
        
    },
    err => {
         /** handle initial connection error */ 
         console.log('error connecting to Mongo: ')
         console.log(err);
         
        }
  );


module.exports = mongoose.connection