import * as cheerio from "cheerio"
import axios from "axios"

class Photo {
  constructor(target) {
    this.target = target
    this.merchant = target.includes("hushpuppies.co.id") ? "HUSHPUPPIES" : target.includes("9to9.co.id") ? "9TO9" : target.includes("zalora.co.id") ? "ZALORA" : "UNKNNOWN"
  }

  async generate() {
    const { target, merchant } = this

    const arr = []

    const response = await axios.get(target)
    const $ = cheerio.load(response.data)

    if (merchant === "HUSHPUPPIES") {
      const items = $("li.media-thumbs__item button img")
      const title = $("h1.product-title")?.text().trim()
      const variant = ""
      const desc = $("div.product-spec__value")?.text().trim()

      items.each((i, el) => {
        const url = "https://hushpuppies.co.id" + $(el).attr("src")?.split("hushpuppies.co.id")[1]?.split("?v=")[0]
        const file = url.split("files/")[1]

        arr.push({ title, url, file, variant, desc })
      })
    }

    if (merchant === "ZALORA") {
      const items = $("div.relative.shrink-0.basis-full.snap-center.snap-always img")
      const title = $('[data-test-id="productName"]')?.text().trim()
      const variant = $("span.truncate.text-sm.font-normal.leading-5.text-neutral-500")?.text().trim()
      const desc = "NO DESCRIPTION"

      items.each(async (i, el) => {
        const link = $(el).attr("src")
        const urls = link.split("format(webp)/")
        const url = urls.length > 1 ? urls[1] : link
        const file = `${title.replace(/\s+/g, "-")}_${variant.replace(/\s+/g, "-")}_${i + 1}.jpg`

        arr.push({ title, url, file, variant, desc })
      })
    }

    if (merchant === "9TO9") {
      const items = $("li.swiper-slide.media-thumbs__item button img")
      const title = $("h1.product-title")?.text().trim()
      const variant = $("span.truncate.text-sm.font-normal.leading-5.text-neutral-500")?.text().trim()
      const desc = $("div.product-spec__value")?.text().trim()

      items.each(async (i, el) => {
        const url = "https://9to9.co.id" + $(el).attr("src")?.split("9to9.co.id")[1]?.split("?v=")[0]
        const file = `${title.replace(/\s+/g, "-")}_${variant.replace(/\s+/g, "-")}_${i + 1}.jpg`

        arr.push({ title, url, file, variant, desc })
      })
    }

    return Array.from(new Map(arr.map((item) => [item.url, item])).values()).map((x) => ({ ...x, merchant, source: target }))
  }

  async search(query) {
    const { target, merchant } = this

    if (merchant === "ZALORA") {
      try {
        const { data: results } = await axios.get("https://api.zalora.co.id/v1/dynproducts/datajet/list", {
          params: { enableRelevanceClassifier: "true", fullFacetCategory: "true", limit: "30", offset: "0", query, shop: "m" },
          headers: {
            Accept: "application/json",
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:146.0) Gecko/20100101 Firefox/146.0",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate, br",
            "Content-Language": "id-ID",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
          },
        })

        const { data } = results || {}
        const { NumProductFound, Products = [] } = data || {}

        return Products.map((x) => "https://www.zalora.co.id/" + x.ProductUrl)
      } catch (error) {
        return []
      }
    }

    if (merchant === "HUSHPUPPIES" || merchant === "9TO9") {
      try {
        const response = await axios(this.target, { timeout: 5000 })
        const $ = cheerio.load(response.data)

        const target = {
          HUSHPUPPIES: { domain: "https://hushpuppies.co.id", selector: "div.card__media.has-hover-image > a" },
          "9TO9": { domain: "https://9to9.co.id", selector: "div.card__media.has-hover-image > a" },
        }

        const results = $(target[merchant].selector) || []

        const search = Array.from(results)
          .map((x) => $(x).attr("href"))
          .filter((x) => x && x.includes("products"))
          .map((x) => `${target[merchant].domain}${x}`)

        return search
      } catch (error) {
        return []
      }
    }

    return []
  }
}

export default Photo
