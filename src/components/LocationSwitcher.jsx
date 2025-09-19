import React from "react";

/*
  PURPOSE (beginner words):
  - A tiny, reusable dropdown that lets the user pick a location by name.
  - It doesn't know about coordinates—parent passes a list of names (options),
    the current value, and a callback to change it.
  - Keeping this "dumb" makes it easy to test and reuse.
*/

export default function LocationSwitcher({ options = [], value, onChange }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", fontSize: 12, color: "#555" }}>
        Location
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)} // send the selected key to parent
        style={{ padding: 8, width: 220, borderRadius: 8 }}
      >
        {options.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </label>
  );
}
