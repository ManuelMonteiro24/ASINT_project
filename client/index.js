import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import Interface from './components/Interface.vue';
import Room from './components/Room.vue';

Vue.use(VueRouter);
Vue.component('App', App); //register App component
Vue.component('interface', Interface);
Vue.component('room', Room);

new Vue().$mount('#app');
