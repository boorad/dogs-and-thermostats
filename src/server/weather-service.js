const fetch = require("node-fetch");

/**
 * Provides a wrapper around the Open Weather Map api
 */
class WeatherService {

  /**
   * Constructor
   *
   * @param {string} apiKey - The api key
   */
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.apiBase = "http://api.openweathermap.org/data/2.5";
  }

  /**
   * Gets the current temp at a location
   *
   * @param {string} zip - Zip code
   * @return {Promise<object>} The json api results
   */
  async getTemperature(zip) {
    let params = {
      zip: zip,
      units: "imperial",
      appid: this.apiKey,
    }

    let queryString = Object.keys(params)
      .map(k => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
      .join("&");

    let endpoint = `/weather?${queryString}`;

    let response = await fetch(this.apiBase + endpoint);
    if (!response.ok) {
      return {
        success: false,
        error: `Error communicating with api when getting temperature: ${response.status}`,
      };
    }

    let json = await response.json();
    return (json.cod === 200)
      ? {success: true, data: json.main.temp}
      : {success: false, error: json.message};
  }
}

module.exports = WeatherService;
