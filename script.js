document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const roleSelect = document.getElementById("role-select");
  const views = document.querySelectorAll(".view");
  document.getElementById("back-to-dashboard").addEventListener("click", () => {
    document.getElementById("booking-page").classList.remove("active");
    document.getElementById("user-dashboard").classList.add("active");
  });

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const role = roleSelect.value;
    views.forEach((view) => view.classList.remove("active"));
    document.getElementById(`${role}-dashboard`).classList.add("active");
  });

  const swiper = new Swiper(".swiper-container", {
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    slidesPerView: 1,
    spaceBetween: 20,
    breakpoints: {
      640: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  });

  const services = [
    { name: "Haircut", price: "$30", image: "images/hair.jpg" },
    { name: "Facial", price: "$50", image: "images/face.jpg" },
    { name: "Massage", price: "$70", image: "images/massage.jpg" },
    { name: "Nails", price: "$30", image: "images/nails.jpg" },
  ];

  const serviceCardsContainer = document.getElementById("service-cards");
  services.forEach((service) => {
    const card = document.createElement("div");
    card.className = "swiper-slide";
    card.innerHTML = `
        <img src="${service.image}" alt="${service.name}" style="width:100%; border-radius:10px;">
        <h3>${service.name}   ${service.price}</h3>
      `;
    card.addEventListener("click", () => {
      const detailsContainer = document.getElementById("service-details");

      // Clear previous details
      detailsContainer.innerHTML = "";

      // Create details content dynamically
      const detailCard = document.createElement("div");
      detailCard.style.background = "rgba(255, 255, 255, 0.15)";
      detailCard.style.backdropFilter = "blur(8px)";
      detailCard.style.borderRadius = "10px";
      detailCard.style.padding = "1rem";
      detailCard.style.color = "white";
      detailCard.style.textAlign = "center";
      detailCard.style.boxShadow = "0 5px 15px rgba(0,0,0,0.1)";
      detailCard.innerHTML = `
    <h2>${service.name} Services</h2>
    <p>Price: ${service.price}</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Details about ${service.name} services go here.</p>
  `;

      detailsContainer.appendChild(detailCard);

      // Scroll to the service details
      detailCard.scrollIntoView({ behavior: "smooth" });
    });
  });

  const bookingForm = document.getElementById("booking-form");
  const bookingSuccess = document.getElementById("booking-success");
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    bookingSuccess.classList.remove("hidden");
    setTimeout(() => bookingSuccess.classList.add("hidden"), 3000);
  });
});

// Dummy appointments (normally fetched from backend)
const staffAppointments = [
  {
    id: 1,
    client: "Alice",
    time: "10:00 AM",
    service: "Hair",
    status: "Pending",
  },
  {
    id: 2,
    client: "Bob",
    time: "11:30 AM",
    service: "Massage",
    status: "Pending",
  },
];

// Show the selected panel only
function showStaffPanel(panelId) {
  document.querySelectorAll(".staff-panel").forEach((p) => {
    p.style.display = p.id === panelId ? "block" : "none";
  });
}

// Render the appointments list
function renderAppointments() {
  const list = document.getElementById("appointmentList");
  list.innerHTML = "";

  staffAppointments.forEach((appt) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${appt.client}</strong> - ${appt.service} at ${appt.time} 
      [<em>${appt.status}</em>]
      ${
        appt.status === "Pending"
          ? `<button onclick="markCompleted(${appt.id})">Mark as Done</button>`
          : ""
      }
    `;
    list.appendChild(li);
  });
}

// Mark appointment as completed
function markCompleted(id) {
  const appt = staffAppointments.find((a) => a.id === id);
  if (appt) appt.status = "Completed";
  renderAppointments();
}

// Handle info update
function updateStaffInfo(e) {
  e.preventDefault();
  const name = document.getElementById("staffName").value;
  const phone = document.getElementById("staffPhone").value;
  const specialties = Array.from(
    document.querySelectorAll('#updateInfoPanel input[type="checkbox"]:checked')
  ).map((cb) => cb.value);

  alert(
    `Info updated!\nName: ${name}\nPhone: ${phone}\nSpecialties: ${specialties.join(
      ", "
    )}`
  );
}

let selectedService = "";

function selectService(service) {
  selectedService = service;
  document.getElementById(
    "calendarTitle"
  ).innerText = `Select date for ${service}`;
  document.getElementById("calendarModal").style.display = "block";
}

function confirmAppointment() {
  const date = document.getElementById("appointmentDate").value;
  if (!date) {
    alert("Please select a date");
    return;
  }

  let appointments = JSON.parse(
    localStorage.getItem("upcomingAppointments") || "[]"
  );
  appointments.push({ id: Date.now(), date, service: selectedService });
  localStorage.setItem("upcomingAppointments", JSON.stringify(appointments));

  alert(`${selectedService} booked for ${date}`);
  document.getElementById("calendarModal").style.display = "none";
  document.getElementById("appointmentDate").value = "";
}
// Dummy upcoming list
document.addEventListener("DOMContentLoaded", () => {
  const subcategories = {
    Hair: ["Haircut", "Coloring", "Styling"],
    Nails: ["Manicure", "Pedicure", "Nail Art"],
    Massage: ["Swedish", "Deep Tissue", "Aromatherapy"],
    Facial: ["Exfoliation", "Hydration", "Anti-aging"],
  };

  let upcoming = [];

  function openCalendar(category) {
    const modal = document.getElementById("calendarModal");
    const title = document.getElementById("calendarTitle");
    const select = document.getElementById("subcategorySelect");
    const dateInput = document.getElementById("appointmentDate");

    title.textContent = `Book a ${
      category.charAt(0).toUpperCase() + category.slice(1)
    } service`;

    // Clear and populate dropdown
    select.innerHTML =
      '<option value="" disabled selected>Select a type</option>';
    const options = subcategories[category];

    if (options && options.length) {
      options.forEach((item) => {
        const option = document.createElement("option");
        option.value = item;
        option.textContent = item;
        select.appendChild(option);
      });
    } else {
      console.error(`No subcategories found for category: ${category}`);
    }

    dateInput.value = "";
    modal.dataset.category = category;
    modal.style.display = "block";
  }

  function confirmAppointment() {
    const modal = document.getElementById("calendarModal");
    const subcategory = document.getElementById("subcategorySelect").value;
    const date = document.getElementById("appointmentDate").value;

    if (!subcategory) return alert("Please choose a service type.");
    if (!date) return alert("Please choose a date.");

    upcoming.push({ id: Date.now(), service: subcategory, date });

    alert(`Appointment booked:\n${subcategory} on ${date}`);
    closeModal();
  }

  function closeModal() {
    document.getElementById("calendarModal").style.display = "none";
  }

  // Attach card click listeners AFTER DOM is loaded
  document.querySelectorAll(".swiper-slide").forEach((card) => {
    card.addEventListener("click", () => {
      const category = card.getAttribute("data-category");
      openCalendar(category);
    });
  });

  // Expose functions to global scope if needed by buttons
  window.confirmAppointment = confirmAppointment;
  window.closeModal = closeModal;
});



// Render on load
renderAppointments();
showStaffPanel("schedulePanel");
