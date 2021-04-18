import { html } from "/preact.js";
import useLive from "/hooks/useLive.js";

export default function Game({id}) {
  const game = useLive(id);
  console.log(game);
  return html`
    Game id: ${id}; conected: ${game.connected ? "true" : "false"}
  `;
}
