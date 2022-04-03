<template>
  <router-view />
</template>


<script>
import { mapActions } from "vuex";

export default {
  methods: {
    ...mapActions(["getToken"]),
  },
  async created() {
    await this.getToken();
  },
};
</script>


<style>
</style>
