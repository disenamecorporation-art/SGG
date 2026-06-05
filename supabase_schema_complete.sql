-- ==========================================
-- SGG: SISTEMA DE GESTIÓN GANADERA
-- SUPABASE COMPLETE UNRESTRICTED DATABASE SCHEMA
-- ==========================================
-- INSTRUCTIONS:
-- 1. Create a brand new project in Supabase or clear your current database.
-- 2. Open the SQL Editor in Supabase.
-- 3. Click "New Query", paste this entire script, and click "Run".
-- 4. All Row Level Security (RLS) configurations are disabled to guarantee 
--    connection without rigid permissions blocks.

-- Drop tables if they exist to start fresh
DROP TABLE IF EXISTS "registered_users" CASCADE;
DROP TABLE IF EXISTS "animals" CASCADE;
DROP TABLE IF EXISTS "milk_logs" CASCADE;
DROP TABLE IF EXISTS "mastitis_logs" CASCADE;
DROP TABLE IF EXISTS "weight_records" CASCADE;
DROP TABLE IF EXISTS "medicines" CASCADE;
DROP TABLE IF EXISTS "treatment_logs" CASCADE;
DROP TABLE IF EXISTS "tasks" CASCADE;
DROP TABLE IF EXISTS "transactions" CASCADE;
DROP TABLE IF EXISTS "mass_treatments" CASCADE;
DROP TABLE IF EXISTS "mass_vaccinations" CASCADE;
DROP TABLE IF EXISTS "breeding_seasons" CASCADE;
DROP TABLE IF EXISTS "bull_evaluations" CASCADE;
DROP TABLE IF EXISTS "buffalo_production" CASCADE;
DROP TABLE IF EXISTS "small_ruminant_logs" CASCADE;

-- 1. registered_users
CREATE TABLE "registered_users" (
    "email" VARCHAR(255) PRIMARY KEY,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "farm_name" TEXT
);
ALTER TABLE "registered_users" DISABLE ROW LEVEL SECURITY;

-- 2. animals
CREATE TABLE "animals" (
    "id" TEXT PRIMARY KEY,
    "tag" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "breed" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "sex" TEXT NOT NULL,
    "birthDate" TEXT NOT NULL,
    "birthWeight" NUMERIC NOT NULL,
    "currentWeight" NUMERIC NOT NULL,
    "status" TEXT NOT NULL,
    "pregnancyStatus" TEXT,
    "lactationStatus" TEXT,
    "lot" TEXT NOT NULL,
    "pasture" TEXT NOT NULL,
    "fatherTag" TEXT,
    "motherTag" TEXT,
    "asocebuNumber" TEXT,
    "geneticsScore" TEXT,
    "weaningWeight205" NUMERIC,
    "weight540" NUMERIC
);
ALTER TABLE "animals" DISABLE ROW LEVEL SECURITY;

-- 3. milk_logs
CREATE TABLE "milk_logs" (
    "id" TEXT PRIMARY KEY,
    "date" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "morningYield" NUMERIC NOT NULL,
    "afternoonYield" NUMERIC NOT NULL,
    "totalYield" NUMERIC NOT NULL
);
ALTER TABLE "milk_logs" DISABLE ROW LEVEL SECURITY;

-- 4. mastitis_logs
CREATE TABLE "mastitis_logs" (
    "id" TEXT PRIMARY KEY,
    "date" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "quadrants" JSONB NOT NULL,
    "grade" TEXT NOT NULL,
    "treatmentApplied" TEXT NOT NULL
);
ALTER TABLE "mastitis_logs" DISABLE ROW LEVEL SECURITY;

-- 5. weight_records
CREATE TABLE "weight_records" (
    "id" TEXT PRIMARY KEY,
    "date" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "weight" NUMERIC NOT NULL,
    "adg" NUMERIC NOT NULL
);
ALTER TABLE "weight_records" DISABLE ROW LEVEL SECURITY;

-- 6. medicines
CREATE TABLE "medicines" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "activeIngredient" TEXT NOT NULL,
    "stock" NUMERIC NOT NULL,
    "unit" TEXT NOT NULL,
    "withdrawalPeriod" NUMERIC NOT NULL
);
ALTER TABLE "medicines" DISABLE ROW LEVEL SECURITY;

-- 7. treatment_logs
CREATE TABLE "treatment_logs" (
    "id" TEXT PRIMARY KEY,
    "date" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "medicineId" TEXT NOT NULL,
    "medicineName" TEXT NOT NULL,
    "dose" TEXT NOT NULL,
    "withdrawalEnd" TEXT NOT NULL,
    "notes" TEXT NOT NULL
);
ALTER TABLE "treatment_logs" DISABLE ROW LEVEL SECURITY;

-- 8. tasks
CREATE TABLE "tasks" (
    "id" TEXT PRIMARY KEY,
    "title" TEXT NOT NULL,
    "dueDate" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL,
    "category" TEXT NOT NULL,
    "priority" TEXT NOT NULL
);
ALTER TABLE "tasks" DISABLE ROW LEVEL SECURITY;

-- 9. transactions
CREATE TABLE "transactions" (
    "id" TEXT PRIMARY KEY,
    "date" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amountUsd" NUMERIC NOT NULL,
    "amountVes" NUMERIC NOT NULL
);
ALTER TABLE "transactions" DISABLE ROW LEVEL SECURITY;

-- 10. mass_treatments
CREATE TABLE "mass_treatments" (
    "id" TEXT PRIMARY KEY,
    "date" TEXT NOT NULL,
    "groupType" TEXT NOT NULL,
    "groupName" TEXT NOT NULL,
    "medicineId" TEXT NOT NULL,
    "medicineName" TEXT NOT NULL,
    "dose" TEXT NOT NULL,
    "totalAnimals" NUMERIC NOT NULL,
    "personnel" TEXT NOT NULL
);
ALTER TABLE "mass_treatments" DISABLE ROW LEVEL SECURITY;

-- 11. mass_vaccinations
CREATE TABLE "mass_vaccinations" (
    "id" TEXT PRIMARY KEY,
    "date" TEXT NOT NULL,
    "vaccineType" TEXT NOT NULL,
    "groupType" TEXT NOT NULL,
    "groupName" TEXT NOT NULL,
    "totalAnimals" NUMERIC NOT NULL,
    "batchNumber" TEXT NOT NULL,
    "nextDoseDate" TEXT NOT NULL
);
ALTER TABLE "mass_vaccinations" DISABLE ROW LEVEL SECURITY;

-- 12. breeding_seasons
CREATE TABLE "breeding_seasons" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "breedingType" TEXT NOT NULL,
    "sireId" TEXT NOT NULL,
    "sireTag" TEXT NOT NULL,
    "cowsCount" NUMERIC NOT NULL,
    "palpationsCount" NUMERIC NOT NULL,
    "pregnanciesConfirmed" NUMERIC NOT NULL
);
ALTER TABLE "breeding_seasons" DISABLE ROW LEVEL SECURITY;

-- 13. bull_evaluations
CREATE TABLE "bull_evaluations" (
    "id" TEXT PRIMARY KEY,
    "date" TEXT NOT NULL,
    "bullId" TEXT NOT NULL,
    "bullTag" TEXT NOT NULL,
    "andrologyScore" NUMERIC NOT NULL,
    "libidoRating" TEXT NOT NULL,
    "matingCount" NUMERIC NOT NULL,
    "conceptionRate" NUMERIC NOT NULL,
    "scrotalCircumference" NUMERIC NOT NULL,
    "notes" TEXT NOT NULL
);
ALTER TABLE "bull_evaluations" DISABLE ROW LEVEL SECURITY;

-- 14. buffalo_production
CREATE TABLE "buffalo_production" (
    "id" TEXT PRIMARY KEY,
    "date" TEXT NOT NULL,
    "totalBuffaloes" NUMERIC NOT NULL,
    "milkingBuffaloes" NUMERIC NOT NULL,
    "dailyYieldKg" NUMERIC NOT NULL,
    "averageFat" NUMERIC NOT NULL,
    "averageProtein" NUMERIC NOT NULL,
    "cheeseProjectionKg" NUMERIC NOT NULL
);
ALTER TABLE "buffalo_production" DISABLE ROW LEVEL SECURITY;

-- 15. small_ruminant_logs
CREATE TABLE "small_ruminant_logs" (
    "id" TEXT PRIMARY KEY,
    "date" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "breed" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "milkYield" NUMERIC,
    "weight" NUMERIC,
    "prolificacyCount" NUMERIC,
    "notes" TEXT NOT NULL
);
ALTER TABLE "small_ruminant_logs" DISABLE ROW LEVEL SECURITY;

-- Pre-populate admin user safely
INSERT INTO "registered_users" ("email", "password", "name", "farm_name")
VALUES ('disenamecorporation@gmail.com', '123456', 'Ing. Carlos Ruiz', 'Hacienda La Esmeralda')
ON CONFLICT ("email") DO NOTHING;
