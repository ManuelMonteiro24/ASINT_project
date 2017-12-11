import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';

Vue.use(VueRouter);
Vue.component('App', App); //register App component

new Vue().$mount('#app');
