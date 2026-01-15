/*
  Warnings:

  - Added the required column `userId` to the `PomodoroSession` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PomodoroSession" DROP CONSTRAINT "PomodoroSession_studyLogId_fkey";

-- AlterTable
ALTER TABLE "PomodoroSession" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "studyLogId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "PomodoroSession_userId_completedAt_idx" ON "PomodoroSession"("userId", "completedAt" DESC);

-- AddForeignKey
ALTER TABLE "PomodoroSession" ADD CONSTRAINT "PomodoroSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PomodoroSession" ADD CONSTRAINT "PomodoroSession_studyLogId_fkey" FOREIGN KEY ("studyLogId") REFERENCES "StudyLog"("id") ON DELETE SET NULL ON UPDATE CASCADE;
