export const dynamic = 'force-dynamic';

const API_URL = process.env.API_URL || 'http://localhost:4000';

async function getData(path) {
  const res = await fetch(`${API_URL}${path}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Erreur API : ${path}`);
  return res.json();
}

export default async function Home() {
  const profile = await getData('/api/profile');
  const projects = await getData('/api/projects');
  const skills = await getData('/api/skills');

  return (
    <main style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'sans-serif', padding: 16 }}>
      <h1>{profile.name}</h1>
      <p>{profile.title}</p>

      <h2>Compétences</h2>
      <ul>
        {skills.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>

      <h2>Projets</h2>
      {projects.map((p) => (
        <div key={p.id}>
          <h3>{p.title}</h3>
          <p>{p.description}</p>
        </div>
      ))}
    </main>
  );
}
