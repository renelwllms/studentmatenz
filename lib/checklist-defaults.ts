import { ChecklistCategory } from "@prisma/client";

export const checklistDefaults = [
  { category: ChecklistCategory.PRE_ARRIVAL, title: "Confirm flight details" },
  { category: ChecklistCategory.PRE_ARRIVAL, title: "Share accommodation address" },
  { category: ChecklistCategory.ARRIVAL_DAY, title: "Airport pickup confirmation" },
  { category: ChecklistCategory.ARRIVAL_DAY, title: "Activate SIM card" },
  { category: ChecklistCategory.FIRST_WEEK, title: "Open bank account" },
  { category: ChecklistCategory.FIRST_WEEK, title: "Attend campus orientation" },
  { category: ChecklistCategory.WORK_READINESS, title: "Prepare CV" },
  { category: ChecklistCategory.WORK_READINESS, title: "Set up student job alerts" },
];
