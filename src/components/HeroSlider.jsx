import { useState, memo } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "swiper/css";
import "swiper/css/pagination";


function formatGenres(genres, max = 2) {
  if (!genres || !genres.length) return "";
  const shown = genres.slice(0, max).join(", ");
  const extra = genres.length - max;
  return extra > 0 ? `${shown} +${extra} more` : shown;
}


const HeroBanner = memo(function HeroBanner({
  items = [],
  currentIndex,
  onSelect,
  autoPlay = { delay: 5000 },
}) {
  const [swiperInstance, setSwiperInstance] = useState(null);

  if (!items.length) return null;

  return (
    <div className="relative w-full h-105 md:h-140 lg:h-155 bg-gray-100 overflow-hidden select-none">
      <Swiper
        modules={[Autoplay, Pagination]}
        effect="slide"
        speed={450}
        autoplay={
          autoPlay
            ? {
                delay: autoPlay.delay,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
            : false
        }
        allowTouchMove
        grabCursor
        touchRatio={1.15}
        threshold={8}
        longSwipesRatio={0.2}
        longSwipesMs={180}
        followFinger
        simulateTouch
        touchStartPreventDefault={false}
        touchMoveStopPropagation={false}
        onSwiper={setSwiperInstance}
        pagination={{ clickable: true }}
        loop={items.length > 1}
        initialSlide={currentIndex || 0}
        onSlideChange={(swiper) => {
          if (onSelect && items[swiper.realIndex])
            onSelect(items[swiper.realIndex]);
        }}
        className="h-full hero-swiper"
      >
        {items.map((item, idx) => (
          <SwiperSlide key={item.id}>
            {({ isActive }) => (
              <div className="relative h-full w-full">
                
                {item.backdropUrl && (
                  <img
                    src={item.backdropUrl}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-60 animate-ken-burns"
                    loading={idx === 0 ? "eager" : "lazy"}
                  />
                )}

                
                <div className="absolute inset-0 bg-white/40 z-1" />
                
                <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-white to-transparent z-1" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 h-full flex items-center">
                  
                  {isActive && (
                    <div className="max-w-xl animate-poster-in">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-3">
                          {item.title}
                        </h2>
                        <p className="text-gray-700 text-sm md:text-base mb-5 flex items-center flex-wrap gap-1">
                          {item.certificate && (
                            <>
                              <span className="font-bold text-gray-900">
                                {item.certificate}
                              </span>
                              {item.genres?.length > 0 && (
                                <span className="mx-1 text-gray-400">|</span>
                              )}
                            </>
                          )}
                          <span className="font-bold">{formatGenres(item.genres)}</span>
                        </p>
                        {item.cta && (
                          <Link
                            to={item.cta.href || "#"}
                            className="inline-block bg-gray-900 hover:bg-gray-800 text-white text-xs sm:text-sm font-semibold px-4 py-2 sm:px-8 sm:py-3 rounded-xl shadow-lg transition-all"
                          >
                            {item.cta.label}
                          </Link>
                        )}
                    </div>
                  )}

                  
                  {item.posterUrl && (
                    isActive && (
                        <div className="ml-auto shrink-0 animate-poster-in">
                          <img
                            src={item.posterUrl}
                            alt={`${item.title} poster`}
                            className="h-48 sm:h-56 md:h-80 lg:h-96 w-32 sm:w-40 md:w-52 lg:w-64 rounded-2xl shadow-2xl object-cover animate-poster-in"
                            loading={idx === 0 ? "eager" : "lazy"}
                          />
                        </div>
                      )
                  )}
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      
      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => swiperInstance?.slidePrev()}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 hidden md:flex items-center justify-center text-gray-700"
          >
            <FiChevronLeft size={30} />
          </button>
          <button
            type="button"
            onClick={() => swiperInstance?.slideNext()}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 hidden md:flex items-center justify-center text-gray-700"
          >
            <FiChevronRight size={30} />
          </button>
        </>
      )}
    </div>
  );
});

export default HeroBanner;
