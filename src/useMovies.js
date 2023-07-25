import { useState, useEffect } from "react";
const Key = "49175365";
export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isloading, setisloading] = useState(false);
  const [error, seterror] = useState("");
  useEffect(
    function () {
      //   callback?.();
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setisloading(true);
          seterror("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${Key}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("somrthing went wrong with fetching movies");

          const data = await res.json();
          // console.log(res);

          if (data.Response === "False") throw new Error("movie not found");

          setMovies(data.Search);
          seterror("");
          // console.log(data.Search);
        } catch (err) {
          // console.log(err.message);
          if (err.name !== "AbortError") seterror(err.message);
          // seterror(err.message);
        } finally {
          setisloading(false);
        }
      }

      if (query.length < 2) {
        setMovies([]);
        seterror("");
        return;
      }
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isloading, error };
}
