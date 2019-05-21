<template>
    <div class="home">
        <img alt="Vue logo" src="../assets/logo.png">
        <log-in></log-in>
        <div id='posts'>
            <blog-post v-for='post in posts' v-bind:post='post' v-bind:key='post.id'></blog-post>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import BlogPost from '@/components/BlogPost.vue'
import LogIn from '@/components/LogIn.vue'

export default {
    name: 'home',
    components: {
        BlogPost,
        LogIn
    },
    computed: {
        posts () {
            return this.$store.state.posts;
        }
    }
}
</script>
