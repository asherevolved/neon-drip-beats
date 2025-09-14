import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Copy, Upload, CheckCircle } from 'lucide-react';
import { formatINR } from '@/lib/formatCurrency';
import { PLATFORM_FEE, calculateTotalFromTickets } from '@/lib/platformFee';
import upiQRImage from '@/assets/upi-qr-real.jpg';

interface TicketItem {
  tierId: string;
  name: string;
  price: number;
  qty: number;
}

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [eventId] = useState(searchParams.get('eventId') || '');
  const [eventTitle] = useState(searchParams.get('eventTitle') || '');
  const [ticketItems, setTicketItems] = useState<TicketItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    instagram: '',
    email: ''
  });
  
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const UPI_ID = '9606563393@ybl';

  useEffect(() => {
    const itemsParam = searchParams.get('items');
    if (itemsParam) {
      try {
        const parsed = JSON.parse(itemsParam) as TicketItem[];
        setTicketItems(parsed);
        const calculatedSubtotal = parsed.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const calculatedTotal = calculateTotalFromTickets(
          parsed.map(item => ({ price: item.price, quantity: item.qty }))
        );
        setSubtotal(calculatedSubtotal);
        setTotal(calculatedTotal);
      } catch (error) {
        console.error('Failed to parse ticket items:', error);
      }
    }

    // Redirect if no items
    if (!itemsParam || !eventId) {
      navigate('/', { replace: true });
    }
  }, [searchParams, eventId, navigate]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentScreenshot) {
      toast({
        title: "Payment Screenshot Required",
        description: "Please upload your payment screenshot",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission (since it's frontend only)
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
    }, 2000);
  };

  if (showSuccess) {
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
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 text-primary hover:text-primary/80"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-card/90 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>{eventTitle}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {ticketItems.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatINR(item.price)} × {item.qty}
                      </p>
                    </div>
                    <p className="font-medium">{formatINR(item.price * item.qty)}</p>
                  </div>
                ))}
                
                <div className="border-t border-primary/20 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tickets Subtotal</span>
                    <span>{formatINR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Platform Fees</span>
                    <span>{formatINR(PLATFORM_FEE)}</span>
                  </div>
                  <div className="border-t border-primary/20 pt-2">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-semibold">Amount to Pay</p>
                      <p className="text-xl font-bold text-primary">{formatINR(total)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-card/90 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle>Complete Your Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Buyer Info */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Your Details</h3>
                    
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
                  </div>

                  {/* Payment Section */}
                  <div className="space-y-4 border-t border-primary/20 pt-6">
                    <h3 className="font-semibold">Payment via UPI</h3>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <div className="bg-background/50 p-4 rounded-lg text-center">
                          <img src={upiQRImage} alt="UPI QR Code" className="mx-auto w-48 h-48 mb-2" />
                          <p className="text-sm text-muted-foreground">Scan with any UPI app</p>
                        </div>
                      </div>
                      
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
                        
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>1. Scan QR or use UPI ID</p>
                          <p>2. Pay exact amount: {formatINR(total)}</p>
                          <p>3. Upload payment screenshot</p>
                        </div>
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

                  <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1">
                      Back
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="flex-1">
                      {isSubmitting ? 'Submitting...' : 'Submit Booking'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Mobile Sticky Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm border-t border-primary/20 p-4 md:hidden">
          <div className="container mx-auto flex justify-between items-center">
            <div>
              <p className="font-semibold">Amount to Pay: {formatINR(total)}</p>
              <p className="text-sm text-muted-foreground">
                {ticketItems.reduce((sum, item) => sum + item.qty, 0)} tickets + platform fee
              </p>
            </div>
            <Button 
              form="checkout-form" 
              type="submit" 
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}