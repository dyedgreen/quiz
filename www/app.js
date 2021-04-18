import { html, render, useState } from "/preact.js";
import Join from "/components/Join.js";
import Game from "/components/Game.js";

function getQueryParams() {
  const search = document.location.search.replace(/^\?/, "");
  const values = search
    .split("&")
    .map(pair => pair.split("="))
    .reduce((acc, [key, val]) => {
      acc[key] = val;
      return acc;
    }, {});
  return values;
}

function getPresetGameId() {
  return getQueryParams().game || null;
}

function App() {
  const [gameId, setGameId] = useState(getPresetGameId());
  if (gameId == null) {
    return html`<${Join} onGameId=${setGameId} />`;
  } else {
    return html`<${Game} id=${gameId} />`;
  }
}

render(html`<${App} />`, document.body);
