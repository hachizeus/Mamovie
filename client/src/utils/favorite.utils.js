const favoriteUtils = {
  check: ({ listFavorites, mediaId }) => {
    // Make sure listFavorites is an array before using find
    return Array.isArray(listFavorites) && 
      listFavorites.find(e => e.mediaId && mediaId && 
        e.mediaId.toString() === mediaId.toString()) !== undefined;
  }
};

export default favoriteUtils;