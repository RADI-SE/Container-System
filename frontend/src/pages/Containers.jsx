import React, { useState, useMemo } from 'react';
import Table from '../components/Table';
import AddContainerModal from '../components/modals/AddContainerModal';
import AssignContainersModal from '../components/modals/AssignContainersModal'; // Import your new modal
import { useContainers, useDeleteContainer } from '../hooks/useContainers';
import { getContainerColumns } from '../constants/columns';

function Containers() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedContainer, setSelectedContainer] = useState(null);
     
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedIdsForAssignment, setSelectedIdsForAssignment] = useState([]);

    const { data: containers, isLoading, isError, error } = useContainers();
    const { mutate: deleteMutate } = useDeleteContainer();

    const handleEdit = (container) => {
        setSelectedContainer(container);
        setIsModalOpen(true);
    };
 
    const handleOpenAssignModal = (ids) => {
        setSelectedIdsForAssignment(ids);
        setIsAssignModalOpen(true);
    };

    const columns = useMemo(() =>
        getContainerColumns(handleEdit, deleteMutate),
        [deleteMutate, handleEdit]
    );

    return (
        <div className="p-4">
            {isLoading ? (
                <div className="p-10 text-center">Loading...</div>
            ) : isError ? (
                <div className="p-10 text-red-500 text-center">Error: {error.message}</div>
            ) : (
                <Table
                    title="Container Management"
                    d={containers || []} 
                    columns={columns}
                    onAddClick={() => {
                        setSelectedContainer(null);
                        setIsModalOpen(true);
                    }} 
                    onClickAssignUser={handleOpenAssignModal}
                />
            )}
 
            <AddContainerModal
                title={selectedContainer ? "Edit Container" : "Add New Container"}
                isOpen={isModalOpen}
                initialData={selectedContainer}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedContainer(null);
                }}
            />
            <AssignContainersModal 
                isOpen={isAssignModalOpen}
                onClose={() => {
                    setIsAssignModalOpen(false);
                    setSelectedIdsForAssignment([]);
                }}
            />
        </div>
    );
}

export default Containers;