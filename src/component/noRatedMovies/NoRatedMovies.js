import React from 'react';
import { Alert } from 'antd';

import 'antd/dist/antd.css';

const NoRatedMovies = (
  <Alert
    type="info"
    message="Вы не поставили рейтинг понравившимся фильмам. После оценки - они появятся здесь."
    className="ratedError"
    icon
    showIcon
  />
);

export default NoRatedMovies;
