var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var passport = require('passport');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
var mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
var ApiRouter = require('./routes/ApiRouter');
const AuthRouter = require('./routes/AuthRouter');
const HandleErrorMiddleware = require('./middlewares/handleError.middleware');

const secret = process.env.SECRET_KEY;

var mongoDBaddress = process.env.DATABASE_ADDRESS;
console.log('Connecting to the database');
mongoose
  .connect(mongoDBaddress, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error) => {
    console.log('Connection ' + error);
    process.exit();
  });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  fileUpload({
    createParentPath: true,
  })
);
app.use(cookieParser(secret));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

const studentFrontendAddress = process.env.STUDENT_FRONTEND_ADDRESS;
const teacherFrontendAddress = process.env.TEACHER_FRONTEND_ADDRESS;
var allowlist = [studentFrontendAddress, teacherFrontendAddress];
var corsOptions = {
  origin: allowlist,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(logger(process.env.NODE_ENV === 'development' ? 'dev' : 'tiny'));

require('./config/passport');
app.use('/api', ApiRouter);
app.use('/auth', AuthRouter);
app.use(HandleErrorMiddleware);

app.use(function (req, res, next) {
  next(createError(404));
});

module.exports = app;
