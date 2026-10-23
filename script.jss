/* ==========================================
   WHEELEASYY - FRONT-END DEMO
   HTML: index.html
   CSS:  style.css
   JS:   script.js
   ========================================== */

"use strict";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

let selectedService = "all";
let userLocation = null;
let locationLabel = "";

/* ---------- SAFE MESSAGES ---------- */

function showMessage(selector, message) {
    const element = $(selector);
    if (element) element.textContent = message;
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

/* ---------- LOCATION ---------- */

function getLocation() {
    if (!navigator.geolocation) {
        showMessage("#locationMessage",
            "Location is not supported. Enter your city or area instead.");
        return;
    }

    showMessage("#locationMessage", "Requesting your location...");

    navigator.geolocation.getCurrentPosition(
        position => {
            userLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };

            locationLabel = "My current location";

            const input = $("#locationInput");
            if (input) input.value = locationLabel;

            showMessage("#locationMessage",
                "Location selected. You can now search for nearby services.");

            searchNearby();
        },
        error => {
            const messages = {
                1: "Location permission denied. Enter your city or area manually.",
                2: "Your location is unavailable. Try entering your area.",
                3: "Location request timed out. Please try again."
            };

            userLocation = null;
            showMessage("#locationMessage",
                messages[error.code] || "Could not get location. Enter your area manually.");
        },
        {
            enableHighAccuracy: true,
            timeout: 12000,
            maximumAge: 60000
        }
    );
}

function getSearchLocation() {
    const input = $("#locationInput");
    const typedLocation = input ? input.value.trim() : "";

    if (typedLocation && typedLocation !== "My current location") {
        return typedLocation;
    }

    if (userLocation) {
        return `${userLocation.latitude},${userLocation.longitude}`;
    }

    return "";
}

function getServiceLabel(service) {
    const names = {
        all: "vehicle services",
        petrol: "petrol bunks",
        mechanic: "mechanics and car repair shops",
        servicing: "vehicle servicing centres",
        carwash: "car wash shops",
        tyre: "tyre and battery repair shops",
        towing: "vehicle towing services"
    };

    return names[service] || "vehicle services";
}

function getMapsUrl(service, location) {
    const query = `${getServiceLabel(service)} near ${location}`;
    return "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent(query);
}

function searchNearby() {
    const location = getSearchLocation();

    if (!location) {
        showMessage("#locationMessage",
            "Please choose your current location or enter a city/area first.");

        const input = $("#locationInput");
        if (input) input.focus();
        return;
    }

    const url = getMapsUrl(selectedService, location);

    showMessage("#locationMessage",
        `Opening Google Maps to search for ${getServiceLabel(selectedService)}.`);

    // Google Maps results come from Google, not from a WheelEasyy database.
    window.open(url, "_blank", "noopener,noreferrer");
}

$("#useLocation")?.addEventListener("click", getLocation);
$("#findNearby")?.addEventListener("click", searchNearby);
$("#initialSearch")?.addEventListener("click", searchNearby);

$("#locationInput")?.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        event.preventDefault();
        searchNearby();
    }
});

/* ---------- SERVICE CARDS ---------- */

$$(".service-card").forEach(card => {
    card.addEventListener("click", () => {
        selectedService = card.dataset.service || "all";

        $$(".service-card").forEach(item =>
            item.classList.toggle("active", item === card)
        );

        const filter = $("#shopType");
        if (filter) filter.value = selectedService;

        const title = $("#resultsTitle");
        if (title) {
            title.textContent =
                "Find " + getServiceLabel(selectedService);
        }

        const location = getSearchLocation();

        if (location) {
            searchNearby();
        } else {
            showMessage("#locationMessage",
                "Service selected. Choose your location to find nearby results.");

            $("#locationInput")?.focus();
            $("#nearby")?.scrollIntoView({ behavior: "smooth" });
        }
    });
});

$("#shopType")?.addEventListener("change", event => {
    selectedService = event.target.value;

    $$(".service-card").forEach(card => {
        card.classList.toggle(
            "active",
            card.dataset.service === selectedService
        );
    });

    const title = $("#resultsTitle");
    if (title) title.textContent = "Find " + getServiceLabel(selectedService);
});

$("#shopSearch")?.addEventListener("input", event => {
    const term = event.target.value.trim();

    showMessage("#resultsCount", term
        ? "To search live listings, open Google Maps."
        : "Choose your location to search nearby providers.");
});

$("#distanceFilter")?.addEventListener("change", () => {
    showMessage("#resultsCount",
        "Distance filter applies to a future WheelEasyy business directory. Check Google Maps for actual distances.");
});

$("#sortShops")?.addEventListener("change", () => {
    showMessage("#resultsCount",
        "Sorting needs real shop data and distances. Google Maps can help compare nearby places.");
});

/* ---------- OPEN MAPS ---------- */

$("#openMaps")?.addEventListener("click", () => {
    const location = getSearchLocation();

    if (!location) {
        showMessage("#locationMessage",
            "Enter a city or choose your location first.");
        $("#locationInput")?.focus();
        return;
    }

    window.open(
        getMapsUrl(selectedService, location),
        "_blank",
        "noopener,noreferrer"
    );
});

/* ---------- HIGHWAY EMERGENCY ---------- */

$("#emergencySearch")?.addEventListener("click", () => {
    const location = getSearchLocation();

    if (!location) {
        showMessage("#emergencyMessage",
            "Choose your location or enter the nearest town/area first.");

        $("#locationInput")?.focus();
        $("#home")?.scrollIntoView({ behavior: "smooth" });
        return;
    }

    showMessage("#emergencyMessage",
        "Opening nearby roadside repair and towing searches.");

    const query =
        `roadside assistance mechanic towing service near ${location}`;

    window.open(
        "https://www.google.com/maps/search/?api=1&query=" +
            encodeURIComponent(query),
        "_blank",
        "noopener,noreferrer"
    );
});

/* ---------- OFFERS ---------- */

$("#viewOffers")?.addEventListener("click", () => {
    $("#offersList")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

$$(".offer-search").forEach(button => {
    button.addEventListener("click", () => {
        selectedService = button.dataset.service || "all";

        const filter = $("#shopType");
        if (filter) filter.value = selectedService;

        const location = getSearchLocation();

        if (location) {
            searchNearby();
        } else {
            showMessage("#locationMessage",
                "Choose your location to search for these providers.");

            $("#locationInput")?.focus();
            $("#home")?.scrollIntoView({ behavior: "smooth" });
        }
    });
});

/* ---------- BOOKING HISTORY ---------- */

// Demo bookings are saved in this browser only.
// This does not send bookings to a real garage.

const BOOKING_STORAGE_KEY = "wheeleasyy_demo_bookings";

function getBookings() {
    try {
        const data = JSON.parse(
            localStorage.getItem(BOOKING_STORAGE_KEY) || "[]"
        );

        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

function renderBookings() {
    const list = $("#bookingList");
    if (!list) return;

    const bookings = getBookings();

    if (bookings.length === 0) {
        list.textContent = "No demo bookings saved yet.";
        return;
    }

    list.replaceChildren();

    bookings.slice().reverse().forEach(booking => {
        const card = document.createElement("article");
        card.className = "booking-history-card";

        const heading = document.createElement("h4");
        heading.textContent = booking.service;

        const details = document.createElement("p");
        details.textContent =
            `${booking.date} at ${booking.time} · ${booking.garage || "Garage not selected"}`;

        const status = document.createElement("p");
        status.textContent = "Status: Demo request saved in this browser";

        card.append(heading, details, status);
        list.appendChild(card);
    });
}

const dateInput = $("#bookingDate");

if (dateInput) {
    const today = new Date();
    const localToday = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    dateInput.min = localToday;
}

$("#bookingForm")?.addEventListener("submit", event => {
    event.preventDefault();

    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const formData = new FormData(form);

    const booking = {
        name: String(formData.get("customerName") || "").trim(),
        phone: String(formData.get("customerPhone") || "").trim(),
        service: getServiceLabel(
            String(formData.get("bookingService") || "")
        ),
        date: String(formData.get("bookingDate") || ""),
        time: String(formData.get("bookingTime") || ""),
        garage: String(formData.get("garageName") || "").trim(),
        notes: String(formData.get("bookingNotes") || "").trim(),
        createdAt: new Date().toISOString()
    };

    if (!/^[0-9]{10}$/.test(booking.phone)) {
        showMessage("#bookingMessage",
            "Enter a valid 10-digit mobile number.");
        return;
    }

    if (booking.date < dateInput.min) {
        showMessage("#bookingMessage",
            "Please select today or a future date.");
        return;
    }

    const bookings = getBookings();
    bookings.push(booking);

    try {
        localStorage.setItem(
            BOOKING_STORAGE_KEY,
            JSON.stringify(bookings)
        );

        renderBookings();
        form.reset();

        if (dateInput) dateInput.min = localToday;

        showMessage("#bookingMessage",
            "Demo booking saved! No garage has been contacted or appointment confirmed.");
    } catch {
        showMessage("#bookingMessage",
            "Could not save this demo booking in your browser.");
    }
});

/* ---------- DEMO LOGIN / REGISTER ---------- */

let accountMode = "login";

function setAccountMode(mode) {
    accountMode = mode === "register" ? "register" : "login";

    const registering = accountMode === "register";

    showMessage("#accountMessage", "");

    $("#accountTitle").textContent =
        registering ? "Create Demo Account" : "Welcome Back!";

    $("#accountSubtitle").textContent =
        registering
            ? "Enter your details for this front-end demo."
            : "Sign in to your WheelEasyy demo account.";

    $("#accountSubmit").textContent =
        registering ? "Create Demo Account" : "Login";

    $("#accountNameField").hidden = !registering;
    $("#accountName").required = registering;

    $("#accountPassword").autocomplete =
        registering ? "new-password" : "current-password";

    $("#switchPrompt").textContent =
        registering ? "Already tried the demo?" : "New to WheelEasyy?";

    $("#switchAccountMode").textContent =
        registering ? "Switch to Login" : "Create demo account";
}

$("#switchAccountMode")?.addEventListener("click", () => {
    setAccountMode(accountMode === "login" ? "register" : "login");
});

$("#accountForm")?.addEventListener("submit", event => {
    event.preventDefault();

    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    // Deliberately do not store passwords or claim real authentication.
    const email = $("#accountEmail").value.trim();

    if (accountMode === "register") {
        showMessage("#accountMessage",
            `Demo form checked for ${email}. Real registration requires secure authentication and a backend.`);
    } else {
        showMessage("#accountMessage",
            "This is a front-end demo. Secure login is not configured yet.");
    }
});

const loginDialog = $("#loginDialog");

$("#openLogin")?.addEventListener("click", () => {
    if (loginDialog?.showModal) {
        loginDialog.showModal();
    } else {
        $("#account")?.scrollIntoView({ behavior: "smooth" });
    }
});

$("#closeLogin")?.addEventListener("click", () => {
    loginDialog?.close();
});

$("#dialogLoginLink")?.addEventListener("click", () => {
    loginDialog?.close();
});

$("#menuToggle")?.addEventListener("click", () => {
    $("#navMenu")?.classList.toggle("menu-open");
});

$$('#navMenu a').forEach(link => {
    link.addEventListener("click", () => {
        $("#navMenu")?.classList.remove("menu-open");
    });
});

/* ---------- WHEELEASYY BOT ---------- */

function addChatMessage(message, sender) {
    const messages = $("#chatMessages");
    if (!messages) return;

    const bubble = document.createElement("div");
    bubble.className = sender === "user" ? "user-message" : "bot-message";

    // textContent prevents user input from being interpreted as HTML.
    bubble.textContent = message;

    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
}

function getBotReply(message) {
    const text = message.toLowerCase();

    if (text.includes("emergency") || text.includes("highway") ||
        text.includes("breakdown") || text.includes("stopped")) {
        return "If anyone is in immediate danger, move to a safe place if possible and call India's emergency number 112. For vehicle repair, choose your location and use the Emergency Help section to search for nearby providers.";
    }

    if (text.includes("petrol") || text.includes("fuel") ||
        text.includes("bunk")) {
        return "Choose Petrol Bunk under Services, select your location, and search. Google Maps will show available listings. Call the station to confirm fuel availability.";
    }

    if (text.includes("mechanic") || text.includes("repair")) {
        return "Choose Mechanic Repair to search for nearby workshops. Call a provider to confirm that they can help with your vehicle and ask about labour and call-out charges.";
    }

    if (text.includes("wash") || text.includes("diwali") ||
        text.includes("offer") || text.includes("discount")) {
        return "Visit Offers and choose Car Wash. Any discount shown by a garage should be confirmed directly with that garage before booking.";
    }

    if (text.includes("service") || text.includes("servicing")) {
        return "Choose Vehicle Servicing to find service centres. Ask about the service package, spare parts, labour costs and appointment availability.";
    }

    if (text.includes("book") || text.includes("appointment")) {
        return "Open Book an Appointment, complete the form and submit it. This demo saves the request in your browser only; it does not reserve a real garage appointment.";
    }

    if (text.includes("location") || text.includes("near") ||
        text.includes("distance")) {
        return "Enter your city or area in the location box, or use the location button. Then select a service. Nearby listings open in Google Maps.";
    }

    if (text.includes("hello") || text.includes("hi") ||
        text.includes("hey")) {
        return "Hello! 👋 Welcome to WheelEasyy. I can help you find a petrol bunk, mechanic, car wash, servicing centre or roadside assistance.";
    }

    return "I can help with petrol bunks, mechanics, vehicle servicing, car washes, offers, bookings and roadside assistance. What do you need?";
}

function sendChatMessage(message) {
    const cleanMessage = message.trim();
    if (!cleanMessage) return;

    addChatMessage(cleanMessage, "user");

    const reply = getBotReply(cleanMessage);

    // A small delay makes the demo chat feel more natural.
    window.setTimeout(() => addChatMessage(reply, "bot"), 250);
}

$("#chatForm")?.addEventListener("submit", event => {
    event.preventDefault();

    const input = $("#chatInput");
    if (!input) return;

    const message = input.value.trim();
    if (!message) return;

    input.value = "";
    sendChatMessage(message);
});

$$(".chat-quick-actions button").forEach(button => {
    button.addEventListener("click", () => {
        sendChatMessage(button.dataset.question || button.textContent);
    });
});

/* ---------- FOOTER / STARTUP ---------- */

const yearElement = $("#currentYear");
if (yearElement) yearElement.textContent = new Date().getFullYear();

renderBookings();
setAccountMode("login");

console.log("WheelEasyy demo loaded successfully.");