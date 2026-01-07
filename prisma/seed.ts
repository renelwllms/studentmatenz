import { PrismaClient, ChecklistCategory } from "@prisma/client";

const prisma = new PrismaClient();

const checklistDefaults = [
  { category: ChecklistCategory.PRE_ARRIVAL, title: "Confirm arrival details" },
  { category: ChecklistCategory.PRE_ARRIVAL, title: "Share accommodation address" },
  { category: ChecklistCategory.ARRIVAL_DAY, title: "Airport pickup confirmation" },
  { category: ChecklistCategory.ARRIVAL_DAY, title: "Activate SIM card" },
  { category: ChecklistCategory.FIRST_WEEK, title: "Attend campus orientation" },
  { category: ChecklistCategory.FIRST_WEEK, title: "Open bank account" },
  { category: ChecklistCategory.WORK_READINESS, title: "Prepare CV" },
  { category: ChecklistCategory.WORK_READINESS, title: "Set up student job alerts" },
];

async function main() {
  const packages = [
    {
      name: "Basic",
      price: "$199",
      featuresJson: [
        "Pre-Arrival Checklist",
        "SIM Card Setup",
        "Bank Account Setup",
        "IRD Number Assistance",
        "Public Transport Assistance",
        "New Zealand Essentials Orientation",
        "Emergency Services Orientation",
        "Airport pickup add-on: $79",
      ],
    },
    {
      name: "Standard",
      price: "$399",
      featuresJson: [
        "Everything in Basic Package",
        "Airport Pickup",
        "Accommodation Assistance",
        "Assistance in Understanding Tenancy Agreements",
        "Campus Visit",
        "Auckland Important Places Tour",
        "Insurance Guidance",
        "Support in GP Registration",
      ],
    },
    {
      name: "Premium",
      price: "$499",
      featuresJson: [
        "Everything in Standard Package",
        "Assistance in purchasing your first car in NZ",
        "Guidance in CV Formatting (NZ Style)",
        "Part-Time Job Guidance",
        "Interview Preparation",
        "Work Rights Education",
        "NZ Work Culture Orientation",
        "Tax Basics & Payslip Explanation",
      ],
    },
  ];

  for (const pkg of packages) {
    await prisma.package.upsert({
      where: { name: pkg.name },
      update: {
        price: pkg.price,
        featuresJson: pkg.featuresJson,
      },
      create: pkg,
    });
  }

  const templates = [
    {
      key: "welcome",
      title: "Welcome",
      body: "Hi {{studentName}}, welcome to NZ! Your portal is ready: {{portalLink}}",
      variablesJson: ["studentName", "portalLink"],
    },
    {
      key: "pre-arrival",
      title: "Pre-arrival checklist",
      body: "Your pre-arrival checklist is live, {{studentName}}. Let's review together.",
      variablesJson: ["studentName"],
    },
    {
      key: "arrival-day",
      title: "Arrival day",
      body: "Arrival day checklist: {{arrivalDate}} in {{city}}. We'll be in touch.",
      variablesJson: ["arrivalDate", "city"],
    },
    {
      key: "first-week",
      title: "First-week schedule",
      body: "Here's your first-week schedule, {{studentName}}. You've got this!",
      variablesJson: ["studentName"],
    },
    {
      key: "monthly-checkin",
      title: "Monthly check-in",
      body: "Monthly check-in: how are you settling in, {{studentName}}?",
      variablesJson: ["studentName"],
    },
    {
      key: "emergency",
      title: "Emergency",
      body: "If this is urgent, call 111. We're here to help once you're safe.",
      variablesJson: [],
    },
    {
      key: "parent-update",
      title: "Parent update",
      body: "Update: {{studentName}} has completed key arrival steps.",
      variablesJson: ["studentName"],
    },
  ];

  for (const tpl of templates) {
    await prisma.messageTemplate.upsert({
      where: { key: tpl.key },
      update: {},
      create: tpl,
    });
  }

  const starter = await prisma.package.findFirst({ where: { name: "Basic" } });
  if (!starter) return;

  const studentUser = await prisma.user.upsert({
    where: { email: "student@example.com" },
    update: {},
    create: {
      role: "STUDENT",
      email: "student@example.com",
      phone: "+64000000000",
      codeHash: "demo-code",
    },
  });

  const profile = await prisma.studentProfile.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      userId: studentUser.id,
      fullName: "Priya Sharma",
      country: "New Zealand",
      city: "Auckland",
      arrivalDate: new Date(),
      institution: "University of Auckland",
      packageId: starter.id,
      portalCode: "SM-1234",
    },
  });

  const existingChecklist = await prisma.checklistItem.findFirst({
    where: { studentId: profile.id },
  });

  if (!existingChecklist) {
    await prisma.checklistItem.createMany({
      data: checklistDefaults.map((item) => ({
        studentId: profile.id,
        category: item.category,
        title: item.title,
      })),
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
