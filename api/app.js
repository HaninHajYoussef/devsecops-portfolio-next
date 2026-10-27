const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const { z } = require('zod');
const prisma = require('./db');

const app = express();

// Étape 50 : headers de sécurité (Helmet)
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' }));

const profile = {
  name: 'Hanin Haj Youssef',
  title: 'Étudiante en Master DevOps & Cloud',
  email: 'haninhajyoussef1@gmail.com',
  github: 'https://github.com/HaninHajYoussef',
};

const projects = [
  { id: 1, title: 'Portfolio DevSecOps', description: 'Portfolio Next.js déployé avec Docker et Jenkins' },
  { id: 2, title: 'Pipeline CI/CD', description: 'Pipeline Jenkins : checkout, install, build' },
];

const skills = ['Linux', 'Docker', 'Jenkins', 'Ansible', 'Git', 'Next.js'];

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.get('/api/profile', (req, res) => res.json(profile));
app.get('/api/projects', (req, res) => res.json(projects));
app.get('/api/skills', (req, res) => res.json(skills));

// Étape 51 : rate limiting (5 requêtes par minute et par IP)
const contactLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: Number(process.env.RATE_LIMIT_MAX) || 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Trop de requêtes, réessayez plus tard.' },
});

// Étape 48 : validation stricte avec Zod
const contactSchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(200),
    message: z.string().trim().min(10).max(2000),
  })
  .strict();

// Étape 46 : route POST /api/contact
app.post('/api/contact', contactLimiter, async (req, res) => {
  const result = contactSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: 'Données invalides',
      details: result.error.issues.map((i) => ({
        field: i.path.join('.'),
        message: i.message,
      })),
    });
  }
  const saved = await prisma.contactMessage.create({ data: result.data });
  res.status(201).json({ status: 'ok', message: 'Message reçu', id: saved.id });
});

// Étape 49 : gestion centralisée des erreurs
app.use((req, res) => {
  res.status(404).json({ error: 'Route introuvable' });
});

app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    error: status >= 500 ? 'Erreur interne du serveur' : err.message,
  });
});

module.exports = app;
