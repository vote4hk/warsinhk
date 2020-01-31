/**
 * Fetch latest Collaction Poster Gallery
 *
 */
const fetch = require("node-fetch")

exports.fetchCollactionPosterGallery = async () => {
  const posterRequest = await fetch(
    "https://assets.collaction.hk/extradition_gallery/wars.json"
  )
  const response = await posterRequest.json()
  const galleries = response.data.galleries

  return { galleries }
}
