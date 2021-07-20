/* eslint-disable no-shadow */
/* eslint-disable no-return-await */
/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import { Spin, Pagination, Input, Tabs, BackTop } from 'antd';
import DOMEN from '../api/domen';
import KEY_API from '../api/key-api';
import useDebounce from '../hooks/useDebounce';
import Context from '../hooks/context';
import Movie from '../movie/Movie';
import Rated from '../rated';
import ErrorNetwork from '../support-func/error-warning';
import ErrorNoResult from '../support-func/error-no-result';

import 'antd/dist/antd.css';
import './app.css';

export default function App() {
  const [query, setQuery] = useState('first');
  const [movies, setMovies] = useState([]);
  const [ratedMovies, setRatedMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorNetwork, setErrorNetwork] = useState(false);
  const [totalMovie, setTotalMovie] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [genresList, setGenresList] = useState([]);
  const [guestID, setGuestID] = useState(null);
  const { TabPane } = Tabs;

  const searchDebounce = useDebounce(query.trim(), 650);

  useEffect(() => {
    fetch(`${DOMEN}/genre/movie/list?api_key=${KEY_API}`)
      .then((res) => {
        if (res.ok) {
          res.json().then((res) => setGenresList(res.genres));
        } else {
          throw new Error(`Возникла ошибка ${res.status}`);
        }
      })
  }, []);

  useEffect(() => {
    fetch(`${DOMEN}/authentication/guest_session/new?api_key=${KEY_API}`)
      .then((res) => {
        if (res.ok) {
          res.json().then((res) => setGuestID(res.guest_session_id));
        } else {
          throw new Error(`Возникла ошибка ${res.status}`);
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onError = () => {
    setError(true);
    setLoading(false);
  };

  const onErrorNetwork = () => {
    setErrorNetwork(true);
    setLoading(false);
    setError(false);
    setMovies([]);
  };

  const searchMovie = async (search, page = 1) => {
    const searchString = `${DOMEN}/search/movie?api_key=${KEY_API}&query=${search}&page=${page}`;
    return await fetch(searchString)
      .then((res) => res.json())
      .then((res) => res)
      .catch(onErrorNetwork);
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
      });
    } else {
      setError(false);
      setQuery(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDebounce]);

  const onChange = async (pageNumber, query) => {
    const searchString = `${DOMEN}/search/movie?api_key=${KEY_API}&query=${query}&page=${pageNumber}`;
    return await fetch(searchString)
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.results);
        setCurrentPage(pageNumber);
      });
  };

  const callback = (key) => key;

  const getRatedMovie = async (guestID, KEY_API) => {
    const ratedMovieURL = `${DOMEN}/guest_session/${guestID}/rated/movies?api_key=${KEY_API}&language=en-US&sort_by=created_at.asc`;
    await fetch(ratedMovieURL).then((res) => {
      if (res.ok) {
        res.json().then((res) => setRatedMovies(res.results));
      } else {
        throw new Error(`Возникла ошибка ${res.status}`);
      }
    });
  };

  return (
    <div className="wrapper">
      <Context.Provider value={{ 
        genresList, guestID, getRatedMovie,
        }}
      >
        <Tabs defaultActiveKey="1" onChange={callback} className="tabs" centered>
          <TabPane tab="Search" key="1">
            <header>
              <Input 
                type="text" 
                className="search-input" 
                onChange={(e) => setQuery(e.target.value)} 
                placeholder="Type to search..." 
              />
              {loading && <Spin size="large" className="loading" />}
              {error && ErrorNoResult}
              {errorNetwork && ErrorNetwork}
            </header>
            <section>
              {movies.map((movie) => (
                <Movie key={movie.id} {...movie} />
              ))}
              <BackTop />
            </section>
            <footer>
              {totalMovie > 20 ? (
                <Pagination
                  total={totalMovie - 10}
                  defaultCurrent={1}
                  current={currentPage}
                  onChange={(page) => onChange(page, query)}
                  className="pagination"
                />
              ) : (
                ''
              )}
            </footer>
          </TabPane>
          <TabPane tab="Rated" key="2">
            <section>
              {ratedMovies.map((movie) => (
                <Rated key={movie.id} {...movie} />
              ))}
            </section>
          </TabPane>
        </Tabs>
      </Context.Provider>
    </div>
  );
}
