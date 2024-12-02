import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone } from 'lucide-react';


const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto grid md:grid-cols-3 gap-8">
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
              <span className="text-gray-300">+1 (555) 123-4567</span>
            </div>
          </div>
        </div>

        {/* App Download Links */}
        {/* <div>
          <h4 className="text-lg font-semibold mb-4">Download Our App</h4>
          <div className="flex space-x-4">
            <a
              href="https://play.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-black px-4 py-2 rounded-lg flex items-center hover:bg-gray-200 transition-colors"
            >
              <img
                src="/path/to/google-play-icon.png" // Replace with an actual path
                alt="Google Play"
                className="mr-2 w-6 h-6"
              />
              Google Play
            </a>
            <a
              href="https://www.apple.com/app-store/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-black px-4 py-2 rounded-lg flex items-center hover:bg-gray-200 transition-colors"
            >
              <img
                src="/path/to/app-store-icon.png" // Replace with an actual path
                alt="App Store"
                className="mr-2 w-6 h-6"
              />
              App Store
            </a>
          </div>
        </div> */}
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center">
        <p className="text-sm text-gray-400">
          © 2024 FitTrack. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
