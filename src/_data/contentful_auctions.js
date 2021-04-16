const contentful = require("contentful");
const dateformat = require("dateformat");

const client = contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: process.env.CTFL_SPACE,
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: process.env.CTFL_ACCESSTOKEN,
});
// This API call will request an entry with the specified ID from the space defined at the top, using a space-specific access token.

module.exports = async () => {
  return client
    .getEntries({ content_type: "auction" })
    .then(function (response) {
      const assets = Object.assign(
        {},
        ...response.includes.Asset.map((asset) => ({
          [asset.sys.id]: {
            url: asset.fields.file.url,
            description: asset.fields.description,
          },
        }))
      );

      const auctionItems = response.items.map(function (item) {
        let featuredPhotoId = item.fields.featuredPhoto.sys.id;

        return {
          fields: item.fields,
          featuredPhotoUrl: assets[featuredPhotoId],
          photos: item.fields.photos.map(function (photo) {
            return assets[photo.sys.id];
          }),
        };
      });

      auctionItems.sort(function (a, b) {
        var aOrder = a.fields.order || 99;
        var bOrder = b.fields.order || 99;
        return aOrder > bOrder ? 1 : -1;
      });

      return auctionItems;
    })
    .catch(console.error);
};
