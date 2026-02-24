-- CreateEnum
CREATE TYPE "ProductionStatus" AS ENUM ('DRAFT', 'IN_PRODUCTION', 'COMPLETED');

-- AlterTable
ALTER TABLE "Artiste" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Partenaire" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Production" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "status" "ProductionStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "tags" JSONB;

-- CreateTable
CREATE TABLE "ProductionArtist" (
    "productionId" UUID NOT NULL,
    "artisteId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductionArtist_pkey" PRIMARY KEY ("productionId","artisteId")
);

-- CreateTable
CREATE TABLE "ProductionPartenaire" (
    "productionId" UUID NOT NULL,
    "partenaireId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductionPartenaire_pkey" PRIMARY KEY ("productionId","partenaireId")
);

-- CreateTable
CREATE TABLE "AdminActivityLog" (
    "id" UUID NOT NULL,
    "userId" UUID,
    "email" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductionArtist_createdAt_idx" ON "ProductionArtist"("createdAt");

-- CreateIndex
CREATE INDEX "ProductionPartenaire_createdAt_idx" ON "ProductionPartenaire"("createdAt");

-- CreateIndex
CREATE INDEX "AdminActivityLog_createdAt_idx" ON "AdminActivityLog"("createdAt");

-- CreateIndex
CREATE INDEX "AdminActivityLog_entity_idx" ON "AdminActivityLog"("entity");

-- CreateIndex
CREATE INDEX "AdminActivityLog_userId_idx" ON "AdminActivityLog"("userId");

-- CreateIndex
CREATE INDEX "Artiste_createdAt_idx" ON "Artiste"("createdAt");

-- CreateIndex
CREATE INDEX "Artiste_featured_idx" ON "Artiste"("featured");

-- CreateIndex
CREATE INDEX "Artiste_isActive_idx" ON "Artiste"("isActive");

-- CreateIndex
CREATE INDEX "Artiste_slug_idx" ON "Artiste"("slug");

-- CreateIndex
CREATE INDEX "Partenaire_createdAt_idx" ON "Partenaire"("createdAt");

-- CreateIndex
CREATE INDEX "Partenaire_isActive_idx" ON "Partenaire"("isActive");

-- CreateIndex
CREATE INDEX "Prestation_createdAt_idx" ON "Prestation"("createdAt");

-- CreateIndex
CREATE INDEX "Production_createdAt_idx" ON "Production"("createdAt");

-- CreateIndex
CREATE INDEX "Production_category_idx" ON "Production"("category");

-- CreateIndex
CREATE INDEX "Production_status_idx" ON "Production"("status");

-- CreateIndex
CREATE INDEX "Production_isActive_idx" ON "Production"("isActive");

-- CreateIndex
CREATE INDEX "Production_slug_idx" ON "Production"("slug");

-- CreateIndex
CREATE INDEX "Project_slug_idx" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "Project_createdAt_idx" ON "Project"("createdAt");

-- CreateIndex
CREATE INDEX "Service_createdAt_idx" ON "Service"("createdAt");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- AddForeignKey
ALTER TABLE "ProductionArtist" ADD CONSTRAINT "ProductionArtist_productionId_fkey" FOREIGN KEY ("productionId") REFERENCES "Production"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionArtist" ADD CONSTRAINT "ProductionArtist_artisteId_fkey" FOREIGN KEY ("artisteId") REFERENCES "Artiste"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionPartenaire" ADD CONSTRAINT "ProductionPartenaire_productionId_fkey" FOREIGN KEY ("productionId") REFERENCES "Production"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionPartenaire" ADD CONSTRAINT "ProductionPartenaire_partenaireId_fkey" FOREIGN KEY ("partenaireId") REFERENCES "Partenaire"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminActivityLog" ADD CONSTRAINT "AdminActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
