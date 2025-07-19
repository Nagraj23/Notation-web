"use client"

import {
  Shield,
  Zap,
  Search,
  Smartphone,
  Users,
  Lock,
  FileText,
  Cloud,
  Star,
  ArrowRight,
  Check,
  Menu,
  X,
} from "lucide-react"
import { useNavigate } from "react-router-dom"; 
import { useState, useEffect, useRef } from "react"

// Custom Button Component
const Button = ({ children, variant = "primary", size = "md", className = "", onClick, disabled, ...props }) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"

  const variants = {
    primary:
      "bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white focus:ring-purple-500",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-900",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700 hover:text-gray-900",
  }

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-8 py-6 text-lg",
  }

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

// Custom Input Component
const Input = ({ type = "text", placeholder, className = "", ...props }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${className}`}
      {...props}
    />
  )
}

// Custom Card Component
const Card = ({ children, className = "", ...props }) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 ${className}`} {...props}>
      {children}
    </div>
  )
}

const CardContent = ({ children, className = "", ...props }) => {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  )
}

// Custom Badge Component
const Badge = ({ children, className = "", ...props }) => {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${className}`} {...props}>
      {children}
    </span>
  )
}

export default function NotationsLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)
  const featuresRef = useRef(null)
  const whyChooseRef = useRef(null)
  const [featuresInView, setFeaturesInView] = useState(false)
  const [whyChooseInView, setWhyChooseInView] = useState(false)

    const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true)

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("scroll", handleScroll)

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === featuresRef.current) {
            setFeaturesInView(entry.isIntersecting)
          }
          if (entry.target === whyChooseRef.current) {
            setWhyChooseInView(entry.isIntersecting)
          }
        })
      },
      { threshold: 0.1 },
    )

    if (featuresRef.current) observer.observe(featuresRef.current)
    if (whyChooseRef.current) observer.observe(whyChooseRef.current)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
      observer.disconnect()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-violet-50/30 overflow-x-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute w-2 h-2 bg-purple-300/30 rounded-full animate-float"
          style={{
            left: `${20 + Math.sin(scrollY * 0.01) * 10}%`,
            top: `${30 + Math.cos(scrollY * 0.01) * 5}%`,
            animationDelay: "0s",
          }}
        />
        <div
          className="absolute w-3 h-3 bg-violet-300/30 rounded-full animate-float"
          style={{
            left: `${80 + Math.sin(scrollY * 0.008) * 15}%`,
            top: `${60 + Math.cos(scrollY * 0.008) * 8}%`,
            animationDelay: "2s",
          }}
        />
        <div
          className="absolute w-1 h-1 bg-purple-400/40 rounded-full animate-float"
          style={{
            left: `${60 + Math.sin(scrollY * 0.012) * 12}%`,
            top: `${20 + Math.cos(scrollY * 0.012) * 6}%`,
            animationDelay: "4s",
          }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/60 backdrop-blur-xl border-b border-slate-200 transition-all duration-300">
        <div className="container mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-700 group-hover:text-purple-600 transition-colors duration-300">
              Notations
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {["Features", "Why Choose", "Pricing", "Contact"].map((item, index) => (
              <a // Changed Link to a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="text-gray-600 hover:text-slate-900 transition-all duration-300 hover:scale-105 relative group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all duration-300 group-hover:w-full"></span>
              </a> // Changed Link to a
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-600"  onClick={() => navigate('/Register')}>
              Sign In
            </Button>
            <Button>Get Started</Button>
          </div>

          <button
            className="md:hidden hover:scale-110 transition-transform duration-300 p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden bg-white border-t border-slate-200 transition-all duration-300 ${isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
        >
          <nav className="flex flex-col space-y-4 p-4">
            {["Features", "Why Choose", "Pricing", "Contact"].map((item, index) => (
              <a // Changed Link to a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="text-gray-600 hover:text-purple-600 transition-colors duration-300"
                style={{
                  animation: isMenuOpen ? `slideInLeft 0.3s ease-out ${index * 100}ms both` : "none",
                }}
              >
                {item}
              </a> // Changed Link to a
            ))}
            <div className="flex flex-col space-y-2 pt-4 border-t">
              <Button variant="ghost">Sign In</Button>
              <Button>Get Started</Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 to-violet-50/50" />

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-violet-200/30 rounded-full blur-3xl animate-pulse"
            style={{
              transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            }}
          />
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-violet-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse delay-1000"
            style={{
              transform: `translate(${mousePosition.x * -0.02}px, ${mousePosition.y * -0.02}px)`,
            }}
          />
        </div>

        <div className="container mx-auto px-4 lg:px-6 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div
              className={`space-y-8 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div className="space-y-4">
                <Badge className="bg-purple-100 text-purple-700 animate-bounce-gentle">🔒 Secure & Private</Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 leading-tight">
                  <span className="inline-block animate-slide-up" style={{ animationDelay: "0.2s" }}>
                    Your thoughts,
                  </span>
                  <br />
                  <span
                    className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent inline-block animate-slide-up"
                    style={{ animationDelay: "0.4s" }}
                  >
                    perfectly organized
                  </span>
                </h1>
                <p
                  className="text-xl text-gray-600 leading-relaxed animate-slide-up"
                  style={{ animationDelay: "0.6s" }}
                >
                  Capture, organize, and secure your ideas with Notations. The most intuitive note-taking platform with
                  enterprise-grade security.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: "0.8s" }}>
                <Button size="lg" className="group"  onClick={() => navigate('/register')}>
                  Start Taking Notes
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
               
              </div>

             
            </div>

            {/* Hero Illustration */}
            <div
              className={`relative transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-200/20 to-violet-200/20 rounded-3xl blur-3xl animate-pulse" />
                <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-slate-200 hover:shadow-3xl transition-all duration-500 hover:scale-105">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" />
                      <div
                        className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"
                        style={{ animationDelay: "0.5s" }}
                      />
                      <div
                        className="w-3 h-3 bg-green-400 rounded-full animate-pulse"
                        style={{ animationDelay: "1s" }}
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 bg-slate-200 rounded animate-shimmer" />
                      <div className="h-4 bg-slate-100 rounded animate-shimmer" style={{ animationDelay: "0.2s" }} />
                      <div
                        className="h-4 bg-slate-200 rounded w-3/4 animate-shimmer"
                        style={{ animationDelay: "0.4s" }}
                      />
                      <div
                        className="h-8 bg-gradient-to-r from-purple-100 to-violet-100 rounded animate-shimmer"
                        style={{ animationDelay: "0.6s" }}
                      />
                      <div
                        className="h-4 bg-slate-100 rounded w-1/2 animate-shimmer"
                        style={{ animationDelay: "0.8s" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} id="features" className="py-20 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 lg:px-6">
          <div
            className={`text-center space-y-4 mb-16 transition-all duration-1000 ${featuresInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <Badge className="bg-purple-100 text-purple-700 animate-bounce-gentle">Features</Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-800">Everything you need to stay organized</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make note-taking effortless and secure
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Bank-Grade Security",
                description:
                  "Your notes are encrypted end-to-end with AES-256 encryption. Only you can access your data.",
                color: "from-purple-400 to-violet-500",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Instant search, real-time sync, and blazing-fast performance across all your devices.",
                color: "from-amber-400 to-orange-500",
              },
              {
                icon: Search,
                title: "Smart Search",
                description: "Find any note instantly with our AI-powered search that understands context and content.",
                color: "from-pink-400 to-rose-500",
              },
              {
                icon: Smartphone,
                title: "Cross-Platform",
                description: "Access your notes anywhere - web, mobile, desktop. Your data syncs seamlessly.",
                color: "from-sky-400 to-blue-500",
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description:
                  "Share notes and collaborate with your team while maintaining full control over permissions.",
                color: "from-green-400 to-emerald-500",
              },
              {
                icon: Cloud,
                title: "Cloud Backup",
                description: "Automatic backups ensure your notes are never lost. Restore from any point in time.",
                color: "from-indigo-400 to-purple-500",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className={`group hover:shadow-xl transition-all duration-500 hover:-translate-y-3 border-gray-100 bg-white/70 backdrop-blur-sm hover:bg-white hover:scale-105 ${
                  featuresInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{
                  transitionDelay: featuresInView ? `${index * 100}ms` : "0ms",
                }}
              >
                <CardContent>
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-125 group-hover:rotate-6 transition-all duration-500`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section ref={whyChooseRef} id="why-choose" className="py-20 bg-gradient-to-br from-purple-50/20 to-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div
              className={`space-y-8 transition-all duration-1000 ${whyChooseInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
            >
              <div className="space-y-4">
                <Badge className="bg-purple-100 text-purple-700 animate-bounce-gentle">Why Choose Notations</Badge>
                <h2 className="text-3xl lg:text-5xl font-bold text-gray-800">
                  The most secure way to organize your thoughts
                </h2>
                <p className="text-xl text-gray-600">
                  Unlike other note-taking apps, we prioritize your privacy and security without compromising on
                  features.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    icon: Lock,
                    title: "Zero-Knowledge Architecture",
                    description:
                      "We can't read your notes even if we wanted to. Your data is encrypted before it leaves your device.",
                  },
                  {
                    icon: Zap,
                    title: "Blazing Fast Performance",
                    description: "Built with modern technology for instant loading and real-time collaboration.",
                  },
                  {
                    icon: Users,
                    title: "Team-First Design",
                    description: "Seamlessly collaborate with your team while maintaining individual privacy controls.",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`flex space-x-4 hover:scale-105 transition-all duration-300 ${
                      whyChooseInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                    }`}
                    style={{
                      transitionDelay: whyChooseInView ? `${(index + 1) * 200}ms` : "0ms",
                    }}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center flex-shrink-0 hover:rotate-12 transition-transform duration-300">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1 hover:text-purple-600 transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button size="lg" className="group">
                Start Your Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>

            <div
              className={`relative transition-all duration-1000 ${whyChooseInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-200/30 to-violet-200/30 rounded-3xl blur-3xl animate-pulse" />
              <div className="relative space-y-4">
                <Card
                  className="p-6 shadow-xl border-gray-100 bg-white/70 backdrop-blur-sm hover:shadow-2xl hover:scale-105 transition-all duration-500 animate-float"
                  style={{ animationDelay: "0s" }}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center hover:rotate-12 transition-transform duration-300">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-gray-800">Project Ideas</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-200 rounded animate-shimmer" />
                    <div className="h-3 bg-slate-100 rounded animate-shimmer" style={{ animationDelay: "0.2s" }} />
                    <div
                      className="h-3 bg-slate-200 rounded w-3/4 animate-shimmer"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                </Card>

                <Card
                  className="p-6 shadow-xl border-gray-100 bg-white/70 backdrop-blur-sm ml-8 hover:shadow-2xl hover:scale-105 transition-all duration-500 animate-float"
                  style={{ animationDelay: "2s" }}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center hover:rotate-12 transition-transform duration-300">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-gray-800">Meeting Notes</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-100 rounded animate-shimmer" style={{ animationDelay: "0.6s" }} />
                    <div className="h-3 bg-slate-200 rounded animate-shimmer" style={{ animationDelay: "0.8s" }} />
                    <div className="h-3 bg-slate-100 rounded w-2/3 animate-shimmer" style={{ animationDelay: "1s" }} />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-violet-700 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </div>

        <div className="container mx-auto px-4 lg:px-6 text-center relative">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-5xl font-bold text-white animate-slide-up">
              Ready to transform your note-taking?
            </h2>
            <p className="text-xl text-purple-100 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              Join thousands of users who trust Notations with their most important ideas.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up"
              style={{ animationDelay: "0.4s" }}
            >
              <Input
                type="email"
                placeholder="Enter your email address"
                className="max-w-sm bg-white/10 border-white/20 text-white placeholder:text-white/70 hover:bg-white/20 focus:scale-105"
              />
              <Button size="lg" className="bg-white text-purple-600 hover:bg-slate-100 hover:shadow-xl">
                Get Started Free
              </Button>
            </div>

            <p className="text-sm text-purple-100 animate-slide-up" style={{ animationDelay: "0.6s" }}>
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 group">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold group-hover:text-purple-400 transition-colors duration-300">
                  Notations
                </span>
              </div>
              <p className="text-slate-400">The most secure and intuitive way to organize your thoughts and ideas.</p>
            </div>

            {[
              { title: "Product", links: ["Features", "Pricing", "Security", "API"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
              { title: "Support", links: ["Help Center", "Privacy Policy", "Terms of Service", "Status"] },
            ].map((section, sectionIndex) => (
              <div key={section.title}>
                <h3 className="font-semibold mb-4 hover:text-purple-400 transition-colors duration-300">
                  {section.title}
                </h3>
                <div className="space-y-2 text-slate-400">
                  {section.links.map((link, linkIndex) => (
                    <a // Changed Link to a
                      key={link}
                      href="#"
                      className="block hover:text-white transition-all duration-300 hover:translate-x-1"
                      style={{ transitionDelay: `${linkIndex * 50}ms` }}
                    >
                      {link}
                    </a> // Changed Link to a
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p className="hover:text-white transition-colors duration-300">
              &copy; {new Date().getFullYear()} Notations. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes shimmer {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}