export default function label(n) {
  const result = []

  for (let i = 0; i < n; i++) {
    let label = ""
    let num = i

    while (num >= 0) {
      label = String.fromCharCode((num % 26) + 65) + label
      num = Math.floor(num / 26) - 1
    }

    result.push(label)
  }

  return result
}
