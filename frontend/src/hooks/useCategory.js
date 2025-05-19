import {useCallback, useEffect, useState} from "react";
import {useProjects} from "./useProjects";
import {CategoryService} from "../api/categoryService";

export const useCategory = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { selectedProject } = useProjects();

    const loadCategories = useCallback(async () => {
        try {
            setLoading(true);
            if (selectedProject && selectedProject.id) {
                const data = await CategoryService.getCategoriesbyProjectId(selectedProject.id);
                setCategories(data);
            } else {
                setCategories([]);
            }
        } catch (error) {
            console.error('Error loading categories:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    }, [selectedProject]);

    useEffect(() => {
        if (!selectedProject) {
            setLoading(false);
            return;
        }
        loadCategories();
    }, [loadCategories]);

    const addCategory = async (category) => {

        const categoryWithProject = {
            ...category,
            projectId: selectedProject.id
        };

        try {
            setLoading(true);
            const { success, categoryId } = await CategoryService.addCategory(categoryWithProject);
            if (success) {
                setCategories((prev) => [...prev, { ...category, id: categoryId }]);
            }
            return success;
        } catch (error) {
            console.error('Error adding category:', error);
            setError(error);
            return false;
        } finally {
            setLoading(false);
        }
    }

    const updateCategory = async (categoryId, category) => {

        const categoryWithProject = {
            ...category,
            projectId: selectedProject.id
        };

        try {
            setLoading(true);
            const { success } = await CategoryService.updateCategory(categoryId, categoryWithProject);
            if (success) {
                setCategories((prev) => prev.map((cat) => (cat.id === categoryId ? { ...cat, ...categoryWithProject } : cat)));
            }
            return success;
        } catch (error) {
            console.error('Error updating category:', error);
            setError(error);
            return false;
        } finally {
            setLoading(false);
        }
    }

    const deleteCategory = async (categoryId) => {
        try {
            setLoading(true);
            const { success } = await CategoryService.deleteCategory(categoryId);
            if (success) {
                setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
            }
            return success;
        } catch (error) {
            console.error('Error deleting category:', error);
            setError(error);
            return false;
        } finally {
            setLoading(false);
        }
    }

    return { categories, loading, error, addCategory, updateCategory, deleteCategory };
}