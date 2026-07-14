
-- 1) RLS assumes base table privileges exist — make sure they do.
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.tickets TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.ticket_comments TO authenticated;
GRANT SELECT, INSERT ON public.ticket_history TO authenticated;
GRANT SELECT ON public.ticket_categories TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.system_settings TO authenticated;

-- 2) Track who actually resolved the ticket (admin can resolve on technician's behalf)
ALTER TABLE public.tickets
    ADD COLUMN IF NOT EXISTS resolved_by uuid REFERENCES public.profiles(id);

-- 3) Replace the correlated-subquery RLS check with a SECURITY DEFINER helper.
--    (Avoids nested-RLS evaluation on ticket_comments -> tickets -> profiles
--     which was surfacing as a 500 from PostgREST.)
CREATE OR REPLACE FUNCTION public.can_view_ticket_comment(p_ticket_id uuid, p_visibility comment_visibility)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT
    public.is_staff()
    OR (
        p_visibility = 'public'
        AND EXISTS (
        SELECT 1 FROM public.tickets t
        WHERE t.id = p_ticket_id AND t.employee_id = auth.uid()
        )
    );
$$;

GRANT EXECUTE ON FUNCTION public.can_view_ticket_comment(uuid, comment_visibility) TO authenticated;

DROP POLICY IF EXISTS comments_select_visible ON public.ticket_comments;
CREATE POLICY comments_select_visible
ON public.ticket_comments FOR SELECT
TO authenticated
USING (public.can_view_ticket_comment(ticket_id, visibility));

-- 4) Sanity check: confirm is_staff() actually reflects the right roles.
--    (COALESCE already applied in 20260714000000; re-asserted here defensively.)
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT COALESCE(public.current_profile_role() IN ('admin', 'it', 'technician'), false);
$$;

NOTIFY pgrst, 'reload schema';