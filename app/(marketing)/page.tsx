import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AnimatedSection } from "@/components/animated-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { benefits, faqs, steps, testimonials } from "@/data/marketing";

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-20 pt-16 lg:flex-row lg:items-center">
          <div className="flex-1">
            <Badge>International Student Support</Badge>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-tight tracking-tight text-foreground md:text-7xl">
              Start your NZ student journey with a clear plan and real support.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-foreground/70">
              Sign up in minutes. We guide every step from arrival to settling in.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/contact">
                <Button>Join StudentMate</Button>
              </Link>
              <Link href="/pricing" className="inline-flex items-center text-sm font-semibold text-foreground/80">
                View Packages →
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-foreground/70">
              <div>
                <div className="text-2xl font-semibold text-foreground">48h</div>
                Arrival coverage window
              </div>
              <div>
                <div className="text-2xl font-semibold text-foreground">15+</div>
                Checklist checkpoints
              </div>
              <div>
                <div className="text-2xl font-semibold text-foreground">NZ</div>
                Local on-ground support
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-6">
            <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-[0_25px_70px_rgba(15,23,42,0.12)] backdrop-blur">
              <div className="relative overflow-hidden rounded-[24px] border border-muted bg-white">
                <div className="absolute left-6 top-6 z-10 text-xs uppercase tracking-[0.3em] text-white/90 drop-shadow">
                  Student Portal Preview
                </div>
                <Image
                  src="/portal-preview.jpg"
                  alt="StudentMate portal preview"
                  width={3589}
                  height={4641}
                  className="h-[420px] w-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <AnimatedSection>
        <div className="grid gap-6 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <Card key={benefit.title}>
              <CardTitle>{benefit.title}</CardTitle>
              <CardDescription className="mt-3">
                {benefit.description}
              </CardDescription>
            </Card>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection className="pt-0">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">
              Built around your student journey.
            </h2>
            <p className="mt-4 text-lg text-foreground/70">
              We keep things simple so you can focus on settling in, making friends, and starting classes with
              confidence.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-foreground/70">
              <li>Clear steps for each stage of your arrival.</li>
              <li>Friendly reminders so nothing slips through.</li>
              <li>Local support when you have questions.</li>
            </ul>
          </div>
          <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white/90 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.1)]">
            <Image
              src="/student-journey.jpg"
              alt="Students walking on campus"
              width={3509}
              height={5263}
              className="h-full w-full rounded-[24px] object-cover"
            />
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="pt-0">
        <div className="grid gap-6 lg:grid-cols-3">
          {steps.map((step) => (
            <Card key={step.step}>
              <Badge className="bg-white">{step.step}</Badge>
              <CardTitle className="mt-4">{step.title}</CardTitle>
              <CardDescription className="mt-3">
                {step.description}
              </CardDescription>
            </Card>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection className="pt-0">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[32px] border border-white/70 bg-white/90 p-10 shadow-[0_20px_60px_rgba(15,23,42,0.1)]">
            <h3 className="font-display text-3xl font-semibold tracking-tight">
              Why students feel supported
            </h3>
            <div className="mt-6 space-y-5">
              {testimonials.map((item) => (
                <div key={item.name} className="border-l-2 border-accent pl-4">
                  <p className="text-sm text-foreground/70">“{item.quote}”</p>
                  <p className="mt-2 text-xs font-semibold text-foreground/60">
                    {item.name} · {item.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[32px] border border-white/70 bg-gradient-to-br from-foreground to-slate-900 p-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.2)]">
            <h3 className="font-display text-3xl font-semibold tracking-tight">Need a quick start?</h3>
            <p className="mt-4 text-sm text-white/70">
              Book a 15-minute consult and we will map the student journey, package fit, and arrival timeline.
            </p>
            <Link href="/contact" className="mt-6 inline-flex">
              <Button className="bg-white text-foreground hover:bg-slate-100">
                Schedule a Call
              </Button>
            </Link>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="pt-0">
        <div className="rounded-[32px] border border-white/70 bg-white/90 p-10">
          <h3 className="font-display text-3xl font-semibold tracking-tight">
            Frequently asked questions
          </h3>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-muted bg-white p-5">
                <div className="text-sm font-semibold text-foreground">{faq.question}</div>
                <p className="mt-2 text-sm text-foreground/70">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Home",
  description:
    "Premium settlement support for international students in New Zealand. Checklists, arrivals, and WhatsApp care.",
};
