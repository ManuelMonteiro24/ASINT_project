import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import OptionsInterface from './components/OptionsInterface.vue';

Vue.use(VueRouter);
Vue.component('App', App); //register App component
Vue.component('options-interface', OptionsInterface);

new Vue().$mount('#app');
