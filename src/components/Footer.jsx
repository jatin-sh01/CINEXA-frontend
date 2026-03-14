import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import CinexaLogo from "./shared/CinexaLogo";

export default function Footer() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqItems = [
    {
      id: 1,
      question: "Catch the Trending Blockbusters: Get Your Movie Tickets Now!",
      answer:
        "Browse top movies, select your preferred showtime, and book your seats instantly in a few clicks.",
    },
    {
      id: 2,
      question:
        "Discover Trending Films in Popular Cities & Grab Tickets for the Hottest Releases!",
      answer:
        "Find what's trending in your city and reserve seats before popular shows sell out.",
    },
    {
      id: 3,
      question: "Explore the Best Movies Currently Showing in Popular Cities!",
      answer:
        "Explore now-showing titles across top theaters with up-to-date show availability.",
    },
    {
      id: 4,
      question:
        "Top Movie Genres You'll Love - Action, Comedy, Romance & More!",
      answer:
        "Filter by your favorite genres and discover shows that match your mood.",
    },
    {
      id: 5,
      question:
        "Explore & Book Tickets for Your Favorite Movie Genres in Popular Cities!",
      answer:
        "From thrillers to family films, book shows in major cities with a smooth checkout experience.",
    },
    {
      id: 6,
      question: "Dive into Your Favorite Movie Genres in More Amazing Cities!",
      answer:
        "Switch locations and discover fresh lineups from multiple cities on one platform.",
    },
    {
      id: 7,
      question: "Explore Movies in Your Language Across More Amazing Cities!",
      answer:
        "Book movies by language preferences and enjoy regional and international releases easily.",
    },
    {
      id: 8,
      question: "Find the Best Cinemas in Popular Cities and cue to popcorn!",
      answer:
        "Compare theaters, timings, and seat options to choose the perfect cinema experience.",
    },
  ];

  const navLinks = [
    { label: "Terms & Conditions", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Contact Us", href: "#" },
    { label: "Support", href: "#" },
  ];

  return (
    <footer className="mt-auto border-t border-gray-800 bg-gray-950 text-white">
      <div className="bg-gray-200/90 py-12 md:py-14">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900">
                Frequently Asked Questions
              </h3>
              <p className="text-xs md:text-sm text-gray-600 mt-1">
                Everything you need before booking.
              </p>
            </div>
            <span className="hidden md:inline-flex items-center rounded-full border border-gray-300 bg-white px-3 py-1 text-xs text-gray-700">
              Help Center
            </span>
          </div>

          <div className="space-y-3">
            {faqItems.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-gray-300 bg-white overflow-hidden transition hover:shadow-sm"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenFaq(openFaq === item.id ? null : item.id)
                  }
                  className="w-full px-5 md:px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <span className="text-base text-gray-900 font-medium leading-snug pr-3">
                    {item.question}
                  </span>
                  <FiChevronDown
                    size={18}
                    className={`shrink-0 text-gray-700 transition-transform ${openFaq === item.id ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === item.id && (
                  <div className="px-5 md:px-6 pb-4 text-sm text-gray-700 border-t border-gray-200 bg-gray-50/60">
                    <p className="pt-2.5 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 items-start">
          <div>
            <CinexaLogo className="h-8 md:h-9 w-auto" color="#E8E0D7" />
            <p className="text-gray-400 text-sm mt-3 max-w-xs leading-relaxed">
              Book movies, pick seats, and manage your tickets in one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3 md:justify-center">
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

          <div className="flex md:justify-end gap-3">
            <a
              href="#"
              className="w-10 h-10 rounded-full border border-gray-700 bg-gray-900 hover:bg-gray-800 hover:border-gray-600 flex items-center justify-center text-white transition"
              aria-label="Facebook"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full border border-gray-700 bg-gray-900 hover:bg-gray-800 hover:border-gray-600 flex items-center justify-center text-white transition"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08a11.9 11.9 0 01-4.043-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.466.182-.8.398-1.15.748-.35.35-.566.684-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.398.8.748 1.15.35.35.684.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.684.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full border border-gray-700 bg-gray-900 hover:bg-gray-800 hover:border-gray-600 flex items-center justify-center text-white transition"
              aria-label="X"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2h3.308l-7.227 8.26L23 22h-6.74l-5.285-6.91L4.93 22H1.62l7.73-8.835L1 2h6.91l4.777 6.231L18.244 2zm-1.161 18h1.833L6.91 3.895H4.944L17.083 20z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full border border-gray-700 bg-gray-900 hover:bg-gray-800 hover:border-gray-600 flex items-center justify-center text-white transition"
              aria-label="YouTube"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800/90">
          <p className="text-gray-400 text-xs text-center md:text-left leading-relaxed">
            By using Cinexa, you agree to our Terms of Service and Privacy
            Policy. All rights reserved © {new Date().getFullYear()} Cinexa.
          </p>
        </div>
      </div>
    </footer>
  );
}
