import React, { useState } from "react";
import { useFetchData } from "../hooks/useFetchData";

/*
  PURPOSE (beginner words):
  - Reuse our custom hook to show current weather for a given location.
  - Translate numeric weathercode → friendly label + emoji.
  - Accept props so this works for ANY location/units.
*/

const WMO_CODE_MAP = {
  0: { label: "Clear sky", emoji: "☀️" },
  1: { label: "Mainly clear", emoji: "🌤️" },
  2: { label: "Partly cloudy", emoji: "⛅" },
  3: { label: "Overcast", emoji: "☁️" },
  45: { label: "Fog", emoji: "🌫️" },
  48: { label: "Rime fog", emoji: "🌫️" },
  51: { label: "Light drizzle", emoji: "🌦️" },
  53: { label: "Moderate drizzle", emoji: "🌦️" },
  55: { label: "Dense drizzle", emoji: "🌧️" },
  56: { label: "Light freezing drizzle", emoji: "🌧️❄️" },
  57: { label: "Dense freezing drizzle", emoji: "🌧️❄️" },
  61: { label: "Light rain", emoji: "🌧️" },
  63: { label: "Moderate rain", emoji: "🌧️" },
  65: { label: "Heavy rain", emoji: "🌧️" },
  66: { label: "Light freezing rain", emoji: "🌧️❄️" },
  67: { label: "Heavy freezing rain", emoji: "🌧️❄️" },
  71: { label: "Light snow", emoji: "🌨️" },
  73: { label: "Moderate snow", emoji: "🌨️" },
  75: { label: "Heavy snow", emoji: "❄️" },
  77: { label: "Snow grains", emoji: "❄️" },
  80: { label: "Light rain showers", emoji: "🌦️" },
  81: { label: "Moderate rain showers", emoji: "🌦️" },
  82: { label: "Violent rain showers", emoji: "⛈️" },
  85: { label: "Light snow showers", emoji: "🌨️" },
  86: { label: "Heavy snow showers", emoji: "❄️" },
  95: { label: "Thunderstorm", emoji: "⛈️" },
  96: { label: "Thunderstorm w/ hail", emoji: "⛈️🧊" },
  99: { label: "Severe thunder w/ hail", emoji: "⛈️🧊" },
};

function getWeatherInfo(code, isDay) {
  const base = WMO_CODE_MAP[code] || { label: "Unknown", emoji: "❓" };
  if (!isDay) {
    if (code === 0) return { label: base.label, emoji: "🌙" }; // clear night
    if (code === 1 || code === 2) return { label: base.label, emoji: "🌙☁️" }; // a bit cloudy at night
  }
  return base;
}

function toCardinal(deg) {
  const dirs = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  const idx = Math.round((deg % 360) / 22.5) % 16;
  return dirs[idx];
}

/* ⬇️ UPDATED: accept and use units/timezone from props */
function buildOpenMeteoURL(lat, lon, tempUnit, windUnit, timezone) {
  const qs = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current_weather: "true",
    temperature_unit: tempUnit, // 'celsius' | 'fahrenheit'
    windspeed_unit: windUnit, // 'kmh' | 'ms' | 'mph'
    timezone, // 'auto' or 'America/Edmonton', etc.
  });
  return `https://api.open-meteo.com/v1/forecast?${qs.toString()}`;
}

export default function WeatherNow(props) {
  const {
    placeName = "Lake Louise",
    lat = 51.43,
    lon = -116.18,
    initialDelayMs = 1000,
    tempUnit = "celsius",
    windUnit = "kmh",
    timezone = "auto",
  } = props;

  const [delayMs, setDelayMs] = useState(initialDelayMs);

  // ⬇️ use the updated builder with all props
  const url = buildOpenMeteoURL(lat, lon, tempUnit, windUnit, timezone);
  const { data, loading, error } = useFetchData(url, undefined, delayMs);

  const current = data?.current_weather;
  const info = current
    ? getWeatherInfo(current.weathercode, !!current.is_day)
    : null;
  const windCardinal = current ? toCardinal(current.winddirection) : null;

  // tiny labels for display (we’ll add real toggles in Step 10)
  const tempUnitLabel = tempUnit === "fahrenheit" ? "°F" : "°C";
  const windUnitLabel =
    windUnit === "mph" ? "mph" : windUnit === "ms" ? "m/s" : "km/h";

  return (
    <div style={{ fontFamily: "system-ui", padding: 16, maxWidth: 720 }}>
      {/* ⬇️ use prop, not hard-coded name */}
      <h1>Weather Now — {placeName}</h1>
      <p>// Friendly label + emoji derived from weathercode.</p>

      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "center",
          padding: 12,
          background: "#f6f8fa",
          borderRadius: 8,
          marginTop: 8,
          flexWrap: "wrap",
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

        {/* ⬇️ FIXED: use props `lat`/`lon`, not LAT/LON */}
        <div style={{ fontSize: 14, color: "#333" }}>
          Coords: <strong>{lat.toFixed(2)}</strong>,{" "}
          <strong>{lon.toFixed(2)}</strong>
        </div>
        <div style={{ fontSize: 14, color: "#333" }}>
          Units: <strong>{tempUnitLabel}</strong> •{" "}
          <strong>{windUnitLabel}</strong>
        </div>
      </div>

      {loading && <p style={{ marginTop: 12 }}>Loading current weather…</p>}

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

      {!loading && !error && current && info && (
        <div
          style={{
            marginTop: 12,
            padding: 20,
            background: "#eef6ff",
            border: "1px solid #cfe3ff",
            borderRadius: 14,
            display: "grid",
            gridTemplateColumns: "80px 1fr",
            gap: 16,
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 56, lineHeight: "1" }}>{info.emoji}</div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 600 }}>{info.label}</div>
            <div style={{ fontSize: 36, fontWeight: 700, marginTop: 4 }}>
              {current.temperature}
              {tempUnitLabel}
            </div>
            <div style={{ marginTop: 6 }}>
              Wind: {current.windspeed} {windUnitLabel}
              {windCardinal && ` (${windCardinal} ${current.winddirection}°)`}
            </div>
            <div style={{ marginTop: 2 }}>
              Daytime: {current.is_day ? "Yes" : "No"} • Updated: {current.time}
            </div>
            <div style={{ marginTop: 2, color: "#345" }}>
              Code: {current.weathercode}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
