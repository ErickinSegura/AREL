import React from 'react';
import { useProjects } from '../hooks/useProjects';
import { FiUsers, FiCalendar, FiCloudLightning, FiTable, FiCheckSquare, FiAlertCircle, FiClock } from 'react-icons/fi';

const Overview = () => {
    const { selectedProject, loading } = useProjects();

    if (loading) {
        return (
            <div className="p-6 flex justify-center items-center h-64">
                <div className="animate-pulse text-gray-500">Cargando datos del proyecto...</div>
            </div>
        );
    }

    if (!selectedProject) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">No hay proyecto seleccionado</h1>
                <p>Por favor, selecciona un proyecto desde el menú lateral.</p>
            </div>
        );
    }

    // Simulación de datos del proyecto para mostrar
    // En una implementación real, estos datos vendrían del backend
    const projectStats = {
        totalTasks: 36,
        completedTasks: 18,
        pendingTasks: 12,
        blockedTasks: 6,
        sprintProgress: 50,
        teamMembers: 5,
        daysLeft: 8,
        startDate: new Date().toLocaleDateString(),
        endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toLocaleDateString()
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <div className="flex items-center gap-4 mb-2">
                    <div
                        className="w-12 h-12 rounded-md grid place-items-center text-white"
                        style={{ backgroundColor: selectedProject.color?.hexColor || '#808080' }}
                    >
                        {/* Icono dinámico según el proyecto, por simplicidad usamos siempre el mismo */}
                        <FiCloudLightning size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{selectedProject.projectName}</h1>
                        <p className="text-gray-600">{selectedProject.description}</p>
                    </div>
                </div>
            </div>

            {/* Sprint actual */}
            <div className="bg-white p-5 rounded-lg shadow-sm mb-6">
                <h2 className="text-lg font-semibold mb-3 flex items-center">
                    <FiCloudLightning className="mr-2" /> Sprint Actual
                </h2>
                <div className="mb-2">
                    <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Progreso del Sprint</span>
                        <span className="text-sm font-medium">{projectStats.sprintProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="h-2 rounded-full"
                            style={{
                                width: `${projectStats.sprintProgress}%`,
                                backgroundColor: selectedProject.color?.hexColor || '#C74634'
                            }}
                        ></div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-sm">
                        <div className="text-gray-500">Inicio</div>
                        <div className="font-medium flex items-center mt-1">
                            <FiCalendar className="mr-1" /> {projectStats.startDate}
                        </div>
                    </div>
                    <div className="text-sm">
                        <div className="text-gray-500">Fin previsto</div>
                        <div className="font-medium flex items-center mt-1">
                            <FiCalendar className="mr-1" /> {projectStats.endDate}
                        </div>
                    </div>
                </div>
                <div className="text-sm mt-2">
                    <div className="text-gray-500">Tiempo restante</div>
                    <div className="font-medium flex items-center mt-1">
                        <FiClock className="mr-1" /> {projectStats.daysLeft} días
                    </div>
                </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Panel de tareas */}
                <div className="bg-white p-5 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                        <FiTable className="mr-2" /> Tareas
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-start space-x-3 bg-gray-50 p-3 rounded-lg">
                            <div className="p-2 rounded-full bg-green-100">
                                <FiCheckSquare className="text-green-600" size={20} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{projectStats.completedTasks}</div>
                                <div className="text-sm text-gray-500">Completadas</div>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3 bg-gray-50 p-3 rounded-lg">
                            <div className="p-2 rounded-full bg-blue-100">
                                <FiClock className="text-blue-600" size={20} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{projectStats.pendingTasks}</div>
                                <div className="text-sm text-gray-500">Pendientes</div>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3 bg-gray-50 p-3 rounded-lg">
                            <div className="p-2 rounded-full bg-red-100">
                                <FiAlertCircle className="text-red-600" size={20} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{projectStats.blockedTasks}</div>
                                <div className="text-sm text-gray-500">Bloqueadas</div>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3 bg-gray-50 p-3 rounded-lg">
                            <div className="p-2 rounded-full bg-purple-100">
                                <FiTable className="text-purple-600" size={20} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{projectStats.totalTasks}</div>
                                <div className="text-sm text-gray-500">Total</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Panel de equipo */}
                <div className="bg-white p-5 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                        <FiUsers className="mr-2" /> Equipo
                    </h2>
                    <div className="flex items-center mb-4">
                        <div className="flex -space-x-2 mr-4">
                            {/* Avatares de miembros del equipo (simulados) */}
                            {[...Array(Math.min(4, projectStats.teamMembers))].map((_, index) => (
                                <div key={index} className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center overflow-hidden">
                                    {/* Avatar simulado con iniciales */}
                                    <span className="text-xs font-medium text-gray-600">
                    M{index + 1}
                  </span>
                                </div>
                            ))}
                            {projectStats.teamMembers > 4 && (
                                <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">
                    +{projectStats.teamMembers - 4}
                  </span>
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="text-sm font-medium">{projectStats.teamMembers} miembros</div>
                            <div className="text-xs text-gray-500">en el equipo</div>
                        </div>
                    </div>
                    <div className="text-sm">
                        {/* Aquí podrías mostrar actividad reciente del equipo si la tuvieras */}
                        <div className="text-gray-500 mb-2">Actividad reciente</div>
                        <div className="space-y-2">
                            <div className="bg-gray-50 p-2 rounded text-sm">
                                Juan añadió un comentario hace 2h
                            </div>
                            <div className="bg-gray-50 p-2 rounded text-sm">
                                María completó una tarea hace 5h
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gráfico de rendimiento (simulado) */}
            <div className="bg-white p-5 rounded-lg shadow-sm mb-6">
                <h2 className="text-lg font-semibold mb-4">Rendimiento del Sprint</h2>
                <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-gray-400 text-sm">Gráfico de burndown (simulado)</div>
                </div>
            </div>
        </div>
    );
};

export default Overview;