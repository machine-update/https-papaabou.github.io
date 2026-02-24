-- AlterTable
ALTER TABLE "Artiste" ADD COLUMN     "bookingFormats" JSONB,
ADD COLUMN     "highlights" JSONB,
ADD COLUMN     "shortBio" TEXT,
ADD COLUMN     "socials" JSONB,
ADD COLUMN     "stats" JSONB;
