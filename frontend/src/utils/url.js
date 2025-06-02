// src/utils/url.js
export const fullUrl = (relativePath) => {
  const base = process.env.VUE_APP_API_BASE_URL || ''
  return relativePath.startsWith('http://') || relativePath.startsWith('https://')
    ? relativePath
    : `${base}${relativePath}`
}
