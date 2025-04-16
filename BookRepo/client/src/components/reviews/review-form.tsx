import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Review, reviewSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Star, StarIcon } from "lucide-react";

interface ReviewFormProps {
  bookId: number;
  review?: Review;
  onSuccess?: () => void;
}

export function ReviewForm({ bookId, review, onSuccess }: ReviewFormProps) {
  const { toast } = useToast();
  const [rating, setRating] = useState<number>(review?.rating || 0);
  
  // Form validation schema
  const formSchema = reviewSchema.extend({
    title: z.string().optional(),
    rating: z.number().min(1, "Please select a rating").max(5),
    content: z.string().min(10, "Review must be at least 10 characters"),
  }).omit({ userId: true, bookId: true });

  type FormValues = z.infer<typeof formSchema>;

  // Set up react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: review?.title || "",
      rating: review?.rating || 0,
      content: review?.content || "",
    },
  });

  // Create or update mutation
  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      if (review) {
        // Update existing review
        const res = await apiRequest("PUT", `/api/reviews/${review.id}`, {
          ...data,
          bookId,
        });
        return res.json();
      } else {
        // Create new review
        const res = await apiRequest("POST", `/api/books/${bookId}/reviews`, {
          ...data,
          bookId,
        });
        return res.json();
      }
    },
    onSuccess: () => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['/api/books', bookId, 'reviews'] });
      
      // Show success message
      toast({
        title: review ? "Review updated" : "Review submitted",
        description: review 
          ? "Your review has been updated successfully." 
          : "Your review has been submitted successfully.",
      });
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${review ? 'update' : 'submit'} review: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate({
      ...data,
      rating,
    });
  };

  const handleSetRating = (value: number) => {
    setRating(value);
    form.setValue("rating", value, { shouldValidate: true });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className="text-amber-500 p-1 focus:outline-none"
                      onClick={() => handleSetRating(value)}
                      aria-label={`Rate ${value} stars`}
                    >
                      {value <= rating ? (
                        <StarIcon className="h-6 w-6 fill-current" />
                      ) : (
                        <StarIcon className="h-6 w-6 stroke-current fill-transparent" />
                      )}
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Review Title</FormLabel>
              <FormControl>
                <Input placeholder="Summarize your thoughts (optional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Review Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your thoughts about this book..."
                  className="min-h-[150px] resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="reset" variant="outline" disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Submitting..." : review ? "Update Review" : "Submit Review"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
