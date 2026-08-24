"use client";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { AlertCircle, Clock, MapPin, ThumbsUp, Navigation } from "lucide-react";

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
  LOW: createCustomIcon("#94a3b8", "#cbd5e1"),
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

function LocateUser({ setLocation }: { setLocation: (loc: [number, number]) => void }) {
  const map = useMap();

  const handleLocate = () => {
    map.locate().on("locationfound", function (e) {
      setLocation([e.latlng.lat, e.latlng.lng]);
      map.flyTo(e.latlng, 16, { duration: 1.5 });
    });
  };

  return (
    <div className="absolute top-[80px] right-[10px] z-[1000]">
      <button
        onClick={(e) => {
          e.preventDefault();
          handleLocate();
        }}
        className="w-[36px] h-[36px] bg-white rounded-xl shadow-md border border-black/10 flex items-center justify-center text-slate-700 hover:text-yellow-600 hover:bg-slate-50 transition-all"
        title="Mening joylashuvim"
      >
        <Navigation className="w-[18px] h-[18px]" />
      </button>
    </div>
  );
}

export default function MapComponent({ reports, onLocationSelect, selectedLocation }: any) {
  return (
    <>
      <style>{`
        .leaflet-container { touch-action: none !important; cursor: crosshair; background: #f8fafc; }
        .leaflet-container:active { cursor: grabbing; }
        .custom-leaflet-icon { background: none; border: none; }
        .custom-leaflet-icon svg { filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3)); transition: transform 0.2s ease; }
        .custom-leaflet-icon:hover svg { transform: scale(1.15) translateY(-2px); }
        .leaflet-popup-content-wrapper { border-radius: 16px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); padding: 0; overflow: hidden; border: 1px solid rgba(0,0,0,0.08); background: #ffffff !important; }
        .leaflet-popup-content { margin: 0; width: 280px !important; color: #0f172a; }
        .leaflet-popup-tip { background: #ffffff !important; box-shadow: none; }
        .leaflet-control-zoom { border: 1px solid rgba(0,0,0,0.1) !important; border-radius: 12px !important; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05) !important;}
        .leaflet-control-zoom a { background: #ffffff !important; color: #0f172a !important; border-color: rgba(0,0,0,0.05) !important; width: 36px !important; height: 36px !important; line-height: 36px !important; font-size: 18px !important; }
        .leaflet-control-zoom a:hover { background: #f8fafc !important; color: #eab308 !important;}
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
          attribution='&copy; Google Maps'
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        />

        <LocationSelector setLocation={onLocationSelect} />
        <LocateUser setLocation={onLocationSelect} />

        {selectedLocation && (
          <Marker position={selectedLocation} icon={icons.SELECTED}>
            <Popup>
              <div className="p-4 text-center bg-white">
                <MapPin className="mx-auto text-yellow-500 mb-2 w-6 h-6" />
                <h3 className="font-bold text-slate-900 text-sm">Yangi Hodisa Joyi</h3>
                <p className="text-[11px] text-slate-500 mt-1">Chap paneldagi formani to'ldiring</p>
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
              <div className="flex flex-col bg-white">
                <div
                  className={`h-1 w-full ${
                    report.severityLevel === "CRITICAL"
                      ? "bg-red-500"
                      : report.severityLevel === "HIGH"
                      ? "bg-orange-500"
                      : report.severityLevel === "MEDIUM"
                      ? "bg-yellow-400"
                      : "bg-slate-300"
                  }`}
                />
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle
                      className={`w-3.5 h-3.5 ${
                        report.severityLevel === "CRITICAL" ? "text-red-500" : "text-yellow-500"
                      }`}
                    />
                    <span className="text-[9px] font-black tracking-wider text-slate-500 uppercase">
                      {report.severityLevel}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm leading-tight mb-2">{report.title}</h3>
                  <p className="text-[11px] text-slate-600 mb-3 line-clamp-3 leading-relaxed">{report.description}</p>

                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
                    <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-[9px] font-bold text-yellow-600 flex items-center gap-1">
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
