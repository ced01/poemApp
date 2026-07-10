const express = require('express');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const POEMS_FILE = path.join(__dirname, 'public', 'data', 'poems.json');
const DEFAULT_IMAGE = 'Image-par-defaut.webp';

app.use(express.json({ limit: '1mb' }));

function formatQuatrain(quatrain) {
  return String(quatrain || '')
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .join('**');
}

function buildPoem({ title, theme, img, quatrains }) {
  const formattedQuatrains = (Array.isArray(quatrains) ? quatrains : [])
    .map(formatQuatrain)
    .filter(Boolean);

  return {
    theme: String(theme || 'Création').trim() || 'Création',
    title: String(title || '').trim(),
    img: String(img || DEFAULT_IMAGE).trim() || DEFAULT_IMAGE,
    content: formattedQuatrains.join('\n\n'),
  };
}

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/data/poems.json', (req, res) => {
  res.sendFile(POEMS_FILE);
});

app.post('/api/poems', async (req, res) => {
  const poem = buildPoem(req.body || {});

  if (!poem.title) {
    return res.status(400).json({ error: 'Le titre du poème est obligatoire.' });
  }

  if (!poem.content) {
    return res.status(400).json({ error: 'Ajoutez au moins un quatrain non vide.' });
  }

  try {
    const data = JSON.parse(await fs.readFile(POEMS_FILE, 'utf8'));
    const poems = Array.isArray(data.poems) ? data.poems : [];
    poems.push(poem);

    await fs.writeFile(
      POEMS_FILE,
      `${JSON.stringify({ ...data, poems }, null, 4)}\n`,
      'utf8'
    );

    return res.status(201).json({ poem });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du poème :', error);
    return res.status(500).json({ error: 'Impossible de sauvegarder le poème.' });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
module.exports.buildPoem = buildPoem;