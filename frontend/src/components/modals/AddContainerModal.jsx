import React, { useState, useEffect } from 'react';
import { useAddContainer, useUpdateContainer } from '../../hooks/useContainers';

const initialFormState = {
    containerName: '',
    containerNumber: '',
    billOfLading: '',
    purchaseOrder: '',
    invoiceNumber: '',
    receivingBranch: '',
    region: '',
};

export default function AddContainerModal({ isOpen = true, onClose, initialData = null, title = null, onSubmit }) {
    const addMutation = useAddContainer();
    const updateMutation = useUpdateContainer();

    const isPending = addMutation.isPending || updateMutation.isPending;

    const [formData, setFormData] = useState(initialFormState);

    const [files, setFiles] = useState({
        coa: null,
        PackingList: null,
        slips: null
    });

    const [existingDocs, setExistingDocs] = useState([]);

    useEffect(() => {
        if (!isOpen) return;

        setFiles({ coa: null, PackingList: null, slips: null });

        if (initialData) {
            setFormData({
                containerName: initialData.containerName || '',
                containerNumber: initialData.containerNumber || '',
                billOfLading: initialData.billOfLading || '',
                purchaseOrder: initialData.purchaseOrder || '',
                invoiceNumber: initialData.invoiceNumber || '',
                receivingBranch: initialData.receivingBranch || '',
                region: initialData.region || '',
            });
            setExistingDocs(initialData.documents || []);
            return;
        }

        setFormData(initialFormState);
        setExistingDocs([]);
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileSlotChange = (e, slotName) => {
        const file = e.target.files[0];
        if (file && file.type !== 'application/pdf') {
            alert("Only PDF files are allowed.");
            e.target.value = null;
            return;
        }
        setFiles(prev => ({ ...prev, [slotName]: file }));
    };

    const buildFormData = () => {
        const data = new FormData();

        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });

        data.append("replaceBol", !!files.coa);
        data.append("replaceInvoice", !!files.PackingList);
        data.append("replacePo", !!files.slips);

        if (files.coa) data.append("documents", files.coa);
        if (files.PackingList) data.append("documents", files.PackingList);
        if (files.slips) data.append("documents", files.slips);

        return data;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = buildFormData();

        if (initialData) {
            if (onSubmit) {
                onSubmit({ id: initialData._id, updatedData: data });
            } else {
                updateMutation.mutate(
                    { id: initialData._id, updatedData: data },
                    { onSuccess: () => onClose() }
                );
            }

            onClose();
            return;
        }

        if (onSubmit) {
            onSubmit(data);
        } else {
            addMutation.mutate(data, { onSuccess: () => onClose() });
        }

        onClose();
    };
    const FileUploadSlot = ({ label, slotName, selectedFile, index }) => {
        const existingFile = existingDocs[index];
        const hasFile = selectedFile || existingFile;

        return (
            <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</label>
                <div className={`relative border-2 border-dashed rounded-xl p-3 transition-all ${selectedFile ? 'border-blue-400 bg-blue-50' : existingFile ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-blue-300'}`}>
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileSlotChange(e, slotName)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex items-center gap-2 overflow-hidden">
                        <div className={`p-2 rounded-lg ${selectedFile ? 'bg-blue-600 text-white' : existingFile ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="flex flex-col truncate">
                            <span className="text-xs font-medium text-gray-700 truncate">
                                {selectedFile ? selectedFile.name : existingFile ? existingFile.fileName : 'Upload PDF'}
                            </span>
                            {existingFile && !selectedFile ? (
                                <a
                                    href={`http://localhost:5000/${existingFile.filePath.replace(/\\/g, '/')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[9px] text-green-600 font-bold hover:underline z-20"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    View Current File
                                </a>
                            ) : (
                                <span className="text-[9px] text-gray-400">Click to {existingFile ? 'replace' : 'browse'}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const displayTitle = title || (initialData ? 'Edit Container' : 'Add Container');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-xl font-bold text-gray-800">{displayTitle}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors text-2xl">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
                    <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Container Name</label>
                                <input required name="containerName" value={formData.containerName} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Container Number</label>
                                <input required name="containerNumber" value={formData.containerNumber} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Bill of Lading</label>
                                <input required name="billOfLading" value={formData.billOfLading} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Purchase Order (PO)</label>
                                <input required name="purchaseOrder" value={formData.purchaseOrder} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Invoice Number</label>
                                <input required name="invoiceNumber" value={formData.invoiceNumber} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Receiving Branch</label>
                                <input required name="receivingBranch" value={formData.receivingBranch} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Region</label>
                                <select required name="region" value={formData.region} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white">
                                    <option value="">Select a region</option>
                                    <option value="Central">Central</option>
                                    <option value="Western">Western</option>
                                    <option value="Eastern">Eastern</option>
                                    <option value="Northern">Northern</option>
                                    <option value="Southern">Southern</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[2px] mb-4">Required Documents</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <FileUploadSlot label="Bill of Lading (PDF)" slotName="coa" selectedFile={files.coa} index={0} />
                                <FileUploadSlot label="Invoice (PDF)" slotName="PackingList" selectedFile={files.PackingList} index={1} />
                                <FileUploadSlot label="Purchase Order (PDF)" slotName="slips" selectedFile={files.slips} index={2} />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-200 disabled:opacity-50 transition-all active:scale-95"
                        >
                            {isPending ? 'Saving...' : initialData ? 'Update Container' : 'Save Container'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}