class Api {
  constructor({ url, headers }) {
    this._url = url;
    this._headers = headers;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Ошибка ${res.status} ${res.statusText}`);
    }
  }

  request(url, options) {
    return fetch(url, options).then(this._checkResponse);
  }

  getInitialCards() {
    return this.request(`${this._url}/cards`, {
      credentials: "include",
      headers: this._headers
    });
  }

  addCard({ name, link }) {
    return this.request(`${this._url}/cards`, {
      credentials: "include",
      headers: this._headers,
      method: 'POST',
      body: JSON.stringify({ name, link })
    });
  }

  deleteCard(id) {
    return this.request(`${this._url}/cards/${id}/`, {
      credentials: "include",
      headers: this._headers,
      method: 'DELETE',
    });
  }

  getProfileInfo() {
    return this.request(`${this._url}/users/me/`, {
      credentials: "include",
      headers: this._headers
    });
  }

  setProfileInfo({ name, about }) {
    return this.request(`${this._url}/users/me/`, {
      credentials: "include",
      headers: this._headers,
      method: 'PATCH',
      body: JSON.stringify({ name, about })
    });
  }

  updateAvatar({ avatar }) {
    return this.request(`${this._url}/users/me/avatar/`, {
      credentials: "include",
      headers: this._headers,
      method: 'PATCH',
      body: JSON.stringify({ avatar })
    });
  }

  deleteLike(id) {
    return this.request(`${this._url}/cards/${id}/likes`, {
      credentials: "include",
      headers: this._headers,
      method: 'DELETE',
    });
  }

  setLiked(id) {
    return this.request(`${this._url}/cards/${id}/likes`, {
      credentials: "include",
      headers: this._headers,
      method: 'PUT',
    });
  }
}

const api = new Api({
  url: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;