// ===============================
// BUTSHA-DEV
// ===============================

// 1. Global Setup + Debug
console.log("[script.js] Script loaded", new Date().toISOString());

window.addEventListener("error", (event) => {
  console.error("[Global Error]", {
    message: event.message,
    file: event.filename,
    line: event.lineno,
    column: event.colno,
    error: event.error,
  });
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("[Unhandled Promise Rejection]", event.reason);
});

// 2. Shared Data Layer
const employeeInformation = [
  {
    id: 1,
    name: "Sibongile Nkosi",
    position: "Software Engineer",
    dept: "Engineering",
    salary: 99400,
    contact: "sibongile@company.co.za",
    history: "Joined 2021, Led migration to microservices",
    status: "Active",
  },
  {
    id: 2,
    name: "Thabo Molefe",
    position: "Product Manager",
    dept: "Product",
    salary: 105000,
    contact: "thabo@company.co.za",
    history: "Joined 2019, Launched 3 major features",
    status: "Active",
  },
  {
    id: 3,
    name: "Naledi Dube",
    position: "UX Designer",
    dept: "Design",
    salary: 78200,
    contact: "naledi@company.co.za",
    history: "Joined 2022, Redesigned mobile app",
    status: "Active",
  },
  {
    id: 4,
    name: "Kagiso Mthembu",
    position: "Data Analyst",
    dept: "Data",
    salary: 85300,
    contact: "kagiso@company.co.za",
    history: "Joined 2020, Built KPI dashboards",
    status: "Active",
  },
  {
    id: 5,
    name: "Zanele Khumalo",
    position: "HR Manager",
    dept: "Human Resources",
    salary: 92000,
    contact: "zanele@company.co.za",
    history: "Joined 2018, Reduced turnover 18%",
    status: "Active",
  },
  {
    id: 6,
    name: "Bongani Sithole",
    position: "DevOps Engineer",
    dept: "Engineering",
    salary: 101500,
    contact: "bongani@company.co.za",
    history: "Joined 2021, Cut deploy time 70%",
    status: "Active",
  },
  {
    id: 7,
    name: "Lerato Phiri",
    position: "Marketing Lead",
    dept: "Marketing",
    salary: 88400,
    contact: "lerato@company.co.za",
    history: "Joined 2020, Grew MQLs 240%",
    status: "Active",
  },
  {
    id: 8,
    name: "Sipho Ndlovu",
    position: "Sales Executive",
    dept: "Sales",
    salary: 75600,
    contact: "sipho@company.co.za",
    history: "Joined 2023, Top closer Q1 2026",
    status: "Active",
  },
  {
    id: 9,
    name: "Ayanda Cele",
    position: "Finance Officer",
    dept: "Finance",
    salary: 81900,
    contact: "ayanda@company.co.za",
    history: "Joined 2019, Automated invoicing",
    status: "Active",
  },
  {
    id: 10,
    name: "Mandla Zulu",
    position: "IT Support",
    dept: "IT",
    salary: 65800,
    contact: "mandla@company.co.za",
    history: "Joined 2022, 99.2% ticket CSAT",
    status: "Active",
  },
];

const payrollTimesheet = [
  {
    employeeId: 1,
    hoursWorked: 176,
    leaveDeductions: 0,
    finalSalary: 99400,
    gross: 99400,
  },
  {
    employeeId: 2,
    hoursWorked: 168,
    leaveDeductions: 2000,
    finalSalary: 103000,
    gross: 105000,
  },
  {
    employeeId: 3,
    hoursWorked: 176,
    leaveDeductions: 0,
    finalSalary: 78200,
    gross: 78200,
  },
  {
    employeeId: 4,
    hoursWorked: 160,
    leaveDeductions: 3200,
    finalSalary: 82100,
    gross: 85300,
  },
  {
    employeeId: 5,
    hoursWorked: 176,
    leaveDeductions: 0,
    finalSalary: 92000,
    gross: 92000,
  },
  {
    employeeId: 6,
    hoursWorked: 184,
    leaveDeductions: 0,
    finalSalary: 101500,
    gross: 101500,
  },
  {
    employeeId: 7,
    hoursWorked: 172,
    leaveDeductions: 800,
    finalSalary: 87600,
    gross: 88400,
  },
  {
    employeeId: 8,
    hoursWorked: 180,
    leaveDeductions: 0,
    finalSalary: 75600,
    gross: 75600,
  },
  {
    employeeId: 9,
    hoursWorked: 176,
    leaveDeductions: 0,
    finalSalary: 81900,
    gross: 81900,
  },
  {
    employeeId: 10,
    hoursWorked: 168,
    leaveDeductions: 1200,
    finalSalary: 64600,
    gross: 65800,
  },
];

const avatarColors = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#F97316",
  "#84CC16",
  "#6366F1",
];

function getScoreById(id) {
  const scores = {
    1: 92,
    2: 88,
    3: 95,
    4: 85,
    5: 90,
    6: 94,
    7: 87,
    8: 89,
    9: 91,
    10: 86,
  };
  return scores[id] || 85;
}

let employees = employeeInformation.map((emp, idx) => ({
  ...emp,
  color: avatarColors[idx],
  initials: emp.name
    .split(" ")
    .map((n) => n[0])
    .join(""),
  score: getScoreById(emp.id),
}));

const payrollData = employees.map((emp) => {
  const timesheet = payrollTimesheet.find((t) => t.employeeId === emp.id) || {};
  const gross = timesheet.gross || emp.salary;
  const leaveDeductions = timesheet.leaveDeductions || 0;
  const hoursWorked = timesheet.hoursWorked || 176;
  const tax = gross * 0.26;
  const ni = gross * 0.01;
  const pension = gross * 0.075;
  const totalDeductions = tax + ni + pension + leaveDeductions;
  const netPay = gross - totalDeductions;
  const hourlyRate = gross / hoursWorked;
  return {
    ...emp,
    ...timesheet,
    grossPay: gross,
    tax,
    ni,
    pension,
    deductions: totalDeductions,
    netPay,
    hourlyRate,
  };
});

// 3. Shared Utilities
function toRand(amount) {
  if (typeof amount !== "number" || isNaN(amount)) return "R0";
  return "R" + amount.toLocaleString("en-ZA", { maximumFractionDigits: 0 });
}

function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  const icon =
    type === "error"
      ? '<i class="fa-solid fa-circle-xmark"></i>'
      : '<i class="fa-solid fa-circle-check"></i>';
  toast.innerHTML = `${icon}<span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function getQuirkyFact(data) {
  const firstName = data.name.split(" ")[0];
  const facts = [
    `Did you know? ${firstName} could buy ${Math.floor(data.netPay / 25)} cappuccinos this month.`,
    `Fun fact: ${firstName}'s hourly rate is enough for ${Math.floor(data.hourlyRate / 60)} minutes of helicopter time.`,
    `${firstName} worked ${data.hoursWorked} hours. That's ${data.hoursWorked * 60} minutes of brilliance.`,
    `If ${firstName} saved 10% of net pay, they'd have ${toRand(data.netPay * 0.1 * 12)} after a year.`,
    `${firstName}'s tax could fund ${Math.floor(data.tax / 15000)} school textbooks.`,
    `At this rate, ${firstName} earns ${toRand(data.hourlyRate / 60)} per minute.`,
    `${firstName} is in the top ${100 - data.score}% of performers. Iconic.`,
  ];
  return facts[data.id % facts.length];
}

function getMonthData(data, monthOffset) {
  const multiplier = Math.pow(0.95, monthOffset);
  return {
    gross: data.grossPay * multiplier,
    net: data.netPay * multiplier,
    tax: data.tax * multiplier,
  };
}
