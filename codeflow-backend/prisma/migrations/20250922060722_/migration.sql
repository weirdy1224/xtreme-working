-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Status" ADD VALUE 'COMPILATION_ERROR';
ALTER TYPE "Status" ADD VALUE 'RUNTIME_ERROR';
ALTER TYPE "Status" ADD VALUE 'TIME_LIMIT_EXCEEDED';
ALTER TYPE "Status" ADD VALUE 'MEMORY_LIMIT_EXCEEDED';
ALTER TYPE "Status" ADD VALUE 'ILLEGAL_SYSTEM_CALL';
ALTER TYPE "Status" ADD VALUE 'INTERNAL_ERROR';
ALTER TYPE "Status" ADD VALUE 'IN_QUEUE';
ALTER TYPE "Status" ADD VALUE 'COMPILING';
ALTER TYPE "Status" ADD VALUE 'RUNNING';

-- AlterTable
ALTER TABLE "Submission" ALTER COLUMN "sourceCode" SET DATA TYPE TEXT;
