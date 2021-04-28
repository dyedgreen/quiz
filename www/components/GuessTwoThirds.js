import { html, useState } from "/preact.js";
import Button from "./Button.js";
import NumberInput from "./NumberInput.js";
import SelectInput from "./SelectInput.js";
import PlayerChip from "./PlayerChip.js";

function Play({ game }) {
  const [guess, setGuess] = useState(game.round.data.minGuess);
  const didGuess = game.player.ready;

  const submit = () => game.actions.sendMessage("set-guess", guess);

  return html`
    <${NumberInput}
      value=${guess}
      onChange=${setGuess}
      min=${game.round.data.minGuess}
      max=${game.round.data.maxGuess}
      style=${styles.input}
      disabled=${didGuess}
    />
    <${Button} onClick=${submit} title="Guess" disabled=${didGuess} />
  `;
}

function End({ game }) {
  const table = game.round.endData.guesses.map(({ playerId, guess }) => {
    return {
      player: game.players.find((p) => p.id === playerId),
      guess,
    };
  });
  const average = Math.floor(game.round.endData.average * 1000) / 1000;

  return html`
    <p style=${styles.text}>The average guess was ${average}</p>
    ${
    table.map(({ player, guess }) =>
      html`
      <p style=${styles.text}>
        <${PlayerChip} ...${player} /> guessed ${guess}
      </p>
    `
    )
  }
    <${Button} title="Next" onClick=${game.actions.setPlayerReady} disabled=${game.player.ready} />
  `;
}

export default function GuessTwoThirds({ game }) {
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
