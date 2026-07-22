"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CandidateListItem, CandidatePatch } from "@/services/interface";

const candidateFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  location: z.string().nullable().optional(),
});

type CandidateFormValues = z.infer<typeof candidateFormSchema>;

interface CandidateFormProps {
  initialData: CandidateListItem;
  onSubmit: (values: CandidatePatch) => Promise<void>;
  onCancel: () => void;
}

export function CandidateForm({ initialData, onSubmit, onCancel }: CandidateFormProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<any>({
    resolver: zodResolver(candidateFormSchema) as any,
    defaultValues: {
      name: initialData.name || "",
      location: initialData.location || "",
    },
  });

  const handleFormSubmit = async (values: CandidateFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const patchBody: CandidatePatch = {
        name: values.name,
        location: values.location || null,
      };
      await onSubmit(patchBody);
    } catch (err: unknown) {
      console.error("Candidate update error:", err);
      const apiError = err as { detail?: string; message?: string };
      setError(apiError?.detail || apiError?.message || "Failed to update candidate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20 text-center font-medium">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 font-medium">Full Name *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Alice Smith" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 font-medium">Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Seattle, WA (Remote)" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            className="h-9 text-slate-700"
            disabled={loading}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="h-9 gap-1.5"
            disabled={loading}
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
