import VueRouter from 'vue-router';

//Components
import Login from './components/TheLogin.vue';
import Home from './components/TheHome.vue';

const routes = [
  { name: 'home', path: '/', component: Home },
  { name: 'login', path: '/login', component: Login }
]

const router = new VueRouter({
  mode: 'history',
  routes
});

export { router };
