export type AdminRow = Record<string, unknown>;

export type AdminOption = { id: string; label: string };

export type AdminTableKey =
  | "user"
  | "category"
  | "role"
  | "user_role"
  | "contact_info"
  | "project"
  | "project_role"
  | "project_member"
  | "application"
  | "peer_review"
  | "project_report"
  | "notification"
  | "verification_document";

export type AdminRelationTable = "user" | "category" | "role" | "project";

export type AdminTableGroup = "Data master" | "Proyek" | "Aktivitas";

export type AdminFieldType =
  | "text"
  | "textarea"
  | "number"
  | "float"
  | "boolean"
  | "datetime"
  | "enum"
  | "enumArray"
  | "stringArray"
  | "relation";

export type AdminField = {
  name: string;
  label: string;
  type: AdminFieldType;
  required?: boolean;
  options?: readonly string[];
  relation?: { table: AdminRelationTable; labelField: string };
  /** Part of the table's unique key: shown in create forms, locked when editing. */
  primaryKey?: boolean;
  /** Shown in the table but never editable (database-managed columns). */
  readOnly?: boolean;
  /** Only available while creating a record (e.g. a manual primary key). */
  createOnly?: boolean;
  /** Shown in the table but intentionally excluded from every form (e.g. role). */
  displayOnly?: boolean;
};

export type AdminTableConfig = {
  key: AdminTableKey;
  prismaModel: string;
  label: string;
  description: string;
  group: AdminTableGroup;
  primaryKey: string[];
  defaultSort: string;
  fields: AdminField[];
};

export const EDUCATION_LEVELS = ["SMP", "SMA", "MAHASISWA"] as const;
export const COLLABORATION_MODES = ["ONLINE", "OFFLINE", "HYBRID"] as const;
export const ONLINE_PLATFORMS = ["GOOGLE_MEET", "ZOOM", "MICROSOFT_TEAMS", "DISCORD"] as const;
export const OFFLINE_PLACES = ["SEKOLAH", "KAMPUS", "RUANG_PUBLIK", "KAFE"] as const;
export const PROJECT_STATUSES = ["OPEN_RECRUITMENT", "IN_PROGRESS", "COMPLETED"] as const;
export const PROJECT_RANGES = ["ALL", "INTERNAL", "PROVINCE", "CITY", "INSTITUTIONS"] as const;
export const ACCOUNT_ROLES = ["USER", "ADMIN"] as const;

export const ADMIN_TABLES: AdminTableConfig[] = [
  {
    key: "user",
    prismaModel: "user",
    label: "Pengguna",
    description: "Akun pengguna beserta profil dan statistik kontribusinya.",
    group: "Data master",
    primaryKey: ["id"],
    defaultSort: "name",
    fields: [
      { name: "id", label: "ID", type: "text", required: true, primaryKey: true, createOnly: true },
      { name: "name", label: "Nama", type: "text", required: true },
      { name: "role", label: "Peran akun", type: "enum", options: ACCOUNT_ROLES, displayOnly: true },
      { name: "institution", label: "NPSN institusi", type: "text" },
      { name: "institutionName", label: "Nama institusi", type: "text", displayOnly: true },
      { name: "educationLevel", label: "Jenjang", type: "enum", options: EDUCATION_LEVELS },
      { name: "studyProgram", label: "Program studi", type: "text" },
      { name: "schoolGrade", label: "Kelas", type: "text" },
      { name: "entryYear", label: "Tahun masuk", type: "number" },
      { name: "graduationYear", label: "Tahun lulus", type: "number" },
      { name: "dateOfBirth", label: "Tanggal lahir", type: "datetime" },
      { name: "bio", label: "Bio", type: "textarea" },
      { name: "province", label: "Provinsi", type: "text" },
      { name: "city", label: "Kota/Kabupaten", type: "text" },
      { name: "portfolioLink", label: "Link portofolio", type: "text" },
      { name: "verified", label: "Terverifikasi", type: "boolean" },
      { name: "totalProjectsCompleted", label: "Proyek selesai", type: "number" },
      { name: "avgCommitmentScore", label: "Skor komitmen", type: "float" },

      { name: "createdAt", label: "Dibuat", type: "datetime", readOnly: true },
      { name: "updatedAt", label: "Diperbarui", type: "datetime", readOnly: true },
    ],
  },
  {
    key: "category",
    prismaModel: "category",
    label: "Kategori",
    description: "Kategori yang dipakai untuk mengelompokkan proyek.",
    group: "Data master",
    primaryKey: ["id"],
    defaultSort: "name",
    fields: [
      { name: "id", label: "ID", type: "text", primaryKey: true, readOnly: true },
      { name: "name", label: "Nama", type: "text", required: true },
    ],
  },
  {
    key: "role",
    prismaModel: "role",
    label: "Peran",
    description: "Katalog peran/keahlian yang dapat dipilih pengguna dan proyek.",
    group: "Data master",
    primaryKey: ["id"],
    defaultSort: "name",
    fields: [
      { name: "id", label: "ID", type: "text", primaryKey: true, readOnly: true },
      { name: "name", label: "Nama", type: "text", required: true },
    ],
  },
  {
    key: "user_role",
    prismaModel: "userRole",
    label: "Peran Pengguna",
    description: "Relasi antara pengguna dan peran/keahlian yang dimilikinya.",
    group: "Data master",
    primaryKey: ["userId", "roleId"],
    defaultSort: "userId",
    fields: [
      { name: "userId", label: "Pengguna", type: "relation", relation: { table: "user", labelField: "name" }, required: true, primaryKey: true },
      { name: "roleId", label: "Peran", type: "relation", relation: { table: "role", labelField: "name" }, required: true, primaryKey: true },
    ],
  },
  {
    key: "contact_info",
    prismaModel: "contactInfo",
    label: "Kontak",
    description: "Informasi kontak tambahan milik pengguna.",
    group: "Data master",
    primaryKey: ["id"],
    defaultSort: "createdAt",
    fields: [
      { name: "id", label: "ID", type: "text", primaryKey: true, readOnly: true },
      { name: "userId", label: "Pengguna", type: "relation", relation: { table: "user", labelField: "name" }, required: true },
      { name: "value", label: "Kontak", type: "text", required: true },
      { name: "createdAt", label: "Dibuat", type: "datetime", readOnly: true },
    ],
  },
  {
    key: "project",
    prismaModel: "project",
    label: "Proyek",
    description: "Proyek kolaborasi beserta detail jadwal dan kebutuhan tim.",
    group: "Proyek",
    primaryKey: ["id"],
    defaultSort: "createdAt",
    fields: [
      { name: "id", label: "ID", type: "text", primaryKey: true, readOnly: true },
      { name: "ownerId", label: "Pembuat", type: "relation", relation: { table: "user", labelField: "name" }, required: true },
      { name: "categoryId", label: "Kategori", type: "relation", relation: { table: "category", labelField: "name" }, required: true },
      { name: "title", label: "Judul", type: "text", required: true },
      { name: "description", label: "Deskripsi", type: "textarea", required: true },
      { name: "deadline", label: "Tenggat", type: "datetime" },
      { name: "collaborationMode", label: "Mode kolaborasi", type: "enum", options: COLLABORATION_MODES, required: true },
      { name: "onlinePlatform", label: "Platform daring", type: "enum", options: ONLINE_PLATFORMS },
      { name: "onlineLink", label: "Link daring", type: "text" },
      { name: "offlinePlace", label: "Tempat luring", type: "enum", options: OFFLINE_PLACES },
      { name: "offlineLink", label: "Link luring", type: "text" },
      { name: "meetDescription", label: "Deskripsi pertemuan", type: "textarea", required: true },
      { name: "meetAt", label: "Mulai pertemuan", type: "datetime" },
      { name: "meetEndAt", label: "Selesai pertemuan", type: "datetime" },
      { name: "collaborationTool", label: "Alat kolaborasi", type: "text" },
      { name: "workHoursPerWeek", label: "Jam per minggu", type: "number", required: true },
      { name: "educationLevels", label: "Jenjang", type: "enumArray", options: EDUCATION_LEVELS, required: true },
      { name: "range", label: "Jangkauan", type: "enum", options: PROJECT_RANGES, required: true },
      { name: "allowedInstitutions", label: "NPSN institusi diizinkan", type: "stringArray" },
      { name: "extraCriteria", label: "Persyaratan tambahan", type: "textarea" },
      { name: "sourceLink", label: "Link sumber", type: "text" },
      { name: "status", label: "Status", type: "enum", options: PROJECT_STATUSES, required: true },
      { name: "createdAt", label: "Dibuat", type: "datetime", readOnly: true },
      { name: "updatedAt", label: "Diperbarui", type: "datetime", readOnly: true },
    ],
  },
  {
    key: "project_role",
    prismaModel: "projectRole",
    label: "Posisi Proyek",
    description: "Posisi yang dibuka pada sebuah proyek beserta jumlah slotnya.",
    group: "Proyek",
    primaryKey: ["projectId", "roleId"],
    defaultSort: "projectId",
    fields: [
      { name: "projectId", label: "Proyek", type: "relation", relation: { table: "project", labelField: "title" }, required: true, primaryKey: true },
      { name: "roleId", label: "Peran", type: "relation", relation: { table: "role", labelField: "name" }, required: true, primaryKey: true },
      { name: "slotsAvailable", label: "Slot tersedia", type: "number", required: true },
    ],
  },
  {
    key: "project_member",
    prismaModel: "projectMember",
    label: "Anggota Proyek",
    description: "Anggota terkonfirmasi pada sebuah proyek.",
    group: "Proyek",
    primaryKey: ["projectId", "userId"],
    defaultSort: "projectId",
    fields: [
      { name: "projectId", label: "Proyek", type: "relation", relation: { table: "project", labelField: "title" }, required: true, primaryKey: true },
      { name: "userId", label: "Pengguna", type: "relation", relation: { table: "user", labelField: "name" }, required: true, primaryKey: true },
      { name: "roleId", label: "Peran", type: "relation", relation: { table: "role", labelField: "name" }, required: true },
    ],
  },
  {
    key: "application",
    prismaModel: "application",
    label: "Lamaran",
    description: "Lamaran pengguna untuk posisi yang dibuka pada proyek.",
    group: "Proyek",
    primaryKey: ["id"],
    defaultSort: "id",
    fields: [
      { name: "id", label: "ID", type: "text", primaryKey: true, readOnly: true },
      { name: "projectId", label: "Proyek", type: "relation", relation: { table: "project", labelField: "title" }, required: true },
      { name: "applicantId", label: "Pelamar", type: "relation", relation: { table: "user", labelField: "name" }, required: true },
      { name: "roleId", label: "Peran", type: "relation", relation: { table: "role", labelField: "name" }, required: true },
      { name: "message", label: "Pesan", type: "textarea" },
    ],
  },
  {
    key: "peer_review",
    prismaModel: "peerReview",
    label: "Ulasan Sebaya",
    description: "Penilaian komitmen antaranggota setelah proyek selesai.",
    group: "Aktivitas",
    primaryKey: ["projectId", "reviewerId", "revieweeId"],
    defaultSort: "createdAt",
    fields: [
      { name: "projectId", label: "Proyek", type: "relation", relation: { table: "project", labelField: "title" }, required: true, primaryKey: true },
      { name: "reviewerId", label: "Penilai", type: "relation", relation: { table: "user", labelField: "name" }, required: true, primaryKey: true },
      { name: "revieweeId", label: "Dinilai", type: "relation", relation: { table: "user", labelField: "name" }, required: true, primaryKey: true },
      { name: "commitmentScore", label: "Skor komitmen", type: "number", required: true },
      { name: "feedback", label: "Umpan balik", type: "textarea" },
      { name: "createdAt", label: "Dibuat", type: "datetime", readOnly: true },
    ],
  },
  {
    key: "project_report",
    prismaModel: "projectReport",
    label: "Laporan Proyek",
    description: "Laporan pengguna terhadap proyek yang melanggar ketentuan.",
    group: "Aktivitas",
    primaryKey: ["id"],
    defaultSort: "createdAt",
    fields: [
      { name: "id", label: "ID", type: "text", primaryKey: true, readOnly: true },
      // { name: "projectId", label: "Proyek", type: "relation", relation: { table: "project", labelField: "title" }, required: true },
      { name: "projectId", label: "ID Proyek", type: "text", readOnly: true },
      { name: "reporterId", label: "Pelapor", type: "relation", relation: { table: "user", labelField: "name" }, required: true },
      { name: "reason", label: "Alasan", type: "text", required: true },
      { name: "details", label: "Detail", type: "textarea" },
      { name: "createdAt", label: "Dibuat", type: "datetime", readOnly: true },
    ],
  },
  {
    key: "notification",
    prismaModel: "notification",
    label: "Notifikasi",
    description: "Notifikasi yang dikirim ke pengguna.",
    group: "Aktivitas",
    primaryKey: ["id"],
    defaultSort: "createdAt",
    fields: [
      { name: "id", label: "ID", type: "text", primaryKey: true, readOnly: true },
      { name: "userId", label: "Pengguna", type: "relation", relation: { table: "user", labelField: "name" }, required: true },
      { name: "title", label: "Judul", type: "text", required: true },
      { name: "message", label: "Pesan", type: "textarea", required: true },
      { name: "read", label: "Dibaca", type: "boolean" },
      { name: "createdAt", label: "Dibuat", type: "datetime", readOnly: true },
    ],
  },
  {
    key: "verification_document",
    prismaModel: "verificationDocument",
    label: "Dokumen Verifikasi",
    description: "Dokumen pendidikan yang dikirim pengguna untuk ditinjau admin.",
    group: "Aktivitas",
    primaryKey: ["id"],
    defaultSort: "createdAt",
    fields: [
      { name: "id", label: "ID", type: "text", primaryKey: true, readOnly: true },
      { name: "userId", label: "Pengguna", type: "relation", relation: { table: "user", labelField: "name" }, required: true },
      { name: "documentType", label: "Jenis dokumen", type: "enum", options: ["student-card", "enrollment-letter"] },
      { name: "createdAt", label: "Dikirim", type: "datetime", readOnly: true },
    ],
  },
];

export function getAdminTable(key: string): AdminTableConfig | undefined {
  return ADMIN_TABLES.find((table) => table.key === key);
}

export function adminTableHref(key: AdminTableKey) {
  return `/admin/${key}`;
}

export function editableFields(config: AdminTableConfig, mode: "create" | "edit") {
  return config.fields.filter((field) => {
    if (field.readOnly || field.displayOnly) return false;
    if (mode === "edit" && field.primaryKey) return false;
    return true;
  });
}

export function isReferenceField(field: AdminField): field is AdminField & { relation: NonNullable<AdminField["relation"]> } {
  return field.type === "relation" && field.relation !== undefined;
}
