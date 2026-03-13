import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import CinexaLogo from "./shared/CinexaLogo";

export default function Footer() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqItems = [
    {
      id: 1,
      question: "Catch the Trending Blockbusters: Get Your Movie Tickets Now!",
    },
    {
      id: 2,
      question: "Discover Trending Films in Popular Cities & Grab Tickets for the Hottest Releases!",
    },
    {
      id: 3,
      question: "Explore the Best Movies Currently Showing in Popular Cities!",
    },
    {
      id: 4,
      question: "Top Movie Genres You'll Love – Action, Comedy, Romance & More!",
    },
    {
      id: 5,
      question: "Explore & Book Tickets for Your Favorite Movie Genres in Popular Cities!",
    },
    {
      id: 6,
      question: "Dive into Your Favorite Movie Genres in More Amazing Cities!",
    },
    {
      id: 7,
      question: "Explore Movies in Your Language Across More Amazing Cities!",
    },
    {
      id: 8,
      question: "Find the Best Cinemas in Popular Cities and cue to popcorn!",
    },
  ];

  const navLinks = [
    { label: "Terms & Conditions", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Contact Us", href: "#" },
    { label: "List your events", href: "#" },
  ];

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="space-y-3">
          {faqItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setOpenFaq(openFaq === item.id ? null : item.id)}
              className="w-full flex items-center justify-between bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-4 rounded-lg transition"
            >
              <span className="text-left font-medium text-sm">{item.question}</span>
              <FiChevronDown
                size={20}
                className={`flex-shrink-0 transition-transform ${
                  openFaq === item.id ? "rotate-180" : ""
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      
      <div className="bg-gray-950 border-t border-gray-800 px-4 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            
            <div className="flex flex-col items-start justify-between">
              <div>
                <CinexaLogo className="h-8 md:h-9 w-auto" color="#E8E0D7" />
                <p className="text-gray-400 text-xs mt-2">Your movie booking destination</p>
              </div>
            </div>

            
            <div className="flex justify-center">
              <div className="flex flex-wrap gap-6 justify-center">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-gray-300 hover:text-white text-sm font-medium transition"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            
            <div className="flex flex-col items-end gap-3">
              <div className="bg-white p-2 rounded-lg">
                <svg
                  width="100"
                  height="100"
                  viewBox="0 0 100 100"
                  className="w-24 h-24"
                >
                  
                  <rect width="100" height="100" fill="white" />
                  <rect x="10" y="10" width="30" height="30" fill="black" />
                  <rect x="60" y="10" width="30" height="30" fill="black" />
                  <rect x="10" y="60" width="30" height="30" fill="black" />
                  <rect x="28" y="28" width="14" height="14" fill="white" />
                  <rect x="78" y="28" width="14" height="14" fill="white" />
                  <rect x="28" y="78" width="14" height="14" fill="white" />
                  <rect x="45" y="45" width="10" height="10" fill="black" />
                  <rect x="35" y="35" width="30" height="30" fill="white" opacity="0.5" />
                  <circle cx="85" cy="85" r="12" fill="black" />
                </svg>
              </div>
              <p className="text-gray-400 text-sm font-medium text-right">
                Scan to download<br />the app
              </p>
            </div>
          </div>

          
          <div className="border-t border-gray-800 py-8 space-y-4">
            
            <div className="flex justify-center md:justify-end gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-white transition"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-white transition"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08a11.9 11.9 0 01-4.043-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.466.182-.8.398-1.15.748-.35.35-.566.684-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.398.8.748 1.15.35.35.684.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.684.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-white transition"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 002.856-9.98 9.9 9.9 0 01-2.775.771 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-white transition"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>

            
            <p className="text-gray-500 text-xs text-center md:text-right">
              By accessing this page, you confirm that you have read, understood, and agreed to our{" "}
              <a href="#" className="text-gray-400 hover:text-gray-300">
                Terms of Service
              </a>
              ,{" "}
              <a href="#" className="text-gray-400 hover:text-gray-300">
                Privacy Policy
              </a>
              , and{" "}
              <a href="#" className="text-gray-400 hover:text-gray-300">
                Content Guidelines
              </a>
              . All rights reserved © {new Date().getFullYear()} Cinexa.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
