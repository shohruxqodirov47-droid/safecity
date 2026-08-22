"use client";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { AlertCircle, Clock, MapPin, ThumbsUp } from "lucide-react";

delete (L.Icon.Default.prototype as any)._getIconUrl;

const createCustomIcon = (color: string, glow: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="${glow}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3" fill="white"/></svg>`;
  return L.divIcon({
    html: svg,
    className: "custom-leaflet-icon",
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

const icons = {
  CRITICAL: createCustomIcon("#ef4444", "#fca5a5"),
  HIGH: createCustomIcon("#f97316", "#fdba74"),
  MEDIUM: createCustomIcon("#eab308", "#fde047"),
  LOW: createCustomIcon("#6b7280", "#9ca3af"),
  SELECTED: createCustomIcon("#eab308", "#fde047"),
};

function LocationSelector({ setLocation }: { setLocation: (loc: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      setLocation([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function MapComponent({ reports, onLocationSelect, selectedLocation }: any) {
  return (
    <>
      <style>{`
        .leaflet-container { touch-action: none !important; cursor: crosshair; background: #0a0a0a; }
        .leaflet-container:active { cursor: grabbing; }
        .custom-leaflet-icon { background: none; border: none; }
        .custom-leaflet-icon svg { filter: drop-shadow(0 2px 8px rgba(0,0,0,0.5)); transition: transform 0.2s ease; }
        .custom-leaflet-icon:hover svg { transform: scale(1.15) translateY(-2px); }
        .leaflet-popup-content-wrapper { border-radius: 16px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5); padding: 0; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); background: #111 !important; }
        .leaflet-popup-content { margin: 0; width: 280px !important; color: white; }
        .leaflet-popup-tip { background: #111 !important; box-shadow: none; }
        .leaflet-control-zoom { border: 1px solid rgba(255,255,255,0.1) !important; border-radius: 12px !important; overflow: hidden; }
        .leaflet-control-zoom a { background: rgba(0,0,0,0.8) !important; color: #eab308 !important; border-color: rgba(255,255,255,0.06) !important; width: 36px !important; height: 36px !important; line-height: 36px !important; font-size: 18px !important; }
        .leaflet-control-zoom a:hover { background: rgba(234,179,8,0.15) !important; }
      `}</style>

      <MapContainer
        center={[41.311081, 69.240562]}
        zoom={13}
        className="w-full h-full absolute inset-0 z-0"
        zoomControl={true}
        scrollWheelZoom={true}
        dragging={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">Carto</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <LocationSelector setLocation={onLocationSelect} />

        {selectedLocation && (
          <Marker position={selectedLocation} icon={icons.SELECTED}>
            <Popup>
              <div className="p-4 text-center bg-[#111]">
                <MapPin className="mx-auto text-yellow-400 mb-2" />
                <h3 className="font-bold text-white text-sm">Yangi Hodisa Joyi</h3>
                <p className="text-[11px] text-white/40 mt-1">Chap paneldagi formani to'ldiring</p>
              </div>
            </Popup>
          </Marker>
        )}

        {reports.map((report: any) => (
          <Marker
            key={report.id}
            position={[report.latitude, report.longitude]}
            icon={icons[report.severityLevel as keyof typeof icons] || icons.MEDIUM}
          >
            <Popup>
              <div className="flex flex-col bg-[#111]">
                <div
                  className={`h-1 w-full ${
                    report.severityLevel === "CRITICAL"
                      ? "bg-red-500"
                      : report.severityLevel === "HIGH"
                      ? "bg-orange-500"
                      : report.severityLevel === "MEDIUM"
                      ? "bg-yellow-400"
                      : "bg-white/20"
                  }`}
                />
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle
                      className={`w-3.5 h-3.5 ${
                        report.severityLevel === "CRITICAL" ? "text-red-400" : "text-yellow-400"
                      }`}
                    />
                    <span className="text-[9px] font-black tracking-wider text-white/40 uppercase">
                      {report.severityLevel}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-sm leading-tight mb-2">{report.title}</h3>
                  <p className="text-[11px] text-white/40 mb-3 line-clamp-3">{report.description}</p>

                  <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.06]">
                    <span className="text-[10px] font-medium text-white/25 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-[9px] font-bold text-yellow-400/60 flex items-center gap-1">
                      <ThumbsUp size={10} /> {report.upvotes || 0}
                    </span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}
