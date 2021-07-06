import React, { useEffect, useState } from 'react';
import { Alert, Spin, Pagination, Input } from 'antd';
import useDebounce from './useDebounce';
import Movie from '../movie/Movie';
import 'antd/dist/antd.css';
import './app.css';

export default function App() {
  const [query, setQuery] = useState('naruto');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorNetwork, setErrorNetwork] = useState(false);
  const [totalMovie, setTotalMovie] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const KEY_API = '20a8b7a1ea2275c8d7e4524fc410799a';

  const searchDebounce = useDebounce(query.trim(), 650);

  useEffect(() => {
    if(searchDebounce) {
      setLoading(true);
      searchMovie(searchDebounce).then(data => {
        setTotalMovie(data.total_results)
        if(data.results.length) {
          setLoading(false)
          setError(false)
          setMovies(data.results)
        } else {
          onError()
          setMovies([])
        }
      });
    } else {
      setError(false)
      setQuery(query)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDebounce]);

  const onError = () => {
    setError(true);
    setLoading(false)
  }

  const onErrorNetwork = () => {
    setErrorNetwork(true)
    setLoading(false) 
    setError(false)
    setMovies([])
  }

  const searchMovie = async (search, page = 1) => {
    const searchString = `https://api.themoviedb.org/3/search/movie?api_key=${KEY_API}&query=${search}&page=${page}`;
    return await fetch(searchString)
      .then(res => res.json())
      .then(res => res)
      .catch(onErrorNetwork)
  }

  const onChange = async (pageNumber, query) => {
    const searchString = `https://api.themoviedb.org/3/search/movie?api_key=${KEY_API}&query=${query}&page=${pageNumber}`;
    return await fetch(searchString)
      .then(res => res.json())
      .then(data => {
        setMovies(data.results)
        setCurrentPage(pageNumber)
      })
  }

  return (
    <div className="wrapper">
      <header>
        <Input type='text' className="search-input" onChange={(e) => setQuery(e.target.value)}/>
        { loading && <Spin size="large" className="loading" />}
        { error && 
          <Alert className="error" message="Error! Поиск не дал результатов." 
          type="error" showIcon closable/>}
        {errorNetwork && 
          <Alert className="error" message="Warning! Нет подключения к сети." 
          type="warning" showIcon closable />}
      </header>
      <section>
        { movies.map(movie => (<Movie key={movie.id} {...movie}/>)) }
      </section>
      <footer>
        { totalMovie > 20 ?
          <Pagination total={totalMovie - 10} current={currentPage} 
            onChange={(page) => onChange(page, query)} /> : ""
        }  
      </footer>  
    </div> 
  )
}

