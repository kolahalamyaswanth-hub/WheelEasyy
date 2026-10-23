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