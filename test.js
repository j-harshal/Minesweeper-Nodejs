const readline = require ('readline');
const {MongoClient} = require ('mongodb');

// MongoDB connection URL
const mongoUrl =
  'mongodb+srv://jharshal500:enS9syfbjf9qhomo@cluster0.kjfiwxi.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'minesweeper';
const client = new MongoClient (mongoUrl);

// Function to generate a random number between min and max (inclusive)
function getRandomInt (min, max) {
  return Math.floor (Math.random () * (max - min + 1)) + min;
}

// Initialize game state
const grid = [];
const gridSize = 5;
const totalTiles = gridSize * gridSize;
const totalMines = 5;
const players = [];
let currentPlayerIndex = 0;
let turnsLeftPerPlayer = totalTiles - totalMines;

// Function to initialize the game grid
function initializeGrid () {
  for (let i = 0; i < totalTiles; i++) {
    grid.push ({
      hasMine: false,
      revealed: false,
    });
  }
  // Place mines randomly
  for (let i = 0; i < totalMines; i++) {
    let randomIndex;
    do {
      randomIndex = getRandomInt (0, totalTiles - 1);
    } while (grid[randomIndex].hasMine);
    grid[randomIndex].hasMine = true;
  }
}

// Function to print the state of the grid in the terminal
function printGrid () {
  let output = '';
  for (let i = 0; i < totalTiles; i++) {
    if (i % gridSize === 0 && i !== 0) {
      output += '\n';
    }
    if (grid[i].revealed) {
      output += grid[i].hasMine ? '💣 ' : '0 ';
    } else {
      output += '? ';
    }
  }
  console.log (output);
}

// Function to handle player's turn
function takeTurn (player) {
  const rl = readline.createInterface ({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise (resolve => {
    rl.question (
      `${player}, choose a tile to reveal (1-${totalTiles}): `,
      async input => {
        const index = parseInt (input) - 1;
        rl.close ();
        if (index >= 0 && index < totalTiles && !grid[index].revealed) {
          grid[index].revealed = true;
          if (grid[index].hasMine) {
            console.log (`${player} hit a mine! Game over for ${player}.`);
            await storeGameResults (
              players[0],
              players[1],
              `${player} hit a mine! ${player} loses.`
            );
            process.exit (0);
          }
          turnsLeftPerPlayer--;
        } else {
          console.log ('Invalid tile selection. Please choose again.');
          return takeTurn (player);
        }
        resolve ();
      }
    );
  });
}

// Function to store game results in MongoDB
async function storeGameResults (player1, player2, result) {
  try {
    await client.connect ();
    const db = client.db (dbName);
    const collection = db.collection ('games');
    const gameResult = {
      players: [player1, player2],
      result: result,
    };
    await collection.insertOne (gameResult);
    console.log ('Game results stored in MongoDB.');
  } catch (error) {
    console.error ('Error storing game results:', error);
  } finally {
    await client.close ();
  }
}

// Function to take player names from terminal input
function takePlayerNames () {
  const rl = readline.createInterface ({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise (resolve => {
    rl.question ('Enter Player 1 name: ', name1 => {
      players.push (name1);
      rl.question ('Enter Player 2 name: ', name2 => {
        players.push (name2);
        rl.close ();
        resolve ();
      });
    });
  });
}

// Main game loop
async function startGame () {
  await takePlayerNames ();
  initializeGrid ();
  console.log ('Welcome to Minesweeper!');

  while (turnsLeftPerPlayer > 0) {
    printGrid ();
    const currentPlayer = players[currentPlayerIndex];
    await takeTurn (currentPlayer);
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  }

  console.log ("All tiles revealed. It's a draw!");
  await storeGameResults (
    players[0],
    players[1],
    "All tiles revealed. It's a draw!"
  );
  process.exit (0);
}

startGame ();