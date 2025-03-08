import React from "react";
import DocumentsClient from "./DocumentsClient";

export default async function Documents() {
  const res = await fetch("http://localhost:8000/upload", {
    cache: "no-store",
  });
  if (!res.ok) {
    return <div>Error fetching data</div>;
  }
  const data = await res.json();
  const uploads = data.uploads || [];

  return <DocumentsClient initialUploads={uploads} />;
}
