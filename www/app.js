import { html, render, useState } from "/preact.js";
import Join from "/components/Join.js";
import Game from "/components/Game.js";

function App() {
  const [gameId, setGameId] = useState(null);
  if (gameId == null) {
    return html`<${Join} onGameId=${setGameId} />`;
  } else {
    return html`<${Game} id=${gameId} />`;
  }
}

render(html`<${App} />`, document.body);
