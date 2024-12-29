import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone } from 'lucide-react';


const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 px-4">
      <div className="container mx-auto grid md:grid-cols-2 gap-8">
        {/* Company Info */}
        <div>
          <h3 className="text-xl font-bold mb-4">FitTrack</h3>
          <p className="text-gray-300 mb-4">
            Empowering fitness enthusiasts to track, improve, and achieve their health goals.
          </p>
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={24} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500 transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={24} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={24} />
            </a>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
          <div className="space-y-2">
            <div className="flex items-center">
              <Mail size={20} className="mr-2" />
              <a
                href="mailto:support@fittrack.com"
                className="hover:text-blue-300 transition-colors"
              >
                support@fittrack.com
              </a>
            </div>
            <div className="flex items-center">
              <Phone size={20} className="mr-2" />
              <span className="text-gray-300"> 199 1406</span>
            </div>
          </div>
        </div>

        
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center">
        <p className="text-sm text-gray-400">
        © {new Date().getFullYear()} FitTrack. All Rights Reserved.

        </p>
      </div>
    </footer>
  );
};

export default Footer;
