<template>
    <div class='post'>
        <template v-if='post.type === "text"'>
            {{post.contents}}
        </template>
        <template class='post' v-else-if='post.type === null'>
            whoops no content here
        </template>
    </div>
</template>

<script>
export default {
  name: 'BlogPost',
  props: ['post']
}
</script>
