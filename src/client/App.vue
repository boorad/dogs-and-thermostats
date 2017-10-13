<template>
  <div id="app">
    <header>
      <h1>&#128054; Dogs and Thermostats &#128054;</h1>
    </header>
    <breed-selection v-on:breedSelected="showTempSelection"></breed-selection>
    <temperature :show="showingTemp"></temperature>
  </div>
</template>

<script>
  import "vue-style-loader!css-loader!sass-loader!./assets/styles.scss";
  import BreedSelection from "./components/BreedSelection";
  import Temperature from "./components/Temperature";

  export default {
    name: "app",
    components: {BreedSelection, Temperature},
    data() {
      return {
        showingTemp: false,
      };
    },
    methods: {
      showTempSelection() {
        this.showingTemp = true;
      }
    }
  }
</script>

<style lang="scss" scoped>
  #app {
    text-align: center;
    color: #2c3e50;

    & > header {
      background-color: #4D4D4D;
      box-sizing: border-box;
      font-size: 110%;
      padding: 1em .25em;
      width: 100%;

      h1 {
        color: #fff;
        text-shadow: 1px 1px 1px rgba(30, 30, 30, .3);
      }
    }
  }
</style>
