export default function isColor(c) {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(c)
}
