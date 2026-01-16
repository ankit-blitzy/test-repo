import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Footer Component
 * 
 * Site footer component displaying navigation links, contact information,
 * social media links, and opening hours. Contains sections for quick links
 * (Home, Menu, Booking, Account), contact details (address, phone, email),
 * and opening hours. Includes copyright notice with current year.
 * 
 * Styled with Tailwind CSS using dark background (gray-900) for visual
 * separation from main content.
 */

// Quick navigation links for the footer
const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'Menu', path: '/menu' },
  { name: 'Book a Table', path: '/booking' },
  { name: 'My Account', path: '/account' },
];

// Social media links with placeholder icons
const socialLinks = [
  { name: 'Facebook', url: 'https://facebook.com/burgerhouse', icon: '📘' },
  { name: 'Instagram', url: 'https://instagram.com/burgerhouse', icon: '📷' },
  { name: 'Twitter', url: 'https://twitter.com/burgerhouse', icon: '🐦' },
];

// Opening hours data
const openingHours = [
  { days: 'Monday - Thursday', hours: '11:00 AM - 10:00 PM' },
  { days: 'Friday - Saturday', hours: '11:00 AM - 11:00 PM' },
  { days: 'Sunday', hours: '12:00 PM - 9:00 PM' },
];

// Contact information
const contactInfo = {
  address: '123 Burger Street, Food City, FC 12345',
  phone: '(555) 123-4567',
  email: 'info@burgerhouse.com',
};

/**
 * Footer functional component
 * Renders a responsive multi-column footer with navigation, contact info,
 * opening hours, and social media links
 */
export default function Footer(): React.JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Quick Links Section */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-amber-500 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information Section */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2">📍</span>
                <span>{contactInfo.address}</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">📞</span>
                <a
                  href={`tel:${contactInfo.phone.replace(/[^\d]/g, '')}`}
                  className="hover:text-amber-500 transition-colors duration-200"
                >
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-center">
                <span className="mr-2">✉️</span>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="hover:text-amber-500 transition-colors duration-200"
                >
                  {contactInfo.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Opening Hours Section */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Opening Hours</h3>
            <ul className="space-y-2">
              {openingHours.map((schedule) => (
                <li key={schedule.days} className="flex flex-col">
                  <span className="font-medium text-gray-200">{schedule.days}</span>
                  <span className="text-gray-400">{schedule.hours}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links Section */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl hover:text-amber-500 transition-colors duration-200"
                  aria-label={`Follow us on ${social.name}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-400">
              Stay connected with us on social media for the latest updates, special offers,
              and behind-the-scenes content!
            </p>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-gray-700 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} Burger House. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
