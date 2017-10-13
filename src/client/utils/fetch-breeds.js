export default function fetchBreeds() {
  return fetch("/api/breeds").then(res => {
    return res.ok
      ? res.json()
      : Promise.resolve({
          success: false,
          error: `Error fetching breeds: ${res.status}`,
        });
  });
}
