<script setup>
import { PRODUCT_CATEGORIES } from '@/constants/appConstants'
import productService from '@/services/productService'
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSwal } from '@/composibles/useSwal'
import { APP_ROUTE_NAMES } from '@/constants/routeNames'
import { uploadToCloudinary } from '@/utility/cloudinary'

const { showSuccess } = useSwal()
const router = useRouter()
const route = useRoute()

const errorList = reactive([])
const loading = ref(false)
const isImageLoading = ref(false)
const productObj = reactive({
  name: '',
  description: '',
  price: 0,
  salePrice: 0,
  tags: [],
  isBestSeller: false,
  category: '',
  image: 'https://placehold.co/600x400',
})
const productIdForUpdate = route.params.id

async function handleSubmit() {
  try {
    loading.value = true
    errorList.length = 0

    // validations
    if (productObj.name.length < 3) {
      errorList.push('Name should be at least 3 char long.')
    }
    if (productObj.price <= 0) {
      errorList.push('Price should be greater than 0.')
    }
    if (productObj.category === '') {
      errorList.push('Please select a category.')
    }

    if (!errorList.length) {
      const productData = {
        ...productObj,
        price: Number(productObj.price),
        salePrice: productObj.salePrice ? Number(productObj.salePrice) : null,
        tags: productObj.tags.length > 0 ? productObj.tags.split(',').map((tag) => tag.trim()) : [],
        bestseller: Boolean(productObj.isBestSeller),
      }
      if (productIdForUpdate) {
        // update
        await productService.updateProduct(productIdForUpdate, productData)
        showSuccess('Product updated successfully')
        router.push({ name: APP_ROUTE_NAMES.PRODUCT_LIST })
      } else {
        // create
        await productService.createProduct(productData)
        showSuccess('Product created successfully')
        router.push({ name: APP_ROUTE_NAMES.PRODUCT_LIST })
        // console.log(productData)
      }
    }
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}

async function handleImageUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  try {
    isImageLoading.value = true
    const imageUrl = await uploadToCloudinary(file)
    productObj.image = imageUrl
  } catch (err) {
    console.error(err)
    throw err
  } finally {
    isImageLoading.value = false
  }
}

onMounted(async () => {
  if (!productIdForUpdate) return
  loading.value = true

  try {
    const product = await productService.getProductsById(productIdForUpdate)

    Object.assign(productObj, { ...product, tags: product.tags.join(', ') })
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container">
    <div class="row border p-4 my-5 rounded">
      <div class="col-9">
        <form @submit.prevent="handleSubmit">
          <div class="h2 text-center text-success">
            {{ productIdForUpdate ? 'Update' : 'Create' }} Product
          </div>
          <hr />
          <div v-if="errorList.length > 0" class="alert alert-danger pb-0">
            Please fix the following errors:
            <ul>
              <li v-for="error in errorList" :key="error">{{ error }}</li>
            </ul>
          </div>

          <div class="mt-3">
            <span class="text-muted">Name</span>
            <input v-model.trim="productObj.name" type="text" class="form-control" />
          </div>
          <div class="mt-3">
            <span class="text-muted">Description</span>
            <textarea v-model="productObj.description" type="text" class="form-control"></textarea>
          </div>
          <div class="mt-3">
            <span class="text-muted">Price</span>
            <input v-model.number="productObj.price" type="number" class="form-control" />
          </div>

          <div class="mt-3">
            <span class="text-muted">Sale Price</span>
            <input v-model.number="productObj.salePrice" type="number" class="form-control" />
          </div>
          <div class="mt-3">
            <span class="text-muted">Tags (comma-seperated)</span>
            <input
              v-model="productObj.tags"
              type="text"
              class="form-control"
              placeholder="e.g., modern, classic, luxury"
            />
          </div>
          <div class="form-check form-switch pt-3">
            <input
              v-model="productObj.isBestSeller"
              class="form-check-input"
              type="checkbox"
              role="switch"
            />

            <label class="form-check-label" for="bestseller"> Bestseller </label>
          </div>
          <div class="mt-3">
            <label class="text-muted">Category</label>
            <select v-model="productObj.category" class="form-select">
              <option v-for="option in PRODUCT_CATEGORIES" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Image</label>
            <div class="input-group">
              <input
                @change="handleImageUpload"
                :disabled="isImageLoading"
                type="file"
                class="form-control"
              />
            </div>
          </div>
          <div class="pt-3">
            <button :disabled="loading || isImageLoading" class="btn btn-success m-2 w-25">
              <span
                v-if="loading || isImageLoading"
                class="spinner-border spinner-border-sm me-2"
              ></span
              >Submit
            </button>
            <router-link
              :to="{ name: APP_ROUTE_NAMES.PRODUCT_LIST }"
              class="btn btn-secondary m-2 w-25"
            >
              Cancel
            </router-link>
          </div>
        </form>
      </div>
      <div class="col-3">
        <img
          :src="productObj.image"
          class="img-fluid w-100 m-3 p-3 rounded"
          alt="Product
        preview"
        />
      </div>
    </div>
  </div>
</template>
