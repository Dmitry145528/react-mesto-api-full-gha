const BASE_URL = 'https://auth.nomoreparties.co';

const checkResponse = (res) => {
  if (res.ok) {
    return res.json();
  } else {
    return Promise.reject(`Ошибка ${res.status} ${res.statusText}`);
  }
}

const request = (url, options) => {
  return fetch(url, options).then(checkResponse);
}

const register = (password, email) => {
  return request(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ password, email })
  })
}

const onLogin = (password, email) => {
  return request(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ password, email })
  })
    .then((data) => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        return data;
      } else {
        return;
      }
    })
}

const checkToken = (token) => {
  return request(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  })
}

export { BASE_URL, register, onLogin, checkToken }