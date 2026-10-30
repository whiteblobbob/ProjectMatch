import { notFound } from "next/navigation";

import { fetchAdminRecords, fetchAdminRelationOptions } from "../../actions/admin";
import AdminTableView from "../../components/admin/admin-table-view";
import { getAdminTable } from "../../lib/admin/registry";
import { getCloudinaryCloudName } from "../../lib/cloudinary";
import { requireAdminUser } from "../../lib/ui/admin-session";

export default async function AdminTablePage({ params }: { params: Promise<{ table: string }> }) {
  const { table } = await params;
  const config = getAdminTable(table);

  if (!config) {
    notFound();
  }

  await requireAdminUser();

  const [records, relationOptions] = await Promise.all([
    fetchAdminRecords(config.key),
    fetchAdminRelationOptions(config.key),
  ]);

  if (!records.success || !("data" in records) || !relationOptions.success || !("data" in relationOptions)) {
    const message = !records.success
      ? records.error
      : !relationOptions.success
        ? relationOptions.error
        : "Data tidak dapat dimuat.";

    return (
      <section role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h1 className="text-xl font-bold text-red-950">Data tidak dapat dimuat</h1>
        <p className="mt-2 text-sm text-red-800">{message}</p>
      </section>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <AdminTableView
        config={config}
        records={records.data}
        relationOptions={relationOptions.data}
        cloudName={getCloudinaryCloudName()}
      />
    </div>
  );
}
