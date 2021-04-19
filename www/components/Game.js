import { html, useState } from "/preact.js";
import Button from "./Button.js";
import TextInput from "./TextInput.js";
import PlayerList from "./PlayerList.js";

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
      <h1 style=${styles.title}>Game not Found</h1>
      <${Button} title="Back To Home" onClick=${() => document.location.search = ""} />
    </div>
  `;
}

export default function Game({id}) {
  const game = useLive(id);

  if (game.error) {
    return html`<${NotFound} />`;
  } if (game.player.name == null) {
    return html`<${ChooseName} onChooseName=${game.actions.setPlayerName} />`;
  } else {
    return html`
      <div style=${styles.container}>
        <${PlayerList} players=${game.players} />
        <${Button} title="Ready!" onClick=${game.actions.setPlayerReady} style=${styles.singleButton} disabled=${game.player.ready} />
      </div>
    `;
  }
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "90%",
    height: "90%",
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
  input: {
    marginBottom: 12,
  },
  singleButton: {
    marginTop: 32,
  }
};
