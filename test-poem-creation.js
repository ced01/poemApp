const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');
const test = require('node:test');

const app = require('./app');

const poemsPath = path.join(__dirname, 'public', 'data', 'poems.json');

function request(server, method, route, body) {
  const address = server.address();
  const payload = body ? JSON.stringify(body) : '';

  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: '127.0.0.1',
      port: address.port,
      path: route,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    }, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: data ? JSON.parse(data) : null,
        });
      });
    });

    req.on('error', reject);
    req.end(payload);
  });
}

test('POST /api/poems ajoute un poème au format attendu dans poems.json', async (t) => {
  const originalContent = await fs.readFile(poemsPath, 'utf8');
  t.after(async () => {
    await fs.writeFile(poemsPath, originalContent);
  });

  const server = app.listen(0);
  t.after(() => new Promise(resolve => server.close(resolve)));

  const response = await request(server, 'POST', '/api/poems', {
    title: 'Poème de test',
    theme: 'Création',
    quatrains: [
      'Vers un\nVers deux\nVers trois\nVers quatre',
      'Vers cinq\nVers six\nVers sept\nVers huit',
    ],
  });

  assert.equal(response.statusCode, 201);
  assert.equal(response.body.poem.title, 'Poème de test');
  assert.equal(response.body.poem.theme, 'Création');
  assert.equal(response.body.poem.img, 'Image-par-defaut.webp');
  assert.equal(
    response.body.poem.content,
    'Vers un**Vers deux**Vers trois**Vers quatre\n\nVers cinq**Vers six**Vers sept**Vers huit'
  );

  const poemsFile = JSON.parse(await fs.readFile(poemsPath, 'utf8'));
  const savedPoem = poemsFile.poems.at(-1);
  assert.deepEqual(savedPoem, response.body.poem);
});
