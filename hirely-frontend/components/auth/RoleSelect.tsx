"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type UserRole = "candidate" | "employer";

export function RoleSelect({
  value,
  onChange,
  disabled,
}: {
  value: UserRole | undefined;
  onChange: (role: UserRole) => void;
  disabled?: boolean;
}) {
  return (
    <Select value={value} onValueChange={(val: UserRole) => onChange(val)} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="candidate">Candidate</SelectItem>
        <SelectItem value="employer">Employer</SelectItem>
      </SelectContent>
    </Select>
  );
}