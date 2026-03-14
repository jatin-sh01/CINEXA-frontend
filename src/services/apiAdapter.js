


export function normalizeMovie(movie) {
  if (!movie) return null;

  return {
    id: movie._id || movie.id,
    name: movie.name || movie.title || 'Untitled',
    description: movie.description || '',
    poster: movie.posterUrl || movie.poster || null,
    trailer: movie.trailerUrl || movie.trailer || null,
    languages: Array.isArray(movie.languages) ? movie.languages : [movie.language || 'English'].filter(Boolean),
    directors: Array.isArray(movie.directors) ? movie.directors : [movie.director || 'Unknown'].filter(Boolean),
    genres: Array.isArray(movie.genres) ? movie.genres : [],
    rating: movie.rating || movie.imdbRating || null,
    duration: movie.duration || movie.runtimeMinutes || null,
    releaseDate: movie.releaseDate || movie.release_date || null,
    releaseStatus: movie.releaseStatus || movie.status || 'Coming Soon',
    certificate: movie.certificate || movie.rated || 'NA',
    isTrending: movie.isTrending === true,
    formats: Array.isArray(movie.formats) ? movie.formats : [],
    
    
    ...movie,
  };
}


export function normalizeTheater(theater) {
  if (!theater) return null;

  return {
    id: theater._id || theater.id,
    name: theater.name || 'Unknown Theater',
    address: theater.address || '',
    city: theater.city || '',
    capacity: theater.capacity || theater.seats || 0,
    screen: theater.screen || theater.screenCount || 1,
    facilities: Array.isArray(theater.facilities) ? theater.facilities : [],
    
    
    ...theater,
  };
}


export function normalizeShow(show) {
  if (!show) return null;

  return {
    id: show._id || show.id,
    movie: show.movieId ? normalizeMovie(show.movieId) : null,
    theater: show.theaterId ? normalizeTheater(show.theaterId) : null,
    date: show.date || show.showDate || null,
    time: show.time || show.showTime || '00:00',
    ticketPrice: show.ticketPrice || show.price || 0,
    seats: Array.isArray(show.seats) ? show.seats : [],
    availableSeats: show.availableSeats || calculateAvailableSeats(show.seats),
    format: show.format || show.formats?.[0] || '2D',
    
    
    ...show,
  };
}


export function normalizeUser(user) {
  if (!user) return null;

  return {
    id: user._id || user.id,
    name: user.name || user.fullName || '',
    email: user.email || '',
    phone: user.phone || user.phoneNumber || '',
    role: user.role || 'USER',
    avatar: user.avatar || user.avatarUrl || null,
    createdAt: user.createdAt || null,
    isActive: user.isActive !== false,
    
    
    ...user,
  };
}


export function normalizeBooking(booking) {
  if (!booking) return null;

  return {
    id: booking._id || booking.id,
    show: booking.showId ? normalizeShow(booking.showId) : null,
    user: booking.userId ? normalizeUser(booking.userId) : null,
    seats: Array.isArray(booking.seats) ? booking.seats : [booking.seats || ''].filter(Boolean),
    totalPrice: booking.totalPrice || booking.amount || 0,
    status: booking.status || 'pending',
    bookingDate: booking.bookingDate || booking.createdAt || new Date().toISOString(),
    paymentId: booking.paymentId || null,
    paymentStatus: booking.paymentStatus || 'pending',
    
    
    ...booking,
  };
}


export function normalizePayment(payment) {
  if (!payment) return null;

  return {
    id: payment._id || payment.id,
    bookingId: payment.bookingId || payment.booking || null,
    amount: payment.amount || payment.totalAmount || 0,
    currency: payment.currency || 'INR',
    status: payment.status || 'pending',
    method: payment.method || payment.paymentMethod || 'card',
    transactionId: payment.transactionId || payment.txnId || null,
    timestamp: payment.timestamp || payment.createdAt || new Date().toISOString(),
    
    
    ...payment,
  };
}


export function normalizeArray(items, normalizer) {
  if (!Array.isArray(items)) return [];
  return items.map(normalizer).filter(Boolean);
}


function calculateAvailableSeats(seats) {
  if (!Array.isArray(seats)) return 0;
  return seats.filter(seat => seat.status === 'available' || seat.status === 'free').length;
}


export const requestAdapters = {
  
  prepareMovie(movieData) {
    return {
      name: movieData.name,
      description: movieData.description || '',
      posterUrl: movieData.poster || movieData.posterUrl,
      trailerUrl: movieData.trailer || movieData.trailerUrl,
      directors: Array.isArray(movieData.directors) ? movieData.directors : [movieData.director],
      languages: Array.isArray(movieData.languages) ? movieData.languages : [movieData.language || 'English'],
      genres: Array.isArray(movieData.genres) ? movieData.genres : [],
      rating: movieData.rating || null,
      duration: movieData.duration || null,
      releaseDate: movieData.releaseDate,
      releaseStatus: movieData.releaseStatus || 'Coming Soon',
      certificate: movieData.certificate || 'NA',
      isTrending: movieData.isTrending === true,
      formats: Array.isArray(movieData.formats) ? movieData.formats : [],
    };
  },

  
  prepareTheater(theaterData) {
    return {
      name: theaterData.name,
      address: theaterData.address,
      city: theaterData.city,
      capacity: parseInt(theaterData.capacity, 10) || 0,
      screen: parseInt(theaterData.screen || theaterData.screenCount || 1, 10),
      facilities: Array.isArray(theaterData.facilities) ? theaterData.facilities : [],
    };
  },

  
  prepareShow(showData) {
    return {
      movieId: showData.movieId || showData.movie,
      theaterId: showData.theaterId || showData.theater,
      date: showData.date || showData.showDate,
      time: showData.time || showData.showTime,
      ticketPrice: parseFloat(showData.ticketPrice || showData.price || 0),
      format: showData.format || showData.formats?.[0] || '2D',
    };
  },

  
  prepareBooking(bookingData) {
    return {
      showId: bookingData.showId || bookingData.show,
      seats: Array.isArray(bookingData.seats) ? bookingData.seats : [bookingData.seats],
    };
  },

  
  preparePayment(paymentData) {
    return {
      bookingId: paymentData.bookingId || paymentData.booking,
      amount: parseFloat(paymentData.amount || 0),
      method: paymentData.method || paymentData.paymentMethod || 'card',
      
    };
  },
};


export function normalizeResponse(response, normalizer) {
  if (!response) return null;

  
  const data = response.data || response;

  
  if (Array.isArray(data)) {
    return normalizeArray(data, normalizer);
  }

  
  return normalizer(data);
}


export const adapters = {
  movie: {
    normalize: normalizeMovie,
    prepare: requestAdapters.prepareMovie,
  },
  theater: {
    normalize: normalizeTheater,
    prepare: requestAdapters.prepareTheater,
  },
  show: {
    normalize: normalizeShow,
    prepare: requestAdapters.prepareShow,
  },
  user: {
    normalize: normalizeUser,
  },
  booking: {
    normalize: normalizeBooking,
    prepare: requestAdapters.prepareBooking,
  },
  payment: {
    normalize: normalizePayment,
    prepare: requestAdapters.preparePayment,
  },
};

export default {
  normalizeMovie,
  normalizeTheater,
  normalizeShow,
  normalizeUser,
  normalizeBooking,
  normalizePayment,
  normalizeArray,
  normalizeResponse,
  requestAdapters,
  adapters,
};
