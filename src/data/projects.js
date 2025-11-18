// src/data/projects.js
import projectsData from './projects.json';

export const getProjects = () => projectsData.categories;

export const getProjectByCategory = (categoryId) =>
  projectsData.categories.find(cat => cat.id === categoryId);

export const getAllProjects = () => {
  return projectsData.categories.flatMap(category =>
    category.projects.map(project => ({
      ...project,
      category: category.id,
      categoryIcon: category.icon
    }))
  );
};

export default projectsData;