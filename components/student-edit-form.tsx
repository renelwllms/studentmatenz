"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { nzCities, nzUniversities } from "@/data/nz";

type PackageOption = { id: string; name: string };

type StudentEditFormProps = {
  studentId: string;
  initial: {
    fullName: string;
    phone: string | null;
    email: string | null;
    country: string;
    city: string;
    arrivalDate: string;
    institution: string;
    packageName: string | null;
  };
  packages: PackageOption[];
};

const defaultPackages = ["Basic", "Standard", "Premium"];
const selectClassName =
  "h-12 w-full rounded-2xl border border-muted bg-white/80 px-4 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong/50";

export function StudentEditForm({ studentId, initial, packages }: StudentEditFormProps) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const cityInList = nzCities.includes(initial.city);
  const institutionInList = nzUniversities.includes(initial.institution);

  const [citySelection, setCitySelection] = useState(cityInList ? initial.city : "OTHER");
  const [cityOther, setCityOther] = useState(cityInList ? "" : initial.city);
  const [institutionSelection, setInstitutionSelection] = useState(
    institutionInList ? initial.institution : "OTHER"
  );
  const [institutionOther, setInstitutionOther] = useState(
    institutionInList ? "" : initial.institution
  );

  const packageOptions = useMemo(() => {
    if (packages.length > 0) return packages.map((pkg) => pkg.name);
    return defaultPackages;
  }, [packages]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("saving");
    const form = new FormData(event.currentTarget);
    const data = Object.fromEntries(form.entries());
    const payload = {
      ...data,
      country: "New Zealand",
      city:
        data.city === "OTHER" ? (data.cityOther?.toString() ?? "") : (data.city?.toString() ?? ""),
      institution:
        data.institution === "OTHER"
          ? (data.institutionOther?.toString() ?? "")
          : (data.institution?.toString() ?? ""),
    };

    try {
      const res = await fetch(`/api/students/${studentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
      <Input name="fullName" defaultValue={initial.fullName} required />
      <Input name="phone" defaultValue={initial.phone ?? ""} placeholder="Phone" required />
      <Input
        name="email"
        defaultValue={initial.email ?? ""}
        placeholder="Email"
        type="email"
      />
      <Input name="country" value="New Zealand" readOnly />
      <div className="grid gap-2">
        <select
          name="city"
          className={selectClassName}
          required
          value={citySelection}
          onChange={(event) => setCitySelection(event.target.value)}
        >
          <option value="">City arriving</option>
          {nzCities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
          <option value="OTHER">Other (type manually)</option>
        </select>
        {citySelection === "OTHER" ? (
          <Input
            name="cityOther"
            placeholder="Enter city"
            required
            value={cityOther}
            onChange={(event) => setCityOther(event.target.value)}
          />
        ) : null}
      </div>
      <Input name="arrivalDate" defaultValue={initial.arrivalDate} type="date" required />
      <div className="grid gap-2">
        <select
          name="institution"
          className={selectClassName}
          required
          value={institutionSelection}
          onChange={(event) => setInstitutionSelection(event.target.value)}
        >
          <option value="">Institution</option>
          {nzUniversities.map((institution) => (
            <option key={institution} value={institution}>
              {institution}
            </option>
          ))}
          <option value="OTHER">Other (type manually)</option>
        </select>
        {institutionSelection === "OTHER" ? (
          <Input
            name="institutionOther"
            placeholder="Enter institution"
            required
            value={institutionOther}
            onChange={(event) => setInstitutionOther(event.target.value)}
          />
        ) : null}
      </div>
      <select
        name="packageName"
        className={selectClassName}
        required
        defaultValue={initial.packageName ?? ""}
      >
        <option value="">Package</option>
        {packageOptions.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      <div className="md:col-span-2">
        <Button type="submit" disabled={status === "saving"}>
          {status === "saving" ? "Saving..." : "Save changes"}
        </Button>
        {status === "saved" ? (
          <span className="ml-3 text-sm text-foreground/70">Saved.</span>
        ) : null}
        {status === "error" ? (
          <span className="ml-3 text-sm text-red-500">Could not save changes.</span>
        ) : null}
      </div>
    </form>
  );
}
