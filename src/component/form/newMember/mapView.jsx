import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function ClickableMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return <Marker position={position} />;
}

const MapView = () => {
  const [position, setPosition] = useState([28.6139, 77.2090]); // Default Delhi

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          alert("Location permission denied or unavailable.");
          console.log(err);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };
console.log(position,"position")
  return (
    <div>
      <button
        onClick={handleUseCurrentLocation}
        style={{ marginBottom: "10px", padding: "5px 10px" }}
      >
        Use My Current Location
      </button>
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "200px", width: "100%" }} // small map
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClickableMarker position={position} setPosition={setPosition} />
      </MapContainer>
    </div>
  );
};

export default MapView;
