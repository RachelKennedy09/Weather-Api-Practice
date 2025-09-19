//NOTES: What we are doing:

// - Let the user choose how long the loading spinner should stay visible.
// - We pass this "delayMs" into our custom hook as the 3rd argument.
// - Point the hook at a real API
// - Show Loading, Error, Empty, and Success states
// - Keep the delay configurable
import { useState } from "react";
import { useFetchData } from "../hooks/useFetchData.js";

// PURPOSE: This component *consumes* our custom hook to fetch data and render it.
// - it demonstrates ALL UI states: loading, error, empty, success.

export default function PostList() {
  // Control the minimum visible loading time (in milliseconds).
  //    1000ms (1 second)
  const [delayMs, setDelayMs] = useState(1000);

  // Choose a real API
  const url = "https://jsonplaceholder.typicode.com/posts";

  // Call custom hook

  const { data, loading, error } = useFetchData(url, undefined, delayMs);

  // Small helper to render the list (first t0 items)
  const renderPosts = (posts) => {
    //only renders if its an array
    if (!Array.isArray(posts)) return null;

    // we’ll show the first 10 to keep the list short
    return (
      <ul style={{ marginTop: 12, lineHeight: 1.6 }}>
        {posts.slice(0, 10).map((post) => (
          <li key={post.id}>
            <strong>#{post.id}</strong> {post.title}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div style={{ fontFamily: "system-ui", padding: 16, maxWidth: 720 }}>
      <h1>Post List (Practice)</h1>
      <p>
        // Pick how long the loader stays visible, then watch the difference.
      </p>
      {/* Delay control (mobile-friendly <select>) */}
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
            onChange={(e) => setDelayMs(Number(e.target.value))} // keep it a number
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
          Current: <strong>{delayMs} ms</strong>
        </div>
      </div>
      {/* Loading state
          - hook guarantees at least 1s of loading visibility.
          - This prevents “blink” flicker when the network is very fast. */}
      {loading && <p style={{ marginTop: 12 }}>Loading…</p>}

      {/* Error state
          - Clear and visible message.
          - We stringify in case it's an Error object. */}
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

      {/* Empty data state
          - Show a friendly message if the API returns an empty array.
          - Only show this when we’re not loading and there’s no error. */}
      {!loading && !error && Array.isArray(data) && data.length === 0 && (
        <div
          style={{
            marginTop: 12,
            padding: 12,
            background: "#fffbe6",
            border: "1px solid #ffec99",
            borderRadius: 8,
          }}
        >
          No results found.
        </div>
      )}
      {/* Success state
          - Only render when not loading, no error, and data is a non-empty array. */}
      {!loading &&
        !error &&
        Array.isArray(data) &&
        data.length > 0 &&
        renderPosts(data)}
    </div>
  );
}
