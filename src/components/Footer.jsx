import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center">
          <p className="text-slate-400 text-sm">
            © {currentYear} TheTrustSeller. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;