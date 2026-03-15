import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SocketProvider } from "./contexts/SocketContext.jsx";
import { ToastProvider } from "./components/Toast";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Spinner from "./components/shared/Spinner";
import Home from "./pages/Home";
import MoviesList from "./pages/MoviesList";
import MovieDetails from "./pages/MovieDetails";
import TheaterDetail from "./pages/TheaterDetail";
import ShowPage from "./pages/ShowPage";
import BookingSummary from "./pages/BookingSummary";
import BookingDetail from "./pages/BookingDetail";
import PaymentPage from "./pages/PaymentPage";
import Dashboard from "./pages/Dashboard";
import ForbiddenPage from "./pages/ForbiddenPage";
import NotFound from "./pages/NotFound";
import LoginCard from "./components/LoginCard";
import RegisterCard from "./components/RegisterCard";
import ProfileCard from "./components/auth/ProfileCard";
import TheaterList from "./components/theaters/TheaterList";
import "./App.css";




const AdminLayout = lazy(
  () => import( "./layouts/AdminLayout"),
);
const AdminDashboard = lazy(
  () => import( "./pages/admin/AdminDashboard"),
);
const AdminMovies = lazy(
  () => import( "./pages/admin/AdminMovies"),
);
const AdminTheaters = lazy(
  () => import( "./pages/admin/AdminTheaters"),
);
const AdminShows = lazy(
  () => import( "./pages/admin/AdminShows"),
);
const AdminUsers = lazy(
  () => import( "./pages/admin/AdminUsers"),
);
const AdminBookings = lazy(
  () => import( "./pages/admin/AdminBookings"),
);
const AdminAnalytics = lazy(
  () => import( "./pages/admin/AdminAnalytics"),
);
const AdminModeration = lazy(
  () => import( "./pages/admin/AdminModeration"),
);
const AdminSettings = lazy(
  () => import( "./pages/admin/AdminSettings"),
);


function AdminFallback() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <Spinner />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <SocketProvider>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              
              <Route
                path="/admin"
                element={
                  <ProtectedRoute roles={["ADMIN", "CLIENT"]}>
                    <Suspense fallback={<AdminFallback />}>
                      <AdminLayout />
                    </Suspense>
                  </ProtectedRoute>
                }
              >
                <Route
                  index
                  element={
                    <Suspense fallback={<AdminFallback />}>
                      <AdminDashboard />
                    </Suspense>
                  }
                />
                <Route
                  path="movies"
                  element={
                    <Suspense fallback={<AdminFallback />}>
                      <AdminMovies />
                    </Suspense>
                  }
                />
                <Route
                  path="theaters"
                  element={
                    <Suspense fallback={<AdminFallback />}>
                      <AdminTheaters />
                    </Suspense>
                  }
                />
                <Route
                  path="shows"
                  element={
                    <Suspense fallback={<AdminFallback />}>
                      <AdminShows />
                    </Suspense>
                  }
                />
                <Route
                  path="users"
                  element={
                    <ProtectedRoute roles={["ADMIN"]}>
                      <Suspense fallback={<AdminFallback />}>
                        <AdminUsers />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="bookings"
                  element={
                    <Suspense fallback={<AdminFallback />}>
                      <AdminBookings />
                    </Suspense>
                  }
                />
                <Route
                  path="analytics"
                  element={
                    <Suspense fallback={<AdminFallback />}>
                      <AdminAnalytics />
                    </Suspense>
                  }
                />
                <Route
                  path="moderation"
                  element={
                    <ProtectedRoute roles={["ADMIN"]}>
                      <Suspense fallback={<AdminFallback />}>
                        <AdminModeration />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="settings"
                  element={
                    <Suspense fallback={<AdminFallback />}>
                      <AdminSettings />
                    </Suspense>
                  }
                />
              </Route>

              
              <Route
                path="/*"
                element={
                  <div className="min-h-screen bg-white text-gray-900 flex flex-col">
                    <Navbar />
                    <main className="flex-1">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<LoginCard />} />
                        <Route path="/register" element={<RegisterCard />} />
                        <Route path="/403" element={<ForbiddenPage />} />
                        <Route path="/movies" element={<MoviesList />} />
                        <Route path="/movies/:id" element={<MovieDetails />} />
                        <Route path="/theaters" element={<TheaterList />} />
                        <Route
                          path="/theaters/:id"
                          element={<TheaterDetail />}
                        />
                        <Route path="/shows/:id" element={<ShowPage />} />
                        <Route
                          path="/booking"
                          element={
                            <ProtectedRoute>
                              <BookingSummary />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/booking/:id"
                          element={
                            <ProtectedRoute>
                              <BookingDetail />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/payment/:id"
                          element={
                            <ProtectedRoute>
                              <PaymentPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/dashboard"
                          element={
                            <ProtectedRoute>
                              <Dashboard />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/profile"
                          element={
                            <ProtectedRoute>
                              <ProfileCard />
                            </ProtectedRoute>
                          }
                        />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                }
              />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </SocketProvider>
    </BrowserRouter>
  );
}
