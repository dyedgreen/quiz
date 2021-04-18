import { html } from "/preact.js";

function Avatar({name, score}) {
  return html`
    <div style=${styles.player}>
      <h1 style=${styles.letter}>${name[0].toUpperCase()}</h1>
      <h2>${name}</h2>
    </div>
  `;
}

export default function PlayerList({players}) {
  let sorted = [...players];
  sorted.sort(({score: a}, {score: b}) => a - b);

  return html`
    <div style=${styles.container}>
      ${sorted.map(player => html`<${Avatar} ...${player} />`)}
    </div>
  `;
}

const styles = {
  container: {
    display: "flex",
    height: 100,
    background: "#f8f8f8",
    borderRadius: 12,
    margin: 8,
  },
  player: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: 100,
    height: 80,
    marginTop: 10,
  },
  letter: {
    width: 60,
    height: 60,
    flexShrink: 0,
    borderRadius: "100%",
    background: "#f00",
    textAlign: "center",
    fontWeight: 900,
    fontSize: 40,
    lineHeight: 1.5,
    // lineHeight: 70,
    color: "#fff"
  },
};
