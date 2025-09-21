/*
  Warnings:

  - You are about to drop the column `page_id` on the `incident` table. All the data in the column will be lost.
  - The `status` column on the `incident` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `job_type` column on the `monitor` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `periodicity` column on the `monitor` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `monitor` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `stripe_id` on the `workspace` table. All the data in the column will be lost.
  - You are about to drop the `_MonitorsToPages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UsersToWorkspaces` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `incident_update` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[monitor_id,started_at]` on the table `incident` will be added. If there are existing duplicate values, this will fail.
  - Made the column `icon` on table `page` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "public"."MonitorJobTypes" AS ENUM ('http', 'tcp', 'icmp', 'other');

-- CreateEnum
CREATE TYPE "public"."MonitorPeriodicity" AS ENUM ('1m', '5m', '10m', '30m', '1h', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."MonitorStatusEnum" AS ENUM ('active', 'down', 'inactive');

-- CreateEnum
CREATE TYPE "public"."MonitorMethods" AS ENUM ('GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS', 'PATCH');

-- CreateEnum
CREATE TYPE "public"."NotificationProvider" AS ENUM ('email', 'slack', 'pagerduty', 'opsgenie', 'discord', 'telegram', 'sms');

-- CreateEnum
CREATE TYPE "public"."WorkspaceRole" AS ENUM ('owner', 'admin', 'member');

-- CreateEnum
CREATE TYPE "public"."StatusReportStatus" AS ENUM ('investigating', 'identified', 'monitoring', 'resolved');

-- CreateEnum
CREATE TYPE "public"."StatusIncident" AS ENUM ('triage', 'investigating', 'identified', 'monitoring', 'resolved', 'duplicated');

-- DropForeignKey
ALTER TABLE "public"."_MonitorsToPages" DROP CONSTRAINT "_MonitorsToPages_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_MonitorsToPages" DROP CONSTRAINT "_MonitorsToPages_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_UsersToWorkspaces" DROP CONSTRAINT "_UsersToWorkspaces_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_UsersToWorkspaces" DROP CONSTRAINT "_UsersToWorkspaces_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."incident" DROP CONSTRAINT "incident_page_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."incident_update" DROP CONSTRAINT "incident_update_incident_id_fkey";

-- DropIndex
DROP INDEX "public"."workspace_stripe_id_key";

-- AlterTable
ALTER TABLE "public"."incident" DROP COLUMN "page_id",
ADD COLUMN     "acknowledged_at" TIMESTAMP(3),
ADD COLUMN     "acknowledged_by" INTEGER,
ADD COLUMN     "auto_resolved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "incident_screenshot_url" TEXT,
ADD COLUMN     "monitor_id" INTEGER,
ADD COLUMN     "recovery_screenshot_url" TEXT,
ADD COLUMN     "resolved_at" TIMESTAMP(3),
ADD COLUMN     "resolved_by" INTEGER,
ADD COLUMN     "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "summary" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "title" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "userId" INTEGER,
ADD COLUMN     "workspace_id" INTEGER,
DROP COLUMN "status",
ADD COLUMN     "status" "public"."StatusIncident" NOT NULL DEFAULT 'triage';

-- AlterTable
ALTER TABLE "public"."monitor" ADD COLUMN     "assertions" TEXT,
ADD COLUMN     "body" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "degraded_after" INTEGER,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "follow_redirects" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "headers" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "method" "public"."MonitorMethods" NOT NULL DEFAULT 'GET',
ADD COLUMN     "otel_endpoint" TEXT,
ADD COLUMN     "otel_headers" TEXT,
ADD COLUMN     "public" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "regions" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "retry" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "timeout" INTEGER NOT NULL DEFAULT 45000,
DROP COLUMN "job_type",
ADD COLUMN     "job_type" "public"."MonitorJobTypes" NOT NULL DEFAULT 'http',
DROP COLUMN "periodicity",
ADD COLUMN     "periodicity" "public"."MonitorPeriodicity" NOT NULL DEFAULT 'OTHER',
DROP COLUMN "status",
ADD COLUMN     "status" "public"."MonitorStatusEnum" NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "public"."monitors_to_pages" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."page" ADD COLUMN     "configuration" TEXT,
ADD COLUMN     "contact_url" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "forceTheme" TEXT NOT NULL DEFAULT 'system',
ADD COLUMN     "homepage_url" TEXT,
ADD COLUMN     "legacy_page" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "password_protected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "show_monitor_values" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "icon" SET NOT NULL,
ALTER COLUMN "icon" SET DEFAULT '';

-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "first_name" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "last_name" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "name" TEXT,
ADD COLUMN     "photo_url" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "public"."users_to_workspaces" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "role" "public"."WorkspaceRole" NOT NULL DEFAULT 'member';

-- AlterTable
ALTER TABLE "public"."workspace" DROP COLUMN "stripe_id",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "public"."_MonitorsToPages";

-- DropTable
DROP TABLE "public"."_UsersToWorkspaces";

-- DropTable
DROP TABLE "public"."incident_update";

-- CreateTable
CREATE TABLE "public"."account" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."session" (
    "session_token" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("session_token")
);

-- CreateTable
CREATE TABLE "public"."verification_token" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_token_pkey" PRIMARY KEY ("identifier")
);

-- CreateTable
CREATE TABLE "public"."page_subscriber" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "page_id" INTEGER NOT NULL,
    "token" TEXT,
    "accepted_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "page_subscriber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."monitor_status" (
    "monitor_id" INTEGER NOT NULL,
    "region" TEXT NOT NULL DEFAULT '',
    "status" "public"."MonitorStatusEnum" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "monitor_status_pkey" PRIMARY KEY ("monitor_id","region")
);

-- CreateTable
CREATE TABLE "public"."monitor_tag" (
    "id" SERIAL NOT NULL,
    "workspace_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "monitor_tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."monitor_tag_to_monitor" (
    "monitor_id" INTEGER NOT NULL,
    "monitor_tag_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "monitor_tag_to_monitor_pkey" PRIMARY KEY ("monitor_id","monitor_tag_id")
);

-- CreateTable
CREATE TABLE "public"."notification" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "provider" "public"."NotificationProvider" NOT NULL,
    "data" TEXT NOT NULL DEFAULT '{}',
    "workspace_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notifications_to_monitors" (
    "monitor_id" INTEGER NOT NULL,
    "notification_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_to_monitors_pkey" PRIMARY KEY ("monitor_id","notification_id")
);

-- CreateTable
CREATE TABLE "public"."notification_trigger" (
    "id" SERIAL NOT NULL,
    "monitor_id" INTEGER,
    "notification_id" INTEGER,
    "cron_timestamp" INTEGER NOT NULL,

    CONSTRAINT "notification_trigger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."maintenance" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "from" TIMESTAMP(3) NOT NULL,
    "to" TIMESTAMP(3) NOT NULL,
    "workspace_id" INTEGER,
    "page_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "maintenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."maintenance_to_monitor" (
    "maintenance_id" INTEGER NOT NULL,
    "monitor_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "maintenance_to_monitor_pkey" PRIMARY KEY ("maintenance_id","monitor_id")
);

-- CreateTable
CREATE TABLE "public"."application" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "dsn" TEXT,
    "workspace_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."check" (
    "id" SERIAL NOT NULL,
    "regions" TEXT NOT NULL DEFAULT '',
    "url" TEXT NOT NULL,
    "headers" TEXT NOT NULL DEFAULT '',
    "body" TEXT NOT NULL DEFAULT '',
    "method" "public"."MonitorMethods" NOT NULL DEFAULT 'GET',
    "count_requests" INTEGER NOT NULL DEFAULT 1,
    "workspace_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "check_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."invitation" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "role" "public"."WorkspaceRole" NOT NULL DEFAULT 'member',
    "workspace_id" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accepted_at" TIMESTAMP(3),

    CONSTRAINT "invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."monitor_run" (
    "id" SERIAL NOT NULL,
    "workspace_id" INTEGER,
    "monitor_id" INTEGER,
    "runned_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "monitor_run_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."status_report" (
    "id" SERIAL NOT NULL,
    "status" "public"."StatusReportStatus" NOT NULL,
    "title" TEXT NOT NULL,
    "workspace_id" INTEGER,
    "page_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "status_report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."status_report_update" (
    "id" SERIAL NOT NULL,
    "status" "public"."StatusReportStatus" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "message" TEXT NOT NULL,
    "status_report_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "status_report_update_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."status_report_to_monitors" (
    "monitor_id" INTEGER NOT NULL,
    "status_report_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "status_report_to_monitors_pkey" PRIMARY KEY ("monitor_id","status_report_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_provider_provider_account_id_key" ON "public"."account"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "verification_token_token_key" ON "public"."verification_token"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_token_identifier_token_key" ON "public"."verification_token"("identifier", "token");

-- CreateIndex
CREATE INDEX "monitor_status_idx" ON "public"."monitor_status"("monitor_id", "region");

-- CreateIndex
CREATE UNIQUE INDEX "notification_trigger_notification_id_monitor_id_cron_timest_key" ON "public"."notification_trigger"("notification_id", "monitor_id", "cron_timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "application_dsn_key" ON "public"."application"("dsn");

-- CreateIndex
CREATE UNIQUE INDEX "incident_monitor_id_started_at_key" ON "public"."incident"("monitor_id", "started_at");

-- AddForeignKey
ALTER TABLE "public"."account" ADD CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."page_subscriber" ADD CONSTRAINT "page_subscriber_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "public"."page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."monitor_status" ADD CONSTRAINT "monitor_status_monitor_id_fkey" FOREIGN KEY ("monitor_id") REFERENCES "public"."monitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."monitor_tag" ADD CONSTRAINT "monitor_tag_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."monitor_tag_to_monitor" ADD CONSTRAINT "monitor_tag_to_monitor_monitor_id_fkey" FOREIGN KEY ("monitor_id") REFERENCES "public"."monitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."monitor_tag_to_monitor" ADD CONSTRAINT "monitor_tag_to_monitor_monitor_tag_id_fkey" FOREIGN KEY ("monitor_tag_id") REFERENCES "public"."monitor_tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notification" ADD CONSTRAINT "notification_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications_to_monitors" ADD CONSTRAINT "notifications_to_monitors_monitor_id_fkey" FOREIGN KEY ("monitor_id") REFERENCES "public"."monitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications_to_monitors" ADD CONSTRAINT "notifications_to_monitors_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "public"."notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notification_trigger" ADD CONSTRAINT "notification_trigger_monitor_id_fkey" FOREIGN KEY ("monitor_id") REFERENCES "public"."monitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notification_trigger" ADD CONSTRAINT "notification_trigger_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "public"."notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."maintenance" ADD CONSTRAINT "maintenance_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."maintenance" ADD CONSTRAINT "maintenance_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "public"."page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."maintenance_to_monitor" ADD CONSTRAINT "maintenance_to_monitor_maintenance_id_fkey" FOREIGN KEY ("maintenance_id") REFERENCES "public"."maintenance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."maintenance_to_monitor" ADD CONSTRAINT "maintenance_to_monitor_monitor_id_fkey" FOREIGN KEY ("monitor_id") REFERENCES "public"."monitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."application" ADD CONSTRAINT "application_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."check" ADD CONSTRAINT "check_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."incident" ADD CONSTRAINT "incident_monitor_id_fkey" FOREIGN KEY ("monitor_id") REFERENCES "public"."monitor"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."incident" ADD CONSTRAINT "incident_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."incident" ADD CONSTRAINT "incident_acknowledged_by_fkey" FOREIGN KEY ("acknowledged_by") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."incident" ADD CONSTRAINT "incident_resolved_by_fkey" FOREIGN KEY ("resolved_by") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."incident" ADD CONSTRAINT "incident_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invitation" ADD CONSTRAINT "invitation_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."monitor_run" ADD CONSTRAINT "monitor_run_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."monitor_run" ADD CONSTRAINT "monitor_run_monitor_id_fkey" FOREIGN KEY ("monitor_id") REFERENCES "public"."monitor"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."status_report" ADD CONSTRAINT "status_report_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."status_report" ADD CONSTRAINT "status_report_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "public"."page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."status_report_update" ADD CONSTRAINT "status_report_update_status_report_id_fkey" FOREIGN KEY ("status_report_id") REFERENCES "public"."status_report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."status_report_to_monitors" ADD CONSTRAINT "status_report_to_monitors_monitor_id_fkey" FOREIGN KEY ("monitor_id") REFERENCES "public"."monitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."status_report_to_monitors" ADD CONSTRAINT "status_report_to_monitors_status_report_id_fkey" FOREIGN KEY ("status_report_id") REFERENCES "public"."status_report"("id") ON DELETE CASCADE ON UPDATE CASCADE;
