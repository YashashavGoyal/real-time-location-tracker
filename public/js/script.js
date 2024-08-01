const socket = io();

// Emiting Location
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            // sending location to backend
            socket.emit("send-location", { latitude, longitude });
        },
        (error) => {
            console.error(error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    );
}

// Creating Map
const map = L.map("map").setView([0,0],10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribute: "Realtime Location Tracker"
}).addTo(map);


// Creating Marker
const markers = {};

socket.on("receive-location", (data)=>{
    const {id, latitude, longitude} = data;
    map.setView([latitude, longitude], 16);

    if (markers[id]) {
        markers[id].setLatLag([latitude, longitude]);
    }
    else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
})

// handling disconnect
socket.on("user-disconnected", (id)=> {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})