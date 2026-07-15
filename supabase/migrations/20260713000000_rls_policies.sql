-- ============================================================
-- Helper functions (SECURITY DEFINER to avoid recursive RLS)
-- ============================================================

CREATE OR REPLACE FUNCTION public.current_profile_role()
RETURNS user_role
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT public.current_profile_role() IN ('admin', 'it', 'technician');
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT public.current_profile_role() = 'admin';
$$;

GRANT EXECUTE ON FUNCTION public.current_profile_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_staff() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- ============================================================
-- profiles
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY profiles_select_all
ON public.profiles FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS profiles_update_self ON public.profiles;
CREATE POLICY profiles_update_self
ON public.profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY profiles_update_admin
ON public.profiles FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- inserts/deletes handled only via service role (API routes)

-- ============================================================
-- ticket_categories
-- ============================================================
ALTER TABLE public.ticket_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY categories_select_all
ON public.ticket_categories FOR SELECT
TO authenticated
USING (true);

CREATE POLICY categories_insert_admin
ON public.ticket_categories FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY categories_update_admin
ON public.ticket_categories FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ============================================================
-- tickets
-- ============================================================
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY tickets_select_own_or_staff
ON public.tickets FOR SELECT
TO authenticated
USING (employee_id = auth.uid() OR public.is_staff());

CREATE POLICY tickets_insert_own
ON public.tickets FOR INSERT
TO authenticated
WITH CHECK (employee_id = auth.uid());

CREATE POLICY tickets_update_staff
ON public.tickets FOR UPDATE
TO authenticated
USING (public.is_staff())
WITH CHECK (public.is_staff());

-- ============================================================
-- ticket_comments
-- ============================================================
ALTER TABLE public.ticket_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY comments_select_visible
ON public.ticket_comments FOR SELECT
TO authenticated
USING (
  public.is_staff()
  OR (
    visibility = 'public'
    AND EXISTS (
      SELECT 1 FROM public.tickets t
      WHERE t.id = ticket_comments.ticket_id
        AND t.employee_id = auth.uid()
    )
  )
);

CREATE POLICY comments_insert_participant
ON public.ticket_comments FOR INSERT
TO authenticated
WITH CHECK (
  author_id = auth.uid()
  AND (
    public.is_staff()
    OR (
      visibility = 'public'
      AND EXISTS (
        SELECT 1 FROM public.tickets t
        WHERE t.id = ticket_comments.ticket_id
          AND t.employee_id = auth.uid()
      )
    )
  )
);

-- ============================================================
-- ticket_history
-- ============================================================
ALTER TABLE public.ticket_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY history_select_staff
ON public.ticket_history FOR SELECT
TO authenticated
USING (public.is_staff());

CREATE POLICY history_insert_staff
ON public.ticket_history FOR INSERT
TO authenticated
WITH CHECK (public.is_staff() AND changed_by = auth.uid());

-- ============================================================
-- system_settings
-- ============================================================
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY settings_select_admin
ON public.system_settings FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY settings_upsert_admin
ON public.system_settings FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY settings_update_admin
ON public.system_settings FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ============================================================
-- Locked tables (not yet used by app code) — RLS enabled,
-- no policies for `authenticated`; only service_role bypasses RLS.
-- ============================================================
ALTER TABLE public.email_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_predictions ENABLE ROW LEVEL SECURITY;