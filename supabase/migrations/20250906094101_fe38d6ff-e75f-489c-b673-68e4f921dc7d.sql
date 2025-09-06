-- Allow admins to insert, update, and delete events
CREATE POLICY "Admins can insert events" 
ON public.events 
FOR INSERT 
WITH CHECK (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can update events" 
ON public.events 
FOR UPDATE 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can delete events" 
ON public.events 
FOR DELETE 
USING (public.get_current_user_role() = 'admin');

-- Allow admins to manage ticket types
CREATE POLICY "Admins can insert ticket types" 
ON public.ticket_types 
FOR INSERT 
WITH CHECK (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can update ticket types" 
ON public.ticket_types 
FOR UPDATE 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can delete ticket types" 
ON public.ticket_types 
FOR DELETE 
USING (public.get_current_user_role() = 'admin');