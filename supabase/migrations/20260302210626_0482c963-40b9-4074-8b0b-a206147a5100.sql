
-- Game state table (single row, tracks current game)
CREATE TABLE public.game_state (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  current_letter TEXT,
  current_round INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'waiting', -- waiting, playing, basta, results
  basta_by TEXT, -- 'jose' or 'nicol'
  jose_connected BOOLEAN NOT NULL DEFAULT false,
  nicol_connected BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Answers table
CREATE TABLE public.answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  round INTEGER NOT NULL,
  player TEXT NOT NULL, -- 'jose' or 'nicol'
  nombre TEXT DEFAULT '',
  apellido TEXT DEFAULT '',
  color TEXT DEFAULT '',
  animal TEXT DEFAULT '',
  fruta_verdura TEXT DEFAULT '',
  cosa TEXT DEFAULT '',
  pais TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Scores table
CREATE TABLE public.scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player TEXT NOT NULL UNIQUE, -- 'jose' or 'nicol'
  total_score INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.game_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;

-- Since this is a private game with no auth, allow all operations via anon key
-- This is acceptable because it's a private 2-player game, not a public app
CREATE POLICY "Allow all on game_state" ON public.game_state FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on answers" ON public.answers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on scores" ON public.scores FOR ALL USING (true) WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_state;
ALTER PUBLICATION supabase_realtime ADD TABLE public.answers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.scores;

-- Insert initial game state
INSERT INTO public.game_state (status) VALUES ('waiting');

-- Insert initial scores
INSERT INTO public.scores (player, total_score) VALUES ('jose', 0), ('nicol', 0);
