import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../lib/ui/Card";
import { Sheet } from "../../lib/ui/Sheet";
import { Button } from "../../lib/ui/Button";
import { Briefcase, Edit, Trash2 } from 'lucide-react';

const UserCard = ({ user, onDetailsClick, onRemoveClick }) => {
    return (
        <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{user.firstName} {user.lastName}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                    </div>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        user.userLevel.id === 1 ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
            {user.userLevel.label}
          </span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center mb-3">
                    <Briefcase size={16} className="mr-2 text-gray-500" />
                    <span className="text-sm font-medium">
            Projects: {user.userProjects ? user.userProjects.length : 0}
          </span>
                </div>

                {user.userProjects && user.userProjects.length > 0 ? (
                    <div className="space-y-2">
                        {user.userProjects.slice(0, 2).map((project) => (
                            <div key={project.id} className="text-sm p-2 bg-gray-50 rounded-md">
                                <div className="font-medium">{project.project.name}</div>
                                <div className="text-gray-500">{project.role}</div>
                            </div>
                        ))}
                        {user.userProjects.length > 2 && (
                            <div className="text-sm text-center text-blue-600 cursor-pointer"
                                 onClick={() => onDetailsClick(user)}>
                                + {user.userProjects.length - 2} more projects
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No active projects</p>
                )}
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
                <Button
                    variant="default"
                    size="small"
                    startIcon={<Edit size={14} />}
                    onClick={() => onDetailsClick(user)}
                >
                    Details
                </Button>
                <Button
                    variant="danger"
                    size="small"
                    startIcon={<Trash2 size={14} />}
                    onClick={() => onRemoveClick(user.id)}
                >
                    Remove
                </Button>
            </CardFooter>
        </Card>
    );
};

const UserDetailsSheet = ({ user, isOpen, onClose }) => {
    if (!user) return null;

    return (
        <Sheet
            isOpen={isOpen}
            onClose={onClose}
            title={`${user.firstName} ${user.lastName}`}
            description={user.email}
        >
            <div className="space-y-6">
                <div>
                    <h4 className="text-lg font-medium mb-2">User Information</h4>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Telegram</span>
                            <span>@{user.telegramUsername}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Role</span>
                            <span>{user.userLevel.label}</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="text-lg font-medium mb-2">Projects</h4>
                    {user.userProjects && user.userProjects.length > 0 ? (
                        <div className="space-y-3">
                            {user.userProjects.map((project) => (
                                <div key={project.id} className="p-3 bg-gray-50 rounded-lg">
                                    <div className="font-medium">{project.project.name}</div>
                                    <div className="text-sm text-gray-500">{project.role}</div>
                                    {project.project.description && (
                                        <div className="text-sm mt-1">{project.project.description}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No projects assigned</p>
                    )}
                </div>

                <div className="flex justify-end">
                    <Button variant="remarked" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </Sheet>
    );
};

export { UserCard, UserDetailsSheet };