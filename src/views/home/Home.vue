<script setup>
import { computed, onMounted, ref } from 'vue'
import productService from '@/services/productService'
import ProductCard from '@/components/product/ProductCard.vue'
import {
  PRODUCT_CATEGORIES,
  SORT_OPTIONS,
  SORT_PRICE_LOW_HIGH,
  SORT_PRICE_HIGH_LOW,
  SORT_NAME_A_Z,
  SORT_NAME_Z_A,
} from '@/constants/appConstants'

const products = ref([])
const loading = ref(false)
const selectedCategory = ref('ALL')
const selectedSortOption = ref(SORT_OPTIONS[0])
const categoryList = ref(['ALL', ...PRODUCT_CATEGORIES])
const search = ref('')

const filteredProductList = computed(() => {
  let temArray =
    selectedCategory.value === 'ALL'
      ? [...products.value]
      : products.value.filter(
          (product) => product.category.toUpperCase() === selectedCategory.value.toUpperCase(),
        )

  if (search.value) {
    temArray = temArray.filter((item) =>
      item.name.toUpperCase().includes(search.value.toUpperCase()),
    )
  }

  if (selectedSortOption.value === SORT_PRICE_LOW_HIGH) {
    temArray = temArray.sort((a, b) => a.price - b.price)
  }
  if (selectedSortOption.value === SORT_PRICE_HIGH_LOW) {
    temArray = temArray.sort((a, b) => b.price - a.price)
  }
  if (selectedSortOption.value === SORT_NAME_A_Z) {
    temArray = temArray.sort((a, b) => a.name.localeCompare(b.name))
  }
  if (selectedSortOption.value === SORT_NAME_Z_A) {
    temArray = temArray.sort((a, b) => b.name.localeCompare(a.name))
  }

  return temArray
})

const fetchProducts = async () => {
  try {
    loading.value = true
    products.value = await productService.getProducts()
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(async () => fetchProducts())
</script>

<template>
  <div>
    <div
      class="bg-success w-100 position-relative overflow-hidden mb-4 py-5 d-flex align-items-center hero-section"
    >
      <div class="position-absolute top-0 start-0 w-100 h-100"></div>

      <div class="container-fluid position-relative z-1">
        <div class="row justify-content-center text-center">
          <div class="col-lg-8 col-xl-7">
            <h1 class="display-4 fw-bold text-white mb-4">
              Your One-Stop Stone Shop
              <br class="d-none d-lg-block" />
              Premium Granite & Quartz for Every Style!
            </h1>
            <div class="input-group mt-3 mx-auto shadow-lg rounded-4" style="max-width: 700px">
              <input
                v-model="search"
                type="text"
                class="form-control border-0 py-3 px-4 fs-5"
                placeholder="Search your favorite product..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="product-list" class="container">
      <h2 class="mb-5 text-center display-6">Discover Our Collection</h2>

      <div class="row g-3 mb-4 align-items-center">
        <div class="col-md-auto">
          <div class="d-flex flex-wrap gap-3">
            <button
              @click="selectedCategory = category"
              v-for="category in categoryList"
              :key="category"
              :class="{
                'btn-success text-white': category === selectedCategory,
                'btn-outline-success': category !== selectedCategory,
              }"
              class="btn px-4 py-2"
            >
              {{ category }}
            </button>
          </div>
        </div>
        <div class="col-md-auto ms-md-auto">
          <div class="dropdown">
            <button
              class="btn btn-outline-secondary d-flex align-items-center gap-2 px-4 py-2"
              type="button"
              data-bs-toggle="dropdown"
            >
              <i class="bi bi-sort-down"></i>
              <span class="text-capitalize">{{ selectedSortOption }}</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow-sm">
              <li v-for="(sort, index) in SORT_OPTIONS" :key="index">
                <button
                  @click="selectedSortOption = sort"
                  class="dropdown-item py-2 d-flex align-items-center gap-2"
                >
                  <i class="bi"></i>
                  <span class="text-capitalize"> {{ sort }} </span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <div v-if="filteredProductList.length > 0" class="row g-4 pb-4">
          <ProductCard
            v-for="product in filteredProductList"
            :product="product"
            :key="product.id"
          ></ProductCard>
        </div>
        <div v-else>
          <h3 class="text-center">No Products Found!</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-section {
  background: linear-gradient(to right, #6a11cb, #2575fc);
  color: white;
  padding: 80px 0;
}
</style>
