const http = require ('http');
const app = require('./app')

const productRoutes = require('./api/routes/products')

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port);