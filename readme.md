# Minesweeper Game

This repository contains a turn-based minesweeper game where two players compete against each other to open as many tiles as possible without revealing a mine.

## Game Description

In this game, players take turns to reveal tiles on a 5x5 grid. Each tile may contain a gem or a mine. The game ends in one of two ways:

- WIN/LOSS: If a player opens a tile containing a mine, they lose, and the other player wins automatically.
- DRAW: If both players manage to open 12 tiles each without revealing a mine, the game ends in a draw.

## How to Play

1. Players take turns to reveal a tile on the grid by selecting the tile number.
2. If a player reveals a tile containing a mine, they lose the game.
3. The game continues until all non-mine tiles are revealed or until a player hits a mine.

## Features

- 5x5 grid of tiles (total 25 tiles)
- 24 tiles contain gems, and 1 tile contains a randomly generated mine
- Two players are required to play the game
- Each player gets to open 1 tile per turn
- The game can end in a win/loss or a draw
- The state of the grid is printed after each turn in the terminal
- MongoDB is used to store game information, player information, final game state, and results.

## Running the Game

To run the game, follow these steps:

1. Clone this repository.
2. Install the necessary dependencies (`readline` and `mongodb`). 
(
    enter the following commands on terminal:
    -npm i readline
    -npm i mongodb
)

3. Update the MongoDB connection URL in the code.
4. Run the script using Node.js.

