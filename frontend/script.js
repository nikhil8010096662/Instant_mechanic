const API_URL = "http://localhost:8080";

async function loadDashboard() {
    try {
        const response = await fetch(`${API_URL}/api/dashboard`);

        if (!response.ok) {
            throw new Error("Failed to load dashboard data");
        }

        const data = await response.json();

        document.getElementById("totalBookings").textContent =
            data.totalBookings;

        document.getElementById("todayBookings").textContent =
            data.todayBookings;

        document.getElementById("completedBookings").textContent =
            data.completedBookings;

        document.getElementById("pendingBookings").textContent =
            data.pendingBookings;

        document.getElementById("cancelledBookings").textContent =
            data.cancelledBookings;

        document.getElementById("totalRevenue").textContent =
            "₹" + Number(data.totalRevenue).toLocaleString("en-IN");

        document.getElementById("activeMechanics").textContent =
            data.activeMechanics;

        document.getElementById("totalCustomers").textContent =
            data.totalCustomers;
        
        document.getElementById("chartTotalRevenue").textContent =
            "₹" + Number(data.totalRevenue).toLocaleString("en-IN");

        document.getElementById("chartCompletedRevenue").textContent =
            "₹" + Number(data.completedRevenue).toLocaleString("en-IN");

        loadBookingStatusChart();

    } catch (error) {
        console.error("Dashboard error:", error);
    }
}


async function loadBookings() {
    try {
        const response = await fetch(`${API_URL}/api/bookings`);

        if (!response.ok) {
            throw new Error("Failed to load bookings");
        }

        const bookings = await response.json();

        const tableBody = document.getElementById("bookingTableBody");

        tableBody.innerHTML = "";

        const recentBookings = bookings.slice(0, 10);

        recentBookings.forEach(booking => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>#${booking.id}</td>

                <td>
                    ${booking.customer
                        ? booking.customer.name
                        : "N/A"}
                </td>

                <td>
                    ${booking.vehicleNumber || "N/A"}
                    <br>
                    <small>${booking.vehicleModel || ""}</small>
                </td>

                <td>
                    ${booking.service
                        ? booking.service.name
                        : "N/A"}
                </td>

                <td>
                    ${booking.mechanic
                        ? booking.mechanic.name
                        : "N/A"}
                </td>

                <td>
                    ${booking.status || "N/A"}
                </td>

                <td>
                    ₹${Number(booking.amount || 0).toLocaleString("en-IN")}
                </td>
            `;

            tableBody.appendChild(row);
        });

    } catch (error) {

        console.error("Bookings error:", error);

        document.getElementById("bookingTableBody").innerHTML = `
            <tr>
                <td colspan="7">
                    Unable to load bookings
                </td>
            </tr>
        `;
    }
}


// Load dashboard when page opens
loadDashboard();
loadBookings();

let allBookings = [];


function showSection(sectionId, clickedLink) {

    const sections = document.querySelectorAll(".main-content > section");

    sections.forEach(section => {
        section.style.display = "none";
    });

    const selectedSection = document.getElementById(sectionId);

    if (selectedSection) {
        selectedSection.style.display = "block";
    }

    const links = document.querySelectorAll(".sidebar nav a");

    links.forEach(link => {
        link.classList.remove("active");
    });

    clickedLink.classList.add("active");

    if (sectionId === "dashboardSection") {
        loadDashboard();
    }

    if (sectionId === "bookingsSection") {
        loadBookingsPage();
    }

    if (sectionId === "customersSection") {
        loadCustomers();
    }

    if (sectionId === "mechanicsSection") {
        loadMechanics();
    }

    if (sectionId === "servicesSection") {
        loadServices();
    }
}


async function loadBookingsPage() {

    try {

        const response = await fetch(`${API_URL}/api/bookings`);

        if (!response.ok) {
            throw new Error("Failed to load bookings");
        }

        allBookings = await response.json();

        displayBookings(allBookings);

    } catch (error) {

        console.error("Bookings page error:", error);

        document.getElementById("allBookingsTableBody").innerHTML = `
            <tr>
                <td colspan="8">
                    Unable to load bookings
                </td>
            </tr>
        `;
    }
}


function displayBookings(bookings) {

    const tableBody =
        document.getElementById("allBookingsTableBody");

    tableBody.innerHTML = "";

    if (bookings.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="8">
                    No bookings found
                </td>
            </tr>
        `;

        return;
    }

    bookings.forEach(booking => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>#${booking.id}</td>

            <td>
                ${booking.customer
                    ? booking.customer.name
                    : "N/A"}
            </td>

            <td>
                ${booking.vehicleNumber || "N/A"}
                <br>
                <small>${booking.vehicleModel || ""}</small>
            </td>

            <td>
                ${booking.service
                    ? booking.service.name
                    : "N/A"}
            </td>

            <td>
                ${booking.mechanic
                    ? booking.mechanic.name
                    : "N/A"}
            </td>

            <td>
                 <select
                    class="status-select"
                    onchange="updateBookingStatus(${booking.id}, this.value)"
                >
                    <option value="PENDING" ${booking.status === "PENDING" ? "selected" : ""}>
                        Pending
                    </option>

                    <option value="ASSIGNED" ${booking.status === "ASSIGNED" ? "selected" : ""}>
                        Assigned
                    </option>

                    <option value="MECHANIC_ON_THE_WAY" ${booking.status === "MECHANIC_ON_THE_WAY" ? "selected" : ""}>
                        On the Way
                    </option>

                    <option value="COMPLETED" ${booking.status === "COMPLETED" ? "selected" : ""}>
                        Completed
                    </option>

                    <option value="CANCELLED" ${booking.status === "CANCELLED" ? "selected" : ""}>
                        Cancelled
                    </option>
                </select>
            </td>

            <td>
                ₹${Number(booking.amount || 0).toLocaleString("en-IN")}
            </td>

            <td>
                ${booking.bookingDate
                    ? new Date(booking.bookingDate).toLocaleString("en-IN")
                    : "N/A"}
            </td>
        `;

        tableBody.appendChild(row);
    });
}


function filterBookings() {

    const search =
        document.getElementById("bookingSearch")
            .value
            .toLowerCase();

    const status =
        document.getElementById("bookingStatusFilter")
            .value;

    const filteredBookings = allBookings.filter(booking => {

        const customerName =
            booking.customer?.name?.toLowerCase() || "";

        const vehicleNumber =
            booking.vehicleNumber?.toLowerCase() || "";

        const matchesSearch =
            customerName.includes(search) ||
            vehicleNumber.includes(search);

        const matchesStatus =
            status === "" ||
            booking.status === status;

        return matchesSearch && matchesStatus;
    });

    displayBookings(filteredBookings);
}


async function updateBookingStatus(id, status) {

    try {

        const response = await fetch(
            `${API_URL}/api/bookings/${id}/status?status=${encodeURIComponent(status)}`,
            {
                method: "PUT"
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Backend response:", errorText);
            throw new Error(`HTTP ${response.status}`);
        }

        console.log(`Booking #${id} updated to ${status}`);

        // Reload bookings from database
        await loadBookingsPage();

        // Reload dashboard statistics
        await loadDashboard();

    } catch (error) {

        console.error("Status update error:", error);

        alert("Unable to update booking status.");
    }
}

let allCustomers = [];

async function loadCustomers() {

    try {

        const response = await fetch(`${API_URL}/api/customers`);

        if (!response.ok) {
            throw new Error("Failed to load customers");
        }

        allCustomers = await response.json();

        displayCustomers(allCustomers);

    } catch (error) {

        console.error("Customers error:", error);

        document.getElementById("customersTableBody").innerHTML = `
            <tr>
                <td colspan="4">
                    Unable to load customers
                </td>
            </tr>
        `;
    }
}


function displayCustomers(customers) {

    const tableBody =
        document.getElementById("customersTableBody");

    tableBody.innerHTML = "";

    if (customers.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="4">No customers found</td>
            </tr>
        `;

        return;
    }

    customers.forEach(customer => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>#${customer.id}</td>
            <td>${customer.name || "N/A"}</td>
            <td>${customer.email || "N/A"}</td>
            <td>${customer.phone || "N/A"}</td>
        `;

        tableBody.appendChild(row);
    });
}


function filterCustomers() {

    const search =
        document.getElementById("customerSearch")
            .value
            .toLowerCase();

    const filtered = allCustomers.filter(customer => {

        const name =
            customer.name?.toLowerCase() || "";

        const email =
            customer.email?.toLowerCase() || "";

        const phone =
            customer.phone?.toLowerCase() || "";

        return name.includes(search) ||
               email.includes(search) ||
               phone.includes(search);
    });

    displayCustomers(filtered);
}

let allMechanics = [];

async function loadMechanics() {

    try {

        const response = await fetch(`${API_URL}/api/mechanics`);

        if (!response.ok) {
            throw new Error("Failed to load mechanics");
        }

        allMechanics = await response.json();

        displayMechanics(allMechanics);

    } catch (error) {

        console.error("Mechanics error:", error);

        document.getElementById("mechanicsTableBody").innerHTML = `
            <tr>
                <td colspan="5">
                    Unable to load mechanics
                </td>
            </tr>
        `;
    }
}


function displayMechanics(mechanics) {

    const tableBody =
        document.getElementById("mechanicsTableBody");

    tableBody.innerHTML = "";

    if (mechanics.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="5">No mechanics found</td>
            </tr>
        `;

        return;
    }

    mechanics.forEach(mechanic => {

        const row = document.createElement("tr");

        const status = mechanic.status || "N/A";

        row.innerHTML = `
            <td>#${mechanic.id}</td>

            <td>
                ${mechanic.name || "N/A"}
            </td>

            <td>
                ${mechanic.phone || "N/A"}
            </td>

            <td>
                <span class="mechanic-status ${status.toLowerCase()}">
                    ${status}
                </span>
            </td>

            <td>
                ${mechanic.jobsCompleted || 0}
            </td>
        `;

        tableBody.appendChild(row);
    });
}


function filterMechanics() {

    const search =
        document.getElementById("mechanicSearch")
            .value
            .toLowerCase();

    const status =
        document.getElementById("mechanicStatusFilter")
            .value;

    const filtered = allMechanics.filter(mechanic => {

        const name =
            mechanic.name?.toLowerCase() || "";

        const phone =
            mechanic.phone?.toLowerCase() || "";

        const matchesSearch =
            name.includes(search) ||
            phone.includes(search);

        const matchesStatus =
            status === "" ||
            mechanic.status === status;

        return matchesSearch && matchesStatus;
    });

    displayMechanics(filtered);
}

let allServices = [];

async function loadServices() {

    try {

        const response = await fetch(`${API_URL}/api/services`);

        if (!response.ok) {
            throw new Error("Failed to load services");
        }

        allServices = await response.json();

        setupServiceCategories();

        displayServices(allServices);

    } catch (error) {

        console.error("Services error:", error);

        document.getElementById("servicesTableBody").innerHTML = `
            <tr>
                <td colspan="4">
                    Unable to load services
                </td>
            </tr>
        `;
    }
}


function setupServiceCategories() {

    const categorySelect =
        document.getElementById("serviceCategoryFilter");

    const categories = [
        ...new Set(
            allServices
                .map(service => service.category)
                .filter(category => category)
        )
    ];

    categorySelect.innerHTML = `
        <option value="">All Categories</option>
    `;

    categories.forEach(category => {

        const option = document.createElement("option");

        option.value = category;
        option.textContent = category;

        categorySelect.appendChild(option);
    });
}


function displayServices(services) {

    const tableBody =
        document.getElementById("servicesTableBody");

    tableBody.innerHTML = "";

    if (services.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="4">
                    No services found
                </td>
            </tr>
        `;

        return;
    }

    services.forEach(service => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>#${service.id}</td>

            <td>
                ${service.name || "N/A"}
            </td>

            <td>
                ${service.category || "N/A"}
            </td>

            <td>
                ₹${Number(service.price || 0).toLocaleString("en-IN")}
            </td>
        `;

        tableBody.appendChild(row);
    });
}


function filterServices() {

    const search =
        document.getElementById("serviceSearch")
            .value
            .toLowerCase();

    const category =
        document.getElementById("serviceCategoryFilter")
            .value;

    const filtered = allServices.filter(service => {

        const name =
            service.name?.toLowerCase() || "";

        const serviceCategory =
            service.category || "";

        const matchesSearch =
            name.includes(search);

        const matchesCategory =
            category === "" ||
            serviceCategory === category;

        return matchesSearch && matchesCategory;
    });

    displayServices(filtered);
}

let bookingStatusChart = null;

async function loadBookingStatusChart() {

    try {

        const response = await fetch(`${API_URL}/api/bookings`);

        if (!response.ok) {
            throw new Error("Failed to load booking data");
        }

        const bookings = await response.json();

        const statusCounts = {
            PENDING: 0,
            ASSIGNED: 0,
            MECHANIC_ON_THE_WAY: 0,
            COMPLETED: 0,
            CANCELLED: 0
        };

        bookings.forEach(booking => {

            if (statusCounts.hasOwnProperty(booking.status)) {
                statusCounts[booking.status]++;
            }

        });

        const canvas =
            document.getElementById("bookingStatusChart");

        if (bookingStatusChart) {
            bookingStatusChart.destroy();
        }

        bookingStatusChart = new Chart(canvas, {

            type: "doughnut",

            data: {
                labels: [
                    "Pending",
                    "Assigned",
                    "On the Way",
                    "Completed",
                    "Cancelled"
                ],

                datasets: [{
                    data: [
                        statusCounts.PENDING,
                        statusCounts.ASSIGNED,
                        statusCounts.MECHANIC_ON_THE_WAY,
                        statusCounts.COMPLETED,
                        statusCounts.CANCELLED
                    ]
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false
            }

        });

    } catch (error) {

        console.error("Chart error:", error);

    }
}

setInterval(() => {
    loadDashboard();

    if (
        document.getElementById("bookingsSection") &&
        document.getElementById("bookingsSection").style.display !== "none"
    ) {
        loadBookingsPage();
    }

}, 10000);