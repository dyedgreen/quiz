import { html } from "/preact.js";
import s from "/style.js";

function Avatar({name, score, color}) {
  return html`
    <div style=${styles.player}>
      <h1 style=${s(styles.letter, { background: `#${color}` })}>${name[0].toUpperCase()}</h1>
      <h2 style=${styles.name}><b>${score}</b> ${name}</h2>
    </div>
  `;
}

export default function PlayerList({players}) {
  let sorted = [...players];
  sorted.sort(({score: a}, {score: b}) => a - b);

  return html`
    <div style=${styles.container}>
      <h1 style=${styles.title}>Scores</h1>
      ${sorted.map(player => html`<${Avatar} ...${player} />`)}
    </div>
  `;
}

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    background: "#f8f8f8",
    borderRadius: 12,
    padding: "12px 0",
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    margin: "0 12px",
    color: "#ccc",
  },
  player: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "0 12px",
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
    color: "#fff"
  },
  name: {
    whiteSpace: "nowrap",
    width: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    textAlign: "center",
  },
};
