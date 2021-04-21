import { html, useState } from "/preact.js";
import Button from "./Button.js";
import NumberInput from "./NumberInput.js";
import SelectInput from "./SelectInput.js";
import PlayerChip from "./PlayerChip.js";

function Play({ game }) {
  const [contribution, setContribution] = useState(0);
  const didPlayerContribute = game.player.ready;

  const submit = () =>
    game.actions.sendMessage("set-contribution", contribution);

  return html`
    <${NumberInput}
      value=${contribution}
      onChange=${setContribution}
      min=0
      max=${game.round.data.totalPoints}
      style=${styles.input}
      disabled=${didPlayerContribute}
    />
    <${Button} onClick=${submit} title="Contribute" disabled=${didPlayerContribute} />
  `;
}

function End({ game }) {
  const table = game.round.endData.contributions.map(({playerId, contribution}) => {
    return {
      player: game.players.find(p => p.id === playerId),
      contribution,
    };
  });
  const total = Math.floor(game.round.endData.total);
  const each = Math.floor(2 * total / (table.length - 1));

  return html`
    <p style=${styles.text}>The total pot was ${total}</p>
    ${table.map(({player, contribution}, idx) => html`
      <p style=${styles.text}>
        <${PlayerChip} ...${player} /> contributed ${contribution}, receiving ${
          idx < table.length - 1 ? `${10 - contribution} + ${each}` : 10 - contribution
        }
      </p>
    `)}
    <${Button} title="Next" onClick=${game.actions.setPlayerReady} disabled=${game.player.ready} />
  `;
}

export default function PublicGood({ game }) {
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
