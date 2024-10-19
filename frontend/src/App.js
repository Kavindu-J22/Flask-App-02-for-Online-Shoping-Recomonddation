import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import './App.css';

const App = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Fashion Alley🧣</h1>
        <p>Your ultimate destination for trendy apparel..</p>
      </header>

      <main>
        <Routes>
          {/* Home route rendering a list of products */}
          <Route path="/" element={<ProductList />} />
          
          {/* Route for viewing product details */}
          <Route path="/product/:id" element={<ProductDetails />} />
        </Routes>
      </main>

      <footer className="App-footer">
        <p>&copy; {currentYear} Fashion Hub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
