- check demo-1, demo-2, demo-3, demo-4, demo-5 png files in the root directory for the design of the app 
- Create a web mapping application using React, Redux, Vite, TypeScript, Node, Calcite, and the latest ArcGIS Maps SDK for JavaScript. 
- The application will be registered with an ArcGIS Online organisational account, so that when a user signs in, they will sign into their ArcGIS Online account. 
- The app will have a header and footer, and it will have a navigation menu going down the left side of the page. 
- The buttons in the navigation menu will be for "Advanced Search", "Maps", "Layers", "Legend", "Bookmarks", "Tools", "Print", and "Help". 
- The Help will use something like React-Joyride. 
- When any of the buttons in the navigation menu are clicked (with the exception of the Help button), the drawer will open with the content for that button. 
- On the header will be the organisation's logo,on the left side, and a sign in button on the right side. 
- The footer will have hyperlinks for Contact Us, Give Us Feedback, X, LinkedIn, Facebook. 
- The app needs to meet material design guidelines and be responsive so it works on mobile.
- Configurable app that will used for multiple clients, and each client will have its own config, e.g. https://api.geovez.com/get-app-config?organisation=copper-string
- Different clients will have different logos, colours, and configurations. The app should be able to dynamically load these configurations based on the organisation parameter
- The map should be created using the web map JSON for the map, e.g.
const webmap = new WebMap({
    portalItem: null, // Set to null since we're using JSON directly
    ...WebMap.fromJSON(webmapJson) // Deserialize JSON into WebMap
});
const view = new MapView({
    container: "viewDiv", // ID of the HTML element to render the map
    map: webmap // Attach the WebMap instance
});
- First the app has to allow the user to sign in, and then the app will filter the web maps and web scenes that are accessible to the user
- So before even creating the map, the app needs to have the sign in working, so it can get the web map list
- when clicked a map, it will get the web map ID, and load that map using the code in step 4 above.
- App will be registered with ArcGIS Online, and will use the OAuth 2.0 flow for user authentication.
- Get the maps loading in the Maps drawer, and get the map selection working to load the map and then get the LayerList and Legend components working.
- Use Esri's LayerList and Legend components, and then when the app is ready, we will rebuild the LayerList widget ourselves
- Icons will be used from the Calcite Design System, and the app will use the latest ArcGIS Maps SDK for JavaScript.
- For the popup widget, we will not build this ourselves. 
- We will use the out-of-the-box widget for this
- We won't use query-string parameters any more, e.g. this https://copper-string.geovez.com/?web-map=0026dcb028a141219352b3838abd2f61&s=73957191&x=14805492&y=-2875744&wkid=3857 will become https://copper-string.geovez.com For the query-string parameters, we will save these in local storage
