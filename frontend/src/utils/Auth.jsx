const BASE_URL = 'http://localhost:3000';

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
    credentials: "include",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ password, email })
  })
}

const onLogin = (password, email) => {
  return request(`${BASE_URL}/signin`, {
    method: 'POST',
    credentials: "include",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ password, email })
  })
    .then((data) => {
      if (data._id) {
        localStorage.setItem('userId', data._id);
        return data;
      } else {
        return;
      }
    })
}

const onLogout = () => {
  return request(`${BASE_URL}/logout`, {
    method: 'POST',
    credentials: "include",
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

const checkToken = () => {
  return request(`${BASE_URL}/users/me`, {
    method: 'GET',
    credentials: "include",
    headers: {
      'Content-Type': 'application/json',
    }
  })
}

export { BASE_URL, register, onLogin, onLogout, checkToken }