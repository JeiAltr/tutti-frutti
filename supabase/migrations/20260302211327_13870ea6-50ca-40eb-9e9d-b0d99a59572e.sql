
-- Drop restrictive policies
DROP POLICY IF EXISTS "Allow all on game_state" ON public.game_state;
DROP POLICY IF EXISTS "Allow all on answers" ON public.answers;
DROP POLICY IF EXISTS "Allow all on scores" ON public.scores;

-- Create permissive policies
CREATE POLICY "Allow all on game_state" ON public.game_state FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on answers" ON public.answers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on scores" ON public.scores FOR ALL USING (true) WITH CHECK (true);
