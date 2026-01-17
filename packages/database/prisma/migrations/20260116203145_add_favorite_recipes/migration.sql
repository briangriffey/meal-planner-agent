-- CreateTable
CREATE TABLE "favorite_recipes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mealRecordId" TEXT,
    "name" TEXT NOT NULL,
    "day" TEXT,
    "calories" INTEGER,
    "protein" INTEGER,
    "carbs" INTEGER,
    "fat" INTEGER,
    "fiber" INTEGER,
    "ingredients" JSONB,
    "instructions" JSONB,
    "prepTime" TEXT,
    "cookTime" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorite_recipes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "favorite_recipes_userId_createdAt_idx" ON "favorite_recipes"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "favorite_recipes_userId_name_idx" ON "favorite_recipes"("userId", "name");

-- AddForeignKey
ALTER TABLE "favorite_recipes" ADD CONSTRAINT "favorite_recipes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_recipes" ADD CONSTRAINT "favorite_recipes_mealRecordId_fkey" FOREIGN KEY ("mealRecordId") REFERENCES "meal_records"("id") ON DELETE SET NULL ON UPDATE CASCADE;
