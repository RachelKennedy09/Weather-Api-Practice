//NOTES: What we are doing:
// Point the hook at a real API
//Show Loading, Error, Empty, and Success states
//Keep the delay configurable

import { useFetchData } from "../hooks/useFetchData.js";

// PURPOSE: This component *consumes* our custom hook to fetch data and render it.
// - it demonstrates ALL UI states: loading, error, empty, success.

export default function PostList() {
  // 1. Choose a real API
  const url = "https://jsonplaceholder.typicode.com/posts";

  //2. Call custom hook

  const { data, loading, error } = useFetchData(url, {}, 1000);

  //3. Small helper to make UI bit nicer
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
        // Using JSONPlaceholder to practice our custom hook fetching pattern.
      </p>

      {/* ✅ Loading state
          - Your hook guarantees at least 1s of loading visibility.
          - This prevents “blink” flicker when the network is very fast. */}
      {loading && <p>Loading…</p>}

      {/* ✅ Error state
          - Clear and visible message.
          - We stringify in case it's an Error object. */}
      {error && (
        <div style={{ color: "crimson", marginTop: 8 }}>
          <strong>Error:</strong> {String(error)}
        </div>
      )}

      {/* ✅ Empty data state
          - Show a friendly message if the API returns an empty array.
          - Only show this when we’re not loading and there’s no error. */}
      {!loading && !error && Array.isArray(data) && data.length === 0 && (
        <p>No results found.</p>
      )}

      {/* ✅ Success state
          - Only render when not loading, no error, and data is a non-empty array. */}
      {!loading &&
        !error &&
        Array.isArray(data) &&
        data.length > 0 &&
        renderPosts(data)}
    </div>
  );
}
