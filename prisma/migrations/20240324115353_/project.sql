-- -------------------------------------------------------------
-- TablePlus 6.0.0(550)
--
-- https://tableplus.com/
--
-- Database: grants_portal_database
-- Generation Time: 2024-05-20 14:59:35.4150
-- -------------------------------------------------------------


-- This script only contains the table creation statements and does not fully represent the table in the database. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS project_proj_id_seq;

-- Table Definition
CREATE TABLE "public"."project" (
    "proj_id" int4 NOT NULL DEFAULT nextval('project_proj_id_seq'::regclass),
    "proj_title" varchar(255),
    "proj_app_amt" numeric(10,2),
    "proj_amt_uti" numeric(10,2),
    "proj_start_date" date,
    "project_end_date" date,
    "proj_agency" varchar(100),
    "proj_reviewer" varchar(100),
    "claim_status" varchar(50),
    "claim_amount" numeric(10,2),
    "claim_date" date,
    "applicant_name" varchar(255),
    PRIMARY KEY ("proj_id")
);

