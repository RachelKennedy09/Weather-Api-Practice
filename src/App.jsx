import PostList from "./components/PostList.jsx";
import WeatherNow from "./components/WeatherNow.jsx";

/*
  PURPOSE:
  - Keep practicing both endpoints on one screen for comparison.
  - You can comment out <PostList /> later if you want only weather.
*/

export default function App() {
  return (
    <>
      <PostList />
      <hr style={{ margin: "24px 0" }} />
      <WeatherNow />
    </>
  );
}
