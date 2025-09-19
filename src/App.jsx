import React, { useState } from "react";
import WeatherNow from "./components/WeatherNow.jsx";
import LocationSwitcher from "./components/LocationSwitcher.jsx";

/*
  PURPOSE:
  - Keep the list of available locations in ONE place (single source of truth).
  - Store just the *key* (name) in state; look up coords/timezone when rendering.
  - Pass simple, stable primitives (strings/numbers) down to WeatherNow as props.
*/

// Single source of truth for locations (Canada-focused for you)
const LOCATIONS = {
  "Lake Louise": {
    placeName: "Lake Louise",
    lat: 51.43,
    lon: -116.18,
    timezone: "America/Edmonton",
  },
  "Prince George": {
    placeName: "Prince George",
    lat: 53.92,
    lon: -122.75,
    timezone: "America/Vancouver",
  },
  Banff: {
    placeName: "Banff",
    lat: 51.18,
    lon: -115.57,
    timezone: "America/Edmonton",
  },
  Vancouver: {
    placeName: "Vancouver",
    lat: 49.28,
    lon: -123.12,
    timezone: "America/Vancouver",
  },
  Toronto: {
    placeName: "Toronto",
    lat: 43.65,
    lon: -79.38,
    timezone: "America/Toronto",
  },
};

function App() {
  // Keep just the *key* (string) in state—nice and stable
  const [locKey, setLocKey] = useState("Lake Louise");

  // Look up the current location details from our dictionary
  const active = LOCATIONS[locKey];

  // Safety check: if somehow missing, fall back to Lake Louise
  const { placeName, lat, lon, timezone } = active ?? LOCATIONS["Lake Louise"];

  return (
    <div
      style={{
        fontFamily: "system-ui",
        padding: 16,
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      <h1>Weather Practice</h1>
      <p>// Switch locations and watch the card update using the same hook.</p>

      {/* Controls row */}
      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "flex-end",
          padding: 12,
          background: "#f6f8fa",
          borderRadius: 8,
          marginTop: 8,
          flexWrap: "wrap",
        }}
      >
        <LocationSwitcher
          options={Object.keys(LOCATIONS)} // pass the names
          value={locKey}
          onChange={setLocKey} // set the chosen key
        />
      </div>

      {/* The parameterized weather card */}
      <div style={{ marginTop: 16 }}>
        <WeatherNow
          key={locKey}
          placeName={placeName}
          lat={lat}
          lon={lon}
          timezone={timezone}
          initialDelayMs={1000} // default; you can change in UI inside the card
          tempUnit="celsius"
          windUnit="kmh"
        />
      </div>
    </div>
  );
}

export default App;
