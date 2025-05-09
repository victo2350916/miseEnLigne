import express from 'express';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './src/routes/listetache.route.js';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';

const swaggerDocument = JSON.parse(fs.readFileSync('./src/config/documentation.json', 'utf8'));

const swaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Demo API"
};

const app = express();

app.use(cors())

// Code pour le middleware morgan empruté et adapté de https://expressjs.com/en/resources/middleware/morgan.html
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs/access.log'), { flags: 'a' })

app.use(morgan('combined', { skip: (req, res) => res.statusCode < 500, stream: accessLogStream }))
// Fin du code emprunté

app.use(express.json());

app.use("/api", routes);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
})
