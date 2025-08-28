-- Fix security warnings by setting search_path for all functions

-- Update generate_booking_reference function
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN 'CE' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0');
END;
$$;

-- Update update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Update set_booking_reference function
CREATE OR REPLACE FUNCTION set_booking_reference()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.booking_reference IS NULL THEN
    NEW.booking_reference = generate_booking_reference();
  END IF;
  RETURN NEW;
END;
$$;

-- Update auto_categorize_event function
CREATE OR REPLACE FUNCTION auto_categorize_event()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.date < CURRENT_DATE THEN
    NEW.category = 'past';
  ELSE
    NEW.category = 'upcoming';
  END IF;
  RETURN NEW;
END;
$$;

-- Update update_ticket_availability function
CREATE OR REPLACE FUNCTION update_ticket_availability()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
    -- Decrease available quantity for each ticket type in this booking
    UPDATE public.ticket_types 
    SET available_quantity = available_quantity - bi.quantity
    FROM public.booking_items bi
    WHERE bi.booking_id = NEW.id 
    AND bi.ticket_type_id = public.ticket_types.id
    AND public.ticket_types.available_quantity >= bi.quantity;
  ELSIF NEW.status != 'confirmed' AND OLD.status = 'confirmed' THEN
    -- Increase available quantity if booking is no longer confirmed
    UPDATE public.ticket_types 
    SET available_quantity = available_quantity + bi.quantity
    FROM public.booking_items bi
    WHERE bi.booking_id = NEW.id 
    AND bi.ticket_type_id = public.ticket_types.id;
  END IF;
  RETURN NEW;
END;
$$;