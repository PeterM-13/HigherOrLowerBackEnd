# Higher or Lower Game Backend

This repository contains the backend for a "Higher or Lower" game. The backend is implemented using Node.js. The backend provides multiple endpoints to manage game rounds, players, and their scores.

## Usage

Once the server is running, you can interact with the backend using the provided API endpoints.

## API Endpoints

| Endpoint                      | Method | Description                                                                 | Example Body (for POST)                            |
|-------------------------------|--------|-----------------------------------------------------------------------------|---------------------------------------------------|
| `/round`                      | GET    | Get the current round. Returns an error if the game hasn't started or has ended. | N/A                                               |
| `/players`                    | GET    | Get a list of all players.                                                  | N/A                                               |
| `/reset`                      | GET    | Clear all players and reset the game.                                       | N/A                                               |
| `/playersRound`               | GET    | Get the current round and the list of players. Returns an error if the game has ended. | N/A                                               |
| `/addPlayer/:name`            | POST   | Add a new player with the specified name. Returns an error if the game has started or the name is already used. | `{ "name": "PlayerName" }`                        |
| `/admin/nextRound`            | POST   | Move to the next round or start the game. Returns an error if the game has ended. | N/A                                               |
| `/submitAnswer/:playerName/:ans` | POST | Submit an answer for a player. Updates the player's score if the answer is correct. | `{ "ans": "Answer" }`                             |
| `/position/:playerName`       | GET    | Get the position of a player and the top three players. Returns an error if the player is not found. | N/A                                               |

#### Dependencies

- Node.js
- Express.js

#### Environment Variables


- `PORT`: The port on which the server will run.


#### Install dependencies
    ```bash
    npm install
    ```
#### Start the server
    ```bash
    npm run dev
    ```

#### Developers

- Peter Metcalfe
