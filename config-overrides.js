/*
It is possible to use the local React development server.
For this you need to set the CORS headers and make sure to use the same protocol (http or https) as the Safe interface you are using for testing.

CORS
For this we recommend to use react-app-rewired. To enable the library update the scripts section in the package.json:
"scripts": {
  "start": "react-app-rewired start",
  "build": "react-app-rewired build",
  "test": "react-app-rewired test"
},

Additionally, you need to create the config-overrides.js file in the root of the project to confirgure the CORS headers.
The content of the file should be:

config-overrides.js

    module.exports = {
        // The function to use to create a webpack dev server configuration when running the development
        // server with 'npm run start' or 'yarn start'.
        // Example: set the dev server to use a specific certificate in https.
        devServer: function (configFunction) {
            // Return the replacement function for create-react-app to use to generate the Webpack
            // Development Server config. "configFunction" is the function that would normally have
            // been used to generate the Webpack Development server config - you can use it to create
            // a starting configuration to then modify instead of having to create a config from scratch.
            return function (proxy, allowedHost) {
                // Create the default config by calling configFunction with the proxy/allowedHost parameters
                const config = configFunction(proxy, allowedHost);

                config.headers = {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET',
                    'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
                };

                // Return your customised Webpack Development Server config.
                return config;
            };
        },
    };

SSL

To enable SSL with react-scripts it is necessary to set the HTTPS environment variable to true.
This can be done in the package.json file by adjusting the scripts section to:
"scripts": {
  "start": "HTTPS=true react-app-rewired start",
},

*/
