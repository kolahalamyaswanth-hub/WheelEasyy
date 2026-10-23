function findMechanics(service = "mechanic") {
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
/* ===== WheelEasyy UI Improvements ===== */

html {
    scroll-behavior: smooth;
}

.service-container {
    display: flex;
    justify-content: center;
    align-items: stretch;
    flex-wrap: wrap;
    gap: 25px;
    padding: 25px 15px;
}

.service-card {
    background: white;
    width: 280px;
    padding: 25px;
    border-radius: 18px;
    text-align: center;
    box-shadow: 0 5px 18px rgba(0, 0, 0, 0.10);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.service-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18);
}

.service-card h3 {
    margin-bottom: 15px;
    color: #173b67;
}

.service-card p {
    color: #555;
    line-height: 1.6;
    margin-bottom: 20px;
}

button {
    background: #087cf0;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s ease, transform 0.2s ease;
}

button:hover {
    background: #005ac1;
    transform: scale(1.04);
}

button:active {
    transform: scale(0.97);
}

.services {
    padding: 45px 20px;
    text-align: center;
}

.services > h2 {
    font-size: 32px;
    color: #173b67;
    margin-bottom: 12px;
}

.services > p {
    color: #666;
}