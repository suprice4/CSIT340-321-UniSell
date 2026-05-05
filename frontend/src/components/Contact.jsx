import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { IconPin, IconPhone, IconMail, IconClock } from "./Icons";
import "../styles/Contact.css";


const CONTACT_INFO = [
  { icon: <IconPin />,   label: "Address",       value: "123 Commerce Street, New York, NY 10001" },
  { icon: <IconPhone />, label: "Phone",          value: "+1 (555) 123-4567" },
  { icon: <IconMail />,  label: "Email",          value: "ecommercemarketplace@gmail.com" },
  { icon: <IconClock />, label: "Business Hours", value: "Mon – Fri, 9:00 AM – 6:00 PM" },
];

const FAQS = [
  { q: "How do I connect my Shopee store?",        a: "After logging in, go to the Dashboard and click 'Connect Platform'. Follow the steps to link your Shopee account." },
  { q: "Is the platform free to use?",             a: "Yes! All features are completely free for registered sellers. No hidden fees or subscriptions." },
  { q: "Which platforms are supported?",           a: "We currently support Shopee, Lazada, and TikTok Shop, with more platforms coming soon." },
  { q: "How long does it take to get a response?", a: "We aim to respond to all messages within 24 hours on business days." },
];

export default function Contact() {
  const navigate = useNavigate();

  const [form, setForm]           = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors]       = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq]     = useState(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  useEffect(() => {
    if (Object.keys(errors).length > 0) setErrors({});
  }, [form]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};
    if (!form.name)    newErrors.name    = "Name is required.";
    if (!form.email)   newErrors.email   = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Enter a valid email.";
    if (!form.subject) newErrors.subject = "Subject is required.";
    if (!form.message) newErrors.message = "Message is required.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      <Navbar activePage="/contact" />

      <section className="contact-hero">
        <span className="contact-hero__tag">Contact Us</span>
        <h1 className="contact-hero__title">We'd Love to Hear From You</h1>
        <p className="contact-hero__sub">
          Have a question, a suggestion, or just want to say hi?
          Fill out the form and we'll get back to you as soon as possible.
        </p>
      </section>

      <div className="contact-content">

        <div className="contact-info-card">
          <p className="contact-info-card__title">Contact Information</p>

          {CONTACT_INFO.map((info) => (
            <div key={info.label} className="contact-info-row">
              <div className="contact-info-icon-box">{info.icon}</div>
              <div>
                <p className="contact-info-label">{info.label}</p>
                <p className="contact-info-value">{info.value}</p>
              </div>
            </div>
          ))}

          <div className="contact-info-divider" />

          <p className="contact-social-heading">Follow Us</p>
          <div className="contact-social-row">
            {["f", "t", "ig", "yt"].map((s) => (
              <span key={s} className="contact-social-icon">{s}</span>
            ))}
          </div>
        </div>

        <div className="contact-form-card">
          <p className="contact-form-card__title">Send Us a Message</p>

          {submitted ? (
            <div className="contact-success-box">
              <p className="contact-success-icon">✅</p>
              <p className="contact-success-title">Message Sent!</p>
              <p className="contact-success-sub">
                Thanks, <strong>{form.name}</strong>! We'll get back to you within 24 hours.
              </p>
              <button
                className="contact-success-btn"
                onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="contact-form-group">
                <label className="contact-label">Full Name</label>
                <input
                  className={`contact-input${errors.name ? " contact-input--error" : ""}`}
                  name="name" type="text" placeholder="Enter your name"
                  value={form.name} onChange={handleChange}
                />
                {errors.name && <p className="contact-error-text">{errors.name}</p>}
              </div>

              <div className="contact-form-group">
                <label className="contact-label">Email Address</label>
                <input
                  className={`contact-input${errors.email ? " contact-input--error" : ""}`}
                  name="email" type="email" placeholder="Enter your email"
                  value={form.email} onChange={handleChange}
                />
                {errors.email && <p className="contact-error-text">{errors.email}</p>}
              </div>

              <div className="contact-form-group">
                <label className="contact-label">Subject</label>
                <input
                  className={`contact-input${errors.subject ? " contact-input--error" : ""}`}
                  name="subject" type="text" placeholder="What is this about?"
                  value={form.subject} onChange={handleChange}
                />
                {errors.subject && <p className="contact-error-text">{errors.subject}</p>}
              </div>

              <div className="contact-form-group">
                <label className="contact-label">Message</label>
                <textarea
                  className={`contact-textarea${errors.message ? " contact-input--error" : ""}`}
                  name="message" placeholder="Write your message here..."
                  value={form.message} onChange={handleChange}
                />
                {errors.message && <p className="contact-error-text">{errors.message}</p>}
              </div>

              <button type="submit" className="contact-submit-btn">Send Message</button>
            </form>
          )}
        </div>
      </div>

      <div className="contact-faq-section">
        <p className="contact-faq__tag">FAQ</p>
        <h2 className="contact-faq__title">Frequently Asked Questions</h2>
        <p className="contact-faq__sub">Quick answers to common questions.</p>

        {FAQS.map((faq, i) => (
          <div key={i} className="contact-faq-item">
            <button
              className={`contact-faq-q${openFaq === i ? " contact-faq-q--open" : ""}`}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              {faq.q}
              <span>{openFaq === i ? "▲" : "▼"}</span>
            </button>
            {openFaq === i && <p className="contact-faq-a">{faq.a}</p>}
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}