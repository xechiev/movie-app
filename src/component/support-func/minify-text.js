export default function Minify(text, length) {
  return `${text.slice(0, text.indexOf(' ', length))}...`;
}
