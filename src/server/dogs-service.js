const fetch = require("node-fetch");

/**
 * Provides a wrapper around the Dogs.ceo api
 */
class DogsService {

  /**
   * Constructor
   */
  constructor() {
    this.apiBase = "https://dog.ceo"
  }

  /**
   * Gets the full breeds list
   *
   * @return {Promise<object>} The json api results
   */
  async getBreeds() {
    let endpoint = "/api/breeds/list/all";

    let response = await fetch(this.apiBase + endpoint);
    if (!response.ok) {
      return {
        success: false,
        error: `Error communicating with api when getting breeds list: ${response.status}`,
      };
    }

    let json = await response.json();
    return (json.status === "success")
      ? {success: true, data: json.message}
      : {success: false, error: json.message};
  }

  /**
   * Gets the images for the dog breed
   *
   * @param {string} breed - The main breed
   * @param {string} subBreed - The sub breed, or 'all' for all subreeds
   * @return {Promise<object>} The json api results
   */
  async getBreedImages(breed, subBreed="all") {
    let endpoint = (subBreed !== "all")
      ? `/api/breed/${breed}/${subBreed}/images`
      : `/api/breed/${breed}/images`;

    let response = await fetch(this.apiBase + endpoint);
    if (!response.ok) {
      return {
        success: false,
        error: `Error communicating with api when getting breed images: ${response.status}`,
      };
    }

    let json = await response.json();
    return (json.status === "success")
      ? {success: true, data: json.message}
      : {success: false, error: json.message};
  }

}

module.exports = DogsService;
