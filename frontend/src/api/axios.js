import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('taskflow_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// True for a response that never really "answered" the request - a dropped
// connection, a client-side timeout, or a gateway error (502/503/504) from a
// host proxy that gave up while the app server was still waking up (this is
// the normal behaviour of Render's free tier coming back from an idle
// spin-down). In all of these cases the request may well have already
// reached the server and completed - the failure is in getting the response
// back, not in the operation itself.
const isAmbiguousFailure = (error) =>
  !error.response || [502, 503, 504].includes(error.response.status);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // Safe to retry automatically: GET (and HEAD) don't change any data, so
    // resending one after a dropped/cold-start response can't create a
    // duplicate. This alone fixes pages like Employee Stats that were
    // showing "Failed to load..." purely because the first request landed
    // during a cold start.
    const method = (config?.method || 'get').toLowerCase();
    const isRetryableMethod = method === 'get' || method === 'head';

    if (isRetryableMethod && isAmbiguousFailure(error) && config && !config._retried) {
      config._retried = true;
      await wait(2000);
      return api(config);
    }

    // Not safe to auto-resubmit (POST/PUT/PATCH/DELETE) - flag it instead so
    // the calling code (forms, delete handlers) can refresh its data and
    // check whether the write actually went through, rather than assuming
    // it failed outright.
    if (!isRetryableMethod && isAmbiguousFailure(error)) {
      error.isAmbiguousFailure = true;
    }

    if (error.response && error.response.status === 401) {
      localStorage.removeItem('taskflow_token');
      localStorage.removeItem('taskflow_user');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
