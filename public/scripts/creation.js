document.addEventListener('DOMContentLoaded', function () {
    const quatrainsContainer = document.getElementById('quatrainsContainer');
    const addQuatrainButton = document.getElementById('addQuatrainButton');
    let quatrainCount = 1;

    addQuatrainButton.addEventListener('click', function () {
      quatrainCount++;
      const newQuatrain = document.createElement('div');
      newQuatrain.classList.add('mb-3');
      newQuatrain.innerHTML = `
        <textarea class="form-control mb-2 quatrain" id="quatrain${quatrainCount}" rows="4" placeholder="Écrivez le quatrain ${quatrainCount}..."></textarea>
      `;
      quatrainsContainer.appendChild(newQuatrain);
    });

    document.getElementById('poemCreationForm').addEventListener('submit', function (e) {
      e.preventDefault();
      const title = document.getElementById("poemTitle").value;
      const quatrains = document.getElementsByClassName("quatrain");
      const arrQuatrin = [];

      Array.from(quatrains).forEach(quatrin => {
        arrQuatrin.push(quatrin.value);
      });

      console.log(arrQuatrin);
      
      console.log(quatrains);
      // For the purpose of this implementation, we will refresh the page
      //window.location.reload();
    });
});

