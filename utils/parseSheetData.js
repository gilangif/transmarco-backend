import label from "./label.js"

export default function parseSheetData(arr, map, charts, brand) {
  const header = arr[0]
  const body = arr.slice(2)

  const labels = label(header.length)

  const mapper = map.map((item) => {
    const [startLabel, endLabel] = item.range.split(":")

    const start = labels.indexOf(startLabel)
    const end = labels.indexOf(endLabel)

    return { ...item, start, end }
  })

  const result = body.map((row) => {
    const tmp = {}

    mapper.forEach(({ key, range, start, end, int, stock }) => {
      const col = row.slice(start, end + 1)

      if (stock) {
        tmp[key + "_field"] = col.map((v) => (int ? Number(v) || 0 : v || ""))
        tmp[key] = Object.fromEntries(charts.map((c, i) => [tmp["artikel"] + c, int ? Number(col[i]) || 0 : col[i] || ""]))

        return
      }

      if (col.length === 1) tmp[key] = int ? Number(col[0].replace(/\./g, "")) || 0 : col[0] || ""
    })

    return { brand, art: tmp["artikel"].slice(0, 7), ...tmp }
  })

  return result
}
