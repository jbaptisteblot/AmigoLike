import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import Profile from './views/Profile.vue'
import Logout from './components/logout'
import Search from './views/Search'
import MyTravels from './views/MyTravels'
import TravelDetails from './views/TravelDetails'
Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },{
            path: '/login',
            name: 'login',
            component: Login
        }, {
            path: '/logout',
            name: 'logout',
            component: Logout
        },{
            path: '/register',
            name: 'register',
            component: Register
        },
        {
            path: '/profile',
            name: 'profile',
            component: Profile,
            meta: {requireAuth : true}
        },
        {
            path: '/search/:villeDepart/:villeArrive/:dateDepart',
            name: 'search',
            component: Search
        },
        {
            path: '/myTravels',
            name: 'myTravels',
            component: MyTravels,
            meta: {requireAuth : true}
        },
        {
            path: '/travelDetails/:idTravel/:depart/:arrive',
            name: 'travelDetails',
            component: TravelDetails
        },
        {
            path: '/about',
            name: 'about',
            component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
        }
    ]
})
