import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PaymentSection } from './PaymentSection';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
  venue: string;
  city: string;
}

interface SelectedTicket {
  ticketTypeId: string;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutFormProps {
  event: Event;
  selectedTickets: SelectedTicket[];
  onBack: () => void;
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  instagram: string;
}

export function CheckoutForm({ event, selectedTickets, onBack }: CheckoutFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    instagram: '',
  });
  const [currentStep, setCurrentStep] = useState<'details' | 'payment' | 'confirmation'>('details');
  const [loading, setLoading] = useState(false);
  const [bookingReference, setBookingReference] = useState<string>('');
  const { toast } = useToast();

  const getTotalAmount = () => {
    return selectedTickets.reduce((total, ticket) => total + (ticket.price * ticket.quantity), 0);
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep('payment');
  };

  const handlePaymentComplete = async (screenshotFile: File) => {
    setLoading(true);
    try {
      // Upload payment screenshot
      const fileExt = screenshotFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('payment-screenshots')
        .upload(fileName, screenshotFile);

      if (uploadError) throw uploadError;

      // Create booking with auto-generated booking_reference
      const bookingReference = `CE${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          event_id: event.id,
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_email: formData.email,
          customer_instagram: formData.instagram || null,
          total_amount: getTotalAmount(),
          payment_screenshot_url: fileName,
          booking_reference: bookingReference,
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Create booking items
      const bookingItems = selectedTickets.map(ticket => ({
        booking_id: booking.id,
        ticket_type_id: ticket.ticketTypeId,
        quantity: ticket.quantity,
        unit_price: ticket.price,
        subtotal: ticket.price * ticket.quantity
      }));

      const { error: itemsError } = await supabase
        .from('booking_items')
        .insert(bookingItems);

      if (itemsError) throw itemsError;

      setBookingReference(booking.booking_reference);
      setCurrentStep('confirmation');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process booking",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (currentStep === 'confirmation') {
    return (
      <Card className="bg-card/90 backdrop-blur-sm border-primary/20">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold mb-2">Booking Submitted!</h2>
          <p className="text-muted-foreground mb-4 max-w-md">
            Your ticket request has been received. We'll confirm within 2–3 hours via email/WhatsApp.
          </p>
          
          <div className="bg-background/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground mb-1">Booking Reference</p>
            <p className="font-mono text-lg font-semibold text-primary">
              {bookingReference}
            </p>
          </div>
          
          <p className="text-sm text-muted-foreground mb-6">
            Please save this reference number for your records.
          </p>
          
          <Button onClick={() => window.location.href = '/'} className="bg-primary hover:bg-primary/90">
            Back to Events
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {currentStep === 'details' && (
        <Card className="bg-card/90 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="hover:bg-primary/10"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle>Contact Details</CardTitle>
                <CardDescription>
                  We'll use this information to send you booking confirmation
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="instagram">Instagram Handle (Optional)</Label>
                <Input
                  id="instagram"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  placeholder="@username"
                  className="mt-1"
                />
              </div>
              
              <div className="flex justify-end pt-4">
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  Continue to Payment
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {currentStep === 'payment' && (
        <PaymentSection
          totalAmount={getTotalAmount()}
          onBack={() => setCurrentStep('details')}
          onPaymentComplete={handlePaymentComplete}
          loading={loading}
        />
      )}
    </div>
  );
}