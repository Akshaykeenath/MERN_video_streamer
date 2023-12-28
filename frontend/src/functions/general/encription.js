const decodeUrlVideoId = (obfuscatedVideoId) => {
  return atob(obfuscatedVideoId);
};

const encodeUrlVideoId = (videoId) => {
  return btoa(videoId);
};

export { decodeUrlVideoId, encodeUrlVideoId };
