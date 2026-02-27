import Photo from "../models/Photo.js"

async function getPhotos(target) {
  const url = new URL(target)
  const photo = new Photo(target)

  const query = url.searchParams.get("q")

  if (query) {
    const search = await photo.search(query)
    const media = search.map(async (url) => await getPhotos(url))

    return (await Promise.all(media)).flat()
  }

  return [await photo.generate()]
}

class OtherController {
  static async getPhotoFromWebsite(req, res, next) {
    try {
      const { target, merchant } = req.body || {}

      if (!target) throw { code: 400, message: "target is not provided" }

      const generator = await getPhotos(target)
      res.json(generator)
    } catch (error) {
      next(error)
    }
  }

  static async photoGenerator(req, res, next) {
    try {
      const { url, type } = req.body

      const lists = ["auto", "hush_puppies", "9to9", "zalora", "hana"].includes(type)

      if (!url) throw { status: 400, message: "url is not provided" }
      if (!type) throw { status: 400, message: "type is not provided" }
      if (!lists) throw { status: 400, message: "invalid merchant type" }

      const { host, search } = new URL(url)

      let method = type

      if (type === "auto") {
        if (host === "9to9.co.id") method = "9to9"
        if (host === "www.zalora.co.id") method = "zalora"
        if (host === "hana-collections.com") method = "hana"
        if (host === "hushpuppies.co.id") method = "hush_puppies"
      }

      const photo = new Photo(url, method)

      if (search) {
        let results = []

        if (method === "zalora") {
          const lists = await photo.zaloraSearch(search)

          const arr = lists.map(async (url) => {
            try {
              const photo = new Photo(url, method)
              const result = await photo.zalora()

              return result
            } catch (error) {
              return null
            }
          })

          results = (await Promise.all(arr)).filter((x) => x)
        }

        if (method === "9to9") {
          const lists = await photo.nineToNineSearch(search)

          const arr = lists.map(async (url) => {
            try {
              const photo = new Photo(url, method)
              const result = await photo.nineToNine()

              return result
            } catch (error) {
              return null
            }
          })

          results = (await Promise.all(arr)).filter((x) => x)
        }

        if (method === "hush_puppies") {
          const lists = await photo.hushPuppiesSearch(search)

          const arr = lists.map(async (url) => {
            try {
              const photo = new Photo(url, method)
              const result = await photo.hushPuppies()

              return result
            } catch (error) {
              return null
            }
          })

          results = (await Promise.all(arr)).filter((x) => x)
        }

        if (method === "hana") {
          const lists = await photo.hanaBagsSearch(search)

          const arr = lists.map(async (url) => {
            try {
              const photo = new Photo(url, method)
              const result = await photo.hanaBags()

              return result
            } catch (error) {
              return null
            }
          })

          results = (await Promise.all(arr)).filter((x) => x)
        }

        return res.json(results)
      }

      if (method === "zalora") {
        const result = [await photo.zalora()]

        return res.json(result)
      }

      if (method === "9to9") {
        const result = [await photo.nineToNine()]

        return res.json(result)
      }

      if (method === "hush_puppies") {
        const result = [await photo.hushPuppies()]

        return res.json(result)
      }

      if (method === "hana") {
        const result = [await photo.hanaBags()]

        return res.json(result)
      }

      res.send("ok")
    } catch (error) {
      next(error)
    }
  }
}

export default OtherController
