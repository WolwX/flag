// --- 🚩 CONFIGURATION IMPORTANTE (À MODIFIER) ---

// Le code secret pour débloquer le poste (celui que le Flagger va communiquer)
const CODE_SECRET = "RECOMPENSE"; 

// L'URL de votre futur serveur (Backend) qui enregistrera l'événement de Flag
const URL_SERVEUR_LOG = "http://votre-serveur/api/enregistrer_flag"; 

// --- FONCTIONS LOGIQUES ---

function enterFullscreen() {
    /** Tente de mettre la page en plein écran pour maximiser l'effet de blocage **/
    const body = document.getElementById('bodyFlag');
    // Utilise les méthodes standard et préfixées pour une meilleure compatibilité
    if (body.requestFullscreen) {
        body.requestFullscreen();
    } else if (body.mozRequestFullScreen) { /* Firefox */
        body.mozRequestFullScreen();
    } else if (body.webkitRequestFullscreen) { /* Chrome, Safari */
        body.webkitRequestFullscreen();
    } else if (body.msRequestFullscreen) { /* IE/Edge */
        body.msRequestFullscreen();
    }
}

function checkCode() {
    /** Vérifie le code entré par l'utilisateur ciblé **/
    const codeInput = document.getElementById('codeInput');
    const codeEntré = codeInput.value.trim().toUpperCase();

    if (codeEntré === CODE_SECRET) {
        // Code correct : Enregistrement de la faute et déblocage
        enregistrerFlag();
        
        alert("Félicitations ! Code correct. Session débloquée. Pensez à la vigilance !");
        
        // Solution de déblocage : Ferme la fenêtre ou redirige
        if (window.opener) {
            window.close(); // Fonctionne si la page a été ouverte par un script
        } else {
            // Sinon, redirige vers une page blanche ou la page d'accueil de l'entreprise
            window.location.href = "about:blank"; 
        }

    } else {
        // Code incorrect : Affichage d'une fausse alerte pour insister
        alert("❌ Code Invalide. Le poste reste bloqué. Vérifiez le code avec le Flagger.");
        codeInput.value = ''; 
        codeInput.focus();
    }
}

function enregistrerFlag() {
    /** Envoie l'information de faute au serveur (asynchrone) **/
    const data = {
        // Enregistre l'horodatage pour l'heure de la faute
        timestamp: new Date().toISOString(), 
        statut: "FLAGGED_WEB",
        code_secret: CODE_SECRET // Le code utilisé (utile pour l'audit)
    };

    // Utilisation de Fetch API pour envoyer les données au serveur
    fetch(URL_SERVEUR_LOG, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        // Ne rien faire ici, pour ne pas ralentir le déblocage
        console.log('Flag enregistré avec succès.');
    })
    .catch(error => {
        // Ne pas interrompre le processus si le serveur est indisponible
        console.error('Erreur lors de l\'enregistrement du Flag:', error);
    });
}


// --- DÉMARRAGE ET GESTION DES ÉVÉNEMENTS ---

window.onload = function() {
    // 1. Tente de se mettre en plein écran dès le chargement
    enterFullscreen(); 
    
    // 2. Met le curseur directement dans le champ de saisie
    document.getElementById('codeInput').focus();
    
    // 3. Permet de valider en appuyant sur 'Entrée'
    document.getElementById('codeInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkCode();
        }
    });

    // 4. Empêche le clic droit pour éviter l'accès facile aux outils de développement
    document.addEventListener('contextmenu', event => event.preventDefault());
    
    // Rappel de la limite : La touche Échap (Escape) ne peut pas être désactivée de manière fiable dans les navigateurs.
};