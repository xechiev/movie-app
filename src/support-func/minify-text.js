export default function minify(text, length) {
  return `${text.slice(0, text.indexOf(' ', length))}...`;
}
