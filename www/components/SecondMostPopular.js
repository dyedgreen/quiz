import { html, useState } from "/preact.js";
import Button from "./Button.js";
import SelectInput from "./SelectInput.js";
import PlayerChip from "./PlayerChip.js";

function Play({ game }) {
  const [choice, setChoice] = useState(0);

  const choices = (game.round.data.options || []).map(points => `Receive ${points} points`);
  const didVote = game.player.ready;

  const vote = () =>
    game.actions.sendMessage("set-choice", choice);

  return html`
    <${SelectInput}
      value=${choice}
      onChange=${setChoice}
      options=${choices}
      style=${styles.input}
      disabled=${didVote}
    />
    <${Button} onClick=${vote} title="Vote" disabled=${didVote} />
  `;
}

function End({ game }) {
  // const table = game.round.endData.map(({ from, to, amount }) => {
  //   return {
  //     from: game.players.find((p) => p.id === from),
  //     to: game.players.find((p) => p.id === to),
  //     amount,
  //   };
  // });

  const table = game.round.endData.map(({points, players}) => {
    return html`
      <p style=${styles.text}>Votes for ${points} points:</p>
      ${players.map(player => html`
        <p style=${styles.text}><${PlayerChip} ...${game.players.find(p => p.id === player)} /></p>
      `)}
      ${players.length === 0 && html`<i style=${styles.text}>None</i>`}
    `;
  });

  return html`
    ${table}
    <${Button} title="Next" onClick=${game.actions.setPlayerReady} disabled=${game.player.ready} />
  `;
}

export default function Donation({ game }) {
  if (game.round.endData == null) {
    return html`<${Play} game=${game} />`;
  } else {
    return html`<${End} game=${game} />`;
  }
}

const styles = {
  input: {
    marginBottom: 8,
  },
  text: {
    fontSize: "20px",
    marginBottom: 12,
  },
};
