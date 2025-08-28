/**
 * Enhanced composable for handling multi-image upload functionality
 * Supports file uploads, URL images, and proper server integration
 */
import { ref, computed, toRef } from 'vue'

export function useImageUpload(maxImages = 5, apiBaseUrl = 'http://127.0.0.1:3003') {
  const selectedFiles = ref([])
  const imageUrls = ref([])
  const previewImages = ref([])
  const isUploading = ref(false)
  const uploadProgress = ref(0)
  const errors = ref([])
  
  // Computed properties
  const totalImages = computed(() => previewImages.value.length)
  const canAddMore = computed(() => totalImages.value < maxImages)
  const remainingSlots = computed(() => maxImages - totalImages.value)
  const hasErrors = computed(() => errors.value.length > 0)
  
  // Error handling utilities
  const addError = (message) => {
    if (!errors.value.includes(message)) {
      errors.value.push(message)
    }
  }

  const clearErrors = () => {
    errors.value = []
  }

  const removeError = (message) => {
    const index = errors.value.indexOf(message)
    if (index > -1) {
      errors.value.splice(index, 1)
    }
  }
  
  // File validation
  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const maxSize = 10 * 1024 * 1024 // 10MB
    
    if (!validTypes.includes(file.type)) {
      throw new Error(`${file.name}: Invalid file type. Only JPEG, PNG, WebP are allowed.`)
    }
    
    if (file.size > maxSize) {
      throw new Error(`${file.name}: File too large. Maximum 10MB allowed.`)
    }
    
    return true
  }
  
  // Add files to upload queue
  const addFiles = (files) => {
    clearErrors()
    const fileArray = Array.isArray(files) ? files : Array.from(files)
    
    // Validate files
    const validFiles = []
    for (const file of fileArray) {
      try {
        validateFile(file)
        validFiles.push(file)
      } catch (error) {
        addError(error.message)
        continue
      }
    }
    
    // Check total limit
    if (previewImages.value.length + validFiles.length > maxImages) {
      addError(`Maximum ${maxImages} images allowed total.`)
      return
    }
    
    // Add to selectedFiles array
    selectedFiles.value.push(...validFiles)
    
    // Generate previews
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        previewImages.value.push({
          id: `file_${Date.now()}_${Math.random()}`,
          src: e.target.result,
          name: file.name,
          type: 'file',
          file: file,
          size: file.size,
          status: 'pending' // pending, uploading, uploaded, error
        })
      }
      reader.readAsDataURL(file)
    })
  }
  
  // Add URL image
  const addImageUrl = (url) => {
    if (!url || !url.trim()) {
      throw new Error('Please enter a valid URL')
    }
    
    // Basic URL validation
    try {
      new URL(url)
    } catch {
      throw new Error('Please enter a valid URL')
    }
    
    // Check total image limit
    if (previewImages.value.length >= maxImages) {
      throw new Error(`Maximum ${maxImages} images allowed total.`)
    }
    
    // Check if URL already exists
    if (imageUrls.value.includes(url)) {
      throw new Error('This URL is already added')
    }
    
    imageUrls.value.push(url)
    previewImages.value.push({
      id: `url_${Date.now()}_${Math.random()}`,
      src: url,
      name: 'URL Image',
      type: 'url',
      url: url
    })
  }
  
  // Remove image by index
  const removeImage = (index) => {
    const image = previewImages.value[index]
    if (!image) return
    
    if (image.type === 'file') {
      // Find and remove from selectedFiles
      const fileIndex = selectedFiles.value.findIndex(file => file.name === image.name)
      if (fileIndex !== -1) {
        selectedFiles.value.splice(fileIndex, 1)
      }
      
      // Revoke object URL to free memory
      if (image.src && image.src.startsWith('blob:')) {
        URL.revokeObjectURL(image.src)
      }
    } else if (image.type === 'url') {
      // Remove from imageUrls
      const urlIndex = imageUrls.value.findIndex(url => url === image.url)
      if (urlIndex !== -1) {
        imageUrls.value.splice(urlIndex, 1)
      }
    }
    
    previewImages.value.splice(index, 1)
  }
  
  // Clear all images
  const clearAll = () => {
    // Revoke object URLs to free memory
    previewImages.value.forEach(image => {
      if (image.type === 'file' && image.src && image.src.startsWith('blob:')) {
        URL.revokeObjectURL(image.src)
      }
    })
    
    selectedFiles.value = []
    imageUrls.value = []
    previewImages.value = []
  }
  
  // Load existing images for editing
  const loadExistingImages = (existingImages) => {
    if (!Array.isArray(existingImages)) return
    
    clearAll()
    
    existingImages.forEach((image, index) => {
      if (typeof image === 'string') {
        // Handle string URLs
        previewImages.value.push({
          id: `existing_${index}_${Date.now()}`,
          src: image,
          name: 'Existing Image',
          type: 'url',
          url: image,
          isExisting: true
        })
        imageUrls.value.push(image)
      } else if (image && typeof image === 'object') {
        // Handle image objects
        previewImages.value.push({
          id: `existing_${index}_${Date.now()}`,
          src: image.url || image.src,
          name: image.alt || image.name || 'Existing Image',
          type: image.type || 'url',
          url: image.url || image.src,
          isExisting: true
        })
        if (image.url || image.src) {
          imageUrls.value.push(image.url || image.src)
        }
      }
    })
  }
  
  // Get form data for submission
  const getFormData = () => {
    const formData = new FormData()
    
    // Add new files
    selectedFiles.value.forEach(file => {
      formData.append('images', file)
    })
    
    // Add existing/URL images as JSON
    if (imageUrls.value.length > 0) {
      formData.append('images', JSON.stringify(imageUrls.value))
    }
    
    return formData
  }
  
  // Get just the image data for API submission with proper FormData structure
  const getImageData = () => {
    return {
      files: selectedFiles.value,
      urls: imageUrls.value,
      total: totalImages.value
    }
  }

  // Create FormData for multipart submission to server
  const createFormData = (additionalData = {}) => {
    const formData = new FormData()
    
    // Add additional form fields first
    Object.entries(additionalData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value))
        } else {
          formData.append(key, value)
        }
      }
    })
    
    // Add new files
    selectedFiles.value.forEach(file => {
      formData.append('images', file)
    })
    
    // Add existing/URL images as JSON if any exist
    if (imageUrls.value.length > 0) {
      formData.append('existingImages', JSON.stringify(imageUrls.value))
    }
    
    return formData
  }

  // Update image status (for upload progress tracking)
  const updateImageStatus = (imageId, status, url = null) => {
    const image = previewImages.value.find(img => img.id === imageId)
    if (image) {
      image.status = status
      if (url && status === 'uploaded') {
        image.uploadedUrl = url
      }
    }
  }

  // Get images formatted for server
  const getImagesForSubmission = () => {
    return previewImages.value.map(image => {
      if (image.type === 'url') {
        return image.src
      } else if (image.uploadedUrl) {
        return image.uploadedUrl
      }
      return image.src // fallback to preview src
    }).filter(Boolean)
  }

  return {
    // State
    selectedFiles: toRef(selectedFiles),
    imageUrls: toRef(imageUrls),
    previewImages: toRef(previewImages),
    isUploading: toRef(isUploading),
    uploadProgress: toRef(uploadProgress),
    errors: toRef(errors),
    
    // Computed
    totalImages,
    canAddMore,
    remainingSlots,
    hasErrors,
    
    // Methods
    addFiles,
    addImageUrl,
    removeImage,
    clearAll,
    loadExistingImages,
    getFormData,
    getImageData,
    createFormData,
    validateFile,
    
    // Error handling
    addError,
    clearErrors,
    removeError,
    
    // Status management
    updateImageStatus,
    getImagesForSubmission
  }
}
