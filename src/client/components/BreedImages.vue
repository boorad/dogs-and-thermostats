<template>
  <section id="breed-images">
    <div v-if="loading" class="images-loading">
      <p>Fetching Images...</p>
    </div>
    <div v-else-if="error" class="images-error">
      <p>{{ error }}</p>
    </div>
    <div v-else-if="displayedBreed" class="images-display">
      <section class="breed-images">
        <h1>{{ displayedBreed | capitalize }}</h1>
        <div v-if="images.length === 0" class="images-none">
          <p>No images to display.</p>
        </div>
        <div v-else class="images-container">
          <div v-for="image in randomImages" class="breed-image-wrapper">
            <img :src="image" />
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<script>
  import fetchBreedImages from "../utils/fetch-breed-images";

  export default {
    name: "breed-images",
    data() {
      return {
        error: "",
        loading: false,
        images: [],
        displayedBreed: "",
      }
    },
    computed: {
      randomImages() {
        if (this.images.length <= 3) {
          return this.images;
        }
        // less than optimal way to get 3 random images from the collection
        return [...Array(this.images.length).keys()]
          .sort(() => .5 - Math.random())
          .slice(0, 3)
          .map(idx => this.images[idx]);
      },
    },
    methods: {
      fetchImages(mainBreed, subBreed) {
        this.loading = true;
        fetchBreedImages(mainBreed, subBreed).then(images => {
          if (images.success) {
            this.images = images.data;
            this.error = "";
            this.displayedBreed = `${mainBreed} (${subBreed})`;
          } else {
            this.images = [];
            this.error = images.error;
            this.displayedBreed = "";
          }
          this.loading = false;
        });
      }
    },
    filters: {
      capitalize(v) {
        if (!v) return '';
        v = v.toString();
        return v.charAt(0).toUpperCase() + v.slice(1);
      },
    },
  }
</script>

<style lang="scss" scoped>
  .images-container {
    display: flex;
    justify-content: center;
  }

  .breed-image-wrapper img {
    box-sizing: border-box;
    max-width: 500px;
    padding: .25em;
    width: 100%;
  }
</style>
