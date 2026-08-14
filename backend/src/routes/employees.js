// 4. EMPLOYEES PAGE FUNCTIONS
function renderEmployeeGrid(empList = employees) {
  const grid = document.getElementById("employeeGrid");
  const empty = document.getElementById("employeeEmpty");
  if (!grid) return;

  if (empList.length === 0) {
    grid.innerHTML = "";
    if (empty) empty.style.display = "block";
    return;
  }

  if (empty) empty.style.display = "none";

  grid.innerHTML = empList
    .map(
      (emp) => `
    <div class="employee-card" data-employee-id="${emp.id}" role="button" tabindex="0">
      <div class="employee-card-top">
        <div class="employee-avatar" style="background: ${emp.color}">
          ${emp.initials}
        </div>
        <span class="status-badge">${emp.status}</span>
      </div>
      <h4>${emp.name}</h4>
      <p class="employee-role">${emp.position}</p>
      <div class="employee-card-footer">
        <span class="dept-badge">${emp.dept}</span>
        <div class="score-badge">
          <i class="fa-solid fa-star"></i>
          <span>${emp.score}%</span>
        </div>
      </div>
    </div>
  `,
    )
    .join("");

  document.querySelectorAll(".employee-card").forEach((card) => {
    const id = parseInt(card.dataset.employeeId, 10);
    card.onclick = () => openEmployeeProfile(id);
    card.onkeydown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openEmployeeProfile(id);
      }
    };
  });
}

function openEmployeeProfile(empId) {
  const id = parseInt(empId, 10);
  const emp = employees.find((e) => e.id === id);
  if (!emp) return showToast("Employee not found", "error");

  const overlay = document.getElementById("employeeProfileOverlay");
  const body = document.getElementById("empModalBody");
  const title = document.getElementById("empModalTitle");
  if (!overlay || !body) return;

  title.textContent = emp.name;
  body.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
      <div style="display: flex; align-items: center; gap: 1.25rem; padding-bottom: 1.25rem; border-bottom: 1px solid #e2e8f0;">
        <div style="width: 5rem; height: 5rem; border-radius: 9999px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; font-weight: 700; background-color: ${emp.color}">
          ${emp.initials}
        </div>
        <div style="flex: 1;">
          <h4 style="font-size: 1.5rem; font-weight: 700; color: #0f172a; margin: 0;">${emp.name}</h4>
          <p style="color: #4b5563; font-size: 1.125rem; margin: 0.25rem 0;">${emp.position}</p>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem;">
            <span style="padding: 0.25rem 0.75rem; background: #dcfce7; color: #166534; border-radius: 9999px; font-size: 0.875rem; font-weight: 500;">${emp.status}</span>
            <span style="padding: 0.25rem 0.75rem; background: #dbeafe; color: #1e40af; border-radius: 9999px; font-size: 0.875rem; font-weight: 500;">${emp.dept}</span>
          </div>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div style="background: #f9fafb; padding: 1rem; border-radius: 0.5rem;">
          <p style="font-size: 0.875rem; color: #6b7280; margin: 0 0 0.25rem 0;">Performance Score</p>
          <p style="font-size: 1.5rem; font-weight: 700; color: #111827; margin: 0;">${emp.score}/100</p>
        </div>
        <div style="background: #f9fafb; padding: 1rem; border-radius: 0.5rem;">
          <p style="font-size: 0.875rem; color: #6b7280; margin: 0 0 0.25rem 0;">Base Salary</p>
          <p style="font-size: 1.5rem; font-weight: 700; color: #111827; margin: 0;">${toRand(emp.salary)}</p>
        </div>
      </div>
      <div style="background: #f9fafb; padding: 1rem; border-radius: 0.5rem;">
        <p style="font-size: 0.875rem; font-weight: 600; color: #374151; margin: 0 0 0.5rem 0;">Contact Information</p>
        <div style="display: flex; align-items: center; gap: 0.5rem; color: #4b5563;">
          <i class="fa-solid fa-envelope"></i>
          <a href="mailto:${emp.contact}" style="color: #2563eb; text-decoration: none;">${emp.contact}</a>
        </div>
      </div>
      <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 1rem; border-radius: 0.5rem;">
        <p style="font-size: 0.875rem; font-weight: 600; color: #1e3a8a; margin: 0 0 0.5rem 0;">Career History</p>
        <p style="font-size: 0.875rem; color: #1e40af; margin: 0;">${emp.history}</p>
      </div>
    </div>
  `;

  overlay.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeEmployeeProfile() {
  const overlay = document.getElementById("employeeProfileOverlay");
  if (overlay) {
    overlay.style.display = "none";
    document.body.style.overflow = "";
  }
}

function initEmployeeSearch() {
  const search = document.getElementById("employeeSearch");
  if (!search) return;
  search.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) return renderEmployeeGrid(employees);
    const filtered = employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(query) ||
        emp.position.toLowerCase().includes(query) ||
        emp.dept.toLowerCase().includes(query) ||
        emp.contact.toLowerCase().includes(query),
    );
    renderEmployeeGrid(filtered);
  });
}

function initFilterButton() {
  const filterBtn = document.getElementById("filterBtn");
  if (!filterBtn) return;
  filterBtn.addEventListener("click", showFilterModal);
}

function showFilterModal() {
  const depts = [...new Set(employees.map((e) => e.dept))].sort();
  const overlay = document.getElementById("employeeProfileOverlay");
  const body = document.getElementById("empModalBody");
  const title = document.getElementById("empModalTitle");
  if (!overlay || !body) return;

  title.textContent = "Filter Employees";
  body.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div>
        <label style="display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem; color: #374151;">Department</label>
        <select id="filterDept" style="width: 100%; padding: 0.625rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 0.875rem; color: #111827;">
          <option value="">All Departments</option>
          ${depts.map((d) => `<option value="${d}">${d}</option>`).join("")}
        </select>
      </div>
      <div>
        <label style="display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem; color: #374151;">Min Performance Score</label>
        <input id="filterScore" type="number" min="0" max="100" placeholder="0-100" style="width: 100%; padding: 0.625rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 0.875rem; color: #111827;">
      </div>
      <div style="display: flex; gap: 0.75rem; padding-top: 0.5rem;">
        <button id="applyFilterBtn" class="btn-primary" style="flex: 1; padding: 0.75rem; font-size: 0.875rem; font-weight: 600;">Apply Filter</button>
        <button id="clearFilterBtn" class="btn-secondary" style="flex: 1; padding: 0.75rem; font-size: 0.875rem; font-weight: 600;">Clear</button>
      </div>
    </div>
  `;
  overlay.style.display = "flex";
  document.body.style.overflow = "hidden";

  document.getElementById("applyFilterBtn").onclick = applyEmployeeFilter;
  document.getElementById("clearFilterBtn").onclick = () => {
    clearEmployeeFilter();
    closeEmployeeProfile();
  };
}

function applyEmployeeFilter() {
  const dept = document.getElementById("filterDept").value;
  const minScore = parseInt(document.getElementById("filterScore").value) || 0;
  const filtered = employees.filter((emp) => {
    const deptMatch = !dept || emp.dept === dept;
    const scoreMatch = emp.score >= minScore;
    return deptMatch && scoreMatch;
  });
  renderEmployeeGrid(filtered);
  closeEmployeeProfile();
  showToast(`Showing ${filtered.length} employees`);
}

function clearEmployeeFilter() {
  renderEmployeeGrid(employees);
  const search = document.getElementById("employeeSearch");
  if (search) search.value = "";
}

function initAddEmployeeButton() {
  const addBtn = document.getElementById("addEmployeeBtn");
  if (!addBtn) return;
  addBtn.addEventListener("click", showAddEmployeeModal);
}

function showAddEmployeeModal() {
  const overlay = document.getElementById("employeeProfileOverlay");
  const body = document.getElementById("empModalBody");
  const title = document.getElementById("empModalTitle");
  if (!overlay || !body) return;

  title.textContent = "Add New Employee";
  body.innerHTML = `
    <form id="addEmployeeForm" style="display: flex; flex-direction: column; gap: 1rem; font-family: system-ui, -apple-system, sans-serif;">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div>
          <label style="display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.375rem; color: #374151;">Full Name *</label>
          <input name="name" type="text" required placeholder="e.g. John Doe" style="width: 100%; padding: 0.625rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 0.875rem; color: #111827; box-sizing: border-box;">
        </div>
        <div>
          <label style="display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.375rem; color: #374151;">Position *</label>
          <input name="position" type="text" required placeholder="e.g. Software Engineer" style="width: 100%; padding: 0.625rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 0.875rem; color: #111827; box-sizing: border-box;">
        </div>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div>
          <label style="display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.375rem; color: #374151;">Department *</label>
          <input name="dept" type="text" required placeholder="e.g. Engineering" style="width: 100%; padding: 0.625rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 0.875rem; color: #111827; box-sizing: border-box;">
        </div>
        <div>
          <label style="display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.375rem; color: #374151;">Base Salary *</label>
          <input name="salary" type="number" required min="0" placeholder="e.g. 85000" style="width: 100%; padding: 0.625rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 0.875rem; color: #111827; box-sizing: border-box;">
        </div>
      </div>
      <div>
        <label style="display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.375rem; color: #374151;">Email *</label>
        <input name="contact" type="email" required placeholder="name@company.co.za" style="width: 100%; padding: 0.625rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 0.875rem; color: #111827; box-sizing: border-box;">
      </div>
      <div>
        <label style="display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.375rem; color: #374151;">History/Notes</label>
        <textarea name="history" rows="3" placeholder="Brief background" style="width: 100%; padding: 0.625rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 0.875rem; color: #111827; box-sizing: border-box; resize: vertical; font-family: inherit;"></textarea>
      </div>
      <div style="display: flex; gap: 0.75rem; padding-top: 0.5rem;">
        <button type="submit" class="btn-primary" style="flex: 1; padding: 0.75rem; font-size: 0.875rem; font-weight: 600; border: none; border-radius: 0.5rem; cursor: pointer;">Add Employee</button>
        <button type="button" onclick="closeEmployeeProfile()" class="btn-secondary" style="flex: 1; padding: 0.75rem; font-size: 0.875rem; font-weight: 600; border: none; border-radius: 0.5rem; cursor: pointer;">Cancel</button>
      </div>
    </form>
  `;

  overlay.style.display = "flex";
  document.body.style.overflow = "hidden";
  document.getElementById("addEmployeeForm").onsubmit = handleAddEmployee;
}

function handleAddEmployee(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const newId = Math.max(...employees.map((emp) => emp.id), 0) + 1;
  const colorIdx = employees.length % avatarColors.length;

  const newEmp = {
    id: newId,
    name: formData.get("name"),
    position: formData.get("position"),
    dept: formData.get("dept"),
    salary: parseInt(formData.get("salary")),
    contact: formData.get("contact"),
    history: formData.get("history") || "New employee",
    status: "Active",
    color: avatarColors[colorIdx],
    initials: formData
      .get("name")
      .split(" ")
      .map((n) => n[0])
      .join(""),
    score: 85,
  };

  employees.push(newEmp);
  renderEmployeeGrid(employees);
  closeEmployeeProfile();
  showToast(`${newEmp.name} added successfully`);
}

// 7. Global Init - Router
document.addEventListener("DOMContentLoaded", () => {
  console.log("[Init] Starting page");

  // Initialize employees page if present
  if (document.getElementById("employeeGrid")) {
    renderEmployeeGrid();
    initEmployeeSearch();
    initFilterButton();
    initAddEmployeeButton();
  }

  // Global modal close handlers
  const closeBtn = document.getElementById("closeEmpModalBtn");
  const overlay = document.getElementById("employeeProfileOverlay");

  if (closeBtn) closeBtn.onclick = closeEmployeeProfile;
  if (overlay) {
    overlay.onclick = (e) => {
      if (e.target === overlay) closeEmployeeProfile();
    };
  }

  // ESC KEY FIX - This is the key part
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeEmployeeProfile();
    }
  });
});
