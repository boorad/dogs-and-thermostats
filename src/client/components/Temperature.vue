<template>
  <section v-if="show" id="temperature-lookup" class="form-row">
    <div class="fields">

      <div v-if="loading" class="temp-loading">
        <p>Fetching Temperature...</p>
      </div>

      <div v-else-if="error" class="temp-error">
        <p>{{ error }}</p>
      </div>

      <div v-else-if="temp" class="temp-suggestion">
        <p class="current">{{ temp }} &#8457;</p>
        <div v-if="tempSuggestion(temp) === 'lower'" class="temp-suggestion-lower">
          <p>
            <span class="emoji">&#128293;</span>
            You should lower your thermostat!
            <span class="emoji">&#128293;</span>
          </p>
        </div>
        <div v-else-if="tempSuggestion(temp) === 'raise'" class="temp-suggestion-raise">
          <p>
            <span class="emoji">&#9731;</span>
            You should raise your thermostat!
            <span class="emoji">&#9731;</span>
          </p>
        </div>
        <div v-else class="temp-suggestion-keep">
          <p>
            <span class="emoji">&#128077;</span>
            Nice temperature!
            <span class="emoji">&#128077;</span>
          </p>
        </div>
      </div>

      <div class="form-fields">
        <p class="label">Enter your zip to find out the temp</p>
        <form v-on:submit.prevent>
          <div class="inputs">
            <div class="input-wrapper">
              <input type="text" v-model="zip" size="10" name="zip">
            </div>
            <div class="input-wrapper">
              <button @click="handleClick" v-bind:class="{ disabled: !this.zip }" class="btn">Get Temp</button>
            </div>
          </div>
        </form>
      </div>

    </div>
  </section>
</template>

<script>

  import fetchTemperature from "../utils/fetch-temperature";

  export default {
    name: "temperature",
    props: ["show"],
    data() {
      return {
        zip: "",
        temp: "",
        error: "",
        loading: false,
      };
    },
    methods: {
      handleClick() {
        if (this.zip) {
          if (this.validateZip(this.zip)) {
            this.fetchTemp(this.zip);
          } else {
            this.error = "Invalid Zipcode";
          }
        }
      },
      validateZip(zip) {
        return /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zip);
      },
      fetchTemp(zip) {
        this.loading = true;
        fetchTemperature(zip).then(temp => {
          if (temp.success) {
            this.temp = temp.data;
            this.error = "";
          } else {
            this.temp = "";
            this.error = temp.error;
          }
          this.loading = false;
        });
      },
      tempSuggestion(temp) {
        if (temp > 74) return "lower";
        else if (temp < 68) return "raise";
        else return "keep";
      }
    },
  }

</script>

<style lang="scss" scoped>
  #temperature-lookup {
    margin-top: 1em;
  }

  .temp-suggestion {
    background-color: #56C271;
    border-radius: 15px;
    box-sizing: border-box;
    display: inline-block;
    padding: 1.5em 2em;
    font-size: 1.1em;

    p {
      color: #fff;
      text-shadow: 1px 1px 1px rgba(30, 30, 30, .3);
      margin: 0;
    }

    .emoji {
      font-size: 1.5em;
    }

    .current {
      font-weight: 700;
      font-size: 1.5em;
    }
  }
</style>
