const contentful = require("contentful");
const dateformat = require("dateformat");

const client = contentful.createClient({
    // This is the space ID. A space is like a project folder in Contentful terms
    space: process.env.CTFL_SPACE,
    // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
    accessToken: process.env.CTFL_ACCESSTOKEN
});
// This API call will request an entry with the specified ID from the space defined at the top, using a space-specific access token.

var renderFriendlySchedule = (startDateTime, endDateTime) => {
    var start = new Date(startDateTime);
    var end = new Date(endDateTime);

    startText = dateformat(start, "fullDate") + " " + dateformat(start, "mediumTime");
    var endText = "";
    if (start.getDate() != end.getDate() || start.getMonth() != end.getMonth() || start.getFullYear() != end.getFullYear())
        endText = endText + dateformat(end, "fullDate") + " ";
    
    endText = endText + dateformat(end, "longTime");

    return startText + " - " + endText;
}

module.exports = async () => {
    return client.getEntries({ content_type: 'event' }).then(function(response) {
            const assets = Object.assign({}, ...response.includes.Asset.map((asset) => ({[asset.sys.id]: asset.fields.file.url})));
            
            const events = response.items
                .map(function(event) {
                    return {
                        fields: event.fields,
                        url: assets[event.fields.eventImage.sys.id],
                        friendlySchedule: renderFriendlySchedule(event.fields.startDateTime, event.fields.endDateTime)
                    };
                });
            return events;
        })

        
        .catch(console.error);
};
