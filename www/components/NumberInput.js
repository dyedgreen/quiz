import { html } from "/preact.js";
import s from "/style.js";
import Button from "./Button.js";

export default function({value, onChange, min, max, style, disabled}) {
  const downDisabled = disabled || value <= min;
  const upDisabled = disabled || value >= max;
  return html`
    <div style=${s(styles.container, style)}>
      <${Button}
        title="-"
        style=${s(styles.button, downDisabled && styles.buttonDisabled)}
        disabled=${downDisabled}
        onClick=${() => onChange && onChange(value - 1)}
      />
      <p style=${styles.number}>${value}</p>
      <${Button}
        title="+"
        style=${s(styles.button, upDisabled && styles.buttonDisabled)}
        disabled=${upDisabled}
        onClick=${() => onChange && onChange(value + 1)}
      />
    </div>
  `;
}

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    padding: 4,
    background: "#E5E7EB",
    borderRadius: 8,
  },
  number: {
    height: 32,
    minWidth: 32,
    fontSize: "18px",
    fontWeight: 700,
    textAlign: "center",
    lineHeight: "32px",
  },
  button: {
    height: 32,
    width: 32,
    padding: 0,
    background: "#9CA3AF",
    color: "#000",
  },
  buttonDisabled: {
    background: "#D1D5DB",
    color: "#9CA3AF",
  },
};
