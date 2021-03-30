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

    startText = dateformat(startDateTime, "fullDate") + "   " + dateformat(startDateTime, "shortTime");

    if (endDateTime) {
        var endText = "";
        if (start.getDate() != end.getDate() || start.getMonth() != end.getMonth() || start.getFullYear() != end.getFullYear()) {
            endText = endText + dateformat(endDateTime, "fullDate") + " ";
        }

        endText = endText + dateformat(endDateTime, "shortTime");
        return {start: startText, end: endText, full: startText + ' - ' + endText};
    }

    return {start: startText, end: null, full: startText};
}

var renderDirectionUri = (address, location) => {

    if (location){
        return "https://www.google.com/maps/dir/" + location.lat + "," + location.lon;
    }
    if (address){
        return "https://www.google.com/maps/dir/" + encodeURI(address.streetAddress + "," + address.city + "," + address.state + " " + address.zip);
    }
    return null;
}

module.exports = async () => {
    return client.getEntries({ content_type: 'event' }).then(function(response) {
            const assets = Object.assign({}, ...response.includes.Asset.map((asset) => ({[asset.sys.id]: asset.fields.file.url})));
            const entries = Object.assign({}, ...response.includes.Entry.map((entry) => ({[entry.sys.id]: entry.fields})));

            const events = response.items
                .map(function(event) {

                    let eventImageId = null;
                    if (event.fields.eventImage == null) {
                        console.warn(`event '${event.fields.name}' needs an image`);
                    } else {
                        eventImageId = event.fields.eventImage.sys.id;
                    }

                    renderFriendlySchedule(event.fields.startDateTime, event.fields.endDateTime)
                    return {
                        fields: event.fields,
                        url: assets[eventImageId],
                        directionsUri: renderDirectionUri({address: {streetAddress: event.fields.streetAddress, city: event.fields.city || "", state: event.fields.state || "", zip: event.fields.zip || ""}}, event.fields.location),
                        friendlySchedule: renderFriendlySchedule(event.fields.startDateTime, event.fields.endDateTime),
                        teammates: event.fields.teammates ? event.fields.teammates.map(function(teammate){
                            return entries[teammate.sys.id];
                        }) : []
                    };
                });

            events.sort(function(a, b) {
                return a.fields.startDateTime.localeCompare(b.fields.startDateTime);
            });

            return events;

        })
        .catch(console.error);
};
