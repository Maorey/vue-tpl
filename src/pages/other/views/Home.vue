<template>
  <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import HelloWorld from '@com/HelloWorld'

@Component({ components: { HelloWorld } })
export default class extends Vue {}
</script>
