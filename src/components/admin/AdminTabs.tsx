import { EventsManager } from './EventsManager';
import { Calendar } from 'lucide-react';

export function AdminTabs() {
  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-2xl font-bold">
          <Calendar className="h-6 w-6" />
          Events Management
        </div>
        <p className="text-muted-foreground mt-2">Create and manage your events</p>
      </div>
      
      <EventsManager />
    </div>
  );
}