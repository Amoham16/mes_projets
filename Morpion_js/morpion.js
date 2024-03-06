// -------- MISE EN PLACE DU JEU -----------

// Initialisation de la grille avec des valeurs par défaut
let grille = Array(9).fill(-1);
let jeuFini = false;

// Définition des joueurs 
let joueurActuel = "player"; 
let joueurPlayer = 1;
let joueurIA = 0;

// Définition des combinaisons gagnantes possibles
const victoire = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

// Initialisation des scores
let playerScore = 0;
let iaScore = 0;
let matchNuls = 0;

// Fonction pour vérifier la victoire
function Victoire(joueur) {
  for (const ligne of victoire) {
    const [a, b, c] = ligne;
      if (grille[a] === grille[b] && grille[b] === grille[c] && grille[c] === joueur) {
        return true;
      }
    }
  return false;
}

// Fonction pour réinitialiser le jeu
function replay() {
  grille.fill(-1);
  joueurActuel = "player";
  jeuFini = false;
  $('.case').removeClass("player ia");
}

// -------- HUMAIN QUI JOUE -----------

// Fonction pour jouer un coup du joueur humain
function jouerCoup(empl) {
  // Vérifiez si le jeu n'est pas terminé, l'emplacement est libre et c'est le tour du joueur
  if (!jeuFini && grille[empl] === -1 && joueurActuel === "player") {
    grille[empl] = joueurPlayer;
    $(`#${empl}`).addClass("player");
    // Vérifiez s'il y a une victoire après avoir joué un coup
    if (Victoire(joueurPlayer)) {
      setTimeout(function () {
        alert("Le joueur "+ joueurPlayer +" a gagne !");
        playerScore++;
        jeuFini = true;
        replay();
      }, 500); // Ajoutez un délai avant l'alerte

    } else if (grille.indexOf(-1) === -1) {
       // Si la grille est pleine et aucun joueur n'a gagné, c'est un match nul
      setTimeout(function () {
        matchNuls ++;
        alert("Match nul !");
        jeuFini = true;
        replay();
      }, 500); // Ajoutez un délai avant l'alerte

    } else {
      // Passez au tour de l'IA
      joueurActuel = "ia";
      setTimeout(jouerCoupIA, 500);
    }
  }
}

// -------- IA QUI JOUE -----------

// Fonction pour jouer un coup de l'IA
function jouerCoupIA() {
  if (!jeuFini && joueurActuel === "ia") {
    // Vérifiez si le jeu n'est pas terminé et c'est le tour de l'IA
    const caseLibre = grille.findIndex((caseVide) => caseVide === -1);
    if (caseLibre !== -1) {
      let Coup = -Infinity;
      let coupIndex = -1;

      // Utilisation de l'algorithme Minimax pour l'IA
      for (let i = 0; i < grille.length; i++) {
        if (grille[i] === -1) {
          grille[i] = joueurIA;
          let coup = minmax(0, false);
          grille[i] = -1 ;
          if (coup > Coup) {
            Coup = coup;
            coupIndex = i;
          }
        }
      }
      // Jouez le meilleur coup trouvé par l'IA
      grille[coupIndex] = joueurIA;
      $(`#${coupIndex}`).addClass("ia");

      // Vérifiez s'il y a une victoire après le coup de l'IA
      if (Victoire(joueurIA)) {
        setTimeout(function () {
          alert("Le joueur "+ joueurIA +" a gagne !");
          iaScore++;
          jeuFini = true;
          replay();
        }, 500);
      } else if (grille.indexOf(-1) === -1) {
        // Si la grille est pleine et aucun joueur n'a gagné, c'est un match nul
        setTimeout(function () {
          matchNuls ++;
          alert("Match nul !");
          jeuFini = true;
          replay();
        }, 500);
      } else {
        // Passez au tour du joueur humain
        joueurActuel = "player";
      }
    }
  }
}

// Fonction pour évaluer le score du morpion
function scoreMorpion() {
  if (Victoire(joueurIA)) {
    return 10; // L'IA gagne
  } else if (Victoire(joueurPlayer)) {
    return -10; // Le joueur humain gagne
  } else {
    return 0; // Match nul
  }
}

// Algorithme Minimax pour l'IA
function minmax(coup, maximiser) {
  const score = scoreMorpion();
  if (score === 10) {
    return score - coup;
  }
  if (score === -10) {
    return score + coup;
  }
  if (grille.indexOf(-1) === -1) {
    return 0; // Match nul
  }

  // Si c'est le tour de l'IA (maximiser=true)
  if (maximiser) {
    let Score = -Infinity;
    // Parcourir toutes les cases disponibles de la grille
    for (let i = 0; i < 9; i++) {
      if (grille[i] === -1) {
        // Essayer la case avec le symbole de l'IA
        grille[i] = joueurIA;
        // Appeler récursivement la fonction minimax pour la prochaine position
        Score = Math.max(Score, minmax(coup + 1, false));
        // Annuler le coup pour revenir à l'état précédent de la grille
        grille[i] = -1;
      }
    }
    // Retourner le meilleur score trouvé pour l'IA
    return Score;
  } else {
    // Si c'est le tour du joueur humain (maximiser=false)
    let Score = Infinity;
    for (let i = 0; i < 9; i++) {
      if (grille[i] === -1) {
        grille[i] = joueurPlayer;
        Score = Math.min(Score, minmax(coup + 1, true)); //
        grille[i] = -1;
      }
    }
    return Score;
  }
}

// -------- AFFICHAGE  -----------

// Gestionnaire d'événements pour le bouton "IA First"
$('#iaFirst').click(function () {
  const FirstPlayer = "ia";
  replay();

  // Si l'IA commence alors jouer son premier coup
  joueurActuel = FirstPlayer; 
  if (FirstPlayer === "ia") {
    jouerCoupIA();
  }
});

// Gestionnaire d'événement pour les cases du morpion
$('.case').click(function () {
  jouerCoup(this.id);
});

// Gestionnaire d'événement pour le bouton "Replay"
$('#replay').click(function () {
  // Réinitialiser le jeu et les scores
  replay();
  playerScore = 0;
  iaScore = 0;
  matchNuls = 0;
});

replay();

// Démarrer la partie avec l'IA si je click sur "IA First"
if (joueurActuel === "ia") {
  jouerCoupIA();
}

// Gestionnaire d'événement pour le bouton "Other views"
$('#style').click(function () {
  if ($("#replay").css("background-color") === 'rgb(180, 101, 111)'){
  $("#replay").css("background-color","#177E89");
  $("#iaFirst").css("background-color","#70C1B3");
  $("body").css("background-color","#084C61");
  $("h1").css("color","#177E89");
  $("#style").css("text-align","center");
  }
  else {
    $("#replay").css("background-color","#B4656F");
    $("#iaFirst").css("background-color","#CE2D4F");
    $("body").css("background-color","#FFD9DA");
    $("h1").css("color","#B4656F");

  }

});
