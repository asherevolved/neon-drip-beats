import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { formatINR } from '@/lib/formatCurrency';
import { Eye, Check, X, Users } from 'lucide-react';

interface Booking {
  id: string;
  booking_reference: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_instagram: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'declined';
  payment_screenshot_url?: string;
  created_at: string;
  events: {
    title: string;
    date: string;
    venue: string;
  };
  booking_items: {
    quantity: number;
    ticket_types: {
      name: string;
      price: number;
    };
  }[];
}

export function BookingsManager() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          events (title, date, venue),
          booking_items (
            quantity,
            ticket_types (name, price)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings((data || []) as Booking[]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, status: 'confirmed' | 'declined') => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Booking ${status} successfully`,
      });

      fetchBookings();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-500">Pending</Badge>;
      case 'confirmed':
        return <Badge variant="secondary" className="bg-green-500/20 text-green-500">Confirmed</Badge>;
      case 'declined':
        return <Badge variant="secondary" className="bg-red-500/20 text-red-500">Declined</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const viewPaymentScreenshot = async (url: string) => {
    if (!url) return;
    
    try {
      const { data } = await supabase.storage
        .from('payment-screenshots')
        .createSignedUrl(url, 300);
      
      if (data?.signedUrl) {
        setSelectedScreenshot(data.signedUrl);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load payment screenshot",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Bookings Management</h2>
        <p className="text-muted-foreground">Review and manage customer bookings</p>
      </div>

      {bookings.length === 0 ? (
        <Card className="bg-card/50 border-primary/20">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
            <p className="text-muted-foreground text-center">
              Bookings will appear here once customers start purchasing tickets
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-card/50 border-primary/20">
          <CardHeader>
            <CardTitle>All Bookings</CardTitle>
            <CardDescription>
              {bookings.length} total booking{bookings.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Tickets</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-mono text-sm">
                        {booking.booking_reference}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{booking.customer_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {booking.customer_email}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {booking.customer_phone}
                          </div>
                          {booking.customer_instagram && (
                            <div className="text-sm text-muted-foreground">
                              @{booking.customer_instagram}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{booking.events.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(booking.events.date), 'PPP')}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {booking.events.venue}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {booking.booking_items.map((item, index) => (
                            <div key={index} className="text-sm">
                              {item.quantity}x {item.ticket_types.name}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatINR(booking.total_amount)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(booking.status)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(booking.created_at), 'PP')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {booking.payment_screenshot_url && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => viewPaymentScreenshot(booking.payment_screenshot_url!)}
                              className="border-primary/20 hover:bg-primary/10"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          {booking.status === 'pending' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                className="border-green-500/20 hover:bg-green-500/10 text-green-500"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateBookingStatus(booking.id, 'declined')}
                                className="border-red-500/20 hover:bg-red-500/10 text-red-500"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Screenshot Modal */}
      {selectedScreenshot && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedScreenshot(null)}
        >
          <div className="max-w-2xl max-h-[90vh] overflow-auto bg-card rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Payment Screenshot</h3>
            <img 
              src={selectedScreenshot} 
              alt="Payment Screenshot" 
              className="w-full h-auto rounded-lg"
            />
            <Button 
              className="w-full mt-4" 
              onClick={() => setSelectedScreenshot(null)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}