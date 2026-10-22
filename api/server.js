const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

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

app.listen(PORT, () => console.log(`API démarrée sur le port ${PORT}`));
