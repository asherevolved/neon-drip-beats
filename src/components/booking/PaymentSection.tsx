import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { formatINR } from '@/lib/formatCurrency';
import { ArrowLeft, Upload, Loader2, Copy, Check } from 'lucide-react';
import upiQrCode from '@/assets/upi-qr-real.jpg';

interface PaymentSectionProps {
  totalAmount: number;
  onBack: () => void;
  onPaymentComplete: (file: File) => Promise<void>;
  loading: boolean;
}

export function PaymentSection({ totalAmount, onBack, onPaymentComplete, loading }: PaymentSectionProps) {
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [upiCopied, setUpiCopied] = useState(false);
  const { toast } = useToast();

  const UPI_ID = "9606563393@ybl";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setScreenshot(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!screenshot) {
      toast({
        title: "Error",
        description: "Please upload payment screenshot",
        variant: "destructive",
      });
      return;
    }
    
    await onPaymentComplete(screenshot);
  };

  const copyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setUpiCopied(true);
      toast({
        title: "Success",
        description: "UPI ID copied to clipboard",
      });
      setTimeout(() => setUpiCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy UPI ID",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-card/90 backdrop-blur-sm border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="hover:bg-primary/10"
            disabled={loading}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle>Payment</CardTitle>
            <CardDescription>
              Complete your payment using UPI
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Amount Summary */}
        <div className="bg-primary/10 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
          <p className="text-3xl font-bold text-primary">{formatINR(totalAmount)}</p>
        </div>

        {/* Payment Instructions */}
        <div className="space-y-4">
          <h3 className="font-semibold">Payment Instructions:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Scan the QR code below or use the UPI ID</li>
            <li>Enter the exact amount: {formatINR(totalAmount)}</li>
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
              {/* Use provided UPI QR code for payments */}
              <img
                src={upiQrCode}
                alt="Continental Entertainments UPI QR Code - Scan to Pay"
                className="w-48 h-48 object-contain"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Open any UPI app and scan this code
            </p>
          </div>

          {/* UPI ID */}
          <div>
            <h4 className="font-medium mb-3">Or Use UPI ID</h4>
            <div className="space-y-3">
              <div>
                <Label>UPI ID</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={UPI_ID}
                    readOnly
                    className="bg-background/50"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyUpiId}
                    className="border-primary/20 hover:bg-primary/10"
                  >
                    {upiCopied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div>
                <Label>Amount</Label>
                <Input
                  value={`₹${totalAmount}`}
                  readOnly
                  className="bg-background/50 mt-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Upload Payment Screenshot */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="screenshot">Upload Payment Screenshot *</Label>
            <div className="mt-2">
              <Input
                id="screenshot"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                disabled={loading}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
            </div>
            {screenshot && (
              <p className="text-sm text-muted-foreground mt-2">
                Selected: {screenshot.name}
              </p>
            )}
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <p className="text-sm text-yellow-600 dark:text-yellow-500">
              <strong>Important:</strong> Please ensure your screenshot clearly shows the payment amount, 
              recipient details, and transaction status. Unclear screenshots may delay confirmation.
            </p>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!screenshot || loading}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Submit Booking
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}