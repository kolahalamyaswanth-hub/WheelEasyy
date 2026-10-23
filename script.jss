function findMechanics(service = "mechanic")
const serviceSearch = document.getElementById("serviceSearch");

function filterServices(type) {
    const cards = document.querySelectorAll(".service-card");
    const searchInput = serviceSearch.value.toLowerCase().trim();
    let visibleCount = 0;

    cards.forEach(function (card) {
        const text = card.textContent.toLowerCase();

        const matchesSearch = text.includes(searchInput);
        const matchesType =
            type === "all" ||
            (type === "mechanic" && text.includes("mechanic")) ||
            (type === "car wash" && text.includes("car wash")) ||
            (type === "servicing" &&
                (text.includes("servicing") ||
                 text.includes("service center")));

        if (matchesSearch && matchesType) {
            card.style.display = "";
            visibleCount++;
        } else {
            card.style.display = "none";
        }
    });

    document.getElementById("searchMessage").textContent =
        visibleCount + " service option(s) found.";
}

if (serviceSearch) {
    serviceSearch.addEventListener("input", function () {
        filterServices("all");
    });
} {
    if (!navigator.geolocation) {
        alert("Your browser does not support location.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const search = encodeURIComponent(
                service + " near me"
            );

            const mapsURL =
                "https://www.google.com/maps/search/" +
                search +
                "/@" +
                latitude +
                "," +
                longitude +
                ",15z";

            window.open(mapsURL, "_blank");
        },
        function () {
            alert(
                "Location access denied. Please allow location access and try again."
            );
        }
    );
}
/* EMERGENCY ROADSIDE ASSISTANCE */
function findRoadsideHelp() {
    const message = document.getElementById("emergencyMessage");

    if (!navigator.geolocation) {
        message.textContent =
            "Location is not supported. Please search mechanics on Google Maps.";
        window.open(
            "https://www.google.com/maps/search/car+mechanic+near+me/",
            "_blank",
            "noopener"
        );
        return;
    }

    message.textContent = "Getting your location...";

    navigator.geolocation.getCurrentPosition(
        function (position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            message.textContent =
                "Location found. Opening nearby mechanics on Google Maps.";

            const mapUrl =
                "https://www.google.com/maps/search/car+mechanic/@" +
                lat + "," + lon + ",14z";

            window.open(mapUrl, "_blank", "noopener");
        },
        function () {
            message.textContent =
                "Location unavailable. Allow location permission or search manually.";

            window.open(
                "https://www.google.com/maps/search/car+mechanic+near+me/",
                "_blank",
                "noopener"
            );
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
}


/* DEMO LOGIN AND REGISTRATION */
let accountMode = "login";

function showAccountForm(mode) {
    accountMode = mode;

    const nameInput = document.getElementById("accountName");
    const nameLabel = document.getElementById("nameLabel");
    const password = document.getElementById("accountPassword");
    const message = document.getElementById("accountMessage");

    const registering = mode === "register";

    nameInput.hidden = !registering;
    nameLabel.hidden = !registering;
    nameInput.required = registering;

    password.autocomplete = registering
        ? "new-password"
        : "current-password";

    message.textContent = "";
}

document.getElementById("accountForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("accountName").value.trim();
    const email = document.getElementById("accountEmail").value.trim();
    const password = document.getElementById("accountPassword").value;
    const message = document.getElementById("accountMessage");

    if (accountMode === "register" && !name) {
        message.textContent = "Please enter your name.";
        return;
    }

    if (!email || !password) {
        message.textContent = "Please enter your email and password.";
        return;
    }

    if (accountMode === "register") {
        message.textContent =
            "Demo registration successful, " + name +
            "! This is a demonstration, not a real account.";
    } else {
        message.textContent =
            "Demo login successful! Real account verification is not enabled.";
    }

    this.reset();
    showAccountForm("login");
});
/* WHEELEASYY DEMO APPOINTMENT BOOKING */

const bookingDate = document.getElementById("bookingDate");

if (bookingDate) {
    const today = new Date();
    const localToday = new Date(
        today.getTime() - today.getTimezoneOffset() * 60000
    ).toISOString().split("T")[0];

    bookingDate.min = localToday;
}

document.getElementById("bookingForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("bookingName").value.trim();
    const phone = document.getElementById("bookingPhone").value.trim();
    const service = document.getElementById("bookingService").value;
    const date = document.getElementById("bookingDate").value;
    const time = document.getElementById("bookingTime").value;
    const notes = document.getElementById("bookingNotes").value.trim();
    const message = document.getElementById("bookingMessage");

    const selectedDateTime = new Date(date + "T" + time);

    if (selectedDateTime < new Date()) {
        message.textContent = "Please select a future appointment time.";
        return;
    }

    const booking = {
        reference: "WE-" + Date.now().toString().slice(-8),
        name,
        phone,
        service,
        date,
        time,
        notes,
        status: "Demo request — not sent to a shop"
    };

    const bookings = JSON.parse(
        localStorage.getItem("wheeleasyyDemoBookings") || "[]"
    );

    bookings.push(booking);
    localStorage.setItem("wheeleasyyDemoBookings", JSON.stringify(bookings));

    message.textContent =
        "Demo booking created! Reference: " + booking.reference +
        ". No mechanic or shop has been notified.";

    this.reset();
});