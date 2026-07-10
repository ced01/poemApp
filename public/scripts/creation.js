document.addEventListener('DOMContentLoaded', function () {
  const quatrainsContainer = document.getElementById('quatrainsContainer');
  const addQuatrainButton = document.getElementById('addQuatrainButton');
  const poemCreationForm = document.getElementById('poemCreationForm');
  const createPoemButton = document.getElementById('createPoemButton');
  const messageElement = document.getElementById('poemCreationMessage');
  let quatrainCount = 1;

  function setMessage(message, type = 'info') {
    if (!messageElement) return;

    messageElement.textContent = message;
    messageElement.className = `mt-2 ${type === 'error' ? 'text-danger' : 'text-success'}`;
  }

  function collectQuatrains() {
    return Array.from(document.getElementsByClassName('quatrain'))
      .map(quatrain => quatrain.value.trim())
      .filter(Boolean);
  }

  function resetForm() {
    poemCreationForm.reset();
    quatrainsContainer.innerHTML = `
      <textarea class="form-control mb-2 quatrain" id="quatrain1" rows="4" placeholder="Écrivez le premier quatrain..."></textarea>
    `;
    quatrainCount = 1;
  }

  addQuatrainButton.addEventListener('click', function () {
    quatrainCount++;
    const newQuatrain = document.createElement('div');
    newQuatrain.classList.add('mb-3');
    newQuatrain.innerHTML = `
      <textarea class="form-control mb-2 quatrain" id="quatrain${quatrainCount}" rows="4" placeholder="Écrivez le quatrain ${quatrainCount}..."></textarea>
    `;
    quatrainsContainer.appendChild(newQuatrain);
  });

  poemCreationForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const title = document.getElementById('poemTitle').value.trim();
    const theme = document.getElementById('poemTheme').value;
    const quatrains = collectQuatrains();

    if (!title) {
      setMessage('Le titre du poème est obligatoire.', 'error');
      return;
    }

    if (quatrains.length === 0) {
      setMessage('Ajoutez au moins un quatrain avant de créer le poème.', 'error');
      return;
    }

    createPoemButton.disabled = true;
    setMessage('Sauvegarde du poème en cours...', 'info');

    try {
      const response = await fetch('/api/poems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, theme, quatrains }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Impossible de sauvegarder le poème.');
      }

      resetForm();
      setMessage('Poème créé et ajouté à public/data/poems.json. Rechargez la page pour le voir dans la liste.');
    } catch (error) {
      setMessage(error.message, 'error');
    } finally {
      createPoemButton.disabled = false;
    }
  });
});
