<template>
  <section id="breed-viewer">

    <section id="breed-selector" class="form-row">
      <div class="fields">

        <div v-if="loading" class="fields-loading">
          <p>Fetching Breeds...</p>
        </div>

        <div v-else-if="error" class="fields-error">
          <p>{{ error }}</p>
        </div>

        <div v-else class="fields-form">
          <p class="label">Select a Pup Type</p>
          <form v-on:submit.prevent>
            <div class="inputs">
              <div class="input-wrapper">
                <select v-model="selectedMainBreed" name="mainBreed">
                  <option value="" disabled selected>Choose...</option>
                  <option v-for="breed in mainBreeds" :value="breed">{{ breed | capitalize }}</option>
                </select>
              </div>
              <div v-if="selectedMainBreed && getSubBreeds(selectedMainBreed).length > 0" class="input-wrapper">
                <select v-model="selectedSubBreed" name="subBreed">
                  <option value="all" selected>All Sub-breeds</option>
                  <option v-for="breed in getSubBreeds(selectedMainBreed)" :value="breed">{{ breed | capitalize }}</option>
                </select>
              </div>
              <div class="input-wrapper">
                <button @click="displayImages" v-bind:class="{ disabled: !this.selectedMainBreed }" class="btn">See Doggos</button>
              </div>
            </div>
          </form>
        </div>

      </div>
    </section>

    <breed-images ref="imagesComponent"></breed-images>

  </section>
</template>

<script>

  import BreedImages from "./BreedImages";
  import fetchBreeds from "../utils/fetch-breeds";

  export default {
    name: "breed-selection",
    components: {BreedImages},

    data() {
      return {
        error: "",
        breeds: [],
        selectedMainBreed: "",
        selectedSubBreed: "all",
        loading: true,
      }
    },

    computed: {
      mainBreeds() {
        return Object.keys(this.breeds);
      },
    },

    methods: {
      getSubBreeds(breed) {
        return (breed in this.breeds)
          ? this.breeds[breed]
          : [];
      },
      displayImages() {
        if (this.selectedMainBreed) {
          this.$refs.imagesComponent.fetchImages(
            this.selectedMainBreed,
            this.selectedSubBreed
          );
          this.$emit("breedSelected");
        }
      }
    },

    watch: {
      // reset the sub-breed if the primary breed is changed so that
      // incompatible sub-breeds don't linger
      selectedMainBreed(_newBreed) {
        this.selectedSubBreed = "all";
      }
    },

    filters: {
      capitalize(v) {
        if (!v) return '';
        v = v.toString();
        return v.charAt(0).toUpperCase() + v.slice(1);
      },
    },

    // grab the full breeds list from the api
    created() {
      // use the breeds from session storage if they exist. this is to be
      // considerate when debugging and constantly refreshing
      let cachedBreeds = JSON.parse(sessionStorage.getItem("breeds"));
      if (cachedBreeds) {
        this.breeds = cachedBreeds.data;
        this.error = "";
        this.loading = false;
        return;
      }
      fetchBreeds().then(breeds => {
        if (breeds.success) {
          this.breeds = breeds.data;
          this.error = "";
          sessionStorage.setItem("breeds", JSON.stringify(breeds));
        } else {
          this.breeds = [];
          this.error = breeds.error;
        }
        this.loading = false;
      });
    }

  }

</script>

<style lang="scss" scoped>
  .fields {
    text-align: center;
  }

  .fields-form {

    .label {
      font-weight: 700;
    }

    .inputs {
      display: flex;
      justify-content: center;
    }

    select {
      font-size: 1em;
      padding: .4em;
    }
  }

</style>
