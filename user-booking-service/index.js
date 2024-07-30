require('dotenv').config({ path: './.env' });
const express = require('express');
const connectDB = require('./utils/db');
const logger = require('./utils/logger');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
app.use(express.json());

connectDB();

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/bookings', bookingRoutes);

app.use((err, req, res, next) => {
   logger.error(err.message, { stack: err.stack });
   res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
