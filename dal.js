const axios = require('axios');

/**
 * CONFIG
 */
const token = '423f9bb635a54a653c198b64e40a30b633e10bc4';
const url_base = 'https://dev-api.classpass.com';
const videos_url_base = 'https://development-platform-videos-api.classpass.com';
const leaderboard_url_base = 'https://development-platform-leaderboard.classpass.com';

const headers = {
  'CP-Authorization': `Token ${token}`,
  'Content-Type': 'application/json',
};

const dal = {
  createClass: (alias) => {
    const epocTime = new Date().getTime();
    const start = Math.ceil(epocTime / 1000)
    const data = {
      title: 'chromecast test',
      description: 'test description',
      alias,
      thumbnail_large_url: 'https://images.bbycastatic.ca/sf/projects/brandstore/google/contents/chromecast/assets/2016-10/logo-lockup-chromecast.png',
      stream_url: 'https://wowzaprod126-i.akamaihd.net/hls/live/531651/930fed58/playlist.m3u8',
      class_start_time: start,
      class_end_time: start + (30 * 60 * 60),
    };
  
    const request = {
      url: `${videos_url_base}/v1/videos/live`,
      method: 'POST',
      headers,
      data,
    };
    return axios(request);
  },
  
  deleteClass: alias => {
    const request = {
      url: `${videos_url_base}/v1/videos/live/${alias}`,
      method: 'DELETE',
    };
    return axios(request);
  },
  
  endClass: class_id => {
    const request = {
      url: `${leaderboard_url_base}/v1/leaderboard/classes/${class_id}/end`,
      method: 'PATCH',
      headers,
    };
    return axios(request);    
  },
  
  joinClass: (alias, user_id) => {
    const request = {
      url: `${url_base}/v1/leaderboard/classes/${alias}/join`,
      method: 'POST',
      headers,
      data: { user_id },
    };
    return axios(request);    
  },
  
  leaveClass: (alias, user_id) => {
    const request = {
      url: `${url_base}/v1/leaderboard/classes/${alias}/leave`,
      method: 'POST',
      headers,
      data: { user_id },
    };
    return axios(request);    
  },
  
  registerClass: class_id => {
    const request = {
      url: `${leaderboard_url_base}/v1/leaderboard/classes`,
      method: 'POST',
      headers,
      data: { class_id },
    };
    return axios(request);    
  },
  
  startClass: class_id => {
    const request = {
      url: `${leaderboard_url_base}/v1/leaderboard/classes/${class_id}/start`,
      method: 'PATCH',
      headers,
    };
    return axios(request);    
  }
}

module.exports = dal;
