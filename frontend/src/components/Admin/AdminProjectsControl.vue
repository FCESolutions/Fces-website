<template> 
  <div class="admin-projects">
    <div class="admin-header">
      <h2>Gestion des projets</h2>
      <button @click="showAddModal = true" class="add-project-btn">
        <i class="fas fa-plus"></i> Ajouter un projet
      </button>
    </div>

    <div class="projects-list">
      <div v-for="project in projects" :key="project._id" class="project-card">
        <div class="project-card-header">
          <h3>{{ project.title }}</h3>
          <div class="project-actions">
            <button @click="editProject(project)" class="edit-btn">
              <i class="fas fa-edit"></i>
            </button>
            <button @click="confirmDelete(project._id)" class="delete-btn">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        
        <div class="status-toggle">
          <label>
            <input type="checkbox" v-model="project.isInProgress" @change="updateProjectStatus(project)">
            En cours
          </label>
        </div>

        <div class="project-images">
          <div 
              v-for="(image, idx) in project.images" 
              :key="idx" 
          >
            <div class="image-item">
              <img 
                :src="getImageUrl(image.imageId)" 
                :alt="image.description || 'Image du projet'"
                @error="handleImageError"
              >
              <button @click="removeImage(project._id, image.imageId)" class="remove-img-btn">
                <i class="fas fa-times"></i>
              </button>
            </div>
              <input
                v-model="image.description"
                type="text"
                placeholder="Description de l'image"
                class="image-desc-input"
                @blur="updateImageDescription(project._id, image)"
              />
          </div>            
        </div>

        <div class="add-images">
          <input type="file" multiple name="images" @change="handleImageUpload($event, project._id)" 
            accept="image/*" :id="'file-upload-'+project._id" class="file-input">
          <label :for="'file-upload-'+project._id" class="upload-label">
            <i class="fas fa-cloud-upload-alt"></i> Ajouter des images
          </label>
        </div>
      </div>
    </div>

    <!-- Add/Edit Project Modal -->
    <div v-if="showAddModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editingProject ? 'Modifier le projet' : 'Ajouter un projet' }}</h3>
          <button @click="closeModal" class="close-modal">&times;</button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>Titre du projet</label>
            <input type="text" v-model="currentProject.title" placeholder="Entrez le titre du projet">
          </div>
          
          <div class="form-group">
            <label>
              <input type="checkbox" v-model="currentProject.isInProgress">
              Marquer comme "En cours"
            </label>
          </div>
          
          <div class="form-actions">
            <button @click="saveProject" class="save-btn">
              {{ editingProject ? 'Mettre à jour' : 'Enregistrer' }}
            </button>
            <button @click="closeModal" class="cancel-btn">Annuler</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-content delete-confirm">
        <h3>Confirmer la suppression</h3>
        <p>Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.</p>
        <div class="confirm-actions">
          <button @click="deleteProject" class="confirm-btn">Supprimer</button>
          <button @click="showDeleteModal = false" class="cancel-btn">Annuler</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api';
import { useToast } from 'vue-toastification';

const projects = ref([]);
const showAddModal = ref(false);
const showDeleteModal = ref(false);
const editingProject = ref(false);
const currentProject = ref({
  title: '',
  images: [],
  isInProgress: false
});
const projectToDelete = ref(null);
const toast = useToast();

// Fetch all projects
const fetchProjects = async () => {
  try {
    const response = await api.getAllProjects(); // ← Add `await` here
    projects.value = response.data;
    console.log('Projects loaded:', projects.value); // Optional: verify data
  } catch (error) {
    console.error('Error fetching projects:', error);
  }
};

// Add new project
const addProject = async () => {
  try {
    const response = await api.createNewProject(currentProject.value);
    projects.value.push(response.data);
    closeModal();
  } catch (error) {
    console.error('Error adding project:', error);
  }
};

// Update project
const updateProject = async () => {
  try {
    const response = await api.updateProject(currentProject.value._id, currentProject.value);
    const index = projects.value.findIndex(p => p._id === currentProject.value._id);
    if (index !== -1) {
      projects.value[index] = response.data;
    }
    closeModal();
  } catch (error) {
    console.error('Error updating project:', error);
  }
};

// Update project status
const updateProjectStatus = async (project) => {
  try {
    await api.updateProjectStatus(project._id, project.isInProgress);
  } catch (error) {
    console.error('Error updating project status:', error);
    // Revert the change if failed
    project.isInProgress = !project.isInProgress;
  }
};

// Update image description
const updateImageDescription = async (projectId, image) => {
  try {
    console.log('Updating image description:', image.imageId, image.description);
    await api.updateImgDesc(projectId, image.imageId, image.description);
  } catch (error) {
    console.error('Error updating image description:', error);
  }
};

// Delete project
const deleteProject = async () => {
  try {
    await api.deleteProject(projectToDelete.value);
    projects.value = projects.value.filter(p => p._id !== projectToDelete.value);
    showDeleteModal.value = false;
  } catch (error) {
    console.error('Error deleting project:', error);
  }
};

// Handle image upload
const handleImageUpload = async (event, projectId) => {
  const files = event.target.files;
  console.log('Files:', files);
  if (!files.length) return;

  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('images', files[i]);
  }

  try {
    const response = await api.updateProjectImg(projectId, formData);

    const projectIndex = projects.value.findIndex(p => p._id === projectId);
    if (projectIndex !== -1) {
      const uploaded = response.data.uploadedImages || [];
      projects.value[projectIndex].images.push(...uploaded);
    }

    const msg = response.data.message;
    console.log('Upload Message:', msg);
    // Show it to user (toast/snackbar/alert)
    toast.success(msg); 
  } catch (error) {
    console.error('Error uploading images:', error);

    // ✅ Show error message from backend
    const errMsg = error.response?.data?.message || 'Failed to upload images';
    toast.error(errMsg);
  }
};

// Get image URL from GridFS
const getImageUrl = (imageId) => {
    console.log('Loading image with ID:', imageId);
    return `http://localhost:4000/api/admin/projects/images/${imageId}`
};

const handleImageError = (event) => {
  console.error('Image failed to load', event);
  event.target.style.display = 'none'; // or show a placeholder
};

// Remove image
const removeImage = async (projectId, imageId) => {
  try {
    await api.deleteImg(projectId, imageId);
    const projectIndex = projects.value.findIndex(p => p._id === projectId);
    if (projectIndex !== -1) {
      projects.value[projectIndex].images = projects.value[projectIndex].images.filter(
        img => img.imageId !== imageId
      );
    }
  } catch (error) {
    console.error('Error removing image:', error);
  }
};

// Edit project
const editProject = (project) => {
  currentProject.value = JSON.parse(JSON.stringify(project));
  editingProject.value = true;
  showAddModal.value = true;
};

// Confirm delete
const confirmDelete = (projectId) => {
  projectToDelete.value = projectId;
  showDeleteModal.value = true;
};

// Save project (add or update)
const saveProject = () => {
  if (editingProject.value) {
    updateProject();
  } else {
    addProject();
  }
};

// Close modal
const closeModal = () => {
  showAddModal.value = false;
  editingProject.value = false;
  currentProject.value = {
    title: '',
    images: [],
    isInProgress: false
  };
};

// Initialize
onMounted(() => {
  fetchProjects();
});
</script>

<style scoped>
.admin-projects {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
  color: #2c3e50;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.add-project-btn {
  background-color: #176B87;
  color: #fff;
  border: none;
  padding: 0.65rem 1.25rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s;
}

.add-project-btn:hover {
  background-color: #145a70;
}

.projects-list {
  display: grid;
  gap: 1.75rem;
}

.project-card {
  position: relative;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 400px;
}

.project-card:hover {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
}

.project-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.project-card-header h3 {
  font-size: 1.25rem;
  margin: 0;
}

.project-actions button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  margin-left: 0.5rem;
  padding: 0.4rem;
  border-radius: 5px;
  transition: background-color 0.2s;
}

.edit-btn {
  color: #176B87;
}

.edit-btn:hover {
  background-color: #edf7fa;
}

.delete-btn {
  color: #e74c3c;
}

.delete-btn:hover {
  background-color: #fbeaea;
}

.status-toggle {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  margin: 0;
}

.status-toggle label {
  background: #f5f5f5;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 1rem;
  box-shadow: 0 0 2px rgba(0,0,0,0.1);
}

.project-images {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.image-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #eee;
  margin-bottom: 0.5rem;
}

.image-item img {
  width: 100%;
  height: 260px;
  object-fit: cover;
  display: block;
}

/* Description input outside the image */
.image-desc-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-bottom: 1rem;
  box-sizing: border-box;
}

.image-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.25rem 0.5rem;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(4px);
  transition: background 0.3s ease;
}

.image-actions input {
  flex: 1;
  padding: 0.3rem 0.5rem;
  font-size: 0.85rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
}

.remove-img-btn {
  position: absolute;
  top: 0.4rem;
  right: 0.4rem;
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
}

.remove-img-btn:hover {
  background-color: #c0392b;
}

.image-item:hover .image-actions {
  background: rgba(255, 255, 255, 0.95);
}

.add-images {
  margin-top: 1rem;
}

.file-input {
  display: none;
}

.upload-label {
  display: inline-block;
  background: #176B87;
  color: #fff;
  padding: 0.6rem 1.2rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.upload-label:hover {
  background-color: #145a70;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 10px;
  width: 100%;
  max-width: 480px;
  padding: 2rem;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
}

.delete-confirm {
  text-align: center;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.close-modal {
  background: none;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  color: #999;
  transition: color 0.2s;
}

.close-modal:hover {
  color: #555;
}

.form-group {
  margin-bottom: 1.2rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: 500;
  color: #444;
}

.form-group input[type="text"] {
  width: 95%;
  padding: 0.65rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 0.95rem;
}

.form-actions,
.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.save-btn,
.confirm-btn {
  background: #176B87;
  color: white;
  border: none;
  padding: 0.65rem 1.25rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background-color 0.3s;
}

.cancel-btn {
  background: #f1f1f1;
  color: #333;
  border: none;
  padding: 0.65rem 1.25rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background-color 0.2s;
}

.save-btn:hover,
.confirm-btn:hover {
  background-color: #145a70;
}

.cancel-btn:hover {
  background: #e0e0e0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .admin-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .project-images {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
}

</style>