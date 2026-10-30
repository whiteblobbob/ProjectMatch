-- CreateEnum
CREATE TYPE "account_role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "project_status" AS ENUM ('OPEN_RECRUITMENT', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "collaboration_mode" AS ENUM ('ONLINE', 'OFFLINE', 'HYBRID');

-- CreateEnum
CREATE TYPE "online_platform" AS ENUM ('GOOGLE_MEET', 'ZOOM', 'MICROSOFT_TEAMS', 'DISCORD');

-- CreateEnum
CREATE TYPE "offline_place" AS ENUM ('SEKOLAH', 'KAMPUS', 'RUANG_PUBLIK', 'KAFE');

-- CreateEnum
CREATE TYPE "education_level" AS ENUM ('SMP', 'SMA', 'MAHASISWA');

-- CreateEnum
CREATE TYPE "project_range" AS ENUM ('ALL', 'INTERNAL', 'PROVINCE', 'CITY', 'INSTITUTIONS');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "institution" TEXT,
    "institution_name" TEXT,
    "education_level" "education_level",
    "study_program" TEXT,
    "school_grade" TEXT,
    "entry_year" INTEGER,
    "graduation_year" INTEGER,
    "date_of_birth" TIMESTAMP(3),
    "bio" TEXT,
    "province" TEXT,
    "city" TEXT,
    "profile_cloud_id" TEXT,
    "portfolio_link" TEXT,
    "role" "account_role" NOT NULL DEFAULT 'USER',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verification_token" TEXT,
    "verification_token_expires_at" TIMESTAMP(3),
    "total_projects_completed" INTEGER NOT NULL DEFAULT 0,
    "avg_commitment_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_role" (
    "user_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,

    CONSTRAINT "user_role_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "project" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "deadline" TIMESTAMP(3),
    "collaboration_mode" "collaboration_mode" NOT NULL DEFAULT 'ONLINE',
    "online_platform" "online_platform",
    "online_link" TEXT,
    "offline_place" "offline_place",
    "offline_link" TEXT,
    "meet_description" TEXT NOT NULL,
    "meet_at" TIMESTAMP(3),
    "meet_end_at" TIMESTAMP(3),
    "collaboration_tool" TEXT,
    "work_hours_per_week" INTEGER NOT NULL,
    "education_levels" "education_level"[],
    "audience_range" "project_range" NOT NULL DEFAULT 'ALL',
    "allowed_institutions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "extra_criteria" TEXT,
    "source_link" TEXT,
    "status" "project_status" NOT NULL DEFAULT 'OPEN_RECRUITMENT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_report" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "reporter_id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "details" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_role" (
    "project_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "slots_available" INTEGER NOT NULL,

    CONSTRAINT "project_role_pkey" PRIMARY KEY ("project_id","role_id")
);

-- CreateTable
CREATE TABLE "application" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "applicant_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "message" TEXT,

    CONSTRAINT "application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_info" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_member" (
    "project_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,

    CONSTRAINT "project_member_pkey" PRIMARY KEY ("project_id","user_id")
);

-- CreateTable
CREATE TABLE "peer_review" (
    "project_id" TEXT NOT NULL,
    "reviewer_id" TEXT NOT NULL,
    "reviewee_id" TEXT NOT NULL,
    "commitment_score" INTEGER NOT NULL,
    "feedback" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "notification" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_document" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "document_cloud_id" TEXT NOT NULL,
    "document_type" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verification_document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school_institution" (
    "npsn" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "school_institution_pkey" PRIMARY KEY ("npsn")
);

-- CreateTable
CREATE TABLE "university_institution" (
    "npsn" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "university_institution_pkey" PRIMARY KEY ("npsn")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_verification_token_key" ON "user"("verification_token");

-- CreateIndex
CREATE UNIQUE INDEX "application_project_id_applicant_id_key" ON "application"("project_id", "applicant_id");

-- CreateIndex
CREATE UNIQUE INDEX "peer_review_project_id_reviewer_id_reviewee_id_key" ON "peer_review"("project_id", "reviewer_id", "reviewee_id");

-- CreateIndex
CREATE UNIQUE INDEX "verification_document_user_id_key" ON "verification_document"("user_id");

-- AddForeignKey
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_report" ADD CONSTRAINT "project_report_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_report" ADD CONSTRAINT "project_report_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_role" ADD CONSTRAINT "project_role_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_role" ADD CONSTRAINT "project_role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application" ADD CONSTRAINT "application_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application" ADD CONSTRAINT "application_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application" ADD CONSTRAINT "application_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_info" ADD CONSTRAINT "contact_info_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_member" ADD CONSTRAINT "project_member_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_member" ADD CONSTRAINT "project_member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_member" ADD CONSTRAINT "project_member_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peer_review" ADD CONSTRAINT "peer_review_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peer_review" ADD CONSTRAINT "peer_review_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peer_review" ADD CONSTRAINT "peer_review_reviewee_id_fkey" FOREIGN KEY ("reviewee_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_document" ADD CONSTRAINT "verification_document_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
