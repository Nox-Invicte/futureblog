import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, FileText, Share2, TrendingUp, Edit, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useToast } from "../hooks/use-toast";
import { useAuthStore } from "../lib/auth";
import { BlogPost } from "../lib/api";
import PostEditor from "../components/post-editor";
import { Link, useLocation } from "wouter";
import { Skeleton } from "../components/ui/skeleton";
import { getUserPosts, deletePost, getUserStats } from "../lib/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | undefined>();
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/auth");
    return null;
  }

  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["posts", "user", user?.id],
    queryFn: () => getUserPosts(user!.id),
    enabled: !!user?.id,
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["user-stats", user?.id],
    queryFn: () => getUserStats(user!.id),
    enabled: !!user?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: async (postId: string) => {
      await deletePost(postId);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Post deleted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["posts", "user", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setDeletingPostId(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreatePost = () => {
    setEditingPost(undefined);
    setShowEditor(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setShowEditor(true);
  };

  const handleDeletePost = (postId: string) => {
    setDeletingPostId(postId);
  };

  const confirmDelete = () => {
    if (deletingPostId) {
      deleteMutation.mutate(deletingPostId);
    }
  };

  if (showEditor) {
    return (
      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PostEditor
            post={editingPost}
            onSave={() => setShowEditor(false)}
            onCancel={() => setShowEditor(false)}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.email}
            </p>
          </div>
          <Button 
            onClick={handleCreatePost}
            className="floating-button"
            data-testid="button-create-post"
          >
            <Plus className="mr-2 h-5 w-5" />
            New Post
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="text-primary text-2xl mr-3" />
                <div>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-16 mb-2" />
                  ) : (
                    <p className="text-2xl font-bold text-foreground" data-testid="stat-posts">
                      {stats?.totalPosts || 0}
                    </p>
                  )}
                  <p className="text-muted-foreground">Total Posts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Share2 className="text-secondary text-2xl mr-3" />
                <div>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-16 mb-2" />
                  ) : (
                    <p className="text-2xl font-bold text-foreground" data-testid="stat-shares">
                      {stats?.totalShares || 0}
                    </p>
                  )}
                  <p className="text-muted-foreground">Total Shares</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="text-accent text-2xl mr-3" />
                <div>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-16 mb-2" />
                  ) : (
                    <p className="text-2xl font-bold text-foreground" data-testid="stat-likes">
                      {stats?.totalLikes || 0}
                    </p>
                  )}
                  <p className="text-muted-foreground">Total Likes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Posts Management */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-foreground">Your Posts</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-start justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <div className="flex gap-4">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                ))}
              </div>
            ) : posts && posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div 
                    key={post.id} 
                    className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-muted/10 transition-smooth"
                    data-testid={`post-item-${post.id}`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground" data-testid={`post-title-${post.id}`}>
                          {post.title}
                        </h3>
                      </div>
                      <div>
                        <span data-testid={`post-date-${post.id}`}>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        <span>0 views</span>
                        <span>0 likes</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditPost(post)}
                        data-testid={`button-edit-${post.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
                        className="text-destructive hover:text-destructive/80"
                        data-testid={`button-delete-${post.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No posts yet</h3>
                <p className="text-muted-foreground mb-6">
                  Get started by creating your first blog post
                </p>
                <Button 
                  onClick={handleCreatePost}
                  className="floating-button"
                  data-testid="button-create-first-post"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Post
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deletingPostId} onOpenChange={() => setDeletingPostId(null)}>
          <AlertDialogContent className="glass-card">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your blog post.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-testid="button-cancel-delete">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDelete}
                className="bg-destructive hover:bg-destructive/90"
                data-testid="button-confirm-delete"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </main>
  );
}
