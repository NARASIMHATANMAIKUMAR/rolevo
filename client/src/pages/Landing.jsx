import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Landing() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoError, setDemoError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const slides = [
    {
      badge: '📋 Visual Career Pipeline',
      title: 'Track Every Job From Apply to Signed Offer',
      desc: 'Toss the clunky spreadsheets. Rolevo gives you an intuitive Kanban board and clean data table to monitor interview rounds, locations, and salary targets in one calm space.',
      previewType: 'kanban',
    },
    {
      badge: '⏰ Proactive Intelligence',
      title: 'Never Let An Opportunity Go Cold',
      desc: 'Rolevo automatically calculates when an application has been waiting for more than 7 days, flagging it with a smart "Follow Up" indicator so you always stay top-of-mind with recruiters.',
      previewType: 'followup',
    },
    {
      badge: '⭐ Dream Targets & Analytics',
      title: 'Prioritize Top Companies & Track Response Rates',
      desc: 'Bookmark your dream companies with gold stars, monitor your real-time interview conversion rate, and export formatted CSV reports whenever you need to share progress.',
      previewType: 'analytics',
    },
  ];

  // Auto-advance slides every 5.5s unless hovered
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  async function handleInstantDemo() {
    setDemoLoading(true);
    setDemoError('');
    try {
      const res = await api.post('/auth/login', {
        email: 'narasimhatanmaikumar@gmail.com',
        password: 'rolevo123',
      });
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setDemoError(getErrorMessage(err));
    } finally {
      setDemoLoading(false);
    }
  }

  return (
    <div className="landing-hero">
      {/* Top Banner & Header Intro */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div className="landing-header-badge">
          <span>✨</span> Smart Career & Job Application Tracker
        </div>
        <h1 className="landing-title">
          Master your job hunt with <span className="highlight-mocha">Rolevo</span>
        </h1>
        <p className="landing-subtitle" style={{ margin: '0 auto 28px' }}>
          An elegant, distraction-free workspace designed to track applications, follow-ups, interview stages, and dream offers.
        </p>

        {/* Primary Call to Action Buttons */}
        <div className="landing-cta-row" style={{ justifyContent: 'center' }}>
          <Link to="/register" className="btn btn-primary btn-large">
            <span>🚀</span> Register for Free
          </Link>
          <button
            type="button"
            className="btn btn-large"
            onClick={handleInstantDemo}
            disabled={demoLoading}
            style={{
              borderColor: 'var(--mocha-border)',
              background: '#ffffff',
              color: 'var(--mocha-dark)',
            }}
          >
            {demoLoading ? 'Launching Demo...' : '⚡ Explore Live Demo'}
          </button>
          <Link to="/login" className="btn btn-large" style={{ background: 'transparent' }}>
            Sign In ➔
          </Link>
        </div>

        {demoError && (
          <div className="alert" style={{ maxWidth: '440px', margin: '0 auto' }}>
            {demoError}
          </div>
        )}
      </div>

      {/* The Interactive Sliding Showcase */}
      <div
        className="showcase-slider-wrap"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="showcase-slide-content">
          {/* Left: Slide Text Explanation */}
          <div className="slide-text-col">
            <span className="slide-badge">{slides[currentSlide].badge}</span>
            <h2 className="slide-heading">{slides[currentSlide].title}</h2>
            <p className="slide-desc">{slides[currentSlide].desc}</p>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Link to="/register" className="btn btn-primary">
                Get Started Free ➔
              </Link>
              <span className="small muted">No credit card required</span>
            </div>
          </div>

          {/* Right: Rich Interactive Visual Preview Mockup */}
          <div className="slide-preview-col">
            {currentSlide === 0 && (
              <div className="mock-kanban">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '13px', color: 'var(--text)' }}>Application Pipeline</strong>
                  <span className="badge badge-offer">Active Cycle</span>
                </div>

                <div className="mock-card">
                  <div>
                    <div className="mock-card-title">Google ⭐</div>
                    <div className="mock-card-sub">Software Engineer I • Bengaluru</div>
                  </div>
                  <span className="badge badge-offer">Offer</span>
                </div>

                <div className="mock-card">
                  <div>
                    <div className="mock-card-title">Microsoft ⭐</div>
                    <div className="mock-card-sub">SDE-1 • Hyderabad</div>
                  </div>
                  <span className="badge badge-interview">Interview</span>
                </div>

                <div className="mock-card">
                  <div>
                    <div className="mock-card-title">Amazon ⭐</div>
                    <div className="mock-card-sub">SDE Intern • Bengaluru</div>
                  </div>
                  <span className="badge badge-applied">Applied</span>
                </div>
              </div>
            )}

            {currentSlide === 1 && (
              <div className="mock-kanban" style={{ borderLeft: '4px solid var(--interview)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '13px', color: 'var(--text)' }}>Follow-up Intelligence</strong>
                  <span className="followup">⏰ Follow up</span>
                </div>

                <div className="mock-card" style={{ background: '#FFFBEB', borderColor: '#FDE68A' }}>
                  <div>
                    <div className="mock-card-title">Zoho • Product Developer</div>
                    <div className="mock-card-sub">Applied 14 days ago • No response yet</div>
                  </div>
                </div>

                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', background: '#FAF8F6', padding: '10px', borderRadius: '6px' }}>
                  💡 <strong>Suggested action:</strong> Send a polite follow-up email to recruiter referencing your referral and portfolio.
                </div>
              </div>
            )}

            {currentSlide === 2 && (
              <div className="mock-analytics-card">
                <div className="stat-label">Response Rate</div>
                <div className="mock-stat-number">75%</div>
                <div className="stat-bar-track" style={{ height: '8px', margin: '12px auto', maxWidth: '240px' }}>
                  <div className="stat-bar-fill" style={{ width: '75%' }}></div>
                </div>
                <p className="small muted" style={{ margin: '8px 0 14px' }}>
                  6 out of 8 applications progressed to interviews or offers
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                  <span className="badge-starred">⭐ 4 Dream Companies</span>
                  <span className="badge badge-applied">📥 CSV Ready</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Slider Bar with Dots and Arrows */}
        <div className="slider-footer-bar">
          <div className="slider-dots">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`slider-dot ${idx === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="slider-arrows">
            <button
              type="button"
              className="slider-arrow-btn"
              onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
              aria-label="Previous slide"
            >
              ←
            </button>
            <button
              type="button"
              className="slider-arrow-btn"
              onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
              aria-label="Next slide"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="landing-features-grid">
        <div className="landing-feature-card">
          <div className="landing-feature-icon">📊</div>
          <h3 className="landing-feature-title">Dual View Flexibility</h3>
          <p className="landing-feature-text">
            Switch effortlessly between a visual Kanban board and a fast spreadsheet list view. Track salaries, locations, and dates your way.
          </p>
        </div>

        <div className="landing-feature-card">
          <div className="landing-feature-icon">⭐</div>
          <h3 className="landing-feature-title">Dream Company Focus</h3>
          <p className="landing-feature-text">
            Mark your top aspirational employers with priority stars. Filter them instantly with a single click to focus your prep where it counts most.
          </p>
        </div>

        <div className="landing-feature-card">
          <div className="landing-feature-icon">📥</div>
          <h3 className="landing-feature-title">Export Anytime</h3>
          <p className="landing-feature-text">
            Your data belongs to you. Download comprehensive CSV spreadsheet reports of your application history, notes, and milestones with zero friction.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Landing;
