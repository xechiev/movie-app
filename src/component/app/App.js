/* eslint-disable no-shadow */
/* eslint-disable no-return-await */
/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import { Spin, Tabs, BackTop } from 'antd';
import InputSearch from '../input';
import DOMEN from '../api/domen';
import KEY_API from '../api/key-api';
import useDebounce from '../hooks/useDebounce';
import Context from '../hooks/context';
import Movie from '../movie/Movie';
import Pagin from '../support-func/pagination';
import Rated from '../rated';
import ErrorNetwork from '../support-func/error-warning';
import ErrorNoResult from '../support-func/error-no-result';
import NoRatedMovies from '../support-func/alert';

import 'antd/dist/antd.css';
import './app.css';

export default function App() {
  const [query, setQuery] = useState('return'); // запрос input
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

  const { TabPane } = Tabs;

  const searchDebounce = useDebounce(query.trim(), 650); // ф-я debounce

  useEffect(() => {
    fetch(`${DOMEN}/genre/movie/list?api_key=${KEY_API}`).then((res) => {
      if (res.ok) {
        res.json().then((res) => setGenresList(res.genres));
      } else {
        throw new Error(`Возникла ошибка ${res.status}`);
      }
    });
  }, []); // получение массива жанров

  useEffect(() => {
    fetch(`${DOMEN}/authentication/guest_session/new?api_key=${KEY_API}`).then((res) => {
      if (res.ok) {
        res.json().then((res) => setGuestID(res.guest_session_id));
      } else {
        throw new Error(`Возникла ошибка ${res.status}`);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // получение гостевого id

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

  const searchMovie = async (search, page = 1) => {
    const searchString = `${DOMEN}/search/movie?api_key=${KEY_API}&query=${search}&page=${page}`;
    return await fetch(searchString)
    .then((res) => {
      if (res.ok) {
        setErrorNetwork(false);
      }
     return res.json()
    })
    .then((res) => res)
    .catch(onErrorNetwork)
  };

  useEffect(() => {
    if (searchDebounce) {
      setLoading(true);
      searchMovie(searchDebounce).then((data) => {
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
      }).catch((e) => console.error('Ошибка сети', e.message))
    } else {
      setError(false);
      setQuery(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDebounce]); // получение массива фильмов и настройка остальных показателей

  const onChange = async (pageNumber, query) => {
    const searchString = `${DOMEN}/search/movie?api_key=${KEY_API}&query=${query}&page=${pageNumber}`;
    return await fetch(searchString)
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.results);
        setCurrentPage(pageNumber);
      });
  }; // ф-я пагинации

  const callback = (key) => key;

  const getRatedMovie = async (guestID, KEY_API, pageNum = 1) => {
    const ratedMovieURL = `${DOMEN}/guest_session/${guestID}/rated/movies?api_key=${KEY_API}&page=${pageNum}&language=en-US&sort_by=created_at.asc`;
    await fetch(ratedMovieURL).then((res) => {
      if (res.ok) {
        res.json().then((res) => {
          setRatedMovies(res.results);
          setTotalRatedMovie(res.total_results);
          setCurrentRatedPage(pageNum);
          setHaveRatedMovie(false);
        });
      } else {
        throw new Error(`Возникла ошибка ${res.status}`);
      }
    });
  }; // ф-я получения оцененных фильмов и пагинация

  return (
    <div className="wrapper">
      <Context.Provider value={{ genresList, guestID, getRatedMovie }}>
        <Tabs defaultActiveKey="1" onChange={callback} className="tabs" centered>
          <TabPane tab="Search" key="1">
            <header>
              {InputSearch(setQuery)}
              {loading && <Spin size="large" className="loading" />}
              {error && ErrorNoResult}
              {errorNetwork && ErrorNetwork}
            </header>
            <ul>
              {!errorNetwork &&
                movies.map((movie) => {
                  movie.rating = 0;
                  ratedMovies.map((movie2) => {
                    if (movie.id === movie2.id) {
                      movie.rating = movie2.rating;
                    }
                    return movie.rating
                  }) 
                  return <Movie key={movie.id} {...movie} />;
                })}
            </ul>
            <BackTop />
            <footer>{pagin && Pagin(totalMovie, 1, currentPage, onChange, query)}</footer>
          </TabPane>
          <TabPane tab="Rated" key="2">
            {haveRatedMovie && NoRatedMovies}
            <ul>
              {ratedMovies.map((movie) => (
                <Rated key={movie.id} {...movie} />
              ))}
            </ul>
            <footer>{totalRatedMovie > 20 ? Pagin(totalRatedMovie, 1, currentRatedPage, getRatedMovie, guestID, KEY_API) : ''}</footer>
          </TabPane>
        </Tabs>
      </Context.Provider>
    </div>
  );
}
