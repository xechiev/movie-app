import React from "react";

import './movie.css';
import 'antd/dist/antd.css'

const SEARCH_IMG = 'https://image.tmdb.org/t/p/w1280'

const Movie = ({ backdrop_path, title, overview, vote_average, release_date }) => {

    return (
        <div className="movie">
            <img className="poster" src={SEARCH_IMG + backdrop_path}  alt={title} />
            <div className="info">
                <h2>{title}</h2>
                <span className="rating"><p className="ratingNumber">{vote_average}</p></span>
                <p className="releaseData">{release_date}</p>
                <span className="genre">Action</span>
                <p className="describe">{overview}</p>
            </div>
        </div>
    )
}


export default Movie;

