import { html, useState } from "/preact.js";
import Button from "./Button.js";
import NumberInput from "./NumberInput.js";
import SelectInput from "./SelectInput.js";
import PlayerChip from "./PlayerChip.js";

function SplitSelector({ game, alive }) {
  const [split, setSplit] = useState({});
  const getPlayerSplit = (id) => split.hasOwnProperty(id) ? split[id] : 0;
  const setPlayerSplit = (id, val) => {
    split[id] = val;
    setSplit({ ...split });
  };

  const totalGiven = alive.reduce((acc, { id }) => acc + getPlayerSplit(id), 0);
  const totalLeft = game.round.data.totalPoints - totalGiven;

  const submit = () => game.actions.sendMessage("submit-split", split);

  return html`
    <p style=${styles.text}>You have ${totalLeft} points left to split.</p>
    ${
    alive.map((player) => {
      return html`
        <div style=${styles.splitRow}>
          <${PlayerChip} ...${player} />
          <${NumberInput}
            value=${getPlayerSplit(player.id)}
            onChange=${(v) => setPlayerSplit(player.id, v)}
            min=0
            max=${getPlayerSplit(player.id) + totalLeft}
          />
        </div>
      `;
    })
  }
    <${Button} onClick=${submit} title="Split" />
  `;
}

function Vote({ game }) {
  const submit = (choice) => game.actions.sendMessage("vote-on-split", choice);
  return html`
    <div>
      <${Button} onClick=${() =>
    submit(
      true,
    )} title="Agree" disabled=${game.player.ready} style=${styles.voteButton}/>
      <${Button} onClick=${() =>
    submit(
      false,
    )} title="Reject" disabled=${game.player.ready} style=${styles.voteButton}/>
    </div>
  `;
}

function VoteResults({ votes, players }) {
  const player = (playerId) => players.find(({ id }) => id === playerId);
  return html`
    <p style=${styles.title}>Previous Vote:</p>
    ${
    Object.keys(votes).map((id) => {
      if (!votes.hasOwnProperty(id)) {
        return null;
      }
      return html`
        <div style=${styles.splitRow}>
          <${PlayerChip} ...${player(id)} />
          <p style=${styles.splitNumber}>${votes[id] ? "YES" : "NO"}</p>
        </div>
      `;
    })
  }
  `;
}

function ProposedSplit({ captain, alive, split, noTitle }) {
  return html`
    ${
    noTitle === true
      ? null
      : html
        `<p style=${styles.text}>${captain} proposed the following split:</p>`
  }
    ${
    alive.map((player) => {
      return html`
        <div style=${styles.splitRow}>
          <${PlayerChip} ...${player} />
          <p style=${styles.splitNumber}>${split[player.id]}</p>
        </div>
      `;
    })
  }
  `;
}

function DeadPlayers({ dead }) {
  if (dead.length === 0) {
    return html`<p style=${styles.title}>Nobody is dead.</p>`;
  } else {
    return html`
      <p style=${styles.title}>Previous captains:</p>
      ${dead.map((player) => html`<${PlayerChip} ...${player} />`)}
    `;
  }
}

function Play({ game }) {
  const [to, setTo] = useState(0);
  const [amount, setAmount] = useState(0);

  const findPlayer = (playerId) =>
    game.players.find(({ id }) => id === playerId);
  const playersAlive = game.round.data.playersAlive.map((id) => findPlayer(id));
  const playersDead = game.players.filter(({ id }) =>
    !game.round.data.playersAlive.includes(id)
  );

  const isCaptain = game.round.data.captain === game.player.id;
  const captain = isCaptain
    ? "You"
    : html`<${PlayerChip} ...${findPlayer(game.round.data.captain)} />`;
  const propsedSplit = game.round.data.split;

  const isDead = !game.round.data.playersAlive.includes(game.player.id);

  return html`
    ${propsedSplit == null &&
    html`<p style=${styles.text}>${captain} ${
      isCaptain ? "are" : "is"
    } captain.</p>`}
    ${isCaptain &&
    propsedSplit == null &&
    html`<${SplitSelector} game=${game} alive=${playersAlive} />`}
    ${propsedSplit != null && html`
        <${ProposedSplit} captain=${captain} alive=${playersAlive} split=${propsedSplit} />
      `}
    ${propsedSplit != null && !isCaptain && !isDead &&
    html`<${Vote} game=${game} />`}
    ${game.round.data.lastVotes != null && html`<${VoteResults} votes=${game.round.data.lastVotes} players=${game.players} />`}
    <${DeadPlayers} dead=${playersDead} />
  `;
}

function End({ game }) {
  const findPlayer = (playerId) =>
    game.players.find(({ id }) => id === playerId);
  const playersAlive = game.round.data.playersAlive.map((id) => findPlayer(id));
  const playersDead = game.players.filter(({ id }) =>
    !game.round.data.playersAlive.includes(id)
  );
  const isCaptain = game.round.data.captain === game.player.id;
  const captain = isCaptain
    ? "You"
    : html`<${PlayerChip} ...${findPlayer(game.round.data.captain)} />`;
  const propsedSplit = game.round.data.split;

  return html`
    <p style=${styles.title}>The split was good, arrrr!</p>
    <${ProposedSplit} captain=${captain} alive=${playersAlive} split=${propsedSplit} noTitle />
    <${Button} title="Next" onClick=${game.actions.setPlayerReady} disabled=${game.player.ready} />
    ${game.round.data.lastVotes != null && html`<${VoteResults} votes=${game.round.data.lastVotes} players=${game.players} />`}
    ${playersDead.length > 0 && html`<${DeadPlayers} dead=${playersDead} />`}
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
  title: {
    fontSize: "20px",
    marginTop: 24,
    marginBottom: 12,
  },
  splitRow: {
    display: "flex",
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
    alignItems: "center",
    paddingLeft: 4,
    marginBottom: 8,
  },
  splitNumber: {
    height: 40,
    margin: "0 12px",
    lineHeight: "40px",
    fontSize: "20px",
    fontWeight: 700,
  },
  voteButton: {
    margin: 4,
  },
};
