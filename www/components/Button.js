import { html } from "/preact.js";
import s from "/style.js";

export default function Button({title, onClick, disabled, style}) {
  return html`
    <button style=${s(styles.button, disabled && styles.disabled, style)} onClick=${() => !disabled && onClick()}>
      ${title}
    </button>
  `;
}

const styles = {
  button: {
    height: 40,
    background: "rgb(37, 99, 235)",
    borderRadius: 8,
    padding: "0 12px",
    fontWeight: 800,
    color: "#fff",
  },
  disabled: {
    opacity: 0.5,
    cursor: "default",
  },
};
