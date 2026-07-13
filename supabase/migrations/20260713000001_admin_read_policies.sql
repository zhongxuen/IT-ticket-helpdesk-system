CREATE POLICY email_notifications_select_admin
ON public.email_notifications FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY audit_logs_select_admin
ON public.audit_logs FOR SELECT
TO authenticated
USING (public.is_admin());