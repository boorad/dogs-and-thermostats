import Vue from "vue";
import App from "./App";

//import "vueify/lib/insert-css";

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: "#app",
    render: h => h(App),
});
