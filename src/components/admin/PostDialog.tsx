import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { ImageUploader } from './ImageUploader';
import { Loader2 } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  body: string;
  slug: string;
  published_on: string;
  feature_image_url?: string;
  tags?: string[];
  event_id?: string;
}

interface Event {
  id: string;
  title: string;
}

interface PostDialogProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function PostDialog({ post, isOpen, onClose, onSaved }: PostDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    slug: '',
    tags: '',
  });
  const [featureImage, setFeatureImage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | undefined>(undefined);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
    if (post) {
      setFormData({
        title: post.title,
        body: post.body,
        slug: post.slug,
        tags: post.tags?.join(', ') || '',
      });
      setFeatureImage(post.feature_image_url || '');
      setSelectedEvent(post.event_id);
    } else {
      setFormData({
        title: '',
        body: '',
        slug: '',
        tags: '',
      });
      setFeatureImage('');
      setSelectedEvent(undefined);
    }
  }, [post]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('id, title')
        .order('date', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive",
      });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const postData = {
        title: formData.title,
        body: formData.body,
        slug: formData.slug,
        feature_image_url: featureImage || null,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : null,
        published_on: new Date().toISOString(),
        created_by: user.id,
        event_id: selectedEvent || null,
      };

      if (post) {
        // Update existing post
        const { error } = await supabase
          .from('posts')
          .update({
            ...postData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', post.id);

        if (error) throw error;
      } else {
        // Create new post
        const { error } = await supabase
          .from('posts')
          .insert(postData);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Post ${post ? 'updated' : 'created'} successfully`,
      });

      onSaved();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${post ? 'update' : 'create'} post`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-sm border-primary/20">
        <DialogHeader>
          <DialogTitle>{post ? 'Edit Post' : 'Create New Post'}</DialogTitle>
          <DialogDescription>
            {post ? 'Update post content and settings' : 'Create a new blog post'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Post Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="auto-generated-from-title"
              required
            />
          </div>

          <div>
            <Label htmlFor="body">Content</Label>
            <Textarea
              id="body"
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              rows={10}
              required
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="tag1, tag2, tag3"
            />
          </div>

          <div>
            <Label htmlFor="event">Link to Event (Optional)</Label>
            <Select value={selectedEvent || ''} onValueChange={(value) => setSelectedEvent(value || undefined)}>
              <SelectTrigger>
                <SelectValue placeholder="Select an event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {events.map(event => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Feature Image</Label>
            <ImageUploader
              bucketName="post-images"
              allowMultiple={false}
              value={featureImage}
              onChange={(value) => setFeatureImage(value as string)}
              placeholder="Upload feature image for the post"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {post ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                post ? 'Update Post' : 'Create Post'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}