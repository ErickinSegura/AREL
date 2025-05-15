import {useCallback, useEffect, useState} from "react";
import {LogsService} from "../api/logsService";
import {useProjects} from "./useProjects";

export const useLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { selectedProject } = useProjects();

    const loadLogs = useCallback(async () => {
        try {
            setLoading(true);
            if (selectedProject && selectedProject.id) {
                const data = await LogsService.getLogsbyProjectId(selectedProject.id);
                setLogs(data);
            } else {
                setLogs([]);
            }
        } catch (error) {
            console.error('Error loading logs:', error);
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
        loadLogs();
    }, [loadLogs]);

    return { logs, loading, error };
}