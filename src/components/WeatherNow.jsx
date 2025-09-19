import React, { useState } from "react";
import { useFetchData } from "../hooks/useFetchData";

/*
  PURPOSE (beginner words):
  - This component reuses our custom hook to fetch *current weather*
    for Lake Louise using a public API (Open-Meteo).
  - We keep the same 3 states: loading, error, data.
  - We also keep an adjustable "delayMs" (minimum loader time) so
    you can *see* the loading UX difference like in PostList.
*/

// small helper: build the Open-Meteo URL from latitude/longitude
function buildOpenMeteoURL(lat, lon) {
  // "current_weather=true" asks the API for the current conditions.
  // "temperature_unit=celsius" and "windspeed_unit=kmh" for Canada-friendly units.
  // "timezone=auto" makes timestamps match your local timezone.
  return `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius&windspeed_unit=kmh&timezone=auto`;
}

export default function WeatherNow() {
  // Lake Louise, AB (approx coords)
  const LAT = 51.43;     // // why store these? it keeps our URL builder clean
  const LON = -116.18;

  // adjustable minimum loader time, like in Step 5
  const [delayMs, setDelayMs] = useState(1000);

  // build the URL once per render using our helper
  const url = buildOpenMeteoURL(LAT, LON);

  // REUSE our hook 🎉
  // - pass `undefined` for options so we don't create a new {} each render
  // - pass delayMs so the minimum loading time is controllable from the UI
  const { data, loading, error } = useFetchData(url, undefined, delayMs);

  // friendly formatter: safely read fields from the API response
  const current = data?.current_weather; // might be undefined until success

  return (
    <div style={{ fontFamily: "system-ui", padding: 16, maxWidth: 720 }}>
      <h1>Weather Now — Lake Louise</h1>
      <p>// Using Open-Meteo to fetch current weather with our custom hook.</p>

      {/* 🧰 Controls (keep mobile-friendly with a <select>) */}
      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "center",
          padding: 12,
          background: "#f6f8fa",
          borderRadius: 8,
          marginTop: 8,
        }}
      >
        <label>
          <span style={{ display: "block", fontSize: 12, color: "#555" }}>
            Min loader (ms)
          </span>
          <select
            value={delayMs}
            onChange={(e) => setDelayMs(Number(e.target.value))}
            style={{ padding: 6, width: 160 }}
          >
            <option value={0}>0</option>
            <option value={500}>500</option>
            <option value={1000}>1000</option>
            <option value={1500}>1500</option>
            <option value={2000}>2000</option>
          </select>
        </label>
        <div style={{ fontSize: 14, color: "#333" }}>
          Coords: <strong>{LAT.toFixed(2)}</strong>, <strong>{LON.toFixed(2)}</strong>
        </div>
      </div>

      {/* 🔄 Loading state (shows for ≥ delayMs thanks to the hook) */}
      {loading && <p style={{ marginTop: 12 }}>Loading current weather…</p>}

      {/* ❌ Error state (visible, simple) */}
      {error && (
        <div
          style={{
            color: "crimson",
            marginTop: 12,
            padding: 12,
            background: "#ffeef0",
            border: "1px solid #ffd3d6",
            borderRadius: 8,
          }}
        >
          <strong>Error:</strong> {String(error)}
        </div>
      )}

      {/* 🤷 Empty / unexpected shape (defensive) */}
      {!loading && !error && !current && (
        <div
          style={{
            marginTop: 12,
            padding: 12,
            background: "#fffbe6",
            border: "1px solid #ffec99",
            borderRadius: 8,
          }}
        >
          No current weather available.
        </div>
      )}

      {/* ✅ Success state */}
      {!loading && !error && current && (
        <div
          style={{
            marginTop: 12,
            padding: 16,
            background: "#eef6ff",
            border: "1px solid #cfe3ff",
            borderRadius: 8,
          }}
        >
          {/* The Open-Meteo "current_weather" object typically contains:
              - temperature (°C)
              - windspeed (km/h, since we requested kmh)
              - winddirection (degrees)
              - weathercode (number that maps to a condition)
              - is_day (1/0)
              - time (ISO string) */}
          <div style={{ fontSize: 18, marginBottom: 4 }}>
            <strong>Temperature:</strong> {current.temperature}°C
          </div>
          <div>Wind: {current.windspeed} km/h (dir {current.winddirection}°)</div>
          <div>Time: {current.time}</div>
          <div>Daytime: {current.is_day ? "Yes" : "No"}</div>
          <div>Code: {current.weathercode}</div>
        </div>
      )}
    </div>
  );
}
