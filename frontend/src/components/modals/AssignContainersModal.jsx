import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAssignContainers } from '../../hooks/useContainers';
import  useAuth  from '../../store/useAuthStore';
function AssignContainersModal({ isOpen, onClose }) {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedContainerId, setSelectedContainerId] = useState('');
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [containers, setContainers] = useState([]);
    const { user } = useAuth();
    const adminId = user?._id;

    const { mutate: assignMutate, isPending } = useAssignContainers();

    const containersData = useMemo(() => {
        const list = Array.isArray(containers)
            ? containers
            : Array.isArray(containers?.data)
                ? containers.data
                : [];

        return list.map((item) => ({
            id: typeof item === 'string' ? item : item?._id,
            name: item?.containerName || 'Unnamed Container',
            number: item?.containerNumber || "Unnumbered Container"
        })).filter(item => item.id);
    }, [containers]);
 

    useEffect(() => {
        if (!isOpen) return;

        const fetchUsers = async () => {
            setLoadingUsers(true);
            try {
                const { data } = await axios.get(
                    'http://localhost:5000/api/auth/users',
                    { withCredentials: true }
                );

                setUsers(data.users || []);
            } catch (err) {
                console.error("Failed to load users", err);
            } finally {
                setLoadingUsers(false);
            }
        };

        fetchUsers();
    }, [isOpen]);

    useEffect(() => {
        if (!selectedUserId) return;

        const fetchAvailable = async () => {
            const { data } = await axios.get(
                `http://localhost:5000/api/containers/available/${adminId}/${selectedUserId}`,
                { withCredentials: true }
            );

            setContainers(data.data);
        };

        fetchAvailable();
    }, [selectedUserId]);


    const handleConfirm = () => {
        console.log("handleConfirm 1")
        if (!selectedUserId || !selectedContainerId) return;

        console.log({
            containerId: selectedContainerId,
            userIdToAllow: selectedUserId
        });
        assignMutate(
            {
                containerId: selectedContainerId,
                userIdToAllow: selectedUserId
            },
            {
                onSuccess: () => {
                    setSelectedUserId('');
                    setSelectedContainerId('');
                    onClose();
                }
            }
        );
        console.log("handleConfirm 2")
    };
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">

                {/* HEADER */}
                <div className="p-6 border-b flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            Assign Containers
                        </h2>
                        <p className="text-xs text-gray-500 mt-1">
                            Assigning <strong>{containersData.length}</strong> items
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                        &times;
                    </button>
                </div>
 
                <div className="p-6 space-y-4">
 
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Select Team Member
                        </label>

                        {loadingUsers ? (
                            <div className="h-11 w-full bg-gray-100 animate-pulse rounded-xl" />
                        ) : (
                            <select
                                value={selectedUserId}
                                onChange={(e) => setSelectedUserId(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
                            >
                                <option value="">Choose a user...</option>
                                {users.map((user) => (
                                    <option key={user._id} value={user._id}>
                                        {user.name} ({user.email})
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
 
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Selected Containers
                        </label>

                        <select
                            value={selectedContainerId}
                            onChange={(e) => setSelectedContainerId(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl p-3 text-sm bg-indigo-50/50"
                        >
                            <option value="">Choose a Container...</option>

                            {containersData.length > 0 ? (
                                containersData.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name} ({item.number})
                                    </option>
                                ))
                            ) : (
                                <option>No containers available</option>
                            )}
                        </select>
                    </div>
 
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <p className="text-xs text-blue-700">
                            These containers will be assigned to the selected user.
                        </p>
                    </div>
                </div>
 
                <div className="p-6 border-t bg-gray-50 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded-xl"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleConfirm}
                        disabled={!selectedUserId || isPending || containersData.length === 0}
                        className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl disabled:opacity-50"
                    >
                        {isPending ? 'Assigning...' : 'Confirm Assignment'}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default AssignContainersModal;