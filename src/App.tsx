import React from 'react';
import './App.css';
import { ProductList } from './app/product/ProductList';

const App: React.FC = () => {
  return (
    <div className='App'>
      <h1> CTT Exercise - Frontend Typescript!</h1>
      <ProductList />
    </div>
  );
};

export default App;
