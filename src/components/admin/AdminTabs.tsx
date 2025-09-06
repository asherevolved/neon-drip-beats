import { useState } from 'react';
import { EventsManager } from './EventsManager';
import { PostsManager } from './PostsManager';
import { Button } from '@/components/ui/button';
import { Calendar, FileText } from 'lucide-react';

type Tab = 'events' | 'posts';

export function AdminTabs() {
  const [activeTab, setActiveTab] = useState<Tab>('events');

  return (
    <div className="w-full">
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-primary/20">
          <Button
            variant={activeTab === 'events' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('events')}
            className="rounded-b-none"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Events
          </Button>
          <Button
            variant={activeTab === 'posts' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('posts')}
            className="rounded-b-none"
          >
            <FileText className="h-4 w-4 mr-2" />
            Posts
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === 'events' && <EventsManager />}
        {activeTab === 'posts' && <PostsManager />}
      </div>
    </div>
  );
}