"use client";

import { useState } from "react";

interface Upload {
  _id: string;
  email: string;
  file_url: string;
  created_at: string;
}

interface DocumentsClientProps {
  initialUploads: Upload[];
}

export default function DocumentsClient({
  initialUploads,
}: DocumentsClientProps) {
  const [uploads, setUploads] = useState(initialUploads);

  const handleDelete = async (email: string) => {
    try {
      const res = await fetch(`http://localhost:8000/${email}`, {
        method: "DELETE",
      });
      if (res.ok) {
        // Remove the document with this email from the state.
        setUploads((prev) => prev.filter((upload) => upload.email !== email));
      } else {
        console.error("Delete request failed.");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Documents</h1>
      {uploads.length === 0 && (
        <p className="text-center text-gray-500">No uploads available.</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {uploads.map((upload) => (
          <div
            key={upload._id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <img
              className="w-full h-48 object-cover rounded-t-lg"
              src={upload.file_url}
              alt="Document"
            />
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Email:</strong> {upload.email}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Uploaded on:</strong>{" "}
                {new Date(upload.created_at).toLocaleString()}
              </p>
            </div>
            <div className="px-4 pb-4 flex justify-end gap-2">
              <button
                onClick={() => handleDelete(upload.email)}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
              >
                Accept
              </button>
              <button
                onClick={() => handleDelete(upload.email)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
