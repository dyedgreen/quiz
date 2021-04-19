import { html } from "/preact.js";
import s from "/style.js";

export default function PlayerChip({name, color}) {
  return html`
    <span style=${styles.container}>
      <span style=${s(styles.letter, { backgroundColor: `#${color}` })}>${name[0].toUpperCase()}</span>
      <p style=${styles.text}>${name}</p>
    </span>
  `;
}

const styles = {
  container: {
    display: "inline-flex",
    alignItems: "center",
    height: 32,
    padding: "0 8px",
    backgroundColor: "#F3F4F6",
    borderRadius: 4,
  },
  letter: {
    width: 20,
    height: 20,
    flexShrink: 0,
    borderRadius: "100%",
    textAlign: "center",
    fontWeight: 900,
    fontSize: 16,
    lineHeight: "20px",
    color: "#fff",
    marginRight: 4,
  },
  text: {
    fontSize: "20px",
    lineHeight: "24px",
    fontWeight: 600,
  },
};
