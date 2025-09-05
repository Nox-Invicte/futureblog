import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../components/ui/button";
import { Plus, Search } from "lucide-react";
import BlogCard from "../components/blog-card";
import HeroSection from "../components/hero-section";
import CategoriesSection from "../components/categories-section";
import { getCategoryCounts } from "../lib/categories";
import { Skeleton } from "../components/ui/skeleton";
import { getAllPosts } from "../lib/api";
import { Input } from "../components/ui/input";

export default function Home() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: getAllPosts,
  });

  const { data: categoryCounts = {}, isLoading: isLoadingCounts } = useQuery({
    queryKey: ["categoryCounts"],
    queryFn: getCategoryCounts,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  // Filter posts by search and category
  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    return posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        !selectedCategory || (post.category && post.category.toLowerCase() === selectedCategory.toLowerCase());
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchTerm, selectedCategory]);
  return (
    <main className="pt-20">
      <HeroSection />

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-4 flex justify-end">
        <div className="relative w-full max-w-md">
          <Input
            type="text"
            placeholder="Search posts..."
            className="bg-input border-border pl-10 w-full focus-visible:ring-ring"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            data-testid="input-search"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* Categories */}
      <CategoriesSection
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        categoryCounts={categoryCounts}
        isLoadingCounts={isLoadingCounts}
      />

      {/* Featured Posts Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Latest Posts</h2>
          </div>

          {/* Blog Posts Grid */}
          <div className="blog-grid">
            {isLoading ? (
              // Loading skeletons
              [...Array(6)].map((_, i) => (
                <div key={i} className="glass-card rounded-xl p-6 space-y-4">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-16 w-full" />
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Skeleton className="h-6 w-12" />
                      <Skeleton className="h-6 w-12" />
                      <Skeleton className="h-6 w-8" />
                    </div>
                  </div>
                </div>
              ))
            ) : filteredPosts && filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-xl font-semibold text-foreground mb-2">No posts found</h3>
                <p className="text-muted-foreground">Be the first to create a post!</p>
              </div>
            )}
          </div>

          {/* Load More Button */}
          {filteredPosts && filteredPosts.length > 0 && (
            <div className="text-center mt-12">
              <Button
                variant="outline"
                className="bg-muted hover:bg-muted/80 px-8 py-3"
                data-testid="button-load-more"
              >
                <Plus className="mr-2 h-4 w-4" />
                Load More Posts
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
