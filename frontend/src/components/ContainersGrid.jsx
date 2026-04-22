import React from "react";
import { useNavigate } from "react-router-dom";
import { Package, MapPin, ArrowRight, FileText } from "lucide-react";

function ContainersGrid({ containers = [], detailsBasePath = "/staff-containers" }) {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {containers.map((c) => (
          <div key={c._id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all group">
             
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-900 leading-tight truncate pr-4">
                {c.containerName}
              </h2>
              <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded uppercase">
                {c.region}
              </span>
            </div>
 
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Package size={14} className="text-gray-400" />
                <span className="font-medium">No: {c.containerNumber}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={14} className="text-gray-400" />
                <span className="font-medium">{c.receivingBranch}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText size={14} className="text-gray-400" />
                <span className="font-medium">{c.documents?.length || 0} Documents</span>
              </div>
            </div>
 
            <button 
              onClick={() =>
                navigate(`${detailsBasePath}/${c._id}`, { state: { container: c } })
              }
              className="w-full flex items-center justify-between bg-gray-900 text-white font-bold py-3 px-5 rounded-xl hover:bg-blue-600 transition-all active:scale-95"
            >
              View Details
              <ArrowRight size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContainersGrid;