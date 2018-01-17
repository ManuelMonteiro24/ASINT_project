import VueRouter from 'vue-router';

//Components
import Home from './components/TheHome.vue';
import Login from './components/TheLogin.vue';
import AdminLogin from './components/TheAdminLogin.vue';

const routes = [
  { name: 'home', path: '/', component: Home },
  { name: 'login', path: '/login', component: Login },
  { name: 'adminlogin', path: '/login/admin', component: AdminLogin }
]

const router = new VueRouter({
  mode: 'history',
  routes
});

export { router };
