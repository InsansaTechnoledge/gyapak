import React, { useEffect, useState } from 'react';
import { getExamCategory } from './constants/data';

const Category = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getExamCategory()
      .then(setCategories)
      .catch(console.error);
  }, []);

  return (
    <ul>
      {categories.map((cat) => (
        <li key={cat.id}>{cat.name}</li>
      ))}
    </ul>
  );
};

const App = () => {
  return (
    <div>
      <h2>Exam Categories</h2>
      <Category />
    </div>
  );
};

export default App;
