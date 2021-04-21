import { html, useState } from "/preact.js";
import Button from "./Button.js";
import TextInput from "./TextInput.js";
import PlayerList from "./PlayerList.js";

import Donation from "./Donation.js";
import GuessTwoThirds from "./GuessTwoThirds.js";
import PublicGood from "./PublicGood.js";
import Pirates from "./Pirates.js";

import useLive from "/hooks/useLive.js";

function ChooseName({onChooseName}) {
  const [name, setName] = useState("");
  return html`
    <div style=${styles.nameSelect}>
      <h1 style=${styles.title}>Select Your Name</h1>
      <${TextInput} value=${name} onTextChange=${setName} placeholder="Type your name ..." style=${styles.input} />
      <${Button} title="Choose Name" onClick=${() => onChooseName(name)} disabled=${!name.length} />
    </div>
  `;
}

function NotFound() {
  return html`
    <div style=${styles.nameSelect}>
      <h1 style=${styles.title}>Failed to Connect</h1>
      <${Button} title="Back To Home" onClick=${() => document.location.search = ""} style=${styles.input} />
      <${Button} title="Refresh" onClick=${() => window.location.reload(true)} />
    </div>
  `;
}

export default function Game({id}) {
  const game = useLive(id);

  if (game.error) {
    return html`<${NotFound} />`;
  } if (game.player.name == null) {
    return html`<${ChooseName} onChooseName=${game.actions.setPlayerName} />`;
  } if (game.round.id != null) {
    let ui = null;
    switch (game.round.id) {
      case "donation":
        ui = html`<${Donation} game=${game} />`;
        break;
      case "guess_two_thirds":
        ui = html`<${GuessTwoThirds} game=${game} />`;
        break;
      case "public_good":
        ui = html`<${PublicGood} game=${game} />`;
        break;
      case "pirates":
        ui = html`<${Pirates} game=${game} />`;
        break;
    }
    return html`
      <div style=${styles.container}>
        <${PlayerList} playerId=${game.player.id} players=${game.players} />
        <div style=${styles.prompt}>
          <h1 style=${styles.promptTitle}>${game.round.title}</h1>
          <p>${game.round.description}</p>
        </div>
        ${ui}
        <p style=${styles.gameId}><b>Game ID:</b> ${id}</p>
      </div>
    `;
  } else {
    return html`
      <div style=${styles.container}>
        <${PlayerList} playerId=${game.player.id} players=${game.players} />
        <h1 style=${styles.title}>
          ${game.players.length < 4 ?
            "Waiting for people to join" :
            "Waiting for people to get ready"
          }
        </h1>
        <${Button}
          title="Ready!"
          onClick=${game.actions.setPlayerReady}
          style=${styles.singleButton}
          disabled=${game.player.ready || game.players.length < 4}
        />
        <p style=${styles.gameId}><b>Game ID:</b> ${id}</p>
      </div>
    `;
  }
}

const styles = {
  container: {
    display: "flex",
    maxWidth: "100%",
    flexDirection: "column",
    alignItems: "center",
    background: "#fff",
    borderRadius: 12,
    padding: 24,
  },
  nameSelect: {
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
  promptTitle: {
    fontSize: 24,
    fontWeight: 800,
  },
  prompt: {
    display: "flex",
    flexDirection: "column",
    width: 500,
    maxWidth: "100%",
    alignItems: "left",
    textAlign: "left",
    background: "#F3F4F6",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  input: {
    marginBottom: 12,
  },
  singleButton: {
    marginTop: 32,
  },
  gameId: {
    marginTop: 24,
    fontSize: "14px",
    color: "#E5E7EB",
  },
};
