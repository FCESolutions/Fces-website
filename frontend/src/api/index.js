import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:4000/api'
})

export default {
  getCategories() {
    return api.get('/categories')
  },
  // Add other endpoints...
}