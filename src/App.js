import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocalstoragestate } from "./useLocalstoragestate";
import { useKey } from "./useKey";

const Key = "49175365";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

// useEffect(function () { //this was inside app component
//   fetch(`http://www.omdbapi.com/?apikey=${Key}&s=titan`)
//     .then((res) => res.json())
//     .then((data) => setMovies(data.Search));
// }, []);
export default function App() {
  const [query, setQuery] = useState("");
  const [selectedID, setselectedID] = useState(null);

  // const [watched, setWatched] = useState([]);
  const [watched, setWatched] = useLocalstoragestate([]);
  const { movies, isloading, error } = useMovies(query);

  // const [watched, setWatched] = useState(function () {
  //   const storedValue = localStorage.getItem("watched");
  //   return JSON.parse(storedValue);
  // });

  function handelselectMovie(id) {
    // if(id==selectedID)
    setselectedID((selectedID) => (id === selectedID ? null : id));
  }

  function handelclosemovie() {
    setselectedID(null);
  }

  function handelAddwatced(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handeldeletewatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  /*
  useEffect(function () {
    console.log("a");
  }, []);
  useEffect(function () {
    console.log("b");
  });

  console.log("c");
*/

  return (
    <>
      <Navbar>
        <Search query={query} setQuery={setQuery} />

        <NumResults movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {!isloading && !error && (
            <MovieList movies={movies} onselectMovie={handelselectMovie} />
          )}
          {error && <Errormessage message={error} />}
          {isloading && <Loader />}
          {/* {isloading ? <Loader /> : <MovieList movies={movies} />} */}
        </Box>
        <Box>
          {selectedID ? (
            <Moviedatails
              onclosemovie={handelclosemovie}
              selectedID={selectedID}
              onaddwatched={handelAddwatced}
              watched={watched}
            />
          ) : (
            <>
              <WhatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                ondeletewatched={handeldeletewatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Errormessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span>
      {message}
    </p>
  );
}

function Loader() {
  return <p className="loader">loding...</p>;
}

function Navbar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo /> {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Search({ query, setQuery }) {
  // useEffect(function () {
  //   const ele = document.querySelector(".search");
  //   ele.focus();
  // }, []);

  const inputel = useRef(null);
  // useEffect(function () {
  //   inputel.current.focus();
  // }, []);

  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Enter") {
          if (document.activeElement === inputel.current) return;
          inputel.current.focus();
          setQuery("");
        }
      }
      document.addEventListener("keydown", callback);

      return () => document.removeEventListener("keydown", callback);
    },
    [setQuery]
  );

  // useKey("Enter", function () {
  //   if (document.activeElement === inputel.current) return;
  //   inputel.current.focus();
  //   setQuery();
  // });

  return (
    <input
      className="search"
      type="text"
      ref={inputel}
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function WatchedMovieList({ watched, ondeletewatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          ondeletewatched={ondeletewatched}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, ondeletewatched }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>

        <button
          className="btn-delete"
          onClick={() => ondeletewatched(movie.imdbID)}
        >
          x
        </button>
      </div>
    </li>
  );
}

function Moviedatails({ selectedID, onclosemovie, onaddwatched, watched }) {
  const [movie, setmovie] = useState({});
  const [loding, setisloading] = useState(false);
  const [userrating, setuserrating] = useState("");

  const iswatched = watched.map((movie) => movie.imdbID).includes(selectedID);
  const countRef = useRef(0);
  useEffect(
    function () {
      if (userrating) countRef.current++;
    },
    [userrating]
  );

  const watcheduserating = watched.find(
    (movie) => movie.imdbID === selectedID
  )?.userrating;

  // console.log(watcheduserating);
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: realesed,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handeladd() {
    const newwatchedmovie = {
      imdbID: selectedID,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userrating,
      conuntRatingDecision: countRef,
    };

    onaddwatched(newwatchedmovie);
    onclosemovie();
  }

  useKey("escape", onclosemovie);
  // useEffect(
  //   function () {
  //     function callback(e) {
  //       if (e.code === "Escape") onclosemovie();
  //     }
  //     document.addEventListener("keydown", callback);

  //     return function () {
  //       document.removeEventListener("keydown", callback);
  //     };
  //   },
  //   [onclosemovie]
  // );

  useEffect(
    function () {
      async function getmoviedetails() {
        setisloading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${Key}&i=${selectedID}`
        );

        const data = await res.json();
        // console.log(data);
        setisloading(false);
        setmovie(data);
      }
      getmoviedetails();
    },
    [selectedID]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `${title}`;

      return function () {
        document.title = "usepopcorn";
      };
    },
    [title]
  );
  return (
    <div className="details">
      {loding ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={() => onclosemovie()}>
              &larr;
            </button>
            <img src={poster} alt={`poster of ${title}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {realesed} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>🌟</span>
                {imdbRating} IMDB rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!iswatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setuserrating}
                  />
                  {userrating > 0 && (
                    <button className="btn-add" onClick={handeladd}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>you already rated this movie fu {watcheduserating}</p>
              )}
            </div>

            <p>
              <em>{plot}</em>
            </p>
            <p>starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function WhatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}

function MovieList({ movies, onselectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onselectMovie={onselectMovie} />
      ))}
    </ul>
  );
}

function Movie({ movie, onselectMovie }) {
  return (
    <li key={movie.imdbID} onClick={() => onselectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

// function WatchedBox() {
//   const [watched, setWatched] = useState(tempWatchedData);

//   const [isOpen2, setIsOpen2] = useState(true);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
// <>
//   <WhatchedSummary watched={watched} />
//   <WatchedMovieList watched={watched} />
// </>
//       )}
//     </div>
//   );
// }
