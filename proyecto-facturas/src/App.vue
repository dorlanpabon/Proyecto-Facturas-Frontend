<template>
  <router-view />
</template>


<script>
import { mapActions } from "vuex";

export default {
  methods: {
    ...mapActions(["getToken"]),
  },
  mounted() {
    this.getToken();
  },
};
</script>


<style>
</style>
