export default class ApiService {
  _domain = 'https://api.themoviedb.org/3/';

  _key = '20a8b7a1ea2275c8d7e4524fc410799a';

  _img = 'https://image.tmdb.org/t/p/w1280';

  _posterDefault = 'http://i.mycdn.me/i?r=AzEPZsRbOZEKgBhR0XGMT1Rk6UAY5ln4nsFhs3LG0wAZcKaKTM5SRkZCeTgDn6uOyic';

  async getResourse(url) {
    const res = await fetch(`${this._domain}${url}`);

    if (!res.ok) {
      throw new Error(`Возникла ошибка ${res.status}`);
    }
    // eslint-disable-next-line no-return-await
    return await res.json();
  }

  async getGuestId() {
    const res = await this.getResourse(`authentication/guest_session/new?api_key=${this._key}`);
    const req = await res.guest_session_id;
    return req;
  }

  async getGenreList() {
    const res = await this.getResourse(`genre/movie/list?api_key=${this._key}`);
    const req = await res.genres;
    return req
  }

  async getPopularMovies(page = 1) {
    const res = await this.getResourse(`movie/popular?api_key=${this._key}&language=en-US&page=${page}`);
    return res;
  }

  async getMovies(query, page = 1) {
    const res = await this.getResourse(`search/movie?api_key=${this._key}&query=${query}&page=${page}`);
    return res;
  }

  async getRatedMovies(guestID, page = 1) {
    const res = await this.getResourse(`guest_session/${guestID}/rated/movies?api_key=${this._key}&page=${page}&sort_by=created_at.asc`);
    return res;
  }

  async getNextPage(page = 1, query) {
    const res = await this.getResourse(`search/movie?api_key=${this._key}&query=${query}&page=${page}`);
    return res;
  }

  getDefaultPoster(poster) {
    return poster ? this._img + poster : (poster = this._posterDefault); 
  }

  async postStars(number, movie_id, guestID) {
    const value = number;
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movie_id}/rating?api_key=${this._key}&guest_session_id=${guestID}`, 
    {
      method: 'POST',
      body: JSON.stringify({
        value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`Возникла ошибка ${res.status}`);
    }
  }
}
