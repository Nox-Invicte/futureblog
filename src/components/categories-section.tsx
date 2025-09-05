
import { Laptop, Palette, Rocket, Brain, Smartphone, TrendingUp } from "lucide-react";
import React from "react";

export const categories = [
  { id: "technology", name: "Technology", icon: Laptop, count: 127, color: "text-primary" },
  { id: "design", name: "Design", icon: Palette, count: 89, color: "text-secondary" },
  { id: "startup", name: "Startup", icon: Rocket, count: 64, color: "text-accent" },
  { id: "ai", name: "AI & ML", icon: Brain, count: 52, color: "text-primary" },
  { id: "mobile", name: "Mobile", icon: Smartphone, count: 73, color: "text-secondary" },
  { id: "business", name: "Business", icon: TrendingUp, count: 91, color: "text-accent" },
];

interface CategoriesSectionProps {
  selectedCategory?: string;
  onCategorySelect?: (categoryId: string | undefined) => void;
  categoryCounts?: Record<string, number>;
  isLoadingCounts?: boolean;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ selectedCategory, onCategorySelect, categoryCounts = {}, isLoadingCounts }) => {
  // Calculate total posts for 'All'
  const totalPosts = categoryCounts['all'] ?? Object.values(categoryCounts).reduce((a, b) => a + b, 0);
  return (
    <section className="py-16 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Explore Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* 'All' category */}
          <div
            key="all"
            className={`glass-card rounded-lg p-4 text-center hover-glow transition-smooth cursor-pointer ${!selectedCategory ? 'ring-2 ring-primary' : ''}`}
            data-testid="category-all"
            onClick={() => onCategorySelect?.(undefined)}
          >
            <span className="text-2xl mb-2 mx-auto block">🌐</span>
            <h3 className="font-semibold text-foreground">All</h3>
            <p className="text-muted-foreground text-sm">
              {isLoadingCounts ? '...' : totalPosts} posts
            </p>
          </div>
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            const count = categoryCounts[category.id] || 0;
            return (
              <div
                key={category.id}
                className={`glass-card rounded-lg p-4 text-center hover-glow transition-smooth cursor-pointer ${isSelected ? 'ring-2 ring-primary' : ''}`}
                data-testid={`category-${category.id}`}
                onClick={() => onCategorySelect?.(category.id)}
              >
                <Icon className={`${category.color} text-2xl mb-2 mx-auto`} />
                <h3 className="font-semibold text-foreground">{category.name}</h3>
                <p className="text-muted-foreground text-sm">
                  {isLoadingCounts ? '...' : count} posts
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
