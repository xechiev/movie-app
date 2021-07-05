import React from 'react';
import { format } from 'date-fns';
//import { Alert } from 'antd';
import './movie.css';
import 'antd/dist/antd.css';

const SEARCH_IMG = 'https://image.tmdb.org/t/p/w1280';

const Movie = ({ backdrop_path, title, overview, vote_average, release_date }) => {
  let raiting = ['rating'];

  if(!release_date) {
    release_date = "1992-03-08"
  }

  if(vote_average < 3) {
    raiting.push('cirrcleColor1')
  } else if(vote_average >= 3 && vote_average < 5) {
    raiting.push('cirrcleColor2')
  } else if(vote_average >= 5 && vote_average < 7) {
    raiting.push('cirrcleColor3')
  } else {
    raiting.push('cirrcleColor4')
  }

  return (
    <div className="movie">
      <img className="poster" src={SEARCH_IMG + backdrop_path} alt={title} />
      <div className="info">
        <h2>{title}</h2>
        <span className={raiting.join(' ')}>
          <p className="ratingNumber">{vote_average}</p>
        </span>
        <p className="releaseData">{format(new Date(release_date), 'PP')}</p> 
        <span className="genre">Action</span>
        <p className="describe">{overview}</p>
      </div>
    </div>
  );
};

export default Movie;

