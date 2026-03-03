
-- Function to atomically increment a player's score
CREATE OR REPLACE FUNCTION public.increment_score(p_player text, p_points integer)
RETURNS void
LANGUAGE sql
SET search_path = public
AS $$
  UPDATE public.scores
  SET total_score = total_score + p_points,
      updated_at = now()
  WHERE player = p_player;
$$;

-- Add unique constraint to prevent duplicate answers per round/player
ALTER TABLE public.answers ADD CONSTRAINT answers_round_player_unique UNIQUE (round, player);
