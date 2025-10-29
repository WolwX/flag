// --- 🚩 CONFIGURATION IMPORTANTE (À MODIFIER) ---

// L'URL de votre futur serveur (Backend) qui enregistrera l'événement de Flag
const URL_SERVEUR_LOG = "http://votre-serveur/api/enregistrer_flag"; 

// --- VARIABLES GLOBALES ---

let expectedCode = "RECOMPENSE"; // Code par défaut si l'URL ne fournit pas de code
let flaggerName = "Un Collègue Vigilant"; // Nom par défaut

// --- FONCTIONS LOGIQUES ---

function getUrlParameters() {
    /** Récupère les paramètres de l'URL et met à jour le contenu/code secret **/
    const urlParams = new URLSearchParams(window.location.search);
    
    // 1. Définition du Code Secret
    if (urlParams.has('code')) {
        expectedCode = urlParams.get('code').trim().toUpperCase();
    }
    
    // 2. Définition du Nom du Flagger (pour le message de reward)
    if (urlParams.has('flagger')) {
        flaggerName = urlParams.get('flagger').trim();
    }
    
    // 3. Mise à jour du Message personnalisé (si un message est fourni)
    const customMessageElement = document.getElementById('custom-message');
    if (urlParams.has('msg') && customMessageElement) {
        // Décodage pour gérer les espaces (%20)
        const msg = decodeURIComponent(urlParams.get('msg')); 
        customMessageElement.innerHTML = msg;
    }
}


function enterFullscreen() {
    /** Tente de mettre la page en plein écran pour maximiser l'effet de blocage **/
    const body = document.getElementById('bodyFlag');
    // Tente de mettre en plein écran avec les différentes méthodes de navigateur
    if (body.requestFullscreen) {
        body.requestFullscreen();
    } else if (body.mozRequestFullScreen) {
        body.mozRequestFullScreen();
    } else if (body.webkitRequestFullscreen) { 
        body.webkitRequestFullscreen();
    } else if (body.msRequestFullscreen) { 
        body.msRequestFullscreen();
    }
}


function checkCode() {
    /** Vérifie le code entré par l'utilisateur ciblé **/
    const codeInput = document.getElementById('codeInput');
    const codeEntré = codeInput.value.trim().toUpperCase();

    // Utilise expectedCode qui a été mis à jour par les paramètres d'URL
    if (codeEntré === expectedCode) { 
        // Code correct : Déblocage (la fonction d'enregistrement est ignorée en local)
        // enregistrerFlag(true, flaggerName); // Ligne commentée pour le test local
        
        alert(`Félicitations ! Code correct. Le Flagger (${flaggerName}) mérite son reward ! Session débloquée.`);
        
        // Fermeture de l'onglet ou redirection
        if (window.opener) {
            window.close();
        } else {
            window.location.href = "about:blank"; 
        }

    } else {
        // Code incorrect : Fausse alerte pour insister.
        alert("❌ Code Invalide. Contactez l'administrateur du Flag.");
        codeInput.value = ''; 
        codeInput.focus();
    }
}

// Fonction d'enregistrement commentée pour le test local.
/*
function enregistrerFlag(success, flagger) {
    // Envoie l'information de faute au serveur (asynchrone)
    const data = {
        timestamp: new Date().toISOString(), 
        statut: success ? "FLAGGED_SUCCESS" : "FLAGGED_FAILED",
        code_secret: expectedCode,
        flagger_name: flagger,
    };

    fetch(URL_SERVEUR_LOG, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        console.log('Flag enregistré avec succès.');
    })
    .catch(error => {
        console.error('Erreur lors de l\'enregistrement du Flag:', error);
    });
}
*/


// --- DÉMARRAGE ET GESTION DES ÉVÉNEMENTS ---

window.onload = function() {
    getUrlParameters(); // Récupère les paramètres de l'URL
    enterFullscreen(); 
    document.getElementById('codeInput').focus();
    
    // Permet de valider en appuyant sur 'Entrée'
    document.getElementById('codeInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkCode();
        }
    });

    // Empêche le clic droit pour éviter l'accès facile aux outils de développement
    document.addEventListener('contextmenu', event => event.preventDefault());
};