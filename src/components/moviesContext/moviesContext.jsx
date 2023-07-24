import React from 'react';

const { Provider: MoviesProvider, Consumer: MoviesConsumer } =
  React.createContext();

export { MoviesProvider, MoviesConsumer };
