import { html } from "/preact.js";
import s from "/style.js";

export default function TextInput({ value, placeholder, onTextChange, style }) {
  return html`
    <input
      style=${s(styles.input, style)}
      type="text"
      value=${value}
      placeholder=${placeholder}
      onInput=${(e) => onTextChange && onTextChange(e.target.value)}
    />
  `;
}

const styles = {
  input: {
    height: 40,
    padding: "0 12px",
    border: "solid 2px #ccc",
    borderRadius: 8,
  },
};
