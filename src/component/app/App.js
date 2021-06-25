import React, { useEffect, useState } from 'react';
import SearchInput from '../search-input';
import Movie from '../movie/Movie';

//import { Row, Col} from 'antd';
import 'antd/dist/antd.css';
import './app.css';

const value = 'love';
const KEY_API = '20a8b7a1ea2275c8d7e4524fc410799a';
const SEARCH_MOVIE = `https://api.themoviedb.org/3/search/movie?&api_key=${KEY_API}&query=${value}&page=1`;

function App() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(SEARCH_MOVIE)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.results);
        setMovies(data.results);
      });
  }, []);

  // searchMovies(e) {
  //     const searchValue = e.target.value.trim();
  //     if(searchValue.length) {
  //        this.api.loadAccounts(searchValue).then(res => this.updatedAccounts(res))
  //     } else {
  //       this.clearAccounts();
  //     }
  // }

  return (
    <div className="wrapper">
      <SearchInput />

      {movies.map((movie) => (
        <Movie key={movie.id} {...movie} />
      ))}
    </div>
  );
}

export default App;
