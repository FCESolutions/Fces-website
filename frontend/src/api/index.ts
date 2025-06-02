import api from './http'
import type { AxiosResponse, AxiosProgressEvent  } from 'axios'

// Replace these with your actual data types later
type CategoryData = any
type SubcategoryData = any
type SubSubcategoryData = any
type ProductData = any
type OrderData = any
type ProjectData = any
type ImgData = any

export default {
  // ===================== Categories =====================
  getCategories(): Promise<AxiosResponse<any>> {
    return api.get('/categories')
  },
  createCategory(categoryData: CategoryData): Promise<AxiosResponse<any>> {
    return api.post('/admin/categories', categoryData)
  },
  updateCategory(categoryId: string, categoryData: CategoryData): Promise<AxiosResponse<any>> {
    return api.put(`/admin/categories/${categoryId}`, categoryData)
  },
  deleteCategory(categoryId: string): Promise<AxiosResponse<any>> {
    return api.delete(`/admin/categories/${categoryId}`)
  },

  // ===================== Subcategories =====================
  getAllSubcategories(): Promise<AxiosResponse<any>> {
    return api.get('/subcategories')
  },
  getSubcategories(categoryId: string): Promise<AxiosResponse<any>> {
    return api.get(`/subcategories/category/${categoryId}`)
  },
  createSubcategory(subcategoryData: SubcategoryData): Promise<AxiosResponse<any>> {
    return api.post('/admin/subcategories', subcategoryData)
  },
  updateSubcategory(subcategoryId: string, subcategoryData: SubcategoryData): Promise<AxiosResponse<any>> {
    return api.put(`/admin/subcategories/${subcategoryId}`, subcategoryData)
  },
  deleteSubcategory(subcategoryId: string): Promise<AxiosResponse<any>> {
    return api.delete(`/admin/subcategories/${subcategoryId}`)
  },

  // ===================== Sub-Subcategories =====================
  getAllSubSubcategories(): Promise<AxiosResponse<any>> {
    return api.get('/subsubcategories')
  },
  getSubSubcategories(subcategoryId: string): Promise<AxiosResponse<any>> {
    return api.get(`/subsubcategories/subcategory/${subcategoryId}`)
  },
  createSubSubcategory(subsubcategoryData: SubSubcategoryData): Promise<AxiosResponse<any>> {
    return api.post('/admin/subsubcategories', subsubcategoryData)
  },
  updateSubSubcategory(subsubcategoryId: string, subsubcategoryData: SubSubcategoryData): Promise<AxiosResponse<any>> {
    return api.put(`/admin/subsubcategories/${subsubcategoryId}`, subsubcategoryData)
  },
  deleteSubSubcategory(subsubcategoryId: string): Promise<AxiosResponse<any>> {
    return api.delete(`/admin/subsubcategories/${subsubcategoryId}`)
  },

  // ===================== Products =====================
  getAllProducts(): Promise<AxiosResponse<any>> {
    return api.get('/products')
  },
  getProductDetails(productId: string): Promise<AxiosResponse<any>> {
    return api.get(`/products/${productId}`)
  },
  getProducts(categoryId: string, subcategoryId: string, subsubcategoryId: string): Promise<AxiosResponse<any>> {
    return api.get(`/products/category/${categoryId}/subcategory/${subcategoryId}/subsubcategory/${subsubcategoryId}`)
  },
  createProduct(productData: ProductData): Promise<AxiosResponse<any>> {
    return api.post('/admin/products', productData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  updateProduct(productId: string, productData: ProductData): Promise<AxiosResponse<any>> {
    return api.put(`/admin/products/${productId}`, productData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  deleteProduct(productId: string): Promise<AxiosResponse<any>> {
    return api.delete(`/admin/products/${productId}`)
  },
  updateProductStock(productId: string, stock: number): Promise<AxiosResponse<any>> {
    return api.put(`/admin/products/${productId}/stock`, { stock })
  },

  // ===================== Product Images =====================
  uploadProductImage(formData: FormData, options: { onUploadProgress?: (progressEvent: AxiosProgressEvent) => void } = {}) {
    return api.post('/admin/products/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: options.onUploadProgress
    })
  },
  uploadImage(data: any, config?: any): Promise<AxiosResponse<any>> {
    return api.post('/admin/upload-image', data, config)
  },
  getImageUrl(fileId: string): string {
    return `http://localhost:4000/api/images/${fileId}`
  },

  // ===================== Product Search & Sidebar =====================
  getProductsSideBar(): Promise<AxiosResponse<any>> {
    return api.get('/categories/SideBar')
  },
  getSearchedItem(keyword: string): Promise<AxiosResponse<any>> {
    return api.get(`/categories/search?q=${encodeURIComponent(keyword)}`)
  },

  // ===================== Orders =====================
  getOrders(): Promise<AxiosResponse<any>> {
    return api.get('/admin/orders')
  },
  submitOrder(orderData: OrderData): Promise<AxiosResponse<any>> {
    return api.post('/orders', orderData)
  },
  updateOrderStatus(orderId: string, status: string): Promise<AxiosResponse<any>> {
    return api.put(`/admin/orders/${orderId}/status`, { status })
  },
  deleteOrder(orderId: string): Promise<AxiosResponse<any>> {
    return api.delete(`/admin/orders/${orderId}`)
  },

  // ===================== Projects =====================
  getAllProjects(): Promise<AxiosResponse<any>> {
    return api.get('/projects')
  },
  createNewProject(projectData: ProjectData): Promise<AxiosResponse<any>> {
    return api.post('/admin/projects', projectData)
  },
  updateProject(projectId: string, projectData: ProjectData): Promise<AxiosResponse<any>> {
    return api.put(`/admin/projects/${projectId}`, projectData)
  },
  updateProjectStatus(projectId: string, isInProgress: boolean): Promise<AxiosResponse<any>> {
    return api.put(`/admin/projects/${projectId}/status`, { isInProgress })
  },
  deleteProject(projectId: string): Promise<AxiosResponse<any>> {
    return api.delete(`/admin/projects/${projectId}`)
  },

  // ----- Project Images -----
  updateProjectImg(projectId: string, imgData: FormData): Promise<AxiosResponse<any>> {
    return api.put(`/admin/projects/${projectId}/images`, imgData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  updateImgDesc(projectId: string, imageId: string, description: string): Promise<AxiosResponse<any>> {
    return api.put(`/admin/projects/${projectId}/images/${imageId}`, { description })
  },
  deleteImg(projectId: string, imageId: string): Promise<AxiosResponse<any>> {
    return api.delete(`/admin/projects/${projectId}/images/${imageId}`)
  },
  getImgsFromGridFS(id: string): Promise<AxiosResponse<any>> {
    return api.get(`/admin/projects/images/${id}`)
  },

  // ===================== Admin Access =====================
  async checkAdmin(password: string): Promise<AxiosResponse<any>> {
    return await api.post('/admin/admin-access', { password })
  },

  // ===================== Upload files =====================
  uploadFile(file: File): Promise<AxiosResponse<any>> {
    return api.post('/admin/upload-file', file, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}
