import { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TicketSelector } from '@/components/booking/TicketSelector';
import { Calendar, MapPin, Clock, ArrowLeft, Copy, Upload, CheckCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { formatINR } from '@/lib/formatCurrency';
import upiQRImage from '@/assets/upi-qr-real.png';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  starts_at: string;
  venue: string;
  city: string;
  category: 'upcoming' | 'past';
  banner_image_url?: string;
}

interface TicketType {
  id: string;
  name: string;
  price: number;
  capacity: number;
  sold: number;
  enabled: boolean;
}

interface SelectedTicket {
  ticketTypeId: string;
  name: string;
  price: number;
  quantity: number;
}

export default function EventBooking() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [selectedTickets, setSelectedTickets] = useState<SelectedTicket[]>([]);
  const [currentStep, setCurrentStep] = useState<'select' | 'details' | 'payment' | 'success'>('select');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    instagram: ''
  });
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string>('');
  
  const { toast } = useToast();
  const UPI_ID = '9606563393@ybl';

  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      // Fetch event details
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (eventError) throw eventError;
      setEvent(eventData as Event);

      // Fetch ticket types
      const { data: ticketData, error: ticketError } = await supabase
        .from('ticket_types')
        .select('*')
        .eq('event_id', eventId)
        .eq('enabled', true)
        .order('price');

      if (ticketError) throw ticketError;
      setTicketTypes(ticketData || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load event details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTotalAmount = () => {
    return selectedTickets.reduce((total, ticket) => total + (ticket.price * ticket.quantity), 0);
  };

  const getTotalQuantity = () => {
    return selectedTickets.reduce((total, ticket) => total + ticket.quantity, 0);
  };

  const handleContinueToDetails = () => {
    if (selectedTickets.length === 0) {
      toast({
        title: "No Tickets Selected",
        description: "Please select at least one ticket to continue",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep('details');
  };

  const handleContinueToPayment = () => {
    if (!formData.name || !formData.phone || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep('payment');
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID);
    toast({
      title: "Copied!",
      description: "UPI ID copied to clipboard",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid File",
        description: "Please upload JPG, PNG, WebP or PDF files only",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (12MB)
    if (file.size > 12 * 1024 * 1024) {
      toast({
        title: "File Too Large", 
        description: "File size must be less than 12MB",
        variant: "destructive",
      });
      return;
    }

    setPaymentScreenshot(file);
    setScreenshotPreview(URL.createObjectURL(file));
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentScreenshot) {
      toast({
        title: "Payment Screenshot Required",
        description: "Please upload your payment screenshot",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    
    // Simulate submission (frontend only as requested)
    setTimeout(() => {
      setSubmitting(false);
      setCurrentStep('success');
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!event) {
    return <Navigate to="/" replace />;
  }

  // Don't allow booking for past events
  if (event.category === 'past') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="max-w-md text-center bg-card/90 backdrop-blur-sm border-primary/20">
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-2">Event Has Ended</h2>
            <p className="text-muted-foreground mb-4">
              Booking is no longer available for this event.
            </p>
            <Link to="/">
              <Button>Back to Events</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success screen
  if (currentStep === 'success') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-primary/10" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10"
        >
          <Card className="max-w-md text-center bg-card/90 backdrop-blur-sm border-primary/20">
            <CardContent className="pt-6">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-xl font-bold mb-2">Thanks for Your Booking!</h2>
              <p className="text-muted-foreground mb-4">
                We've received your payment proof. Your booking is <strong>Pending Verification</strong>. 
                We'll confirm within 2–3 hours via email/WhatsApp.
              </p>
              <Button onClick={() => navigate('/')} className="w-full">
                Back to Events
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-primary/10" />
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => {
              if (currentStep === 'details') setCurrentStep('select');
              else if (currentStep === 'payment') setCurrentStep('details');
              else navigate('/');
            }}
            className="text-primary hover:text-primary/80"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {currentStep === 'select' ? 'Back to Events' : 'Back'}
          </Button>
          
          {/* Progress indicator */}
          <div className="flex items-center gap-2 ml-auto">
            <div className={`w-3 h-3 rounded-full ${currentStep === 'select' ? 'bg-primary' : 'bg-primary/30'}`} />
            <div className="w-8 h-px bg-primary/30" />
            <div className={`w-3 h-3 rounded-full ${currentStep === 'details' ? 'bg-primary' : 'bg-primary/30'}`} />
            <div className="w-8 h-px bg-primary/30" />
            <div className={`w-3 h-3 rounded-full ${currentStep === 'payment' ? 'bg-primary' : 'bg-primary/30'}`} />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Event Details - Always visible */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-card/90 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                  <Badge className="bg-primary/20 text-primary w-fit">
                    {event.category}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="text-sm">{format(new Date(event.date), 'PPP')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-sm">{format(new Date(event.starts_at), 'p')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-sm">{event.venue}, {event.city}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-card/90 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedTickets.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No tickets selected
                    </p>
                  ) : (
                    <>
                      {selectedTickets.map((ticket) => (
                        <div key={ticket.ticketTypeId} className="flex justify-between">
                          <div>
                            <p className="font-medium">{ticket.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatINR(ticket.price)} × {ticket.quantity}
                            </p>
                          </div>
                          <p className="font-medium">{formatINR(ticket.price * ticket.quantity)}</p>
                        </div>
                      ))}
                      
                      <div className="border-t border-primary/20 pt-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">Total</p>
                            <p className="text-sm text-muted-foreground">
                              {getTotalQuantity()} ticket{getTotalQuantity() !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <p className="text-xl font-bold text-primary">
                            {formatINR(getTotalAmount())}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Step 1: Ticket Selection */}
              {currentStep === 'select' && (
                <Card className="bg-card/90 backdrop-blur-sm border-primary/20">
                  <CardHeader>
                    <CardTitle>Select Tickets</CardTitle>
                    <CardDescription>Choose your ticket types and quantities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TicketSelector
                      ticketTypes={ticketTypes}
                      selectedTickets={selectedTickets}
                      onTicketChange={setSelectedTickets}
                      onContinue={handleContinueToDetails}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Contact Details */}
              {currentStep === 'details' && (
                <Card className="bg-card/90 backdrop-blur-sm border-primary/20">
                  <CardHeader>
                    <CardTitle>Your Details</CardTitle>
                    <CardDescription>Please provide your contact information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={(e) => { e.preventDefault(); handleContinueToPayment(); }} className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="instagram">Instagram Handle</Label>
                        <Input
                          id="instagram"
                          placeholder="@username"
                          value={formData.instagram}
                          onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                        />
                      </div>

                      <div className="flex justify-end pt-4">
                        <Button type="submit" className="w-full md:w-auto">
                          Continue to Payment
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Payment */}
              {currentStep === 'payment' && (
                <Card className="bg-card/90 backdrop-blur-sm border-primary/20">
                  <CardHeader>
                    <CardTitle>Payment via UPI</CardTitle>
                    <CardDescription>Complete your payment using UPI</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitBooking} className="space-y-6">
                      {/* Payment Instructions */}
                      <div className="bg-primary/10 rounded-lg p-4">
                        <h3 className="font-semibold mb-2">Payment Instructions:</h3>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                          <li>Scan the QR code below or use the UPI ID</li>
                          <li>Enter the exact amount: {formatINR(getTotalAmount())}</li>
                          <li>Complete the payment in your UPI app</li>
                          <li>Take a screenshot of the payment confirmation</li>
                          <li>Upload the screenshot below</li>
                        </ol>
                      </div>

                      {/* UPI Payment Details */}
                      <div className="grid gap-6 md:grid-cols-2">
                        {/* QR Code */}
                        <div className="text-center">
                          <h4 className="font-medium mb-3">Scan QR Code</h4>
                          <div className="bg-white p-4 rounded-lg inline-block">
                            <img src={upiQRImage} alt="UPI QR Code" className="w-32 h-32 object-contain" />
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Open any UPI app and scan this code
                          </p>
                        </div>

                        {/* UPI ID */}
                        <div className="space-y-3">
                          <div>
                            <Label>UPI ID</Label>
                            <div className="flex">
                              <Input value={UPI_ID} readOnly className="rounded-r-none" />
                              <Button 
                                type="button"
                                variant="outline" 
                                className="rounded-l-none border-l-0" 
                                onClick={copyUpiId}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div>
                            <Label>Amount to Pay</Label>
                            <Input value={`₹${getTotalAmount()}`} readOnly />
                          </div>
                        </div>
                      </div>

                      {/* Screenshot Upload */}
                      <div className="space-y-3">
                        <Label>Payment Screenshot *</Label>
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center hover:border-primary transition-colors">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleFileChange}
                            className="hidden"
                            id="screenshot-upload"
                          />
                          <label htmlFor="screenshot-upload" className="cursor-pointer">
                            <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">
                              Click to upload payment screenshot
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              JPG, PNG, WebP or PDF up to 12MB
                            </p>
                          </label>
                        </div>
                        
                        {screenshotPreview && (
                          <div className="mt-3">
                            <img 
                              src={screenshotPreview} 
                              alt="Payment screenshot preview" 
                              className="max-w-full h-32 object-cover rounded-lg"
                            />
                          </div>
                        )}
                      </div>

                      <Button type="submit" disabled={submitting || !paymentScreenshot} className="w-full">
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          'Submit Booking'
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </div>

        {/* Mobile Sticky Footer */}
        {currentStep !== 'payment' && selectedTickets.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm border-t border-primary/20 p-4 md:hidden">
            <div className="container mx-auto flex justify-between items-center">
              <div>
                <p className="font-semibold">Total: {formatINR(getTotalAmount())}</p>
                <p className="text-sm text-muted-foreground">
                  {getTotalQuantity()} tickets
                </p>
              </div>
              <Button 
                onClick={currentStep === 'select' ? handleContinueToDetails : handleContinueToPayment}
                className="min-w-[120px]"
              >
                {currentStep === 'select' ? 'Continue' : 'To Payment'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}