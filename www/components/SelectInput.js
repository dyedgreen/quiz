import { html } from "/preact.js";
import s from "/style.js";

const bgImg =
  `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'%3e%3cpath d='M7 7l3-3 3 3m0 6l-3 3-3-3' stroke='%239fa6b2' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e")`;

export default function ({ value, onChange, options, disabled, style }) {
  return html`
    <select style=${
    s(styles.container, disabled && styles.disabled, style)
  } onChange=${(e) => onChange && onChange(+e.target.value)}>
      ${
    options.map((value, idx) =>
      html`<option value=${idx} disabled=${disabled}>${value}</option>`
    )
  }
    </select>
  `;
}

const styles = {
  container: {
    height: 40,
    padding: "0 28px 0 8px",
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
    backgroundImage: bgImg,
    backgroundPosition: "right 4px center",
    backgroundSize: "24px 24px",
    backgroundRepeat: "no-repeat",
    fontSize: "18px",
    fontWeight: 600,
    ["-webkit-appearance"]: "none",
    ["-moz-appearance"]: "none",
    appearance: "none",
  },
  disabled: {
    color: "#9CA3AF",
  },
};
