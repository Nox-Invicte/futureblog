import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useToast } from "../hooks/use-toast";
import { createPost, updatePost } from "../lib/api";
import { categories } from "../components/categories-section";
import { useAuthStore } from "../lib/auth";
import { z } from "zod";


const editorSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  category: z.string().min(1, "Category is required"),
});


type EditorFormData = z.infer<typeof editorSchema>;


interface PostEditorProps {
  post?: {
    id: string;
    title: string;
    content: string;
    category?: string;
  };
  onSave?: () => void;
  onCancel?: () => void;
}

export default function PostEditor({ post, onSave, onCancel }: PostEditorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();


  const form = useForm<EditorFormData>({
    resolver: zodResolver(editorSchema),
    defaultValues: {
      title: post?.title || "",
      content: post?.content || "",
      category: post?.category || categories[0].id,
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: EditorFormData) => {
      if (post) {
        return updatePost(post.id, data);
      } else {
        return createPost(data);
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Post ${post ? "updated" : "created"} successfully!`,
      });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts", "user", user?.id] });
      onSave?.();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EditorFormData) => {
    saveMutation.mutate(data);
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-foreground">
          {post ? "Edit Post" : "Create New Post"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label className="text-foreground text-sm font-medium">Title</Label>
            <Input
              {...form.register("title")}
              placeholder="Enter post title..."
              className="bg-input border-border focus-visible:ring-ring mt-2"
              data-testid="input-title"
            />
            {form.formState.errors.title && (
              <p className="text-destructive text-sm mt-1">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div>
            <Label className="text-foreground text-sm font-medium">Content</Label>
            <Textarea
              {...form.register("content")}
              placeholder="Write your post content here..."
              className="bg-input border-border focus-visible:ring-ring mt-2"
              rows={12}
              data-testid="textarea-content"
            />
            {form.formState.errors.content && (
              <p className="text-destructive text-sm mt-1">
                {form.formState.errors.content.message}
              </p>
            )}
          </div>

          <div>
            <Label className="text-foreground text-sm font-medium">Category</Label>
            <select
              {...form.register("category")}
              className="bg-input border-border focus-visible:ring-ring mt-2 w-full rounded-md p-2"
              data-testid="select-category"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {form.formState.errors.category && (
              <p className="text-destructive text-sm mt-1">
                {form.formState.errors.category.message}
              </p>
            )}
          </div>

          <div className="flex justify-between gap-4">
            <Button
              type="submit"
              className="floating-button"
              disabled={saveMutation.isPending}
              data-testid="button-save"
            >
              {saveMutation.isPending ? "Saving..." : post ? "Update Post" : "Create Post"}
            </Button>

            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
