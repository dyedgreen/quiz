import { html, useState } from "/preact.js";
import { validate } from "/uuid.js";
import Button from "./Button.js";

function startGame(onGameId) {
  fetch(`${window.location.protocol}//${window.location.host}/api/start`)
    .then(res => res.json())
    .then(({gameId}) => onGameId(gameId));
}

export default function Join({onGameId}) {
  const [idInput, setIdInput] = useState("");
  return html`
    <h1>Join a Game</h1>
    <input type="text" placeholder="Game ID" value=${idInput} onChange=${e => setIdInput(e.target.value)} />
    <${Button} title="Join" onClick=${() => onGameId(idInput)} disabled=${!validate(idInput)} />
    <h2>OR</h2>
    <${Button} title="New Game" onClick=${() => startGame(onGameId)} />
  `;
}
