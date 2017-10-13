export default function fetchTemperature(zip) {
  return fetch(`/api/temp/${zip}`).then(res => {
    return res.ok
      ? res.json()
      : Promise.resolve({
          success: false,
          error: `Error fetching temp: ${res.status}`,
        });
  });
}
