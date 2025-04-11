// Variáveis iniciais

messageText = document.getElementById("messageText");

xPointBox = document.getElementById("xPoint");
oPointBox = document.getElementById("oPoint");


let turn = 0; // 0 = Player 1 (X), 1 = Player 2 (O)
let canPlay = true;

//pontos
var xPoints = 0;
var oPoints = 0;

// ===== Matriz do tabuleiro =====
// 0 - Vazio
// 1 - X
// 2 - O
let tabela = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

// Referências individuais
let xTableRef = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

let oTableRef = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

let stalemateRef = [
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
];

// Combinações de vitória
const VictoryCombinations = [
  [
    [1, 1, 1],
    [0, 0, 0],
    [0, 0, 0],
  ],
  [
    [0, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  [
    [0, 0, 0],
    [0, 0, 0],
    [1, 1, 1],
  ],

  [
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
  ],
  [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
  [
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1],
  ],

  [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ],
  [
    [0, 0, 1],
    [0, 1, 0],
    [1, 0, 0],
  ],
];

const buttonIds = [
  ["a1", "a2", "a3"],
  ["b1", "b2", "b3"],
  ["c1", "c2", "c3"],
];

// Alternância de turnos
function TurnSwitch() {
  turn = turn === 0 ? 1 : 0;
}

function checkBox(yOffset, xOffset) {
  if (canPlay) {
    messageText.textContent = "";
    if (tabela[yOffset][xOffset] !== 0) return; // não deixa jogar em um espaço ja ocupado

    if (turn === 0) {
      // Player X
      tabela[yOffset][xOffset] = 1;
      xTableRef[yOffset][xOffset] = 1;
    } else {
      // Player O
      tabela[yOffset][xOffset] = 2;
      oTableRef[yOffset][xOffset] = 1;
    }

    let clickAudio = new Audio('./snd/click.mp3');
    clickAudio.play();

    setButtonIcon(yOffset, xOffset); // Atualiza o ícone na interface
    verifyVictory(); // Verifica se alguém venceu
    TurnSwitch(); // Alterna turno
  }
}

// Função que atualiza o botão no HTML
function setButtonIcon(yOffset, xOffset) {
  let box = document.getElementById(buttonIds[yOffset][xOffset]);
  if (turn === 0) {
    let xIcon = document.createElement("div");
    box.appendChild(xIcon);
    xIcon.className = "xBox";
    xIcon.textContent = "X";
  } else {
    let oIcon = document.createElement("div");
    box.appendChild(oIcon);
    oIcon.className = "oBox";
    oIcon.textContent = "O";
  }
}

// Função para resetar o tabuleiro
function resetTable() {
  document.getElementById("xIconBox").className = "pointBox";
  document.getElementById("oIconBox").className = "pointBox";

  destroyLines();
  turn = 0;
  canPlay = true;

  tabela = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  xTableRef = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  oTableRef = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      document.getElementById(buttonIds[i][j]).textContent = "";
    }
  }
}

// Função que verifica se houve vitória
function verifyVictory() {
  for (let i = 0; i < VictoryCombinations.length; i++) {
    let Xwin = true; //travinha pra vitoria do X
    let Owin = true; //travinha pra vitoria do O

    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        if (VictoryCombinations[i][y][x] === 1) {
          // verifica se alguem ganhou
          if (xTableRef[y][x] !== 1) Xwin = false;
          if (oTableRef[y][x] !== 1) Owin = false;
        }
      }
    }
    //verifica empate
    if (
      JSON.stringify(xTableRef) == JSON.stringify(stalemateRef) ||
      JSON.stringify(oTableRef) == JSON.stringify(stalemateRef)
    ) {
      canPlay = false;

      return;
    }

    if (Xwin) {
      //messageText.textContent = "X Venceu!!!";
      drawWinnerLine();
      canPlay = false;
      xPoints++;
      xPointBox.textContent = xPoints;
      document.getElementById("xIconBox").className = "pointBox winnerBox";
      let finishMusic = new Audio('./snd/win.mp3');
      finishMusic.play();
      setTimeout(despawnEffect, 800);
      setTimeout(resetTable, 1200);
      return;
    }
    if (Owin) {
      //messageText.textContent = "O Venceu!!!";
      drawWinnerLine();
      canPlay = false;
      oPoints++;
      oPointBox.textContent = oPoints;
      document.getElementById("oIconBox").className = "pointBox winnerBox";
      let finishMusic = new Audio('./snd/win.mp3');
      finishMusic.play();
      setTimeout(despawnEffect, 500);
      setTimeout(resetTable, 1200);

      return;
    }
  }

  // Verifica empate
  if (tabela.flat().every((cell) => cell !== 0)) {
    console.log("Empate!");
    let drawMusic = new Audio('./snd/draw.mp3');
      drawMusic.play();
    setTimeout(despawnEffect, 500);
    setTimeout(resetTable, 1200);
  }
}

//effeito pra fazer as bolinhas e os xizes desaparecerem lentinho.
function despawnEffect() {
  const xObjectsRef = document.querySelectorAll(".xBox");
  const oObjectsRef = document.querySelectorAll(".oBox");

  // Itera sobre os elementos selecionados e faz algo com cada um
  xObjectsRef.forEach((elementox) => {
    elementox.className = "xBox transparentEffect";
  });

  oObjectsRef.forEach((elementoo) => {
    elementoo.className = "oBox transparentEffect";
  });
}

function spawnLine(index) {
  let board = document.getElementById("board");
  let line = document.createElement("div");
  board.appendChild(line);

  switch (index) {
    //horizontais
    case 0:
      line.className = "horizontal white line ";
      line.style.top = "-85px";
      line.style.left = "10px";
      break;
    case 1:
      line.className = "horizontal white line ";
      line.style.top = "70px";
      line.style.left = "10px";
      break;
    case 2:
      line.className = "horizontal white line ";
      line.style.top = "225px";
      line.style.lefts = "10px";

      break;
    //verticais
    case 3:
      line.className = "vertical white line ";
      line.style.top = "70px";
      line.style.left = "-146px";
      break;
    case 4:
      line.className = "vertical white line ";
      line.style.top = "70px";
      line.style.left = "8px";
      break;
    case 5:
      line.className = "vertical white line ";
      line.style.top = "70px";
      line.style.left = "165px";
      break;

    //diagonais
    case 6:
      line.className = "diagonalEsquerda white line ";
      line.style.top = "75px";
      line.style.left = "10px";
      break;

    case 7:
      line.className = "diagonalDireita white line ";
      line.style.top = "75px";
      line.style.left = "10px";
      break;
  }
}

function destroyLines() {
  let lines = document.querySelectorAll(".line");
  lines.forEach((line) => {
    line.remove();
  });
}

function drawWinnerLine() {
  //horizontais
  if (
    (xTableRef[0][0] == 1 && xTableRef[0][1] == 1 && xTableRef[0][2] == 1) ||
    (oTableRef[0][0] == 1 && oTableRef[0][1] == 1 && oTableRef[0][2] == 1)
  ) {
    spawnLine(0);
  } else if (
    (xTableRef[1][0] == 1 && xTableRef[1][1] == 1 && xTableRef[1][2] == 1) ||
    (oTableRef[1][0] == 1 && oTableRef[1][1] == 1 && oTableRef[1][2] == 1)
  ) {
    spawnLine(1);
  } else if (
    (xTableRef[2][0] == 1 && xTableRef[2][1] == 1 && xTableRef[2][2] == 1) ||
    (oTableRef[2][0] == 1 && oTableRef[2][1] == 1 && oTableRef[2][2] == 1)
  ) {
    spawnLine(2);
  }

  //verticais
  else if (
    (xTableRef[0][0] == 1 && xTableRef[1][0] == 1 && xTableRef[2][0] == 1) ||
    (oTableRef[0][0] == 1 && oTableRef[1][0] == 1 && oTableRef[2][0] == 1)
  ) {
    spawnLine(3);
  } else if (
    (xTableRef[0][1] == 1 && xTableRef[1][1] == 1 && xTableRef[2][1] == 1) ||
    (oTableRef[0][1] == 1 && oTableRef[1][1] == 1 && oTableRef[2][1] == 1)
  ) {
    spawnLine(4);
  } else if (
    (xTableRef[0][2] == 1 && xTableRef[1][2] == 1 && xTableRef[2][2] == 1) ||
    (oTableRef[0][2] == 1 && oTableRef[1][2] == 1 && oTableRef[2][2] == 1)
  ) {
    spawnLine(5);
  }

  //diagonais
  else if (
    (xTableRef[0][0] == 1 && xTableRef[1][1] == 1 && xTableRef[2][2] == 1) ||
    (oTableRef[0][0] == 1 && oTableRef[1][1] == 1 && oTableRef[2][2] == 1)
  ) {
    spawnLine(6);
  } else if (
    (xTableRef[0][2] == 1 && xTableRef[1][1] == 1 && xTableRef[2][0] == 1) ||
    (oTableRef[0][2] == 1 && oTableRef[1][1] == 1 && oTableRef[2][0] == 1)
  ) {
    spawnLine(7);
  }
}

function resetGame() {
  location.reload(); //reinicia a pagina
}
