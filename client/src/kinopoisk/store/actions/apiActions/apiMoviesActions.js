import {
  kinoRequestTypes,
  kinoApi
} from '../../constants';

export function getMovies(params) {
  return {
    type: kinoRequestTypes.GET_TOP_MOVIES_BY_DATE,
    request: {
      method: 'get',
      url: kinoApi.API_URL_MOVIES,
      params: params
    }
  };
}

export function getMovieById(movieId) {
  return {
    type: kinoRequestTypes.GET_MOVIE_BY_ID,
    request: {
      method: 'get',
      url: kinoApi.API_URL_MOVIES + `/${movieId}`,
    },
  };
}