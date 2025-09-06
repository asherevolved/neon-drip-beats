import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PostDialog } from './PostDialog';
import { ConfirmDialog } from './ConfirmDialog';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface Post {
  id: string;
  title: string;
  body: string;
  slug: string;
  published_on: string;
  feature_image_url?: string;
  tags?: string[];
  created_at: string;
}

export function PostsManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletePost, setDeletePost] = useState<Post | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('published_on', { ascending: false });

      if (error) throw error;
      setPosts((data || []) as Post[]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (!deletePost) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', deletePost.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
      
      fetchPosts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  const handlePostSaved = () => {
    fetchPosts();
    setIsDialogOpen(false);
    setSelectedPost(null);
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Posts Management</h2>
          <p className="text-muted-foreground">Manage your blog posts and content</p>
        </div>
        <Button
          onClick={() => {
            setSelectedPost(null);
            setIsDialogOpen(true);
          }}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Post
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.id} className="bg-card/50 border-primary/20">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.body.slice(0, 150)}...
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  Published {format(new Date(post.published_on), 'PPP')}
                </div>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{post.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedPost(post);
                    setIsDialogOpen(true);
                  }}
                  className="flex-1 border-primary/20 hover:bg-primary/10"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeletePost(post)}
                  className="border-destructive/20 hover:bg-destructive/10 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {posts.length === 0 && (
        <Card className="bg-card/50 border-primary/20">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first post to get started with content management
            </p>
            <Button
              onClick={() => {
                setSelectedPost(null);
                setIsDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Post
            </Button>
          </CardContent>
        </Card>
      )}

      <PostDialog
        post={selectedPost}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedPost(null);
        }}
        onSaved={handlePostSaved}
      />

      <ConfirmDialog
        isOpen={!!deletePost}
        onClose={() => setDeletePost(null)}
        onConfirm={handleDeletePost}
        title="Delete Post"
        description="This will permanently remove the post. Continue?"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}