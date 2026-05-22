import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import errorHandler from './src/middleware/error-handler';
import accountsController from './src/accounts/accounts.controller';
import setupSwagger from './src/_helpers/swagger';

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
    : ['http://localhost:4200'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/accounts', accountsController);

// ─── Swagger Docs ─────────────────────────────────────────────────────────────
setupSwagger(app);

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
const app_start = app.listen(PORT, () => {
    console.log('');
    console.log('═══════════════════════════════════════════');
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 Swagger docs: http://localhost:${PORT}/api-docs`);
    console.log(`❤️  Health check: http://localhost:${PORT}/health`);
    console.log(`🌐 CORS origins: ${allowedOrigins.join(', ')}`);
    console.log('═══════════════════════════════════════════');
});

export default app_start;
