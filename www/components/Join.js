import { html, useState } from "/preact.js";
import { validate } from "/uuid.js";
import Button from "./Button.js";
import TextInput from "./TextInput.js";

function startGame(onGameId) {
  fetch(`${window.location.protocol}//${window.location.host}/api/start`)
    .then((res) => res.json())
    .then(({ gameId }) => onGameId(gameId));
}

export default function Join({ onGameId }) {
  const [idInput, setIdInput] = useState("");
  return html`
    <div style=${styles.card}>
      <h1 style=${styles.title}>Join a Game</h1>
      <${TextInput} placeholder="Game ID" value=${idInput} onTextChange=${setIdInput} style=${styles.input} />
      <${Button} title="Join" onClick=${() =>
    onGameId(idInput)} disabled=${idInput.length !== 4} />
      <h2 style=${styles.divider}>OR</h2>
      <${Button} title="New Game" onClick=${() => startGame(onGameId)} />
    </div>
  `;
}

const styles = {
  card: {
    display: "flex",
    flexDirection: "column",
    padding: 12,
    width: 400,
    height: "auto",
    background: "#fff",
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 800,
    marginBottom: 12,
  },
  input: {
    marginBottom: 12,
  },
  divider: {
    display: "block",
    marginTop: 24,
    marginBottom: 24,
    height: 1,
    borderLeft: "solid 150px #999",
    borderRight: "solid 150px #999",
    color: "#999",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 0,
  },
};
