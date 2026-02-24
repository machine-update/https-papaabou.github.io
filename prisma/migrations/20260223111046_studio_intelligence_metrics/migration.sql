-- AlterTable
ALTER TABLE "Artiste" ADD COLUMN     "country" TEXT,
ADD COLUMN     "performanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "region" TEXT;

-- AlterTable
ALTER TABLE "Partenaire" ADD COLUMN     "country" TEXT,
ADD COLUMN     "region" TEXT,
ADD COLUMN     "revenueAmount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Production" ADD COLUMN     "abandonmentRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "costAmount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "region" TEXT,
ADD COLUMN     "revenueAmount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "watchTimeMinutes" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Artiste_country_idx" ON "Artiste"("country");

-- CreateIndex
CREATE INDEX "Artiste_region_idx" ON "Artiste"("region");

-- CreateIndex
CREATE INDEX "Partenaire_country_idx" ON "Partenaire"("country");

-- CreateIndex
CREATE INDEX "Partenaire_region_idx" ON "Partenaire"("region");

-- CreateIndex
CREATE INDEX "Production_country_idx" ON "Production"("country");

-- CreateIndex
CREATE INDEX "Production_region_idx" ON "Production"("region");
