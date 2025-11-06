"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Briefcase, Award, Code, User } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";
import { onboardingSchema } from "@/lib/schema";
import { updateUser } from "@/actions/user";

interface Industry {
  id: string;
  name: string;
  subIndustries: string[];
}

interface OnboardingFormProps {
  industries: Industry[];
}

const OnboardingForm = ({ industries }: OnboardingFormProps) => {
  const router = useRouter();
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);

  const {
    loading: updateLoading,
    fn: updateUserFn,
    data: updateResult,
  } = useFetch(updateUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(onboardingSchema),
  });

  const onSubmit = async (values: any) => {
    console.log("Onboarding form submitted with values:", values);
    try {
      const formattedIndustry = values.subIndustry 
        ? `${values.industry}-${values.subIndustry.toLowerCase().replace(/ /g, "-")}`
        : values.industry;

      await updateUserFn({
        ...values,
        industry: formattedIndustry,
      });
    } catch (error) {
      console.error("Onboarding error:", error);
      toast.error("Failed to complete profile. Please try again.");
    }
  };

  useEffect(() => {
    if (updateResult?.success && !updateLoading) {
      toast.success("Profile completed successfully!",{style:{backgroundColor:"#4ade80",color:"white"}});
      router.push("/sensai/dashboard");
      router.refresh();
    }
  }, [updateResult, updateLoading, router]);

  const watchIndustry = watch("industry");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-2xl shadow-xl border-none">
        <CardHeader className="space-y-3 pb-6">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to SensAI! 🚀
          </CardTitle>
          <CardDescription className="text-center text-base">
            Let's personalize your experience. Tell us about your professional background
            to get AI-powered career insights and recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Industry Selection */}
            <div className="space-y-2">
              <Label htmlFor="industry" className="text-sm font-semibold flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                Industry *
              </Label>
              <Select
                onValueChange={(value) => {
                  setValue("industry", value);
                  setSelectedIndustry(
                    industries.find((ind) => ind.id === value) || null
                  );
                  setValue("subIndustry", "");
                }}
              >
                <SelectTrigger id="industry" className="h-11">
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Industries</SelectLabel>
                    {industries.map((ind) => (
                      <SelectItem key={ind.id} value={ind.id}>
                        {ind.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.industry && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  ⚠️ {errors.industry.message as string}
                </p>
              )}
            </div>

            {/* Specialization */}
            {watchIndustry && selectedIndustry?.subIndustries && selectedIndustry.subIndustries.length > 0 && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <Label htmlFor="subIndustry" className="text-sm font-semibold flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-600" />
                  Specialization
                </Label>
                <Select
                  onValueChange={(value) => setValue("subIndustry", value)}
                >
                  <SelectTrigger id="subIndustry" className="h-11">
                    <SelectValue placeholder="Select your specialization (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Specializations</SelectLabel>
                      {selectedIndustry.subIndustries.map((sub) => (
                        <SelectItem key={sub} value={sub}>
                          {sub}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.subIndustry && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    ⚠️ {errors.subIndustry.message as string}
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Experience */}
              <div className="space-y-2">
                <Label htmlFor="experience" className="text-sm font-semibold">
                  Years of Experience
                </Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  max="50"
                  placeholder="e.g., 3"
                  className="h-11"
                  {...register("experience")}
                />
                {errors.experience && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    ⚠️ {errors.experience.message as string}
                  </p>
                )}
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <Label htmlFor="skills" className="text-sm font-semibold flex items-center gap-2">
                  <Code className="w-4 h-4 text-green-600" />
                  Skills
                </Label>
                <Input
                  id="skills"
                  placeholder="React, Python, Leadership"
                  className="h-11"
                  {...register("skills")}
                />
                {errors.skills && (
                  <p className="text-sm text-red-500">{errors.skills.message as string}</p>
                )}
              </div>
            </div>

            

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm font-semibold">
                Professional Bio
              </Label>
              <Textarea
                id="bio"
                placeholder="Share your professional journey, achievements, and career goals..."
                className="h-32 resize-none"
                {...register("bio")}
              />
              {errors.bio && (
                <p className="text-sm text-red-500">{errors.bio.message as string}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl" 
              disabled={updateLoading}
            >
              {updateLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Setting up your profile...
                </>
              ) : (
                <>
                  Complete Profile & Continue
                  <span className="ml-2">→</span>
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingForm;