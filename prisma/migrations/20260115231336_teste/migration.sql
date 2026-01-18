/*
  Warnings:

  - You are about to alter the column `subtotal` on the `budget` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Integer`.
  - You are about to alter the column `discount_amount` on the `budget` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Integer`.
  - You are about to alter the column `total` on the `budget` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Integer`.
  - You are about to alter the column `quantity` on the `budget_item` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Integer`.
  - You are about to alter the column `unit_price` on the `budget_item` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Integer`.
  - You are about to alter the column `line_total` on the `budget_item` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Integer`.
  - You are about to alter the column `base_price` on the `service` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "budget" ALTER COLUMN "subtotal" SET DEFAULT 0,
ALTER COLUMN "subtotal" SET DATA TYPE INTEGER,
ALTER COLUMN "discount_amount" SET DEFAULT 0,
ALTER COLUMN "discount_amount" SET DATA TYPE INTEGER,
ALTER COLUMN "total" SET DEFAULT 0,
ALTER COLUMN "total" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "budget_item" ALTER COLUMN "quantity" SET DEFAULT 1,
ALTER COLUMN "quantity" SET DATA TYPE INTEGER,
ALTER COLUMN "unit_price" SET DEFAULT 0,
ALTER COLUMN "unit_price" SET DATA TYPE INTEGER,
ALTER COLUMN "line_total" SET DEFAULT 0,
ALTER COLUMN "line_total" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "service" ALTER COLUMN "base_price" SET DEFAULT 0,
ALTER COLUMN "base_price" SET DATA TYPE INTEGER;
