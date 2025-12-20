"use client"

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import L from 'leaflet'

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface StoreMapProps {
    storeName: string
    location: string
    coordinates?: [number, number] // [lat, lng]
}

export function StoreMap({ storeName, location, coordinates }: StoreMapProps) {
    const [mounted, setMounted] = useState(false)

    // Default coordinates (you can geocode the address in a real app)
    const defaultCoords: [number, number] = coordinates || [40.7128, -74.0060] // NYC default

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center text-muted-foreground text-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/30 dark:to-green-900/30" />
                <div className="relative z-10 text-center">
                    <MapPin className="h-8 w-8 mx-auto mb-2" />
                    <p className="font-medium">{location}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="aspect-video rounded-lg mb-4 overflow-hidden">
            <MapContainer
                center={defaultCoords}
                zoom={15}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={defaultCoords}>
                    <Popup>
                        <strong>{storeName}</strong>
                        <br />
                        {location}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    )
}
