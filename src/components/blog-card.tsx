import { Link } from "wouter";
import { Heart, Share2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// Like/share functionality is currently disabled (API not implemented)
import { useAuthStore } from "../lib/auth";
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

export default function BlogCard({ post }: BlogCardProps) {
  const { user, isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();


  // Like/share handlers are disabled
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
      title: "Not implemented",
      description: "Like functionality is not available.",
      variant: "destructive",
    });
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
      title: "Not implemented",
      description: "Share functionality is not available.",
      variant: "destructive",
    });
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
            className="hover:text-primary"
            onClick={handleLike}
            data-testid={`button-like-${post.id}`}
          >
            <Heart className="h-4 w-4" />
            <span className="ml-1 text-sm">0</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="hover:text-primary"
            onClick={handleShare}
            data-testid={`button-share-${post.id}`}
          >
            <Share2 className="h-4 w-4" />
            <span className="ml-1 text-sm">0</span>
          </Button>
        </div>
      </div>
    </article>
  );
}
