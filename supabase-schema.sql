-- ============================================================
-- MSN Athlete Profiling System — Supabase Schema
-- Run this in the Supabase SQL Editor (supabase.com/dashboard)
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: athletes
-- ============================================================
CREATE TABLE athletes (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama_atlet       TEXT NOT NULL,
  no_kp            TEXT NOT NULL UNIQUE,
  sukan            TEXT NOT NULL DEFAULT 'MEMANAH',
  acara            TEXT NOT NULL,
  gambar_url       TEXT,
  negeri           TEXT,
  tarikh_lahir     DATE,
  berat_badan      NUMERIC(5,2),
  tinggi           NUMERIC(5,2),
  sekolah          TEXT,
  jurulatih        TEXT,
  no_perhubungan   TEXT,
  ulasan_prestasi  TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_athletes_updated_at
BEFORE UPDATE ON athletes
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================
-- TABLE: achievements
-- ============================================================
CREATE TABLE achievements (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  athlete_id   UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  urutan       SMALLINT NOT NULL CHECK (urutan BETWEEN 1 AND 7),
  kejohanan    TEXT NOT NULL,
  tarikh       DATE,
  acara        TEXT,
  catatan      TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (athlete_id, urutan)
);

-- ============================================================
-- TABLE: assessments
-- ============================================================
CREATE TABLE assessments (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  athlete_id   UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  no           SMALLINT NOT NULL CHECK (no BETWEEN 1 AND 5),
  jenis_ujian  TEXT NOT NULL,
  keputusan    TEXT,
  status       TEXT CHECK (status IN ('LULUS', 'GAGAL', 'DALAM PROSES')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (athlete_id, no)
);

-- ============================================================
-- VIEW: athlete_summary (used by dashboard)
-- ============================================================
CREATE VIEW athlete_summary AS
SELECT
  a.id,
  a.nama_atlet,
  a.no_kp,
  a.acara,
  a.negeri,
  a.gambar_url,
  a.jurulatih,
  CASE
    WHEN a.tarikh_lahir IS NOT NULL
    THEN DATE_PART('year', AGE(a.tarikh_lahir))::INT
    ELSE NULL
  END AS umur,
  a.created_at,
  a.updated_at
FROM athletes a;

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_athletes_nama    ON athletes (nama_atlet);
CREATE INDEX idx_athletes_negeri  ON athletes (negeri);
CREATE INDEX idx_athletes_acara   ON athletes (acara);
CREATE INDEX idx_achievements_aid ON achievements (athlete_id);
CREATE INDEX idx_assessments_aid  ON assessments (athlete_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE athletes    ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments  ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read
CREATE POLICY "Athletes: read" ON athletes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Achievements: read" ON achievements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Assessments: read" ON assessments FOR SELECT TO authenticated USING (true);

-- All authenticated users can write (tighten per-role if needed)
CREATE POLICY "Athletes: write" ON athletes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Achievements: write" ON achievements FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Assessments: write" ON assessments FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- STORAGE: athlete-photos bucket
-- Create this manually in Supabase Dashboard > Storage:
--   Bucket name : athlete-photos
--   Public      : false
--   File size   : 5242880 (5 MB)
-- Then run these storage policies:
-- ============================================================
CREATE POLICY "Photos: read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'athlete-photos');
CREATE POLICY "Photos: upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'athlete-photos');
CREATE POLICY "Photos: update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'athlete-photos');
CREATE POLICY "Photos: delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'athlete-photos');
