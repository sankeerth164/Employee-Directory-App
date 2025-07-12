// Employee data - you can replace this with data from a JSON file or API
let employees = [
    {
        id: 1,
        name: "Virat",
        department: "Engineering",
        role: "Developer",
        email: "virat.kohli@gmail.com",
        phone: "+91 **********"
    },
    {
        id: 2,
        name: "Jai",
        department: "Marketing",
        role: "Product Manager",
        email: "jai164@gmail.com",
        phone: "+91 **********"
    },
    {
        id: 3,
        name: "Harsha",
        department: "Sales",
        role: "Team Lead",
        email: "harsha@gmail.com",
        phone: "+91 **********"
    },
    {
        id: 4,
        name: "G Jaya Sankeerth",
        department: "HR",
        role: "QA Engineer",
        email: "gjaya@gmail.com",
        phone: "+91 **********"
    },
    {
        id: 5,
        name: "Sam",
        department: "Sales  ",
        role: "Sales Manager",
        email: "sam@gmail.com",
        phone: "+91 **********"
    },
    {
        id: 6,
        name: "Kuladeep",
        department: "Engineering",
        role: "Developer",
        email: "kuladeep@gmail.com",
        phone: "+91 **********"
    },
    
];

let currentEditId = null;
let filteredEmployees = [...employees];

// DOM Elements
const employeeGrid = document.getElementById('employeeGrid');
const searchInput = document.getElementById('searchInput');
const departmentFilter = document.getElementById('departmentFilter');
const roleFilter = document.getElementById('roleFilter');
// Remove sortSelect reference
// const sortSelect = document.getElementById('sortSelect');
const addEmployeeBtn = document.getElementById('addEmployeeBtn');
const modal = document.getElementById('employeeModal');
const modalTitle = document.getElementById('modalTitle');
const employeeForm = document.getElementById('employeeForm');
const closeModal = document.querySelector('.close');
const cancelBtn = document.getElementById('cancelBtn');
const showCountSelect = document.getElementById('showCountSelect');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    renderEmployees();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    searchInput.addEventListener('input', handleSearch);
    departmentFilter.addEventListener('change', handleFilter);
    roleFilter.addEventListener('change', handleFilter);
    showCountSelect.addEventListener('change', renderEmployees);
    // Removed sortSelect event listener since sort dropdown is gone
    // sortSelect.addEventListener('change', handleSort);
    // Restore modal popup for Add Employee
    addEmployeeBtn.addEventListener('click', openAddModal);
    closeModal.addEventListener('click', closeEmployeeModal);
    cancelBtn.addEventListener('click', closeEmployeeModal);
    employeeForm.addEventListener('submit', handleFormSubmit);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeEmployeeModal();
        }
    });
}

// Render employees
function renderEmployees() {
    employeeGrid.innerHTML = '';

    let showCount = showCountSelect.value;
    let employeesToShow = filteredEmployees;

    if (showCount !== 'all') {
        employeesToShow = filteredEmployees.slice(0, parseInt(showCount));
    }

    if (employeesToShow.length === 0) {
        employeeGrid.innerHTML = '<p style="text-align: center; color: #666; font-size: 1.2rem;">No employees found.</p>';
        return;
    }

    employeesToShow.forEach(employee => {
        const employeeCard = createEmployeeCard(employee);
        employeeGrid.appendChild(employeeCard);
    });
}

// Create employee card
function createEmployeeCard(employee) {
    const card = document.createElement('div');
    card.className = 'employee-card';
    card.innerHTML = `
        <div class="employee-header" style="display: block; margin-bottom: 15px;">
            <div class="employee-name">${employee.name}</div>
            <div class="employee-role">${employee.role ? employee.role : ''}</div>
        </div>
        <div class="employee-department">${employee.department}</div>
        <div class="employee-contact">
            <p><strong>Email:</strong> ${employee.email}</p>
            <p><strong>Phone:</strong> ${employee.phone}</p>
        </div>
        <div class="card-actions">
            <button class="btn btn-edit" onclick="editEmployee(${employee.id})">Edit</button>
            <button class="btn btn-danger" onclick="deleteEmployee(${employee.id})">Delete</button>
        </div>
    `;
    return card;
}

// Search functionality
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    applyFilters();
}

// Filter functionality
function handleFilter() {
    applyFilters();
}

// Remove handleSort function since sort dropdown is gone
// function handleSort() {
//     const sortBy = sortSelect.value;
//     filteredEmployees.sort((a, b) => {
//         if (a[sortBy] < b[sortBy]) return -1;
//         if (a[sortBy] > b[sortBy]) return 1;
//         return 0;
//     });
//     renderEmployees();
// }

// Apply all filters
function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const departmentValue = departmentFilter.value;
    const roleValue = roleFilter.value;

    filteredEmployees = employees.filter(employee => {
        const matchesSearch = employee.name.toLowerCase().includes(searchTerm) ||
                              employee.role.toLowerCase().includes(searchTerm) ||
                              employee.email.toLowerCase().includes(searchTerm);

        const matchesDepartment = !departmentValue || employee.department === departmentValue;
        const matchesRole = !roleValue || employee.role === roleValue;

        return matchesSearch && matchesDepartment && matchesRole;
    });

    renderEmployees();
}

// Modal functions
function openAddModal() {
    currentEditId = null;
    modalTitle.textContent = 'Add Employee';
    employeeForm.reset();
    modal.style.display = 'block';
}

function editEmployee(id) {
    const employee = employees.find(emp => emp.id === id);
    if (!employee) return;
    
    currentEditId = id;
    modalTitle.textContent = 'Edit Employee';
    
    // Populate form
    document.getElementById('name').value = employee.name;
    document.getElementById('department').value = employee.department;
    document.getElementById('role').value = employee.role || '';
    document.getElementById('email').value = employee.email;
    document.getElementById('phone').value = employee.phone;
    
    modal.style.display = 'block';
}

function closeEmployeeModal() {
    modal.style.display = 'none';
    employeeForm.reset();
    currentEditId = null;
}

// Form submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(employeeForm);
    const employeeData = {
        name: document.getElementById('name').value,
        department: document.getElementById('department').value,
        role: document.getElementById('role').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value
    };
    
    if (currentEditId) {
        // Update existing employee
        const index = employees.findIndex(emp => emp.id === currentEditId);
        if (index !== -1) {
            employees[index] = { ...employees[index], ...employeeData };
        }
    } else {
        // Add new employee
        const newEmployee = {
            id: Date.now(), // Simple ID generation
            ...employeeData
        };
        employees.push(newEmployee);
    }
    
    closeEmployeeModal();
    applyFilters();
}

// Delete employee
function deleteEmployee(id) {
    if (confirm('Are you sure you want to delete this employee?')) {
        employees = employees.filter(emp => emp.id !== id);
        applyFilters();
    }
}
