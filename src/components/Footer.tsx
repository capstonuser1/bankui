import React from 'react';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        <small>© {year} MD282 Bank. All rights reserved.</small>
      </div>
    </footer>
  );
}

export default Footer;
