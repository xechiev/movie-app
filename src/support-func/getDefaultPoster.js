export default function getDefaultPoster(poster, url, defaultPoster) {
  return poster ? url + poster : (poster = defaultPoster)
}
