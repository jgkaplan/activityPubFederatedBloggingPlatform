import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'es6-promise/auto'
import Vuex from 'vuex'

Vue.config.productionTip = false

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        posts: [{
            id: 0,
            type: 'text',
            contents: 'What a wonderful world'
        },{
            id: 1,
            type: 'text',
            contents: 'This is my second post'
        }],
        jwt: null
    },
    mutations: {
        // addPost (state) {
        //     state.posts.push()
        // },
        // login(state) {
        //
        // }
    },
    actions: {
        // getPosts(context) {
            //make api calls
            // for post in posts:
            // context.commit('addPost', post);
        // },
        // login(context){
        //
        // }
    }
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
