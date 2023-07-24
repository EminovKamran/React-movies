export default class TmdbService {
  apiBase = 'https://api.themoviedb.org/3/';

  apiKey = '8aadd95d44f761dcc324687cde3c2db4';

  optionsG = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
    },
  };

  static guestSessionId;

  async checkResponseStatus(response) {
    if (!response.ok) {
      throw new Error(
        `Could not fetch ${this.apiBase}, received ${response.status}`,
      );
    }
    return response.json();
  }

  async getResourse(url) {
    const response = await fetch(
      `${this.apiBase}search/movie?api_key=${this.apiKey}${url}`,
      this.optionsG,
    );
    return this.checkResponseStatus(response);
  }

  async getFilms(movie, page) {
    const url = `&query=${movie}&include_adult=false&language=en-US&page=${page}`;
    return this.getResourse(url);
  }

  async getGuestSession() {
    const response = await fetch(
      `${this.apiBase}authentication/guest_session/new?api_key=${this.apiKey}`,
      this.optionsG,
    );
    return this.checkResponseStatus(response);
  }

  async setGuestSessionId() {
    const guestSessionId = await this.getGuestSession();
    if (sessionStorage.getItem('guestSessionId') === null) {
      sessionStorage.setItem('guestSessionId', guestSessionId.guest_session_id);
    } else {
      TmdbService.guestSessionId = sessionStorage.getItem('guestSessionId');
    }
  }

  async sendRatedMovie(movieId, rate) {
    const guestSessionId = sessionStorage.getItem('guestSessionId');
    const optionsP = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        value: rate,
      }),
    };
    const response = await fetch(
      `${this.apiBase}movie/${movieId}/rating?api_key=${this.apiKey}&guest_session_id=${guestSessionId}`,
      optionsP,
    );

    return this.checkResponseStatus(response);
  }

  async getRatedMovie(page) {
    const guestSessionId = sessionStorage.getItem('guestSessionId');
    const response = await fetch(
      `${this.apiBase}guest_session/${guestSessionId}/rated/movies?api_key=${this.apiKey}&page=${page}`,
      this.optionsG,
    );
    return this.checkResponseStatus(response);
  }

  async getGenre() {
    const response = await fetch(
      `${this.apiBase}genre/movie/list?api_key=${this.apiKey}`,
    );
    return this.checkResponseStatus(response);
  }
}
