<template>
    <div class="dashboard">
        <log-in></log-in>
        <div id='posts'>
            <blog-post v-for='post in posts' v-bind:post='post' v-bind:key='post.id'></blog-post>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import BlogPost from '@/components/BlogPost.vue'

export default {
    name: 'dashboard',
    components: {
        BlogPost
    },
    computed: {
        posts () {
            return this.$store.state.posts;
        }
    }
}
</script>
