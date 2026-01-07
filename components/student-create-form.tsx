"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { nzCities, nzUniversities } from "@/data/nz";

type PackageOption = { name: string };

const defaultPackages = ["Basic", "Standard", "Premium"];
const selectClassName =
  "h-12 w-full rounded-2xl border border-muted bg-white/80 px-4 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong/50";

export function StudentCreateForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [portalCode, setPortalCode] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [packages, setPackages] = useState<PackageOption[]>([]);
  const [citySelection, setCitySelection] = useState("");
  const [institutionSelection, setInstitutionSelection] = useState("");

  const packageOptions = useMemo(() => {
    if (packages.length > 0) return packages.map((pkg) => pkg.name);
    return defaultPackages;
  }, [packages]);

  useEffect(() => {
    const loadPackages = async () => {
      const res = await fetch("/api/packages");
      if (res.ok) {
        setPackages(await res.json());
      }
    };
    void loadPackages();
  }, []);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    setStatus("saving");
    setErrorMessage(null);
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
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const error = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(error?.error ?? "Failed to create student");
      }
      const data = (await res.json()) as { portalCode?: string };
      setPortalCode(data.portalCode ?? null);
      setStatus("saved");
      formElement?.reset();
      setCitySelection("");
      setInstitutionSelection("");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create student";
      setErrorMessage(message);
      setStatus("error");
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
      <Input name="fullName" placeholder="Full name" required />
      <Input name="phone" placeholder="Phone" required />
      <Input name="email" placeholder="Email" type="email" />
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
          <Input name="cityOther" placeholder="Enter city" required />
        ) : null}
      </div>
      <Input name="arrivalDate" placeholder="Arrival date" type="date" required />
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
          <Input name="institutionOther" placeholder="Enter institution" required />
        ) : null}
      </div>
      <select name="packageName" className={selectClassName} required>
        <option value="">Package</option>
        {packageOptions.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      <div className="md:col-span-2">
        <Button type="submit" disabled={status === "saving"}>
          {status === "saving" ? "Creating..." : "Create student"}
        </Button>
        {status === "saved" ? (
          <span className="ml-3 text-sm text-foreground/70">
            Student created{portalCode ? ` · Portal code: ${portalCode}` : "."}
          </span>
        ) : null}
        {status === "error" ? (
          <span className="ml-3 text-sm text-red-500">
            {errorMessage ?? "Could not create student."}
          </span>
        ) : null}
      </div>
    </form>
  );
}
