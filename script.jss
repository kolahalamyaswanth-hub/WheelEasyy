function findMechanics() {
    const result = document.getElementById("result");

    result.textContent = "Requesting your location...";

    if (!navigator.geolocation) {
        result.textContent =
            "Sorry, your browser does not support location.";
        return;
    }

    navigator.geolocation.getCurrentPosition(
        function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const mapURL =
                "https://www.google.com/maps/search/mechanics/@" +
                latitude + "," + longitude + ",14z";

            result.innerHTML =
                '📍 Location found! ' +
                '<a href="' + mapURL +
                '" target="_blank" rel="noopener noreferrer">' +
                'View nearby mechanics on Google Maps</a>';
        },
        function () {
            result.textContent =
                "Location access denied or unavailable. " +
                "Please allow location access and try again.";
        }
    );
}