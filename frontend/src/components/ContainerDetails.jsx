import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import { useContainerById } from "../hooks/useContainers";

function ContainerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const stateContainer = location.state?.container;
  const { data, isLoading, isError, error } = useContainerById(id);
  const container = data || stateContainer;

  const getDocumentUrl = (filePath) => {
    if (!filePath) return null;

    if (/^https?:\/\//i.test(filePath)) {
      return filePath;
    }

    const normalizedPath = String(filePath).replace(/\\/g, "/");
    const uploadsIndex = normalizedPath.toLowerCase().indexOf("uploads/");
    const relativePath =
      uploadsIndex >= 0 ? normalizedPath.slice(uploadsIndex) : normalizedPath.replace(/^\/+/, "");

    return `http://localhost:5000/${relativePath}`;
  };

  if (!id) {
    return <div className="p-6">Container id is missing.</div>;
  }

  if (isLoading && !stateContainer) {
    return <div className="p-6">Loading container details...</div>;
  }

  if (isError && !stateContainer) {
    return <div className="p-6 text-red-500">Error: {error?.message || "Failed to load container details"}</div>;
  }

  if (!container) {
    return <div className="p-6">Container not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <button
        type="button"
        onClick={() => navigate("/staff-containers")}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-blue-600"
      >
        <ArrowLeft size={16} />
        Back to My Containers
      </button>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{container.containerName}</h1>
        <p className="text-sm text-gray-500">Container #{container.containerNumber}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500 uppercase">Region</p>
          <p className="font-semibold text-gray-900">{container.region || "-"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase">Receiving Branch</p>
          <p className="font-semibold text-gray-900">{container.receivingBranch || "-"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase">Bill Of Lading</p>
          <p className="font-semibold text-gray-900">{container.billOfLading || "-"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase">Purchase Order</p>
          <p className="font-semibold text-gray-900">{container.purchaseOrder || "-"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase">Invoice Number</p>
          <p className="font-semibold text-gray-900">{container.invoiceNumber || "-"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase">Created</p>
          <p className="font-semibold text-gray-900">
            {container.createdAt ? new Date(container.createdAt).toLocaleString() : "-"}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <FileText size={16} className="text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
        </div>
        {Array.isArray(container.documents) && container.documents.length > 0 ? (
          <ul className="space-y-2">
            {container.documents
              .filter(Boolean)
              .map((doc, index) => (
                <li key={`${doc.fileName}-${index}`} className="text-sm text-gray-700">
                  {getDocumentUrl(doc.filePath) ? (
                    <a
                      href={getDocumentUrl(doc.filePath)}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      <FileText size={14} />
                      {doc.fileName || `Document ${index + 1}`}
                    </a>
                  ) : (
                    doc.fileName || `Document ${index + 1}`
                  )}
                </li>
              ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No documents available.</p>
        )}
      </div>
    </div>
  );
}

export default ContainerDetails;