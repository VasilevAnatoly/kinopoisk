import {
  socketTypes
} from 'kinopoisk/store/constants';

// https://github.com/axios/axios
export function connectToSocket(actionId) {
  return {
    //тип определяющий обрабатывающий редюсер
    type: socketTypes.SOCKET_CONNECT,
  };
}

export function addMovieLikeDislike(data) {
  return {
    //тип определяющий обрабатывающий редюсер
    type: socketTypes.SOCKET_ADD_MOVIE_LIKE_DISLIKE,
    //объект socket служит для конфигурации socket.io
    socket: {
      emit: 'addMovieLikeDislike',
      data: data
    }
  };
}

export function addCommentLikeDislike(data) {
  return {
    //тип определяющий обрабатывающий редюсер
    type: socketTypes.SOCKET_ADD_COMMENT_LIKE_DISLIKE,
    //объект socket служит для конфигурации socket.io
    socket: {
      emit: 'addCommentLikeDislike',
      data: data
    }
  };
}

export function addCommentToMovie(data) {
  return {
    //тип определяющий обрабатывающий редюсер
    type: socketTypes.SOCKET_ADD_COMMENT_TO_MOVIE,
    //объект socket служит для конфигурации socket.io
    socket: {
      emit: 'addCommentToMovie',
      data: data
    }
  };
}