import React from 'react';

const SearchGenreMovie = (genre_id, genreses) => {
  const result = [];
  for (let i = 0; i < genre_id.length; i++) {
    const element = genre_id[i];
    for (let j = 0; j < genreses.length; j++) {
      const item = genreses[j];
      if (item.id === element) {
        result.push(
          <span key={item.id} className="genre">
            {item.name}
          </span>,
        );
      }
    }
  }
  return result;
};

export default SearchGenreMovie
