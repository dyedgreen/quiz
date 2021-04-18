export default function style(...styles) {
  let final = {};
  for (const style of styles) {
    if (typeof style === "object")
      final = {...final, ...style};
  }
  return final;
}
