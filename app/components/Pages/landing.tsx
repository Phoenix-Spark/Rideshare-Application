import { useState, useEffect } from 'react';
import { BaseBoundIcon } from '../Icons/BaseBoundIcon';
import { Link } from 'react-router';

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);

  const features = [
      {
            visible: true,
            color: "from-blue-500 to-blue-400",
            description: "No fees, no charges, no subscriptions. Community members volunteer their time to help fellow service members.",
            title: "100% Free",
            svg: <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
      },
      {
            visible: true,
            color: "from-green-500 to-green-400",
            description: "All users are verified base personnel. Rides stay within base boundaries for your safety and security.",
            title: "Base Security",
            svg: <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
      },
      {
            visible: true,
            color: "from-purple-500 to-purple-400", 
            description: "Built on the values of service and support. Every ride strengthens our base community.",
            title: "Community Driven",
            svg: <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
      },
      {
            visible: true,
            color: "from-orange-500 to-orange-400", 
            description: "See available drivers instantly. Get notifications when your ride is on the way.",
            title: "Real-Time Updates",
            svg: <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
      },
      {
            visible: true,
            color: "from-indigo-500 to-indigo-400",
            description: "Simple interface designed for quick pickups. Request or offer rides in seconds.",
            title: "Easy to Use",
            svg: <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
      },
      {
            visible: true,
            color: "from-pink-500 to-pink-400",
            description: "Build trust through ratings and feedback. Recognize outstanding community members.",
            title: "Rating System",
            svg: <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
      }
  ]

  const navLinks = [
      {
            ref: "#features",
            label: "Features",
      },
      {
            ref: "#how-it-works",
            label: "How it works",
      },
      {
            ref: "#community",
            label: "Community",
      }
  ]

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 ">
      <nav className="fixed top-0 w-full bg-gradient-to-br from-blue-600 to-indigo-700 backdrop-blur-md z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <BaseBoundIcon />
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">Base Bound</span>
              </Link>
              <div className="hidden sm:flex items-center gap-3 pl-6 border-l-2 border-slate-200">
                <span className="text-xs text-white font-medium">Powered by</span>
                <a href="https://www.travisspark.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                  <img 
                    width={85}
                    src="/public/SparkLogo.png" 
                    alt="Phoenix Spark"
                    className="h-15 w-auto"
                  />
                </a>
              </div>
            </div>
            <div className="hidden md:flex gap-8 text-white">
                  {navLinks.map(link => 
                  <a href={link.ref} className="hover:border rounded-lg border-white p-2 font-medium transition-colors relative group" onClick={(e) => {
                        e.preventDefault();
                        const element = document.querySelector(link.ref);
                        element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}>
                        {link.label}
                  </a>)}
            </div>
          </div>
          
          <div className="sm:hidden pb-3 flex items-center justify-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Powered by</span>
            <a href="https://www.travisspark.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <img 
                width={75} 
                src="/SparkLogo.png" 
                alt="Phoenix Spark"
                className="h-8 w-auto"
              />
            </a>
          </div>
        </div>
      </nav>

      <section className="pt-32 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
        
        <div className={`max-w-7xl mx-auto relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
                🇺🇸 Our Air Force Community
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight mb-6">
                Get Where You Need to Go,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Together
                </span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Base Bound connects service members and base personnel through volunteer-driven ride-sharing. 
                Free, community-powered transportation within your Air Force Base.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all hover:-translate-y-0.5 text-center">
                  Login
                </Link>
                <Link to="/register" className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg border-2 border-blue-200 hover:border-blue-400 transition-all hover:-translate-y-0.5 text-center">
                  Register
                </Link>
              </div>
              <div className="mt-12 flex items-center gap-8 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>100% Free</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Volunteer Driven</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-500">
                <div className="space-y-6">
                  <div className="border-2 border-blue-100 rounded-xl p-6 hover:border-blue-300 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full mb-3 flex items-center justify-center text-white font-bold text-lg">
                          JS
                        </div>
                        <h3 className="font-bold text-slate-900">SSgt Johnson</h3>
                        <p className="text-sm text-slate-500">⭐ 4.9 • 127 rides</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        Available Now
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-slate-600">BX Parking Lot</span>
                      </div>
                      <div className="border-l-2 border-dashed border-slate-300 ml-1.5 h-6"></div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="text-slate-600">Main Gate</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-xs text-slate-500">Departs in 5 min</span>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                        Request Ride
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full opacity-20 blur-2xl"></div>
              <div className="absolute bottom-4 left-4 w-40 h-40 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full opacity-20 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-8 px-4 bg-amber-50 border-y border-amber-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-6 h-6 text-amber-600">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-amber-900 mb-1">Service Not Guaranteed</h3>
              <p className="text-amber-800 text-sm leading-relaxed">
                Base Bound is a volunteer-driven service. While we strive to connect you with rides, availability depends on community participation. 
                Always have a backup transportation plan.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Built for the <span className="text-blue-600">Base Community</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Simple, safe, and designed specifically for life on base
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.filter(item => item.visible === true).map( f => (
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-slate-100">
                  <div className={`w-14 h-14 bg-gradient-to-br ${f.color} rounded-xl flex items-center justify-center mb-6 transform hover:rotate-6 transition-transform`}>
                    {f.svg}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {f.description}
                  </p>
                </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Simple as <span className="text-blue-600">1-2-3</span>
            </h2>
            <p className="text-xl text-slate-600">Getting around base has never been easier</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="absolute -top-6 left-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    1
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Sign Up</h3>
                  <p className="text-slate-600 leading-relaxed">
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
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Request or Drive</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Need a ride? Post your request. Have a car and some time? See if anyone needs a ride. It's that simple.
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
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Connect & Go</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Get matched with a driver or rider. Coordinate pickup details and you're on your way!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="community" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-12 md:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Stronger Together
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Base Bound thrives because of volunteers like you. Whether you're offering rides or requesting them, 
                you're helping build a more connected, supportive base community.
              </p>
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-4xl font-bold mb-2">2,400+</div>
                  <div className="text-blue-100">Rides Completed</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-4xl font-bold mb-2">500+</div>
                  <div className="text-blue-100">Active Members</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-4xl font-bold mb-2">4.8★</div>
                  <div className="text-blue-100">Average Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-slate-600 mb-10">
            Join your base community today and never worry about getting around base again.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all hover:-translate-y-1">
              Login
            </Link>
            <Link to="/register" className="px-10 py-5 bg-white text-blue-600 rounded-xl font-semibold text-lg border-2 border-blue-200 hover:border-blue-400 transition-all hover:-translate-y-1">
              Register
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-400 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <BaseBoundIcon />
                </div>
                <span className="text-2xl font-bold">Base Bound</span>
              </div>
              <p className="text-slate-400 leading-relaxed mb-4">
                Connecting our Air Force community, one ride at a time. Built by service members, for service members.
              </p>
              <p className="text-sm text-slate-500">
                © 2025 Base Bound. Volunteer-driven community service.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}