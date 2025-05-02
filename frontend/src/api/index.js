import axios from 'axios'
import { getAllSubcategories } from '../../../backend/controllers/subcategoryController'

const api = axios.create({
  baseURL: 'http://localhost:4000/api'
})

export default {
  getCategories() {
    return api.get('/categories')
  },
  getAllSubcategories() {
    return api.get('/subcategories')
  },
  getAllSubSubcategories() {
    return api.get('/subsubcategories')
  },
  getAllProducts() {
    return api.get('/products')
  },
  getSubcategories(categoryId) {
    return api.get(`/subcategories/category/${categoryId}`)
  },
  getSubSubcategories(subcategoryId) {
    return api.get(`/subsubcategories/subcategory/${subcategoryId}`)
  },
  getProducts(categoryId, subcategoryId, subsubcategoryId) {
    return api.get(`/products/category/${categoryId}/subcategory/${subcategoryId}/subsubcategory/${subsubcategoryId}`)
  },
  getProductDetails(productId) {
    return api.get(`/products/${productId}`)
  },
  getProductsSideBar() {
    return api.get('/categories/SideBar')
  },
  getSearchedItem() {
    return api.get('/categories/search?q=${encodeURIComponent(keyword)}')
  },
  submitOrder(orderData) {
    return api.post('/orders', orderData)
  }
  // Add other endpoints...
}