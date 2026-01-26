import { useState, useEffect } from 'react';
import { BaseBoundIcon } from '../Icons/BaseBoundIcon';
import { Link } from 'react-router';

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToSection = (ref: string) => {
    const element = document.querySelector(ref);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">

      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <BaseBoundIcon />
              </div>
              <span className="text-xl font-bold text-gray-900">Base Bound</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('#features'); }} className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                Features
              </a>
              <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollToSection('#how-it-works'); }} className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                How it Works
              </a>
              <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                Login
              </Link>
              <Link to="/register" className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all">
                Get Started
              </Link>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
              <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col gap-3">
                <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('#features'); }} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                  Features
                </a>
                <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollToSection('#how-it-works'); }} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                  How it Works
                </a>
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold text-sm text-center">
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className={`max-w-7xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-sm font-semibold mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Serving Travis AFB
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Your Base,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Your Rides
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Free volunteer ridesharing connecting service members. Get where you need to go, together.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/register" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 text-center">
                  Get Started Free
                </Link>
                <Link to="/login" className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold text-lg border-2 border-gray-300 hover:border-blue-400 transition-all text-center">
                  Sign In
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">100% Free</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Verified Members</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="border-2 border-gray-100 rounded-xl p-6 bg-gradient-to-br from-white to-blue-50/30">
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        SJ
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">SSgt Johnson</h3>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                      Available
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700 font-medium">BX Parking Lot</span>
                    </div>
                    <div className="border-l-2 border-dashed border-gray-300 ml-1.5 h-6"></div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700 font-medium">Main Gate</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <button className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all">
                      Request Ride
                    </button>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">Powered by</span>
                  <a href="https://www.travisspark.com" target="_blank" rel="noopener noreferrer">
                    <img width={75} src="/SparkLogo.png" alt="Phoenix Spark" className="h-8 w-auto" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="py-6 px-4 bg-amber-50 border-y border-amber-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-6 h-6 text-amber-600">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-amber-900 mb-1">Service Not Guaranteed</h3>
              <p className="text-amber-800 text-sm leading-relaxed">
                Base Bound is volunteer-driven. Availability depends on community participation. Always have a backup plan.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-blue-600">Base Bound</span>
            </h2>
            <p className="text-xl text-gray-600">Built for our base community</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-400 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">100% Free</h3>
              <p className="text-gray-600 leading-relaxed">
                No fees, no charges, no subscriptions. Community members volunteer their time to help fellow service members.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-400 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Base Security</h3>
              <p className="text-gray-600 leading-relaxed">
                All users are verified base personnel. Rides stay within base boundaries for your safety and security.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-400 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community Driven</h3>
              <p className="text-gray-600 leading-relaxed">
                Built on the values of service and support. Every ride strengthens our base community.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-400 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-Time Updates</h3>
              <p className="text-gray-600 leading-relaxed">
                See available drivers instantly. Get notifications when your ride is on the way.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-400 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Easy to Use</h3>
              <p className="text-gray-600 leading-relaxed">
                Simple interface designed for quick pickups. Request or offer rides in seconds.
              </p>
            </div>
            
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple as <span className="text-blue-600">1-2-3</span>
            </h2>
            <p className="text-xl text-gray-600">Getting around base has never been easier</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="absolute -top-6 left-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    1
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Sign Up</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Create your account with your military email. Quick verification ensures everyone is part of our community.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="absolute -top-6 left-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    2
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Request or Drive</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Need a ride? Post your request. Have a car and some time? See if anyone needs a ride.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="absolute -top-6 left-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    3
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Connect & Go</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Get matched with a driver or rider. Coordinate pickup details and you're on your way!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Join your base community today and never worry about getting around base again.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="px-10 py-5 bg-white text-blue-600 rounded-xl font-bold text-lg shadow-2xl hover:scale-105 transition-all">
              Get Started Free
            </Link>
            <Link to="/login" className="px-10 py-5 bg-blue-500/20 backdrop-blur-sm text-white rounded-xl font-bold text-lg border-2 border-white/30 hover:bg-blue-500/30 transition-all">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <BaseBoundIcon />
                </div>
                <span className="text-2xl font-bold">Base Bound</span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-4">
                Connecting our Air Force community, one ride at a time. Built by service members, for service members.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
            <p>© 2025 Base Bound. Volunteer-driven community service.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}