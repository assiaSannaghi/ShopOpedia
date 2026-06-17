<script setup>
import { APP_ROUTE_NAMES } from '@/constants/routeNames'
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="container vh-100 d-flex align-items-center justify-content-center">
    <div class="text-center">
      <h2 class="mb-3">Page Not Found</h2>
      <p class="text-muted mb-4">Sorry, the page you are looking for does not exist.</p>
      <router-link :to="{ name: APP_ROUTE_NAMES.HOME }" class="btn btn-primary">
        Go Back Home
      </router-link>
    </div>
  </div>
</template>
