<template>
  <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import HelloWorld from '@/components/HelloWorld' // @ is an alias to /src

@Component({
  components: {
    HelloWorld,
  },
})
export default class extends Vue {}
</script>
