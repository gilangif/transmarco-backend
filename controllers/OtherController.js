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
      const { target } = req.body || {}

      if (!target) throw { code: 400, message: "target is not provided" }

      const generator = await getPhotos(target)
      res.json(generator)
    } catch (error) {
      next(error)
    }
  }
}

export default OtherController
