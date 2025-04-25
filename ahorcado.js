// Lista de jugadores de fútbol para adivinar
const jugadores = [
    "MESSI", "NEYMAR", "RONALDO", "MBAPPE", "HAALAND", "VINICIUS", "MODRIC", "KROOS", "BENZEMA", "LEWANDOWSKI",
    "DEMBELE", "GRIEZMANN", "SUAREZ", "DYBALA", "DE BRUYNE", "SALAH", "MANE", "COURTOIS", "ALISSON", "DONNARUMMA",
    "HAZARD", "FODEN", "MOUNT", "SANCHO", "MAGUIRE", "VAN DIJK", "VARANE", "RAMOS", "PIQUE", "CHIELLINI",
    "BUFFON", "OBLAK", "LUKAKU", "MARTINEZ", "ICARDI", "CAVANI", "DI MARIA", "ALEXIS", "VIDAL", "JAMES",
    "RAFINHA", "CASEMIRO", "MILITAO", "RODRYGO", "ANTONY", "RICHARLISON", "FERNANDES", "RONALDINHO", "KAKA", "ZIDANE",
    "XAVI", "INIESTA", "PIRLO", "TOTTI", "DEL PIERO", "IBRAHIMOVIC", "ROONEY", "BECKHAM", "GERRARD", "LAMPARD",
    "HENRY", "BERGKAMP", "ZLATAN", "KLOSE", "LAHM", "SCHWEINSTEIGER", "MULLER", "NEUER", "REUS", "GORETZKA",
    "MBOMA", "ETOO", "YAYA", "TOURE", "ESSIEN", "MAKELELE", "SEEDORF", "CRESPO", "BATISTUTA", "RIQUELME",
    "AGUERO", "MASCHERANO", "OTAMENDI", "PEPE", "CANCELO", "RUBEN DIAS", "JOAO FELIX", "PEDRI", "GAVI", "ANSU FATI",
    "FERNANDEZ", "MAC ALLISTER", "ENZO", "GARNACHO", "BALDE", "CAMAVINGA", "TCHOUAMENI", "VALVERDE", "DARWIN", "BELLINGHAM"
  ];

  // Variables globales del juego
  let palabraSecreta = "";
  let palabraMostrada = [];
  let letrasUsadas = [];
  let intentos = 6;
  let juegoTerminado = false;

  // Elementos del DOM
  const palabraElement = document.getElementById("palabra");
  const letrasUsadasElement = document.getElementById("letrasUsadas");
  const estadoElement = document.getElementById("estadoJuego");
  const nuevaPartidaBtn = document.getElementById("nuevaPartida");
  const tecladoElement = document.getElementById("teclado");
  const ahorcadoPartes = document.querySelectorAll(".ahorcado-parte");

  // Inicializar teclado
  const letras = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
  for (let letra of letras) {
    const boton = document.createElement("button");
    boton.textContent = letra;
    boton.setAttribute("data-letra", letra);
    tecladoElement.appendChild(boton);
  }

  // Inicializar juego
  iniciarJuego();

  // Event Listeners
  nuevaPartidaBtn.addEventListener("click", iniciarJuego);

  // Manejar clics en el teclado virtual
  tecladoElement.addEventListener("click", function(event) {
    if (event.target.tagName === "BUTTON" && !juegoTerminado) {
      const letra = event.target.getAttribute("data-letra");
      if (!letrasUsadas.includes(letra)) {
        procesarLetra(letra);
        event.target.disabled = true;
      }
    }
  });

  // También permitir uso del teclado físico
  document.addEventListener("keydown", function(event) {
    if (juegoTerminado) return;
    
    const letra = event.key.toUpperCase();
    if (!letra.match(/^[A-ZÑ]$/) || letrasUsadas.includes(letra)) return;
    
    procesarLetra(letra);
    
    // Desactivar la tecla virtual correspondiente
    const teclaVirtual = document.querySelector(`button[data-letra="${letra}"]`);
    if (teclaVirtual) {
      teclaVirtual.disabled = true;
    }
  });

  // Función para iniciar nuevo juego
  function iniciarJuego() {
    // Seleccionar palabra aleatoria
    palabraSecreta = jugadores[Math.floor(Math.random() * jugadores.length)];
    palabraMostrada = Array(palabraSecreta.length).fill("_");
    letrasUsadas = [];
    intentos = 6;
    juegoTerminado = false;
    
    // Restablecer UI
    palabraElement.textContent = palabraMostrada.join(" ");
    letrasUsadasElement.textContent = "Letras usadas: ";
    estadoElement.textContent = "¡Adivina el jugador!";
    estadoElement.className = "estado";
    
    // Habilitar todas las teclas
    const teclas = document.querySelectorAll("#teclado button");
    teclas.forEach(tecla => tecla.disabled = false);
    
    // Ocultar todas las partes del ahorcado excepto la base
    ahorcadoPartes.forEach((parte, index) => {
      if (index <= 2) {
        parte.style.display = "block"; // Mostrar base, poste y viga
      } else {
        parte.style.display = "none";
      }
    });
  }

  // Función para procesar una letra ingresada
  function procesarLetra(letra) {
    letrasUsadas.push(letra);
    letrasUsadasElement.textContent = `Letras usadas: ${letrasUsadas.join(", ")}`;
    
    if (palabraSecreta.includes(letra)) {
      // La letra está en la palabra secreta
      for (let i = 0; i < palabraSecreta.length; i++) {
        if (palabraSecreta[i] === letra) {
          palabraMostrada[i] = letra;
        }
      }
      palabraElement.textContent = palabraMostrada.join(" ");
    } else {
      // La letra no está en la palabra secreta
      intentos--;
      actualizarAhorcado();
    }
    
    comprobarEstado();
  }

  // Función para actualizar el dibujo del ahorcado
  function actualizarAhorcado() {
    const parteIndex = 6 - intentos + 3; // +3 porque las primeras tres partes ya están visibles
    if (parteIndex < ahorcadoPartes.length) {
      ahorcadoPartes[parteIndex].style.display = "block";
    }
  }

  // Función para comprobar el estado del juego
  function comprobarEstado() {
    if (palabraMostrada.join("") === palabraSecreta) {
      estadoElement.textContent = "🎉 ¡Ganaste! 🎉";
      estadoElement.className = "estado victoria";
      juegoTerminado = true;
    } else if (intentos === 0) {
      estadoElement.textContent = `💀 Ya no tienes más intentos. La palabra era: ${palabraSecreta}`;
      estadoElement.className = "estado derrota";
      juegoTerminado = true;
    } else {
      estadoElement.textContent = `Te quedan ${intentos} intentos.`;
    }
  }