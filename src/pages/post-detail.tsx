import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Heart, Share2, Calendar, User } from "lucide-react";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";
import { Link } from "wouter";
import { Skeleton } from "../components/ui/skeleton";
import { getPostById } from "../lib/api";

export default function PostDetail() {
  const { id } = useParams();
  
  const { data: post, isLoading } = useQuery({
    queryKey: ["posts", id],
    queryFn: () => getPostById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-64 w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-2/3" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Post not found</h1>
            <p className="text-muted-foreground">The post you're looking for doesn't exist.</p>
            <Link href="/">
              <Button className="mt-4" data-testid="button-back-home">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-8" data-testid="button-back">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Posts
          </Button>
        </Link>

        {/* Post Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight" data-testid="text-title">
            {post.title}
          </h1>

          {/* Author Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={post.author.avatar || undefined} />
                <AvatarFallback>{post.author.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-foreground font-medium" data-testid="text-author">
                  {post.author.name}
                </p>
                <div className="flex items-center text-muted-foreground text-sm">
                  <Calendar className="mr-1 h-3 w-3" />
                  <span data-testid="text-date">
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="hover:text-primary" data-testid="button-like">
                <Heart className="mr-2 h-4 w-4" />
                42
              </Button>
              {/* Comments button removed */}
              <Button variant="ghost" size="sm" className="hover:text-primary" data-testid="button-share">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </header>

        <Separator className="mb-8" />

        {/* Post Content */}
        <article className="prose prose-lg prose-invert max-w-none">
          <div 
            className="text-foreground leading-relaxed whitespace-pre-wrap"
            data-testid="text-content"
          >
            {post.content}
          </div>
        </article>

        {/* Post Footer */}
        <footer className="mt-12 pt-8 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground text-sm">
              Published {new Date(post.createdAt).toLocaleDateString()}
              {post.updatedAt !== post.createdAt && (
                <span> • Updated {new Date(post.updatedAt).toLocaleDateString()}</span>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="hover:text-primary" data-testid="button-like-footer">
                <Heart className="mr-2 h-4 w-4" />
                Like
              </Button>
              <Button variant="ghost" size="sm" className="hover:text-primary" data-testid="button-share-footer">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
