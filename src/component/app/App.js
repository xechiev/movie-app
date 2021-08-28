/* eslint-disable no-shadow */
/* eslint-disable no-return-await */
/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import { Spin, Tabs, BackTop } from 'antd';
import ApiService from '../../api/ApiService';
import InputSearch from '../inputSearch';
import useDebounce from '../../hooks/useDebounce';
import Context from '../../hooks/context';
import MovieList from '../movieList';
import Pagin from '../pagin';
import ErrorNetwork from '../errorNetwork';
import ErrorNoResult from '../errorNoResult';
import NoRatedMovies from '../noRatedMovies';

import 'antd/dist/antd.css';
import './app.css';

export default function App() {
  const [query, setQuery] = useState(''); 
  const [movies, setMovies] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(false); 
  const [errorNetwork, setErrorNetwork] = useState(false); 
  const [totalMovie, setTotalMovie] = useState(0); 
  const [haveRatedMovie, setHaveRatedMovie] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); 
  const [genresList, setGenresList] = useState([]); 
  const [guestID, setGuestID] = useState(null); 
  const [pagin, setPagin] = useState(true); 
  const [ratedMovie, setRatedMovie] = useState([]);
  const { TabPane } = Tabs;
  const searchDebounce = useDebounce(query.trim(), 650);
  const apiService = new ApiService();

  useEffect(() => {
    apiService.getGuestId().then((res) => setGuestID(res))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    apiService.getGenreList().then((res) => setGenresList(res))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onError = () => {
    setError(true);
    setLoading(false);
    setPagin(false);
  }; 

  const onErrorNetwork = () => {
    setErrorNetwork(true);
    setLoading(false);
    setError(false);
    setPagin(false);
  }; 

  useEffect(() => {
    apiService.getPopularMovies(currentPage).then((data) => {
      setTotalMovie(data.total_results);
      setMovies(data.results);
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage])

  useEffect(() => {
    if (searchDebounce) {
      setErrorNetwork(false);
      setLoading(true);
      apiService.getMovies(searchDebounce, currentPage).then((data) => {
        setTotalMovie(data.total_results);
        if (data.results.length) {
          setLoading(false);
          setError(false);
          setMovies(data.results);
        } else {
          onError();
          setMovies([]);
        }
      }).catch(onErrorNetwork)
    } else {
      setError(false);
      setQuery(query);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDebounce, currentPage])

  const switchTabs = (key) => {
      if (key === '2') {
        apiService.getRatedMovies(guestID).then((data) => {
          setCurrentPage(1);
          setMovies(data.results);
          setTotalMovie(data.total_results);
        })
      } else {
        apiService.getPopularMovies().then((data) => {
          setTotalMovie(data.total_results);
          setMovies(data.results);
          setCurrentPage(1);
        })
      }
  }

  const movieRatingSaved = (item) => {
    const stateRatedMovie = ratedMovie.slice(0);
    stateRatedMovie.push(item);
    setRatedMovie(stateRatedMovie);
  }

  const onChange = (page) => {
    setCurrentPage(page);
  }; 

  return (
    <div className="wrapper">
      <Context.Provider value={{ movies, genresList, guestID, setHaveRatedMovie, movieRatingSaved }}>
        <Tabs defaultActiveKey="1" onChange={switchTabs} className="tabs" centered>
          <TabPane tab="Search" key="1">
            <header>
              {InputSearch(setQuery, setCurrentPage)}
              {loading && <Spin size="large" className="loading" />}
              {error && ErrorNoResult}
              {errorNetwork && ErrorNetwork}
            </header>
            <section>
              {!errorNetwork && <MovieList arr={movies} ratedMovie={ratedMovie} />}
            </section>
            <BackTop />
            <footer>{pagin && Pagin(totalMovie, 1, currentPage, onChange)}</footer>
          </TabPane>
          <TabPane tab="Rated" key="2">
            {haveRatedMovie && NoRatedMovies}
            {errorNetwork && ErrorNetwork}
            <MovieList arr={movies} />
            <footer>{totalMovie > 20 ? Pagin(totalMovie, 1, currentPage, onChange) : ''}</footer>
          </TabPane>
        </Tabs>
      </Context.Provider>
    </div>
  );
}
