const path = require('path');
const express=require('express')
const dotenv=require('dotenv')
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');


const cookieParser = require('cookie-parser');

const errorHandler=require('./middleware/error');
const connectDB= require('./config/db');

//Load env vars
dotenv.config({ path: './config/config.env'});

//connect to database
connectDB();

//Route files
const bootcamps= require('./routes/bootcamps');
const courses= require('./routes/courses');
const auth= require('./routes/auth');
const users= require('./routes/users');
const reviews= require('./routes/reviews');


const app=express();
//Body Parser
app.use(express.json());

//Cookie Parser
app.use(cookieParser());

//Afaan logging middleware
if(process.env.NODE_ENV==='development')
{
    app.use(morgan('dev'));
}

// File uploading
app.use(fileupload());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());


  // Prevent http param pollution
  app.use(hpp());

// Enable CORS
app.use(cors());

// set static folder
app.use(express.static(path.join(__dirname, 'public')));



//Mount Routers

app.use('/api/v1/bootcamps',bootcamps)
app.use('/api/v1/courses',courses)
app.use('/api/v1/auth',auth)
app.use('/api/v1/users',users)
app.use('/api/v1/reviews',reviews)


app.use(errorHandler)


const PORT= process.env.PORT || 5000;

const server= app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`) ); 

//Handle Unhandled promise rejection
process.on('unhandledRejection' ,(err,promise) =>{
console.log(`Error :${err.message}`);

//close server and exit process
server.close(() =>process.exit(1))
});
 