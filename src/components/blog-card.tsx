import { Link } from "wouter";
import { Heart, Share2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import React from "react";
import type { User } from '@supabase/supabase-js';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { likePost, unlikePost, getPostLikes, isPostLikedByUser, sharePost, getPostShares } from "../lib/api";
import { getCurrentUser } from "../lib/auth";
import { useToast } from "../hooks/use-toast";

interface BlogCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    author: {
      id: string;
      name: string;
      avatar: string | null;
    };
  };
}
export function BlogCard({ post }: BlogCardProps) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [user, setUser] = React.useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  React.useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u as User | null);
      setIsAuthenticated(!!u);
    });
  }, []);


  // Fetch like count
  const { data: likeCount = 0 } = useQuery({
    queryKey: ['post-likes', post.id],
    queryFn: () => getPostLikes(post.id),
  });

  const { data: isLiked = false } = useQuery({
    queryKey: ['post-liked', post.id],
    queryFn: () => isPostLikedByUser(post.id),
    enabled: isAuthenticated,
  });

  // Fetch share count
  const { data: shareCount = 0 } = useQuery({
    queryKey: ['post-shares', post.id],
    queryFn: () => getPostShares(post.id),
  });

  // Like/unlike mutation
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (isLiked) {
        await unlikePost(post.id);
      } else {
        await likePost(post.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post-likes', post.id] });
      queryClient.invalidateQueries({ queryKey: ['post-liked', post.id] });
    },
    onError: (error: Error) => {
      toast.toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Share mutation
  const shareMutation = useMutation({
    mutationFn: () => sharePost(post.id, post.title),
    onSuccess: () => {
      // Invalidate share count query to update the UI
      queryClient.invalidateQueries({ queryKey: ['post-shares', post.id] });
      toast.toast({
        title: "Success",
        description: "Post shared successfully!",
      });
    },
    onError: () => {
      toast.toast({
        title: "Error",
        description: "Failed to share post",
        variant: "destructive",
      });
    },
  });

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.toast({
        title: "Authentication Required",
        description: "Please sign in to like posts",
        variant: "destructive",
      });
      return;
    }
    likeMutation.mutate();
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    shareMutation.mutate();
  };

  return (
    <article className="glass-card rounded-xl p-6 hover-glow transition-smooth cursor-pointer" data-testid={`blog-card-${post.id}`}>
      <Link href={`/post/${post.id}`}>
        <h3 className="text-xl font-semibold text-foreground mb-3 hover:text-primary transition-smooth" data-testid={`text-title-${post.id}`}>
          {post.title}
        </h3>
        
        <p className="text-muted-foreground mb-4 leading-relaxed" data-testid={`text-content-${post.id}`}>
          {post.content.length > 200 ? post.content.substring(0, 200) + "..." : post.content}
        </p>
      </Link>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={post.author.avatar || undefined} />
            <AvatarFallback>{post.author.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-foreground text-sm font-medium" data-testid={`text-author-${post.id}`}>
              {post.author.name}
            </p>
            <p className="text-muted-foreground text-xs" data-testid={`text-date-${post.id}`}>
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-muted-foreground">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`hover:text-primary ${isLiked ? 'text-red-500' : ''}`}
            onClick={handleLike}
            disabled={likeMutation.isPending}
            data-testid={`button-like-${post.id}`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="ml-1 text-sm">{likeCount}</span>
          </Button>
          {/* Comments button removed */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="hover:text-primary"
            onClick={handleShare}
            disabled={shareMutation.isPending}
            data-testid={`button-share-${post.id}`}
          >
            <Share2 className="h-4 w-4" />
            <span className="ml-1 text-sm">{shareCount}</span>
          </Button>
        </div>
      </div>
    </article>
  );
}
