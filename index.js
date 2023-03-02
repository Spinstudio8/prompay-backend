require('dotenv').config();
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const express = require('express');
const timeout = require('connect-timeout');
const { mongodb } = require('./db');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');
const rootRoute = require('./routes/root');
const questionRoutes = require('./routes/question');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const assessmentRoutes = require('./routes/assessment');
const withdrawalRoutes = require('./routes/withdrawal');
const adminRoutes = require('./routes/admin');
const subjectRoutes = require('./routes/subject');

// THE APP
const app = express();
const server = http.createServer(app);

// Set the timeout to 5 minutes
// server.timeout = 300000;

if (!process.env.JWT_SECRET) {
  throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
}

app.use(timeout('300s'));

// Cross Origin Resource Sharing
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      process.env.CLIENT_URL_2,
      process.env.CLIENT_URL_3,
      process.env.SERVER_URL,
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  })
);

// 'https://www.theprompay.com',
// 'https://theprompay.com',
// 'https://prompay.vercel.app',
// 'http://localhost:3000',

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: true }));

// built-in middleware for json
app.use(express.json({ limit: '100mb' }));
// app.use(cookieParser());

//Routes
app.use('/', rootRoute);
app.use('/api/questions', questionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/subjects', subjectRoutes);

//Error Handler
app.use(errorHandler);
app.use(notFound);

// Helmet for security purposes. Compression for efficiency
app.use(helmet());
app.use(
  compression({
    level: 6,
    threshold: 0,
  })
);

// connect to mongodb database
mongodb();

const port = process.env.PORT || 6001;
server.listen(port, () => console.log(`Listening on port ${port}...`));
