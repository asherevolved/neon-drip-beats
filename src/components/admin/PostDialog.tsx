import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { ImageUploader } from './ImageUploader';
import { Save, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface Post {
  id: string;
  title: string;
  slug: string;
  feature_image_url?: string;
  body: string;
  tags: string[];
  published_on: string;
}

interface PostDialogProps {
  post?: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function PostDialog({ post, isOpen, onClose, onSaved }: PostDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    body: '',
    tags: '',
    published_on: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm')
  });
  const [featureImage, setFeatureImage] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        slug: post.slug,
        body: post.body,
        tags: post.tags.join(', '),
        published_on: format(new Date(post.published_on), 'yyyy-MM-dd\'T\'HH:mm')
      });
      setFeatureImage(post.feature_image_url || '');
    } else {
      setFormData({
        title: '',
        slug: '',
        body: '',
        tags: '',
        published_on: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm')
      });
      setFeatureImage('');
    }
  }, [post, isOpen]);

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, ''); // Remove leading and trailing dashes
  };

  const handleTitleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      title: value,
      slug: prev.slug || generateSlug(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.body.trim()) {
      toast({
        title: "Validation Error",
        description: "Content body is required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const postData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        feature_image_url: featureImage || null,
        body: formData.body,
        tags: tagsArray,
        published_on: new Date(formData.published_on).toISOString(),
        created_by: user.id
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

        toast({
          title: "Success",
          description: "Post updated successfully",
        });
      } else {
        // Create new post
        const { error } = await supabase
          .from('posts')
          .insert(postData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Post created successfully",
        });
      }

      onSaved();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {post ? 'Edit Post' : 'Create New Post'}
          </DialogTitle>
          <DialogDescription>
            {post ? 'Update your blog post details' : 'Create a new blog post or news update'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter post title"
              className="bg-background border-primary/20"
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="post-url-slug"
              className="bg-background border-primary/20"
            />
            <p className="text-xs text-muted-foreground">
              URL-friendly version of the title. Leave blank to auto-generate.
            </p>
          </div>

          {/* Feature Image */}
          <div className="space-y-2">
            <Label>Feature Image</Label>
            <ImageUploader
              bucketName="event-images"
              allowMultiple={false}
              value={featureImage}
              onChange={(value) => setFeatureImage(value as string)}
              placeholder="Upload feature image"
            />
          </div>

          {/* Body Content */}
          <div className="space-y-2">
            <Label htmlFor="body">Content *</Label>
            <Textarea
              id="body"
              value={formData.body}
              onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
              placeholder="Write your post content here... (Markdown supported)"
              rows={12}
              className="bg-background border-primary/20 resize-y"
            />
            <p className="text-xs text-muted-foreground">
              You can use basic HTML tags or Markdown formatting.
            </p>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="news, update, announcement (comma separated)"
              className="bg-background border-primary/20"
            />
          </div>

          {/* Published Date */}
          <div className="space-y-2">
            <Label htmlFor="published_on">Published On *</Label>
            <Input
              id="published_on"
              type="datetime-local"
              value={formData.published_on}
              onChange={(e) => setFormData(prev => ({ ...prev, published_on: e.target.value }))}
              className="bg-background border-primary/20"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-primary/20 hover:bg-primary/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {post ? 'Update Post' : 'Create Post'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}