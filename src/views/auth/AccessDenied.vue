<script setup>
import { APP_ROUTE_NAMES } from '@/constants/routeNames'
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="container vh-100 d-flex align-items-center justify-content-center">
    <div class="text-center">
      <h1 class="display-1 fw-bold text-danger">403</h1>

      <h2 class="mb-3">Access Denied</h2>

      <p class="text-muted mb-4">You do not have permission to access this page.</p>

      <router-link :to="{ name: APP_ROUTE_NAMES.HOME }" class="btn btn-primary">
        Go Back Home
      </router-link>
    </div>
  </div>
</template>
