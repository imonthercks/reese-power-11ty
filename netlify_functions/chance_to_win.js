exports.handler = async function(event, context) {
  // your server-side functionality
  console.log(JSON.stringify(event.body));
  return {
    statusCode: 200,
    body: JSON.stringify({message: "Hello World"})
};
}