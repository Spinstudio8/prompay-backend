require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const express = require('express');
const { mongodb } = require('./db');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');
const rootRoute = require('./routes/root');
const questionRoutes = require('./routes/question');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const assessmentRoutes = require('./routes/assessment');
const withdrawalRoutes = require('./routes/withdrawal');
const adminRoutes = require('./routes/admin');

const app = express();

if (!process.env.JWT_SECRET) {
  throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
}

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: true }));

// built-in middleware for json
app.use(express.json({ limit: '50mb' }));
// app.use(cookieParser());

// Cross Origin Resource Sharing
app.use(
  cors({
    origin: [process.env.CLIENT_URL, process.env.SERVER_URL],
  })
);

//Routes
app.use('/', rootRoute);
app.use('/api/questions', questionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api/admin', adminRoutes);

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

// connect to mongodb
mongodb();

const port = process.env.PORT || 6001;
app.listen(port, () => console.log(`Listening on port ${port}...`));
