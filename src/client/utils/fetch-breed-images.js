export default function fetchBreedImages(breed, subBreed="all") {
  return fetch(`/api/images/${breed}/${subBreed}`).then(res => {
    return res.ok
      ? res.json()
      : Promise.resolve({
          success: false,
          error: `Error fetching breed images: ${res.status}`,
        });
  });
}
