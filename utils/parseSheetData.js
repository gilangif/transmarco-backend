import label from "./label.js"

export default function parseSheetData(arr, map, brand, artikel) {
  try {
    const header = arr[0]
    const body = arr.slice(1)
    const labels = label(header.length)

    const mapper = map.map((item) => ({ ...item, index: labels.indexOf(item.range) }))

    const results = body.map((r, i) => {
      const tmp = { range: {} }

      mapper.forEach((item, j) => {
        const { key, range, index, int } = item

        if (!key) return

        const c = r[index]

        const row = i + 1 + 1 // add 1 because indexing from zero and add 1 row header
        const col = j + 1
        const cell = `${range}${row}`

        tmp["range"][key] = { row, col, cell }

        tmp[key] = int ? parseInt(String(c)?.replace(/[.,]/g, "") || 0) || 0 : c || ""
      })

      return { brand, artikel: tmp[artikel].slice(0, 7), ...tmp }
    })

    return results.filter((x) => x.barcode)
  } catch (error) {
    console.log("📢[:30]: ", error)
    return {}
  }
}
