import { html } from "/preact.js";
import style from "/style.js";

export default function Button({title, onClick, disabled}) {
  return html`
    <button style=${style(styles.button, disabled && styles.disabled)} onClick=${() => !disabled && onClick()}>
      ${title}
    </button>
  `;
}

const styles = {
  button: {
    height: "40px",
    background: "rgb(37, 99, 235)",
    borderRadius: "8px",
    padding: "0 12px",
    fontWeight: "800",
    color: "#fff",
  },
  disabled: {
    opacity: 0.5,
    cursor: "default",
  },
};
