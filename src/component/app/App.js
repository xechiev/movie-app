/* eslint-disable no-shadow */
/* eslint-disable no-return-await */
/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import { Spin, Tabs, BackTop } from 'antd';
import ApiService from '../../api/ApiService';
import InputSearch from '../inputSearch';
import useDebounce from '../../hooks/useDebounce';
import Context from '../../hooks/context';
import MovieList from '../movie-list';
import Pagin from '../pagin';
import ErrorNetwork from '../errorNetwork';
import ErrorNoResult from '../errorNoResult';
import NoRatedMovies from '../noRatedMovies';

import 'antd/dist/antd.css';
import './app.css';

const apiService = new ApiService();

export default function App() {
  const [query, setQuery] = useState('naruto'); // запрос input
  const [movies, setMovies] = useState([]); // массив фильмов
  const [ratedMovies, setRatedMovies] = useState([]); // массив оцененных фильмов
  const [loading, setLoading] = useState(false); // спиннер
  const [error, setError] = useState(false); // ошибка результата поиска
  const [errorNetwork, setErrorNetwork] = useState(false); // ошибка сети
  const [totalMovie, setTotalMovie] = useState(0); // количество фильмов в запросе
  const [totalRatedMovie, setTotalRatedMovie] = useState(0); // количество оцененных фильмов в запросе
  const [haveRatedMovie, setHaveRatedMovie] = useState(true); // показатель оцененных фильмов(да/нет)
  const [currentPage, setCurrentPage] = useState(1); // текущая страница основных фильмов
  const [currentRatedPage, setCurrentRatedPage] = useState(1); // текущая страница оцененных фильмов
  const [genresList, setGenresList] = useState([]); // массив жанров
  const [guestID, setGuestID] = useState(null); // гостевой индетификатор(id)
  const [pagin, setPagin] = useState(true); // показатель пагинатора (boolean)
  const [tab, setTab] = useState('1'); // показатель активного таба
  const { TabPane } = Tabs;
  const searchDebounce = useDebounce(query.trim(), 650); // ф-я debounce  

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
  }; // ф-я ошибки поиска

  const onErrorNetwork = () => {
    setErrorNetwork(true);
    setLoading(false);
    setError(false);
    setPagin(false);
  }; // ф-я ошибки сети

  useEffect(() => {
    if (searchDebounce) {
      setLoading(true);
      apiService.getMovies(searchDebounce).then((data) => {
        setTotalMovie(data.total_results);
        if (data.results.length) {
          setCurrentPage(1);
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
  }, [searchDebounce])

  const onChange = (page, query) => {
    apiService.getNextPage(page, query)
    .then((data) => {
      setMovies(data.results);
      setCurrentPage(page);
    })
  }; // ф-я пагинации

  const callback = (key) => {
    setTab(key);
  }

  useEffect(() => {
    if (tab === '2') {
      apiService.getRatedMovies(guestID)
      .then((data) => {
        setRatedMovies(data.results);
        setTotalRatedMovie(data.total_results);
        setCurrentRatedPage(data.page);
        setHaveRatedMovie(false);
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])
  
  return (
    <div className="wrapper">
      <Context.Provider value={{ movies, ratedMovies, genresList, guestID }}>
        <Tabs defaultActiveKey="1" onChange={callback} className="tabs" centered>
          <TabPane tab="Search" key="1">
            <header>
              {InputSearch(setQuery)}
              {loading && <Spin size="large" className="loading" />}
              {error && ErrorNoResult}
              {errorNetwork && ErrorNetwork}
            </header>
            <section>
              {!errorNetwork && <MovieList arr={movies} />}
            </section>
            <BackTop />
            <footer>{pagin && Pagin(totalMovie, 1, currentPage, onChange, query)}</footer>
          </TabPane>
          <TabPane tab="Rated" key="2">
            {haveRatedMovie && NoRatedMovies}
            <MovieList arr={ratedMovies} />
            <footer>{totalRatedMovie > 20 ? Pagin(totalRatedMovie, 1, currentRatedPage, guestID) : ''}</footer>
          </TabPane>
        </Tabs>
      </Context.Provider>
    </div>
  );
}
