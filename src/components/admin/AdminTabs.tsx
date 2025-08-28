import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventsManager } from './EventsManager';
import { BookingsManager } from './BookingsManager';
import { Calendar, Users } from 'lucide-react';

export function AdminTabs() {
  return (
    <Tabs defaultValue="events" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-card/50 border border-primary/20">
        <TabsTrigger value="events" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Events Management
        </TabsTrigger>
        <TabsTrigger value="bookings" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Bookings Management
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="events" className="mt-6">
        <EventsManager />
      </TabsContent>
      
      <TabsContent value="bookings" className="mt-6">
        <BookingsManager />
      </TabsContent>
    </Tabs>
  );
}