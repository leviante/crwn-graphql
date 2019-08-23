import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ApolloProvider } from "react-apollo";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient, gql } from "apollo-boost";

import { store, persistor } from './redux/store';

import './index.css';
import App from './App';
import { resolvers, typeDefs }
 from "./graphql/resolvers";
//establish the connection to our backend
// createHttpLink takes one argument as object, which has the "uri" property.
const httpLink = createHttpLink({
  uri: "https://crwn-clothing.com"
});

//create cache object to manage the data
const cache = new InMemoryCache();

//make the client
const client = new ApolloClient({
  link: httpLink,
  cache,
  typeDefs,
  resolvers
});

//using Apollo as a state management, we need to instantiate local value for our state
//we do this by using client and client leverages cache in oder to do that, cache is like a localStorage
// do it inside index.js
client.writeData({
  data: {
    cartHidden: true,
    cartItems: [],
    itemCount: 0
  }
});

//how to make a mutation that modifies this local state
//make a new folder that contains these mutations, graphql

//make a request to test
client.query({
  query: gql`
    {
      getCollectionsByTitle(title: "hats"){
        id
        title
        items{
          id
          name
          price
          imageUrl
        }
      }
    }
  `
}).then(res => console.log(res));

ReactDOM.render(
  <ApolloProvider client={client}>
  <Provider store={store}>
    <BrowserRouter>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </BrowserRouter>
  </Provider>
  </ApolloProvider>,
  document.getElementById('root')
);


//instantiate apollo client in index.js

//ApolloProvider allows the rest of our application to be able to access the state that is stored on Apollo

//createHttpLink is going to let us actually connect our client to our specific endpoint (/graphql).

//InMemoryCache is the thing that Apollo uses to cache our query so that if the data is not changed, we don't have to query for the same data again, we just use the one that is cached

//to query, we use our client and it's query method
/*
  query method takes an object as a parameter, and the object has a query property because we're querying for the data.
  Now to actually benefit graphQL, we need to somehow change the syntax to the one we use in the playground.
  To do that, we use the gql function we imported from apollo-boost
  Just like styled components, we use gql`` and write graphQL query code inside the backticks.

  Now when we query for a data, the client returns us back a promise, and if it resolves, we get back an object that has a "data" property.
  Inside that data property, we see the things we queried for under the name of our query. In this case, it's getCollectionsByTitle

  No need to convert the response with res.json() as we do with fetch(), what we get back is already an object.

*/