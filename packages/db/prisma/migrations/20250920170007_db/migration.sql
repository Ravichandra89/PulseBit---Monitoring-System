-- CreateTable
CREATE TABLE "public"."user" (
    "id" SERIAL NOT NULL,
    "tenant_id" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."workspace" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "stripe_id" TEXT,
    "name" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."page" (
    "id" SERIAL NOT NULL,
    "workspace_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "slug" TEXT NOT NULL,
    "custom_domain" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."monitor" (
    "id" SERIAL NOT NULL,
    "job_type" TEXT NOT NULL DEFAULT 'other',
    "periodicity" TEXT NOT NULL DEFAULT 'other',
    "status" TEXT NOT NULL DEFAULT 'inactive',
    "active" BOOLEAN NOT NULL DEFAULT false,
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "workspace_id" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "monitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."incident" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "page_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "incident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."incident_update" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "incident_date" TIMESTAMP(3),
    "title" TEXT,
    "message" TEXT,
    "incident_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "incident_update_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."monitors_to_pages" (
    "monitor_id" INTEGER NOT NULL,
    "page_id" INTEGER NOT NULL,

    CONSTRAINT "monitors_to_pages_pkey" PRIMARY KEY ("monitor_id","page_id")
);

-- CreateTable
CREATE TABLE "public"."users_to_workspaces" (
    "user_id" INTEGER NOT NULL,
    "workspace_id" INTEGER NOT NULL,

    CONSTRAINT "users_to_workspaces_pkey" PRIMARY KEY ("user_id","workspace_id")
);

-- CreateTable
CREATE TABLE "public"."_UsersToWorkspaces" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_UsersToWorkspaces_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_MonitorsToPages" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MonitorsToPages_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_tenant_id_key" ON "public"."user"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_slug_key" ON "public"."workspace"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_stripe_id_key" ON "public"."workspace"("stripe_id");

-- CreateIndex
CREATE UNIQUE INDEX "page_slug_key" ON "public"."page"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "incident_update_uuid_key" ON "public"."incident_update"("uuid");

-- CreateIndex
CREATE INDEX "_UsersToWorkspaces_B_index" ON "public"."_UsersToWorkspaces"("B");

-- CreateIndex
CREATE INDEX "_MonitorsToPages_B_index" ON "public"."_MonitorsToPages"("B");

-- AddForeignKey
ALTER TABLE "public"."page" ADD CONSTRAINT "page_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."monitor" ADD CONSTRAINT "monitor_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."incident" ADD CONSTRAINT "incident_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "public"."page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."incident_update" ADD CONSTRAINT "incident_update_incident_id_fkey" FOREIGN KEY ("incident_id") REFERENCES "public"."incident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."monitors_to_pages" ADD CONSTRAINT "monitors_to_pages_monitor_id_fkey" FOREIGN KEY ("monitor_id") REFERENCES "public"."monitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."monitors_to_pages" ADD CONSTRAINT "monitors_to_pages_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "public"."page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."users_to_workspaces" ADD CONSTRAINT "users_to_workspaces_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."users_to_workspaces" ADD CONSTRAINT "users_to_workspaces_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_UsersToWorkspaces" ADD CONSTRAINT "_UsersToWorkspaces_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_UsersToWorkspaces" ADD CONSTRAINT "_UsersToWorkspaces_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MonitorsToPages" ADD CONSTRAINT "_MonitorsToPages_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."monitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MonitorsToPages" ADD CONSTRAINT "_MonitorsToPages_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
