import { html } from "/preact.js";
import s from "/style.js";

function Avatar({playerId, player: {id, name, score, color, ready}}) {
  return html`
    <div style=${styles.player}>
      ${ready && html`<h2 style=${s(styles.badge, styles.ready)}>READY</h2>`}
      ${id === playerId && html`<h2 style=${s(styles.badge, styles.you)}>YOU</h2>`}
      <h1 style=${s(styles.letter, { background: `#${color}` })}>${name[0].toUpperCase()}</h1>
      <h2 style=${styles.name}><b>${score}</b> ${name}</h2>
    </div>
  `;
}

export default function PlayerList({playerId, players}) {
  let sorted = [...players];
  sorted.sort(({score: a}, {score: b}) => b - a);

  return html`
    <div style=${styles.container}>
      <h1 style=${styles.title}>Scores</h1>
      ${sorted.map(player => html`<${Avatar} playerId=${playerId} player=${player} />`)}
    </div>
  `;
}

const styles = {
  container: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    background: "#F3F4F6",
    borderRadius: 12,
    padding: "12px 0",
    marginBottom: 12,
  },
  title: {
    width: 24,
    margin: "0 12px",
    fontSize: 24,
    fontWeight: 700,
    color: "#D1D5DB",
    transform: "rotate(-90deg) translate(-28px, 0)",
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
  badge: {
    height: 24,
    position: "absolute",
    padding: "0 4px",
    fontWeight: 700,
    lineHeight: "24px",
    borderRadius: 8,
    boxShadow: "0 0 0 2px #F3F4F6",
  },
  ready: {
    background: "#34D399",
    color: "#fff",
    transform: "rotate(-5deg) translate(-8px, -5px)",
  },
  you: {
    background: "#4B5563",
    color: "#fff",
    transform: "rotate(-5deg) translate(18px, 42px)",
  },
};
