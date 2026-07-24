"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
<<<<<<< HEAD
import { useForm, useFieldArray, type Resolver } from "react-hook-form";
=======
import { useForm, useFieldArray } from "react-hook-form";
>>>>>>> 5b748b2badc66457323db053944e2e133d77601f
import { z } from "zod";
import { Plus, Trash2, Loader2 } from "lucide-react";

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
import { JobDetail, JobCreate, JobSkillIn } from "@/services/interface";

// Validation schema
<<<<<<< HEAD
const emptyStringToUndefined = (value: unknown) => {
  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }
  return value;
};

const jobSchema = z.object({
  title: z.preprocess(emptyStringToUndefined, z.string().min(2, { message: "Job title must be at least 2 characters" }).optional()),
  description: z.preprocess(emptyStringToUndefined, z.string().min(10, { message: "Description must be at least 10 characters" })),
  location: z.preprocess(emptyStringToUndefined, z.string().min(2, { message: "Location must be at least 2 characters" }).optional()),
  min_experience: z.preprocess((value) => (value === "" ? undefined : value), z.coerce.number().min(0, { message: "Min experience must be 0 or greater" }).optional()),
  max_experience: z.preprocess((value) => (value === "" ? undefined : value), z.coerce.number().min(0, { message: "Max experience must be 0 or greater" }).optional()),
  education_required: z.preprocess(emptyStringToUndefined, z.string().optional()),
  status: z.enum(["draft", "active", "closed", "archived"]).optional(),
=======
const jobSchema = z.object({
  title: z.string().min(2, { message: "Job title must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }).nullable().optional(),
  location: z.string().min(2, { message: "Location must be at least 2 characters" }).nullable().optional(),
  min_experience: z.coerce.number().min(0, { message: "Min experience must be 0 or greater" }).nullable().optional(),
  max_experience: z.coerce.number().min(0, { message: "Max experience must be 0 or greater" }).nullable().optional(),
  education_required: z.string().nullable().optional(),
  status: z.enum(["draft", "active", "closed", "archived"]),
>>>>>>> 5b748b2badc66457323db053944e2e133d77601f
  skills: z.array(
    z.object({
      skill: z.string().min(1, { message: "Skill name is required" }),
      weight: z.coerce.number().min(1).max(100),
      required: z.boolean(),
    })
  ).default([]),
}).refine((data) => {
<<<<<<< HEAD
  if (data.min_experience !== undefined && data.max_experience !== undefined) {
=======
  if (data.min_experience !== null && data.max_experience !== null && data.min_experience !== undefined && data.max_experience !== undefined) {
>>>>>>> 5b748b2badc66457323db053944e2e133d77601f
    return data.max_experience >= data.min_experience;
  }
  return true;
}, {
  message: "Max experience cannot be less than min experience",
  path: ["max_experience"],
});

type JobFormValues = z.infer<typeof jobSchema>;

interface JobFormProps {
  initialData?: JobDetail | null;
  onSubmit: (values: JobFormValues) => Promise<void>;
  onCancel: () => void;
}

export function JobForm({ initialData, onSubmit, onCancel }: JobFormProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Map initial values
  const defaultValues: Partial<JobFormValues> = React.useMemo(() => {
    if (initialData) {
      return {
        title: initialData.title || "",
        description: initialData.description || "",
        location: initialData.location || "",
        min_experience: initialData.min_experience ?? 0,
        max_experience: initialData.max_experience ?? 0,
        education_required: initialData.education_required || "",
        status: (initialData.status as any) || "draft",
        skills: initialData.skills?.map(s => ({
          skill: s.skill,
          weight: s.weight,
          required: s.required,
        })) || [],
      };
    }
    return {
      title: "",
      description: "",
      location: "",
      min_experience: 0,
      max_experience: 0,
      education_required: "",
      status: "draft",
      skills: [],
    };
  }, [initialData]);

<<<<<<< HEAD
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema) as Resolver<JobFormValues>,
=======
  const form = useForm<any>({
    resolver: zodResolver(jobSchema) as any,
>>>>>>> 5b748b2badc66457323db053944e2e133d77601f
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "skills",
  });

  const handleFormSubmit = async (values: any) => {
    setLoading(true);
    setError(null);
    try {
      await onSubmit(values);
    } catch (err: unknown) {
      console.error("Job submit error:", err);
      const apiError = err as { detail?: string; message?: string };
      setError(apiError?.detail || apiError?.message || "Failed to save the job. Please try again.");
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
<<<<<<< HEAD
                <FormLabel className="text-slate-700 font-medium">Job Title</FormLabel>
=======
                <FormLabel className="text-slate-700 font-medium">Job Title *</FormLabel>
>>>>>>> 5b748b2badc66457323db053944e2e133d77601f
                <FormControl>
                  <Input placeholder="e.g. Senior Frontend Engineer" {...field} />
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
                  <Input placeholder="e.g. San Francisco, CA (Hybrid)" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 font-medium">Status</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="flex h-8 w-full rounded-lg border border-input bg-white px-2.5 py-1 text-sm shadow-sm transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none text-slate-800"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                    <option value="archived">Archived</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="min_experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 font-medium">Min Experience (Years)</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="max_experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 font-medium">Max Experience (Years)</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="education_required"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel className="text-slate-700 font-medium">Education Required</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Bachelor's in Computer Science" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
<<<<<<< HEAD
                <FormLabel className="text-slate-700 font-medium">Job Description *</FormLabel>
=======
                <FormLabel className="text-slate-700 font-medium">Job Description</FormLabel>
>>>>>>> 5b748b2badc66457323db053944e2e133d77601f
                <FormControl>
                  <textarea
                    placeholder="Provide details about role responsibilities, perks, and expectations..."
                    className="flex min-h-[100px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none resize-y"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Skills Section */}
        <div className="border-t border-slate-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Target Skills & Weighting</h3>
              <p className="text-xs text-slate-500">Add key skills for candidates matching, along with importances (1-100).</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1 text-xs"
              onClick={() => append({ skill: "", weight: 50, required: false })}
            >
              <Plus className="w-3.5 h-3.5" /> Add Skill
            </Button>
          </div>

          <div className="space-y-3">
            {fields.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-slate-200 rounded-lg text-slate-400 text-xs">
                No target skills configured yet. Add some to enable automated resume ranking.
              </div>
            ) : (
              fields.map((item, index) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex-1 w-full">
                    <FormField
                      control={form.control}
                      name={`skills.${index}.skill`}
                      render={({ field }) => (
                        <FormItem className="space-y-0">
                          <FormControl>
                            <Input placeholder="Skill name (e.g. React)" className="h-8" {...field} />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="w-24 flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium sm:hidden">Weight:</span>
                    <FormField
                      control={form.control}
                      name={`skills.${index}.weight`}
                      render={({ field }) => (
                        <FormItem className="space-y-0">
                          <FormControl>
                            <Input type="number" min={1} max={100} className="h-8 pr-1" placeholder="Weight" {...field} />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name={`skills.${index}.required`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-y-0 gap-2">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
                            />
                          </FormControl>
                          <span className="text-xs text-slate-700 font-normal cursor-pointer select-none">
                            Required
                          </span>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 self-end sm:self-auto"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer buttons */}
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
            {initialData ? "Save Changes" : "Create Job"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
