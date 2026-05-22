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
// Supports multiple origins via comma-separated CORS_ORIGIN env var
// e.g. CORS_ORIGIN=https://your-app.netlify.app,http://localhost:4200
const allowedOrigins: string[] = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
    : ['http://localhost:4200'];

app.use(cors({
    origin: (origin, callback) => {
        // allow requests with no origin (e.g. curl, Postman, same-origin)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        console.warn(`⚠️  CORS blocked origin: ${origin}`);
        return callback(new Error(`CORS: origin '${origin}' not allowed`));
    },
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
