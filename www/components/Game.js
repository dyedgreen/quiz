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

export default function Game({id}) {
  const game = useLive(id);

  if (game.player.name == null) {
    return html`<${ChooseName} onChooseName=${game.actions.setPlayerName} />`;
  } else {
    return html`
      <div style=${styles.container}>
        <${PlayerList} players=${game.players} />
        Game id: ${id}; conected: ${game.connected ? "true" : "false"}
      </div>
    `;
  }
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    width: "90%",
    height: "90%",
    background: "#fff",
    borderRadius: 12,
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
};
