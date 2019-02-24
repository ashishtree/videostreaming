import axios from "axios";

export const LOAD_VIDEO = 'LOAD_VIDEO';
export const FILTER_VIDEO = 'FILTER_VIDEO';

export function fetchVideoData(){
  const videoUrl = "http://video.skincoachapp.com/v1/_debug/";
  var time = new Date().getTime();
  return (dispatch, getState) => {
    const videos = getState().videos;
    if(Object.entries(videos).length > 0) {
      return Promise.resolve();
    }
    return axios.get(videoUrl+"?time="+time)
    .then(function(response) {
      dispatch({type:LOAD_VIDEO, content: response.data});
    })
    .catch(function(error) {
      throw(error);
    });
  }
}

export function filterVideoData(term) {
  return {type:FILTER_VIDEO, payload:term}
}

export default function videoReducer(state = [], action) {
  switch (action.type) {
    case LOAD_VIDEO:
      return [...state, action.content];
    default:
      return state;
  }
}
