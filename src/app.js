const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const authRoutes = require('./routes/authRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const healthRoutes = require('./routes/healthRoutes');

const swaggerDocument = YAML.load('./swagger.yaml');
const app = express();

app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', checkoutRoutes);
app.use('/api', healthRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;
