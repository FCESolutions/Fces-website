import axios from 'axios'
import { createCategory } from '../../../backend/controllers/categoryController'
import { create } from '../../../backend/models/Category'
import { deleteProduct } from '../../../backend/controllers/productController'

const api = axios.create({
  baseURL: 'http://localhost:4000/api'
})

export default {
  getCategories() {
    return api.get('/categories')
  },
  createCategory(categoryData) {
    return api.post('/categories', categoryData)
  },
  getAllSubcategories() {
    return api.get('/subcategories')
  },
  createSubcategory(subcategoryData) {
    return api.post('/subcategories', subcategoryData)
  },
  getAllSubSubcategories() {
    return api.get('/subsubcategories')
  },
  createSubSubcategory(subsubcategoryData) {
    return api.post('/subsubcategories', subsubcategoryData)
  },
  getAllProducts() {
    return api.get('/products')
  },
  createProduct(productData) {
    return api.post('/admin/products', productData)
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
  updateProduct(productId, productData) {
    return api.put(`/admin/products/${productId}`, productData)
  },
  deleteProduct(productId) {
    return api.delete(`/admin/products/${productId}`)
  },
  // Orders
  submitOrder(orderData) {
    return api.post('/orders', orderData)
  },
  checkAdmin(password) {
    return api.post('/admin/admin-access', { password })
  },
  updateOrderStatus(orderId, status) {
    return api.put(`/admin/orders/${orderId}/status`, { status })
  },
  deleteOrder(orderId) {
    return api.delete(`/admin/orders/${orderId}`)
  },
  updateOrderStock(productId, stock) {
    return api.put(`/admin/orders/${productId}/stock`, { stock });  // Updated to use products
  },
  // Projects
  // Get all projects
  getAllProjects() {
    return api.get('/admin/projects')
  },
  // Create new project
  createNewProject(projectData) {
    return api.post('/admin/projects', projectData)
  },
  // Update project 
  updateProject(projectId, projectData) {
    return api.put(`/admin/projects/${projectId}`, projectData)
  },
  // Update project status
  updateProjectStatus(projectId, isInProgress) {
    return api.put(`/admin/projects/${projectId}/status`, { isInProgress })
  },
  // Delete project
  deleteProject(projectId) {
    return api.delete(`/admin/projects/${projectId}`)
  },
  // update project image
  updateProjectImg(projectId, imgData) {
    return api.put(`/admin/projects/${projectId}/images`, imgData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },  
  // update image description
  updateImgDesc(projectId, imageId, description) {
    return api.put(`/admin/projects/${projectId}/images/${imageId}`, { description })
  },
  // delete image
  deleteImg(projectId, imageId) {
    return api.delete(`/admin/projects/${projectId}/images/${imageId}`)
  },
  // get images from gridfs
  getImgsFromGridFS(id) {
    return api.get(`/admin/projects/images/${id}`)
  },

}