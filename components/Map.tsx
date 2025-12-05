"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function Map() {
  const { position, loading } = useGeolocation();

  if (loading) return <p>Cargando ubicación...</p>;
  if (!position) return <p>No se pudo obtener la ubicación.</p>;

  return (
    <MapContainer
      center={[position.lat, position.lng] as [number, number]}
      zoom={16}
      style={{ height: "420px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <Marker
        position={[position.lat, position.lng] as [number, number]}
        icon={markerIcon}
      >
        <Popup>Estás aquí</Popup>
      </Marker>
    </MapContainer>
  );
}
