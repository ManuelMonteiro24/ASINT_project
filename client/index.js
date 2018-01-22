import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import OptionsInterface from './components/OptionsInterface.vue';
import CheckIO from './components/CheckIO.vue';

Vue.use(VueRouter);
Vue.component('App', App); //register App component
Vue.component('options-interface', OptionsInterface);
Vue.component('check-io', CheckIO);

new Vue().$mount('#app');
