import React, { useState } from "react";
import {useUnshareContainer} from "../hooks/useContainers";

export default function AllowedUsersCell({ users, containerId }) {
  const [open, setOpen] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const { mutate: unshareMutate, isPending: isUnsharing } = useUnshareContainer();

  if (!users || users.length === 0) {
    return <span className="text-gray-400 text-xs">Not shared</span>;
  }

  const handleUnshare = (userId) => {
    setRemovingId(userId);

    unshareMutate(
      { containerId, userId },
      {
        onSettled: () => setRemovingId(null),
      }
    );
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-blue-600 hover:underline font-medium"
      >
        👥 {users.length} user{users.length > 1 ? "s" : ""}
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[200]">
          <div className="bg-white rounded-xl p-6 w-80 shadow-xl">
            <h3 className="font-bold mb-4">Allowed Users</h3>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {users.map((u) => (
                <div
                  key={u._id}
                  className="border rounded-lg p-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{u.name}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </div>

                  <button
                    onClick={() => handleUnshare(u._id)}
                    disabled={isUnsharing && removingId === u._id}
                    className="text-red-500 hover:text-red-700 text-lg font-bold px-2"
                    title="Remove access"
                  >
                    {removingId === u._id ? "…" : "✕"}
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setOpen(false)}
              className="mt-4 w-full bg-gray-100 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}