import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus } from 'lucide-react';

interface TicketType {
  id: string;
  name: string;
  price: number;
  available_quantity: number;
  enabled: boolean;
}

interface SelectedTicket {
  ticketTypeId: string;
  name: string;
  price: number;
  quantity: number;
}

interface TicketSelectorProps {
  ticketTypes: TicketType[];
  selectedTickets: SelectedTicket[];
  onTicketChange: (tickets: SelectedTicket[]) => void;
  onContinue: () => void;
}

export function TicketSelector({ ticketTypes, selectedTickets, onTicketChange, onContinue }: TicketSelectorProps) {
  const updateTicketQuantity = (ticketType: TicketType, quantity: number) => {
    const updated = [...selectedTickets];
    const existingIndex = updated.findIndex(t => t.ticketTypeId === ticketType.id);
    
    if (quantity === 0) {
      // Remove ticket if quantity is 0
      if (existingIndex > -1) {
        updated.splice(existingIndex, 1);
      }
    } else {
      // Add or update ticket
      const ticket = {
        ticketTypeId: ticketType.id,
        name: ticketType.name,
        price: ticketType.price,
        quantity
      };
      
      if (existingIndex > -1) {
        updated[existingIndex] = ticket;
      } else {
        updated.push(ticket);
      }
    }
    
    onTicketChange(updated);
  };

  const getTicketQuantity = (ticketTypeId: string) => {
    const ticket = selectedTickets.find(t => t.ticketTypeId === ticketTypeId);
    return ticket ? ticket.quantity : 0;
  };

  const getTotalTickets = () => {
    return selectedTickets.reduce((total, ticket) => total + ticket.quantity, 0);
  };

  if (ticketTypes.length === 0) {
    return (
      <Card className="bg-card/90 backdrop-blur-sm border-primary/20">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <h3 className="text-lg font-semibold mb-2">No Tickets Available</h3>
          <p className="text-muted-foreground text-center">
            Tickets for this event are not currently available for purchase.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/90 backdrop-blur-sm border-primary/20">
      <CardHeader>
        <CardTitle>Select Tickets</CardTitle>
        <CardDescription>
          Choose the number of tickets you want to purchase
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {ticketTypes.map((ticketType) => {
            const quantity = getTicketQuantity(ticketType.id);
            const isAvailable = ticketType.available_quantity > 0;
            
            return (
              <div 
                key={ticketType.id} 
                className={`p-4 rounded-lg border ${
                  isAvailable ? 'border-primary/20 bg-background/50' : 'border-muted/20 bg-muted/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">{ticketType.name}</h4>
                      {!isAvailable && (
                        <Badge variant="secondary" className="bg-red-500/20 text-red-500">
                          Sold Out
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="text-lg font-semibold text-primary">
                        ₹{ticketType.price}
                      </span>
                      <span>
                        {ticketType.available_quantity} available
                      </span>
                    </div>
                  </div>
                  
                  {isAvailable && (
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateTicketQuantity(ticketType, Math.max(0, quantity - 1))}
                        disabled={quantity === 0}
                        className="h-8 w-8 border-primary/20"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      
                      <span className="w-8 text-center font-medium">
                        {quantity}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateTicketQuantity(ticketType, quantity + 1)}
                        disabled={quantity >= ticketType.available_quantity}
                        className="h-8 w-8 border-primary/20"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {getTotalTickets() > 0 && (
          <div className="flex justify-end pt-4 border-t border-primary/20">
            <Button onClick={onContinue} className="bg-primary hover:bg-primary/90">
              Continue to Checkout ({getTotalTickets()} ticket{getTotalTickets() !== 1 ? 's' : ''})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}