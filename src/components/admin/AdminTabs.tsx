import { useState } from 'react';
import { EventsManager } from './EventsManager';
import { PostsManager } from './PostsManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, FileText } from 'lucide-react';

export function AdminTabs() {
  return (
    <div className="w-full">
      <Tabs defaultValue="events" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-card/50 border-primary/20">
          <TabsTrigger value="events" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
            <Calendar className="h-4 w-4" />
            Events
          </TabsTrigger>
          <TabsTrigger value="posts" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
            <FileText className="h-4 w-4" />
            Posts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-2xl font-bold">
              <Calendar className="h-6 w-6" />
              Events Management
            </div>
            <p className="text-muted-foreground mt-2">Create and manage your events</p>
          </div>
          <EventsManager />
        </TabsContent>

        <TabsContent value="posts" className="space-y-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-2xl font-bold">
              <FileText className="h-6 w-6" />
              Posts Management
            </div>
            <p className="text-muted-foreground mt-2">Create and manage blog posts and news updates</p>
          </div>
          <PostsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}