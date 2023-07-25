import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import StarRating from "./StarRating";
// import "./index.css";
// import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
function Text() {
  const [movieRating, setMovieRating] = useState(0);

  return (
    <div>
      <StarRating color="blue" maxRating={10} onSetRating={setMovieRating} />
      <p>the movie is rated {movieRating}</p>
    </div>
  );
}

root.render(
  <React.StrictMode>
    <StarRating
      maxRating={5}
      messages={["terrible", "bad", "okay", "good", "amazing"]}
      color="red"
      defaultRating={3}
    />
    <StarRating size={24} className="test" />
    <Text />
    {/* <StarRating maxRating={10} />
    <StarRating /> */}
    {/* <App /> */}
  </React.StrictMode>
);
