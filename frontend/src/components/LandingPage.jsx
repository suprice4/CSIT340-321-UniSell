import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {
  IconCheck, IconStar, IconArrow,
  IconDashboard, IconSync, IconChart, IconShield,
} from "./Icons";
import "../styles/Landingpage.css";


const FEATURES = [
  { icon: <IconDashboard />, title: "Centralized Dashboard", desc: "View and manage all your store data from Shopee, Lazada, and TikTok Shop in one place." },
  { icon: <IconSync />,      title: "Multi-Platform Sync",  desc: "Automatically sync your orders, products, and inventory across all selling platforms in real time." },
  { icon: <IconChart />,     title: "Sales Analytics",      desc: "Track your revenue, orders, and top products with clear charts and summaries per platform." },
  { icon: <IconShield />,    title: "Secure & Reliable",    desc: "Your store data is safe with us. We use secure authentication and data encryption." },
];

const PLATFORMS = [
  { name: "Shopee",      colorClass: "shopee",  desc: "Connect your Shopee store and manage orders, products, and sales all in one tab." },
  { name: "Lazada",      colorClass: "lazada",  desc: "Sync your Lazada listings and track your performance without switching apps." },
  { name: "TikTok Shop", colorClass: "tiktok",  desc: "Manage your TikTok Shop orders and see what's trending alongside your other platforms." },
];

const TESTIMONIALS = [
  { name: "Maria Santos",   role: "Shopee Seller",          stars: 5, review: "I used to open 3 different apps just to check my orders. Now everything is in one dashboard. Game changer!" },
  { name: "Carlo Reyes",    role: "Lazada & TikTok Seller", stars: 5, review: "The platform breakdown feature helped me see that TikTok Shop actually brings in more revenue. Really useful." },
  { name: "Ana Villanueva", role: "Multi-Platform Seller",  stars: 4, review: "Super easy to use. The order filters and search make it so much faster to find what I'm looking for." },
];

const STATS = [
  { value: "3,800+", label: "Orders Managed" },
  { value: "3",      label: "Platforms Supported" },
  { value: "876+",   label: "Registered Sellers" },
  { value: "₱284K+", label: "Revenue Tracked" },
];

const PLATFORM_OVERVIEW = [
  { name: "Shopee",      orders: 580, rev: "₱118,200" },
  { name: "Lazada",      orders: 420, rev: "₱96,700"  },
  { name: "TikTok Shop", orders: 340, rev: "₱69,600"  },
];

const INCLUDED_FEATURES = [
  "Centralized order management",
  "Multi-platform sales tracking",
  "Revenue and order analytics",
  "Platform-specific breakdowns",
  "Order search and filtering",
  "Secure account management",
];


export default function LandingPage() {
  const navigate   = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleViewDashboard = () => {
    if (!isLoggedIn) { navigate("/login"); return; }
    navigate("/dashboard");
  };

  return (
    <div className="lp-page">
      <Navbar activePage="/" />

      <section className="lp-hero">
        <div className="lp-hero__left">
          <span className="lp-hero__tag">Multi-Platform Management</span>
          <h1 className="lp-hero__title">
            Manage All Your<br />Online Stores<br />In One Place
          </h1>
          <p className="lp-hero__sub">
            Stop switching between Shopee, Lazada, and TikTok Shop.
            Our centralized platform lets you track orders, monitor sales,
            and manage products all from a single dashboard.
          </p>
          <div className="lp-hero__btns">
            {isLoggedIn ? (
              <button className="lp-btn lp-btn--primary" onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
            ) : (
              <>
                <button className="lp-btn lp-btn--primary" onClick={() => navigate("/register")}>Get Started Free</button>
                <button className="lp-btn lp-btn--secondary" onClick={() => navigate("/login")}>Log In</button>
              </>
            )}
          </div>
        </div>

        <div className="lp-hero__right">
          <div className="lp-hero-card">
            <p className="lp-hero-card__title">📊 Platform Overview</p>
            {PLATFORM_OVERVIEW.map((p) => (
              <div key={p.name}>
                <div className="lp-hero-card__row">
                  <span className="lp-hero-card__label">{p.name}</span>
                  <span className="lp-hero-card__val">{p.rev}</span>
                </div>
                <div className="lp-hero-card__row">
                  <span className="lp-hero-card__sub">{p.orders} orders</span>
                </div>
                <div className="lp-hero-card__divider" />
              </div>
            ))}
            <div className="lp-hero-card__row">
              <span className="lp-hero-card__total-label">Total Revenue</span>
              <span className="lp-hero-card__total-val">₱284,500</span>
            </div>
          </div>
        </div>
      </section>

      <div className="lp-stats-bar">
        {STATS.map((s) => (
          <div key={s.label} className="lp-stat-item">
            <div className="lp-stat-item__val">{s.value}</div>
            <div className="lp-stat-item__label">{s.label}</div>
          </div>
        ))}
      </div>

      <section className="lp-section">
        <p className="lp-section__tag">Why Choose Us</p>
        <h2 className="lp-section__title">Everything you need to sell smarter</h2>
        <p className="lp-section__sub">One platform to replace all the tabs you have open right now.</p>
        <div className="lp-feat-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="lp-feat-card">
              <div className="lp-feat-card__icon">{f.icon}</div>
              <p className="lp-feat-card__title">{f.title}</p>
              <p className="lp-feat-card__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lp-section lp-section--alt">
        <p className="lp-section__tag">Supported Platforms</p>
        <h2 className="lp-section__title">All your platforms, one dashboard</h2>
        <p className="lp-section__sub">We support the biggest e-commerce platforms in Southeast Asia.</p>
        <div className="lp-plat-grid">
          {PLATFORMS.map((p) => (
            <div key={p.name} className={`lp-plat-card lp-plat-card--${p.colorClass}`}>
              <p className={`lp-plat-card__name lp-plat-card__name--${p.colorClass}`}>{p.name}</p>
              <p className="lp-plat-card__desc">{p.desc}</p>
              <button className={`lp-plat-card__link lp-plat-card__link--${p.colorClass}`} onClick={handleViewDashboard}>
                View Dashboard <IconArrow />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="lp-section">
        <p className="lp-section__tag">How It Works</p>
        <h2 className="lp-section__title">Get started in 3 easy steps</h2>
        <p className="lp-section__sub">No complicated setup. Just sign up, connect, and manage.</p>
        <div className="lp-steps-row">
          {[
            { num: "1", title: "Create an Account",   desc: "Sign up for free and set up your seller profile in minutes." },
            { num: "2", title: "Connect Your Stores", desc: "Link your Shopee, Lazada, and TikTok Shop accounts to the platform." },
            { num: "3", title: "Manage Everything",   desc: "Track orders, monitor sales, and manage products all from one dashboard." },
          ].map((step) => (
            <div key={step.num} className="lp-step">
              <div className="lp-step__num">{step.num}</div>
              <p className="lp-step__title">{step.title}</p>
              <p className="lp-step__desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lp-section lp-section--alt">
        <p className="lp-section__tag">What's Included</p>
        <h2 className="lp-section__title">Everything is free for sellers</h2>
        <p className="lp-section__sub">No hidden fees. All features are available to all registered sellers.</p>
        <div className="lp-included-grid">
          {INCLUDED_FEATURES.map((item) => (
            <div key={item} className="lp-included-item">
              <IconCheck />{item}
            </div>
          ))}
        </div>
      </section>

      <section className="lp-section">
        <p className="lp-section__tag">What Sellers Say</p>
        <h2 className="lp-section__title">Trusted by sellers across platforms</h2>
        <p className="lp-section__sub">Here's what our users have to say about the platform.</p>
        <div className="lp-test-grid">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="lp-test-card">
              <div className="lp-test-card__stars">
                {Array.from({ length: t.stars }).map((_, i) => <IconStar key={i} />)}
              </div>
              <p className="lp-test-card__review">"{t.review}"</p>
              <p className="lp-test-card__name">{t.name}</p>
              <p className="lp-test-card__role">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lp-cta">
        <h2 className="lp-cta__title">Ready to simplify your selling?</h2>
        <p className="lp-cta__sub">Join hundreds of sellers managing their stores smarter with our platform.</p>
        {isLoggedIn ? (
          <button className="lp-btn lp-btn--primary" onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
        ) : (
          <>
            <button className="lp-btn lp-btn--primary" onClick={() => navigate("/register")}>Create Free Account</button>
            <button className="lp-btn lp-btn--outline" onClick={() => navigate("/login")}>Log In</button>
          </>
        )}
      </section>

      <Footer />
    </div>
  );
}