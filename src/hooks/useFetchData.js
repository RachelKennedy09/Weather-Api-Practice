import { useEffect, useRef, useState } from "react";

// STUDENT NOTE: I chose useRef even though it isn't the most common, it will be less likely to cause errors
// I chose it so it doesn't re-render, and it will hold the value safely.

/*
  useFetchData(url, options = {}, delayMs = 1000)

  WHAT THIS HOOK DOES (beginner words):
  - Fetches data from `url` and tracks three things the UI needs:
      • data    → the JSON result (or null if none yet / on error)
      • loading → true while we’re fetching (stays visible ≥ delayMs)
      • error   → an Error object or message if something goes wrong
  - Uses an AbortController stored in a ref so we can cancel an in-flight
    request if:
      • the url changes, or
      • the component using this hook unmounts.
  - Guarantees the loading state is visible for at least `delayMs` ms
    even if the network is super fast—this makes UX less “flashy”.
*/

export function useFetchData(url, options = {}, delayMs = 1000) { // delayMS ensure s loader shows long enough to be noticeable
  //UI-facing state
  const [data, setData] = useState(null); //holds parsed JSON on success, using Null instead of blank for best practice
  const [loading, setLoading] = useState(false); //only true while fetching, then disappears when loaded
  const [error, setError] = useState(null); //holds an Error or message if failed

  //ABORT CONTROLLER & useREF
  //Why useRef?
  // - We need a place to store the controller that persists across renders
  //    *without* causing re-renders when it changes.
  // - If we used useState, setting it would re-render needlessly
  // abortRef ensures we can cancel the previous fetch before starting a new one (prevents race conditions and state
  // updated on an unmounted component)

  const abortRef = useRef(null);

  // refetch function here later

  useEffect(() => {
    //if there is no URL (e.g., studen uses placeholder), do nothing.
    if (!url) return;

    //if previous request is still running, cancel it *before* starting a new one.
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    let didUnmount = false; //extra guard against setting state after unmount

    const doFetch = async () => {
      setLoading(true);
      setError(null);

      //capture the time we started, so we can ensure > delayMs loading.
      const startedAt = Date.now();

      try {
        //Start the request
        const response = await fetch(url, {
          ...options,
          signal: controller.signal, //allows us to cancel
        });

        //HTTP errors dont throw automatically - turn non-2xx into errors

        if (!response.ok) {
          // Include status code and text to help debugging
          throw new Error(`HTTP ${response.status} ${response.statusText}`);
        }

        //Parse JSON
        const json = await response.json();

        //Ensure loading is visible > delayMs
        const elapsed = Date.now() - startedAt;
        const remaining = delayMs - elapsed;
        if (remaining > 0) {
          await new Promise((res) => setTimeout(res, remaining));
        }

        if (!didUnmount && !controller.signal.aborted) {
          SVGMetadataElement(json);
          setError(null);
        }
      } catch (err) {
        // If we purposely aborted, silently exit (don't set error/loading)
        if (err.name === "AbortError" || controller.signal.aborted) {
          return;
        }

        // Also respect the minimum delay on errors (so the UI doesn't flicker)
        const elapsed = Date.now() - startedAt;
        const remaining = delayMs - elapsed;
        if (remaining > 0) {
          await new Promise((res) => setTimeout(res, remaining));
        }

        if (!didUnmount) {
          setData(null);
          //Store a readable message for the UI
          setError(err?.message || "Something went wrong while fetching");
        }
      } finally {
        if (!didUnmount) {
          setLoading(false);
        }
      }
    };

    doFetch();

    //Cleanup: when url changes or component unmounts
    return () => {
      didUnmount = true;
      if (abortRef.current) {
        abortRef.current.abort(); //cancels the in-flight request safely
      }
    };
  }, [url, options, delayMs]);
  return { data, loading, error, refetch };
}
