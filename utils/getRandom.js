export default function getRandoms(arr, count = 1) {
  if (count < 1) return []
  if (count > arr.length) count = arr.length

  const copy = [...arr]
  const result = []

  for (let i = 0; i < count; i++) {
    const index = Math.floor(Math.random() * copy.length)
    result.push(copy[index])
    copy.splice(index, 1)
  }

  return result
}
