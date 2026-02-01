-- CreateTable
CREATE TABLE "email_action_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "mealData" JSONB NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_action_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email_action_tokens_token_key" ON "email_action_tokens"("token");

-- CreateIndex
CREATE INDEX "email_action_tokens_token_idx" ON "email_action_tokens"("token");

-- CreateIndex
CREATE INDEX "email_action_tokens_userId_idx" ON "email_action_tokens"("userId");

-- CreateIndex
CREATE INDEX "email_action_tokens_expiresAt_idx" ON "email_action_tokens"("expiresAt");

-- AddForeignKey
ALTER TABLE "email_action_tokens" ADD CONSTRAINT "email_action_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
