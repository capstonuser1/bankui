import React from 'react';

interface HomeProps {
  title?: string;
}

export default function Home({ title = "Welcome to Our Website" }: HomeProps) {
  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>{title}</h1>
      <p>This is the home page of your Bank app.</p>
    
    </main>
  );
}