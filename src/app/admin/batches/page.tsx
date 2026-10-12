import React from "react";
import { getAllBatches } from "@/lib/data";
import AdminBatchesClient from "@/components/admin/AdminBatchesClient";

export default async function AdminBatches() {
  const batches = await getAllBatches();

  return <AdminBatchesClient initialBatches={batches} />;
}
