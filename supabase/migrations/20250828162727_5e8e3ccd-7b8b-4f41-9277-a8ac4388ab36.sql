-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  venue TEXT NOT NULL,
  city TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('upcoming', 'past')),
  banner_image_url TEXT,
  gallery_images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create ticket types table
CREATE TABLE public.ticket_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER,
  available_quantity INTEGER,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_instagram TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_screenshot_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'declined')),
  booking_reference TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create booking items table (for multiple ticket types per booking)
CREATE TABLE public.booking_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  ticket_type_id UUID REFERENCES public.ticket_types(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL
);

-- Create profiles table for admin users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for events (public read, admin write)
CREATE POLICY "Anyone can view events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Admins can manage events" ON public.events FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for ticket_types (public read, admin write)
CREATE POLICY "Anyone can view ticket types" ON public.ticket_types FOR SELECT USING (true);
CREATE POLICY "Admins can manage ticket types" ON public.ticket_types FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for bookings (customers can create, admins can manage)
CREATE POLICY "Anyone can create bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all bookings" ON public.bookings FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update bookings" ON public.bookings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for booking_items
CREATE POLICY "Anyone can create booking items" ON public.booking_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all booking items" ON public.booking_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (id = auth.uid());

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('event-images', 'event-images', true),
  ('payment-screenshots', 'payment-screenshots', false);

-- Storage policies for event images (public read, admin write)
CREATE POLICY "Anyone can view event images" ON storage.objects FOR SELECT USING (bucket_id = 'event-images');
CREATE POLICY "Admins can upload event images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'event-images' AND
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update event images" ON storage.objects FOR UPDATE USING (
  bucket_id = 'event-images' AND
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete event images" ON storage.objects FOR DELETE USING (
  bucket_id = 'event-images' AND
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Storage policies for payment screenshots (customers can upload, admins can view)
CREATE POLICY "Anyone can upload payment screenshots" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'payment-screenshots');
CREATE POLICY "Admins can view payment screenshots" ON storage.objects FOR SELECT USING (
  bucket_id = 'payment-screenshots' AND
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Function to generate booking reference
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TEXT AS $$
BEGIN
  RETURN 'CE' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-set booking reference
CREATE OR REPLACE FUNCTION set_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.booking_reference IS NULL THEN
    NEW.booking_reference = generate_booking_reference();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for booking reference
CREATE TRIGGER set_booking_reference_trigger BEFORE INSERT ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION set_booking_reference();

-- Function to auto-categorize events based on date
CREATE OR REPLACE FUNCTION auto_categorize_event()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.date < CURRENT_DATE THEN
    NEW.category = 'past';
  ELSE
    NEW.category = 'upcoming';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-categorization
CREATE TRIGGER auto_categorize_event_trigger BEFORE INSERT OR UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION auto_categorize_event();

-- Function to update available quantity when booking is confirmed
CREATE OR REPLACE FUNCTION update_ticket_availability()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Trigger for ticket availability
CREATE TRIGGER update_ticket_availability_trigger AFTER UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_ticket_availability();