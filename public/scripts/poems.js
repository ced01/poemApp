function hideElement(element) {
    // Ajouter la classe pour démarrer la transition
    element.classList.add('hide');
  
    // Attendre que la transition se termine avant de cacher complètement (display: none)
    setTimeout(() => {
      element.style.display = 'none'; // Appliquer display: none après l'animation
    }, 100); // Correspond au temps de transition défini dans le CSS
  }
  
function showElement(element) {
    // Réinitialiser display: none si nécessaire
    element.style.display = '';
  
    // Forcer un reflow pour redémarrer les transitions CSS
    void element.offsetWidth;
  
    // Retirer la classe qui masque l'élément
    element.classList.remove('hide');
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function findClosestImage(element) {
    // Vérifier si l'élément lui-même contient une image
    if (element.tagName === 'IMG' && element.src) {
        return element; // L'image est trouvée
    }

    // Recherche ascendante dans le DOM (parents)
    let parent = element.parentElement;
    while (parent) {
        const imageInParent = parent.querySelector('img');
        if (imageInParent && imageInParent.src) {
            return imageInParent; // Image trouvée dans un parent
        }
        parent = parent.parentElement;
    }

    // Recherche descendante dans le DOM (enfants)
    const imageInChildren = element.querySelector('img');
    if (imageInChildren && imageInChildren.src) {
        return imageInChildren; // Image trouvée dans les enfants
    }

    // Aucun résultat trouvé
    return null;
}

// Générer dynamiquement les positions basées sur la taille du conteneur
function generatePositions(container, rows, cols) {
    
    const positions = [];
    const bubbleSize = 85; // Taille approximative de la bulle
    const padding = 20; // Espace entre les bulles et les bords

    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    const xSpacing = (containerWidth - 2 * padding) / cols; // Espacement horizontal
    const ySpacing = (containerHeight - 2 * padding) / rows; // Espacement vertical

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = padding + col * xSpacing;
            const y = padding + row * ySpacing;

            // Assurez-vous que la bulle ne dépasse pas les limites du conteneur
            if (x + bubbleSize <= containerWidth && y + bubbleSize <= containerHeight) {
                positions.push({ x, y });
            }
        }
    }
    return positions;
}

document.addEventListener('DOMContentLoaded', () => {

    setTimeout(() => {
        const wordMapContainer = document.getElementById('wordMapContainer');
        wordMapContainer.classList.add('animate');
      }, 500); 

    // Ajouter la classe "loaded" au body pour activer les animations
    document.body.classList.add("loaded");

    const dailyQuotes = [
        { text: "La poésie est le miroir brouillé de l'âme.", author: "Paul Éluard" },
        { text: "Écrire, c'est graver des rêves dans l'éphémère.", author: "Victor Hugo" },
        { text: "Chaque mot est une lumière dans l'obscurité.", author: "Charles Baudelaire" },
        { text: "Le silence est parfois la plus belle des poésies.", author: "André Gide" },
        { text: "Les mots sont des fenêtres ouvertes sur l'infini.", author: "Rainer Maria Rilke" },
        { text: "Le poème est l'écho d'une mélodie perdue.", author: "Stéphane Mallarmé" },
        { text: "L'écriture libère l'âme emprisonnée par le temps.", author: "Jean Cocteau" },
        { text: "Un poème commence toujours par un frisson.", author: "Jules Renard" },
        { text: "Les rêves écrits deviennent des réalités éternelles.", author: "Anna de Noailles" },
        { text: "Le vrai poète est un homme de lumière dans un monde d'ombres.", author: "Apollinaire" },
        { text: "La poésie est cette alchimie qui transforme le banal en sublime.", author: "René Char" },
        { text: "Chaque vers est un pas vers l'éternité.", author: "Paul Valéry" },
        { text: "Les mots, ces gouttes d’étoiles tombées de la nuit.", author: "Alphonse de Lamartine" },
        { text: "Un poème est un univers contenu dans une goutte d’encre.", author: "Marguerite Yourcenar" },
        { text: "La poésie est une émotion mise en mots.", author: "Emily Dickinson" }
    ];

    let searchDone = false;

    const randomQuote = dailyQuotes[Math.floor(Math.random() * dailyQuotes.length)];

    const quoteElement = document.getElementById('daily-quote');

    quoteElement.innerHTML = `"${randomQuote.text}" - ${randomQuote.author}`;

    // Ajouter les nouveau poem depuis /data/poems.json

    fetch('/data/poems.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
        }
        return response.json();
    })
    .then(data => {

        const slideWrapper = document.querySelector(".swiper-wrapper");
        
        data.poems.forEach(poem => {

            // append option in poemList
            let allOptions = document.querySelectorAll("li[class='sidebar-title-link']");
            let poemList = document.querySelector("#poemList");
            let li = document.createElement("li");

            li.classList.add("sidebar-title-link");
            li.setAttribute("selected", "false");
            li.setAttribute("data-index", parseInt( allOptions.length != 0 ?  allOptions[allOptions.length - 1].getAttribute("data-index") : 0) + 1) ;
            li.setAttribute("data-theme", poem.theme );
            li.innerHTML = (poem.title == undefined || poem.title == "") ? "Pas de titre" : poem.title;
            
            poemList.append(li);


            let poemImg = document.createElement("img");
            let slide = document.createElement("div");
            let poemeContainer = document.createElement("div");
            let slideHeader = document.createElement("h2");
            let poemTextEl = document.createElement("div");
            
            poemTextEl.classList.add("poem-text");
            poemeContainer.classList.add("poem-container")
            slideHeader.innerText = (poem.title == undefined || poem.title == "") ? "Pas de titre" : poem.title;
            console.log(poem.img == undefined);
            poemImg.src = "img/" +  ((poem.img == undefined || poem.img == "") ? "Image-par-defaut.webp" : poem.img);
            poemImg.loading = "lazy";
            poemImg.classList.add("poem-image");
            slide.classList.add("swiper-slide");
           
            poemTextEl.appendChild(slideHeader);

            let paragraphes = poem.content != undefined ? poem.content.split("\n\n") : [];

            paragraphes.forEach(paragraphe => {
                let paragrapheElement = document.createElement("p");
                paragrapheElement.classList.add("poem-line");
                paragrapheElement.innerHTML = paragraphe.replaceAll("**", "<br>");
                poemTextEl.appendChild(paragrapheElement);
            });

            poemeContainer.appendChild(poemImg);
            poemeContainer.appendChild(poemTextEl);
            slide.appendChild(poemeContainer);
            
            slideWrapper.append(slide);

        });

        // Initialisation du Swiper
        const swiper = new Swiper('.swiper-container', {
            effect: 'coverflow',
            coverflowEffect: {
                rotate: 80,
                stretch: 0,
                depth: 300,
                modifier: 1,
                slideShadows: false,
            },
            speed: 1000,
            slidesPerView: 1,
            centeredSlides: true,
            breakpoints: { // Configuration spécifique aux tailles d'écran
                768: {
                    slidesPerView: 1,
                    spaceBetween: 1500,
                },
                1024: {
                    slidesPerView: 1,
                    spaceBetween: 1500,
                },
            },
            on: {
                slideChangeTransitionStart: () => {
                    const slides = document.querySelectorAll('.swiper-slide');
                    slides.forEach((slide) => {
                        slide.style.transform = 'translateX(50px)'; // Réinitialise la position
                    });
                },
                slideChangeTransitionEnd: () => {
                    const activeSlide = document.querySelector('.swiper-slide-active');
                    activeSlide.style.transform = 'translateX(0)'; // Position finale
                    activeSlide.style.transition = 'opacity 0.5s ease, transform 0.5s ease'; // Animation fluide
                },
            }, 
        });
    
    swiper.on('slideChange', () => {
        // Récupérer l'index actuel du slide
        const currentIndex = swiper.activeIndex;
        
        // Trouver tous les éléments de la sidebar
        const sidebarItems = document.querySelectorAll('.sidebar-title-link');
        
        // Réinitialiser toutes les classes de sélection
        sidebarItems.forEach((item) => {
            item.classList.remove('sidebar-title-selected');
            item.setAttribute('selected', 'false');
        });
        
        // Ajouter la classe sélectionnée à l'élément correspondant
        const selectedItem = sidebarItems[currentIndex];
        if (selectedItem) {
            selectedItem.classList.add('sidebar-title-selected');
            selectedItem.setAttribute('selected', 'true');
        
            // Optionnel : défiler jusqu'à l'élément actif
            selectedItem.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    });

    const wordMapContainer = document.getElementById('wordMapContainer');
    // Liste de mots-clés
    const keywords = ['Amour', 'Nature', 'Rêves', 'Mémoire', 'Horizon', 'Silence', 'Temps', 'Espoir', 'Psyché', "Création", "Science"];
    const positions = generatePositions(wordMapContainer, 3, 4);

    // Vérifier que nous avons assez de positions pour le nombre de bulles
    if (positions.length < keywords.length) {
        console.log(positions);
        console.warn("Pas assez de positions définies pour toutes les bulles !");
    }

    // Fonction pour activer une boucle visuelle entre les bulles chevauchées
    function handleBubbles() {

        // Générer les bulles de mots-clés
        keywords.forEach((word, index) => {
            const bubble = document.createElement('div');
            const span = document.createElement('span');
            bubble.classList.add('word-bubble');
            span.innerText = word;
            bubble.appendChild(span);
            bubble.setAttribute("theme", word );
            
            if(positions.length != 0){
                 // Assigner une position prédéfinie (ou répéter les positions si trop de bulles)
                const position = positions[index % positions.length];
                bubble.style.left = `${position.x}px`;
                bubble.style.top = `${position.y}px`;
        
                // Ajouter un événement clic pour afficher les poèmes associés
                bubble.addEventListener('click', (event) => {
                    event.stopPropagation();
                    const bubbles = document.querySelectorAll(".word-bubble");
                    bubbles.forEach(bubble => bubble.classList.remove("selected-theme"));
            
                    bubble.classList.add("selected-theme");
            
                    // Réinitialiser tous les titres
                    sidebarTitles.forEach(item => {
                        item.classList.remove('sidebar-title-selected');
                        item.setAttribute('selected', 'false');
                    });
            
                    // On trouve tous les poèmes liés au thème choisi
                    const selectedOptions = document.querySelectorAll(`li[data-theme="${word}"]`);
                    const randIndex = getRandomInt(0, selectedOptions.length - 1);
                    const dataIndex = selectedOptions[randIndex].getAttribute("data-index");
            
                    selectedOptions[randIndex].setAttribute("selected", true);
                    selectedOptions[randIndex].classList.add("sidebar-title-selected");
                    selectedOptions[randIndex].scrollIntoView({
                        behavior: 'smooth', // Défilement fluide
                        block: 'center', // Centrer le poème dans la vue
                    });
            
                    document.querySelector("main").scrollTo({
                        top: 0,
                        behavior: 'smooth', // Défilement fluide
                    });
            
                    setTimeout(function () {
                        swiper.slideTo(dataIndex, 500);
                    }, 1000);
                });
        
            wordMapContainer.appendChild(bubble);
            }
        });
    }
    
        handleBubbles();
    

        // Éléments interactifs
        const mainContainer = document.getElementsByClassName("main-container")[0];
        const toggleButton = document.getElementById('burger-menu');
        const sidebar = document.getElementById('sidebar');
        const searchTitleInput = document.getElementById('searchTitleInput');
        const searchPoemInput = document.getElementById('searchPoemInput');
        const poemList = document.getElementById('poemList');
        const poems = poemList.querySelectorAll('li');
        const sidebarTitles = document.querySelectorAll('.sidebar-title-link');
        const modal = document.getElementById('modal');
        const modalText = document.getElementById('modal-text');
        const modalClose = document.getElementById('modal-close');
        const poemContainers = document.querySelectorAll('.poem-container');
        const clearTitleButton = document.getElementById('clear-title-button');
        const clearPoemButton = document.getElementById('clear-poem-button');
        const modalContent = document.querySelector('.modal-content');
        const poemLines = document.querySelectorAll('.poem-line');



        // Affiche ou masque la croix en fonction du contenu de l'input
        searchTitleInput.addEventListener('input', () => {
            if (searchTitleInput.value.trim() !== '') {
                clearTitleButton.style.display = 'inline';
            } else {
                clearTitleButton.style.display = 'none';
            }
        });

        // Affiche ou masque la croix en fonction du contenu de l'input
        searchPoemInput.addEventListener('input', () => {
            if (searchPoemInput.value.trim() !== '') {
                clearPoemButton.style.display = 'inline';
            } else {
                clearPoemButton.style.display = 'none';
            }
        });

        // Efface le contenu de l'input au clic sur la croix
        clearTitleButton.addEventListener('click', () => {
            searchTitleInput.value = '';
            clearTitleButton.style.display = 'none';
            searchTitleInput.focus(); // Replace le focus dans l'input
            let query = searchTitleInput.value.toLowerCase();
            poems.forEach(poem => {
                poem.style.display = poem.textContent.toLowerCase().includes(query) ? '' : 'none';
            });
            let selectedPoem = document.querySelector("li[selected=true]");
            
            if(selectedPoem != null){
                selectedPoem.scrollIntoView({
                    behavior: 'smooth', // Défilement fluide
                    block: 'center', // Centrer le poème dans la vue
                });
            }

            showElement(document.getElementById('randomPoemButton'));
            document.getElementById("searchPoemInput").removeAttribute("disabled");

        });

        clearPoemButton.addEventListener('click', () => {
            searchPoemInput.value = '';
            clearPoemButton.style.display = 'none';
            searchPoemInput.focus(); // Replace le focus dans l'input
            let query = searchPoemInput.value.toLowerCase();
            poems.forEach(poem => {
                poem.style.display = poem.textContent.toLowerCase().includes(query) ? '' : 'none';
            });
            let selectedPoem = document.querySelector("li[selected=true]");
            
            if(selectedPoem != null){
                selectedPoem.scrollIntoView({
                    behavior: 'smooth', // Défilement fluide
                    block: 'center', // Centrer le poème dans la vue
                });
            }

            showElement(document.getElementById('randomPoemButton'));
            document.getElementById("searchTitleInput").removeAttribute("disabled");

        });


        const burgerBtn = document.getElementById('burger-btn');
    
        burgerBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            burgerBtn.classList.toggle('active');
        });

        mainContainer.addEventListener('click', () => {
            if( sidebar.classList.contains("active")){
                sidebar.classList.toggle('active');
                burgerBtn.classList.toggle('active');
            }
        });

        // Fonction de recherche dans la barre latérale
        searchTitleInput.addEventListener('input', (event) => {

            document.getElementById("searchPoemInput").value = "";
            document.getElementById("searchPoemInput").setAttribute("disabled",true);

            const query = event.target.value.toLowerCase();

            poems.forEach(poem => {
                poem.style.display = poem.textContent.toLowerCase().includes(query) ? '' : 'none';
            });

            let selectedPoem = document.querySelector("li[selected=true]");

            if( selectedPoem != null ){
                selectedPoem.scrollIntoView({
                    behavior: 'smooth', // Défilement fluide
                    block: 'center', // Centrer le poème dans la vue
                });
            }
        
            if( query == "" ){
                document.getElementById("searchPoemInput").removeAttribute("disabled");
                showElement(document.getElementById('randomPoemButton'));
                showElement(document.getElementsByClassName("choose-theme")[0]);
            }else {
                hideElement(document.getElementById('randomPoemButton'));
                hideElement(document.getElementsByClassName("choose-theme")[0]);
            }


        });

        searchPoemInput.addEventListener('input', (event) => {

            document.getElementById("searchTitleInput").value = "";
            document.getElementById("searchTitleInput").setAttribute("disabled",true);
            
            const query = event.target.value.toLowerCase();
            let foundSlides = new Set();

            poemLines.forEach(poemLine => {
                if(poemLine.textContent.toLowerCase().includes(query)){
                    //recupère l'index du slide ou le poemLine se situe
                    const slide = poemLine.closest('.swiper-slide'); // Modifier selon votre structure HTML
                    if (slide) {
                        const index = Array.from(slide.parentNode.children).indexOf(slide); // Trouver l'index du slide
                        foundSlides.add(index); // Ajouter l'index trouvé dans le Set
                    }

                }
            });
            
            poems.forEach(poem => {
                const poemIndex = parseInt(poem.getAttribute("data-index")); // Obtenir l'index du poème
                poem.style.display = foundSlides.has(poemIndex) ? '' : 'none'; // Afficher ou masquer en fonction des slides trouvés
            });

            if(query == ""){
                document.getElementById("searchTitleInput").removeAttribute("disabled");
                showElement(document.getElementById('randomPoemButton'));
                showElement(document.getElementsByClassName("choose-theme")[0]);
            }else {
                hideElement(document.getElementById('randomPoemButton'));
                hideElement(document.getElementsByClassName("choose-theme")[0]);
            }
            
        });

        // Gestion des titres sélectionnés dans la barre latérale
        sidebarTitles.forEach(title => {
            title.addEventListener('click', () => {
                // Réinitialiser tous les titres
                sidebarTitles.forEach(item => {
                    item.classList.remove('sidebar-title-selected');
                    item.setAttribute('selected', 'false');
                });

                // Ajouter la classe sélectionnée au titre cliqué
                title.classList.add('sidebar-title-selected');
                title.setAttribute('selected', 'true');
            });
        });

        // Navigation vers un slide en cliquant sur un poème
        poems.forEach(poem => {
            poem.addEventListener('click', () => {
                const index = parseInt(poem.getAttribute('data-index'), 10);
                const theme = poem.getAttribute('data-theme');
                const themes = [...document.getElementsByClassName("word-bubble")];
                
                themes.forEach(theme => {
                    theme.classList.remove("selected-theme");
                });

                if(document.querySelector("div[theme="+theme+"]") !== null){
                    document.querySelector("div[theme="+theme+"]").classList.add("selected-theme");
                }
            
                swiper.slideTo(index, 500); // Aller au slide avec une transition
            });
        });

        // Navigation aléatoire
        document.getElementById('randomPoemButton').addEventListener('click', () => {
            
            let randIndex = getRandomInt(0,parseInt(poems[poems.length-1].getAttribute("data-index")));
            let theme = "";
            swiper.slideTo(randIndex, 500);

            sidebarTitles.forEach(item => {
                item.classList.remove('sidebar-title-selected');
                item.setAttribute('selected', 'false');
            });

            // Ajouter la classe sélectionnée au titre cliqué
            poems[randIndex].classList.add('sidebar-title-selected');
            poems[randIndex].setAttribute('selected', 'true');
            poems[randIndex].style.display = '';

            theme = poems[randIndex].getAttribute("data-theme");

            const themes = [...document.getElementsByClassName("word-bubble")];
                
            themes.forEach(theme => {
                theme.classList.remove("selected-theme");
            });

            if(document.querySelector("div[theme="+theme+"]") !== null){
                document.querySelector("div[theme="+theme+"]").classList.add("selected-theme");
            }

                // Défilement fluide vers le poème sélectionné
            poems[randIndex].scrollIntoView({
                behavior: 'smooth', // Défilement fluide
                block: 'center', // Centrer le poème dans la vue
            });

            document.querySelector("main").scrollTo({
                top: 0,
                behavior: 'smooth' // Défilement fluide
            });
        });

        // Gestion de la modale
        poemContainers.forEach(container => {
            container.addEventListener('click', (event) => {
                const html = container.querySelector('.poem-text').innerHTML;
                modalText.innerHTML = html;

                let title = modalText.querySelector('h2');
                const closestImage = findClosestImage(event.target);
                const imgSrc = closestImage.src;


                document.getElementsByClassName("modal")[0].style.backgroundImage = "url("+imgSrc+")";

                modal.classList.add('show');

                // Sélectionnez tous les éléments de classe "poem-line"
                const lines = modalText.querySelectorAll('.poem-line');

                title.style.fontFamily = "Dancing Script, cursive";
                title.style.fontSize = "2rem";
                
                // Ajouter un effet de survol
                title.addEventListener('mouseover', () => {
                    title.style.color = '#8B5E3C'; // Change la couleur
                    title.style.transition = 'transform 0.3s ease, color 0.3s ease'; // Ajoute une transition
                });

                // Retirer l'effet lorsque la souris quitte
                title.addEventListener('mouseout', () => {
                    title.style.color = ''; // Restaure la couleur initiale
                });

                lines.forEach(line => {
                    line.style.fontFamily = "Dancing Script, cursive";
                    line.style.fontWeight = 300;
                    line.style.fontSize = "1.3rem";
                });

                // Timeline GSAP pour animer les lignes une par une
                const timeline = gsap.timeline({ delay: 0.8 });// Ajout d'un délai initial
                
                timeline.fromTo(
                    modalText.querySelector('h2'),
                    { opacity: 0, y: -20 },
                    { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
                );

                // Ajouter chaque ligne avec un effet de fondu
                lines.forEach((line, index) => {
                    timeline.fromTo(
                        line, // Élément à animer
                        { opacity: 0, y: 5 }, // État initial (transparent, décalé vers le bas)
                        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, // État final
                        index * 4 // Délai relatif entre chaque animation
                    );
                });
            });
        });

        const playBtn = document.querySelector('.play-btn');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const progressBar = document.querySelector('.progress');
        const trackTitle = document.querySelector('.track-title');
        const audioPlayer = document.getElementById('audio-player');

        playBtn.textContent = '\u23ef';
        prevBtn.textContent ='\u23ee';
        nextBtn.textContent = '\u23ed';

        // Liste des pistes (titre, artiste, chemin du fichier)
        const tracks = [
            { title: "ADN Binaire", src: "ADN Binaire.mp3" },
            { title: "Au Coeur des Tempêtes", src: "Au Coeur des Tempêtes.mp3" },
            { title: "Au-delà des Frontières", src: "Au-delà des Frontières (Remastered).mp3" },
            { title: "Bleu Étranger", src: "Bleu Étranger.mp3" },
            { title: "Ce Rire, Cette Relique Enfouie", src: "Ce Rire, Cette Relique Enfouie.mp3" },
            { title: "Dans l'espoir de l'oubli feint", src: "Dans l'espoir de l'oubli feint.mp3" },
            { title: "Dessine moi un rêve", src: "Dessine moi un rêve.mp3" },
            { title: "Destructeur", src: "Destructeur.mp3" },
            { title: "Étoiles et Rêves", src: "Étoiles et Rêves.mp3" },
            { title: "Évasion", src: "Évasion.mp3" },
            { title: "Honte à qui choisit cette voie", src: "Honte à qui choisit cette voie.mp3" },
            { title: "L'Esprit Pervers", src: "L'Esprit Pervers.mp3" },
            { title: "L'Éternité Infinie", src: "L'éternité Infinie.mp3" },
            { title: "L'innocence retrouvée", src: "L'innocence retrouvée.mp3" },
            { title: "La Gravité des Révolutions", src: "La Gravité des Révolutions.mp3" },
            { title: "La Neige et Ses Flocons", src: "La Neige et Ses Flocons.mp3" },
            { title: "La Quête de Simplicité", src: "La Quête de Simplicité.mp3" },
            { title: "Les Rêves d'Autrefois", src: "Les Rêves d'Autrefois.mp3" },
            { title: "Libération de l'étau", src: "Libération de l'étau.mp3" },
            { title: "Lueur de ton Visage", src: "Lueur de ton Visage.mp3" },
            { title: "Mes attentes d'automne", src: "Mes attentes d'automne.mp3" },
            { title: "Nos Moments Perdus", src: "Nos Moments Perdus.mp3" },
            { title: "Perdus ou Retrouvés", src: "Perdus ou Retrouvés.mp3" },
            { title: "Plume du Souvenir", src: "Plume du Souvenir.mp3" },
            { title: "Renaissance", src: "Renaissance.mp3" },
            { title: "Renaître", src: "Renaître.mp3" },
            { title: "Singularité", src: "Singularité.mp3" },
            { title: "Sous l'éclat des sentiments", src: "Sous l'éclat des sentiments.mp3" },
            { title: "Sous le Joug de Mon Esprit", src: "Sous le Joug de Mon Esprit.mp3" },
            { title: "Souvenirs Doux", src: "Souvenirs Doux.mp3" },
            { title: "Traversant Prière et Poussière", src: "Traversant Prière et Poussière.mp3" },
            { title: "Trouve-Moi", src: "Trouve-Moi.mp3" },
            { title: "Un Amour Suspendu", src: "Un Amour Suspendu.mp3" },
            { title: "Un Univers Sensuel", src: "Un Univers Sensuel.mp3" },
            { title: "Voix de Nuit", src: "Voix de Nuit.mp3" }
        ];
        

        let currentTrackIndex = 0;

        // Charger la première piste au démarrage
        function loadTrack(index) {
            const track = tracks[index];
            trackTitle.textContent = track.title;
            audioPlayer.src = "track/"+ track.src;
        }

        // Lecture ou pause
        function togglePlay() {
            if (audioPlayer.paused) {
                audioPlayer.play();
                playBtn.textContent = '\u23f8'; // Affiche le bouton pause
            } else {
                audioPlayer.pause();
                playBtn.textContent = '\u23ef'; // Affiche le bouton play
            }
        }

        // Passer à la piste suivante
        function playNextTrack() {
            currentTrackIndex = (currentTrackIndex + 1) % tracks.length; // Retour à 0 après la dernière piste
            loadTrack(currentTrackIndex);
            audioPlayer.play();
            playBtn.textContent = '\u23f8'; // Affiche le bouton pause
        }

        // Revenir à la piste précédente
        function playPrevTrack() {
            currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length; // Aller à la dernière piste si on recule depuis la première
            loadTrack(currentTrackIndex);
            audioPlayer.play();
            playBtn.textContent = '\u23f8'; // Affiche le bouton pause
        }

        // Mettre à jour la barre de progression
        function updateProgress() {
            const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressBar.style.width = `${progressPercent}%`;
        }

        // Sauter à un point spécifique dans la piste
        function setProgress(event) {
            const progressContainer = document.querySelector('.progress-bar');
            const clickX = event.offsetX;
            const width = progressContainer.offsetWidth;
            const newTime = (clickX / width) * audioPlayer.duration;
            audioPlayer.currentTime = newTime;
        }

        // Ajouter des événements
        playBtn.addEventListener('click', togglePlay);
        nextBtn.addEventListener('click', playNextTrack);
        prevBtn.addEventListener('click', playPrevTrack);
        audioPlayer.addEventListener('timeupdate', updateProgress);
        audioPlayer.addEventListener('ended', playNextTrack);

        // Rendre la barre de progression interactive
        document.querySelector('.progress-bar').addEventListener('click', setProgress);

        // Charger la première piste
        loadTrack(currentTrackIndex);


        // Fermer la modale
        modalClose.addEventListener('click', () => {
            modal.classList.remove('show');
        });

        modal.addEventListener('click', (event) => {
            if (!modalContent.contains(event.target)) {
                modal.classList.remove('show');
            }
        });

    })
    .catch(error => {
        console.error('Erreur lors du chargement des données JSON :', error);
    });
    
});
