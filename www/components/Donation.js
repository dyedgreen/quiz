import { html, useState } from "/preact.js";
import Button from "./Button.js";
import NumberInput from "./NumberInput.js";
import SelectInput from "./SelectInput.js";
import PlayerChip from "./PlayerChip.js";

function Play({ game }) {
  const [to, setTo] = useState(0);
  const [amount, setAmount] = useState(0);

  const otherPlayers = game.players.filter(({ id }) => id !== game.player.id);
  const otherPlayerNames = otherPlayers.map(({ name }) => name);

  const didDonate = game.player.ready;

  const donate = () =>
    game.actions.sendMessage("set-donation", {
      amount,
      to: otherPlayers[to].id,
    });

  return html`
    <${SelectInput}
      value=${to}
      onChange=${setTo}
      options=${otherPlayerNames}
      style=${styles.input}
      disabled=${didDonate}
    />
    <${NumberInput}
      value=${amount}
      onChange=${setAmount}
      min=0
      max=${game.round.data.maxDonation}
      style=${styles.input}
      disabled=${didDonate}
    />
    <${Button} onClick=${donate} title="Donate" disabled=${didDonate} />
  `;
}

function End({ game }) {
  const table = game.round.endData.map(({ from, to, amount }) => {
    return {
      from: game.players.find((p) => p.id === from),
      to: game.players.find((p) => p.id === to),
      amount,
    };
  });

  return html`
    ${
    table.map(({ from, to, amount }) =>
      html`
      <p style=${styles.text}>
        <${PlayerChip} ...${from} /> donated ${amount} point${
        amount !== 1 ? "s" : ""
      } to <${PlayerChip} ...${to} />
      </p>
    `
    )
  }
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
