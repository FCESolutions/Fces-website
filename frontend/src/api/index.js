import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:4000/api'
})

export default {
  getCategories() {
    return api.get('/categories')
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
  getProductsSideBar() {
    return api.get('/categories/SideBar')
  }
  // Add other endpoints...
}