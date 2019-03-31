Vue.component('post', {
    props: ['content'],
    template: '<template v-if="content.type === text"><div class="post">{{content.contents}}</div></template>'
});

Vue.component('top-bar', {
    template: '<div>top bar</div>'
});

Vue.component('make-post', {
    template: '<div>click here to make a post</div>'
});

var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello World!',
        posts: [{
            id: 0,
            type: 'text',
            contents: 'What a wonderful world'
        }]
    },
    // created: function () {
        // this.posts = ['wowwowow'];
    // }
});

// Use lodash throttle to check if more content needs to be loaded
