import Glossary from '@/components/Glossary';
// import Timeline from '@/components/Timeline';
import { useState } from 'react';
function ContactSection() {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
      if (res.ok) {
        setSubmitted(true);
        setName('');
        setEmail('');
        setMessage('');
      } else {
        alert('Failed to send message. Please try again later.');
      }
    } catch {
      alert('Network error. Please try again later.');
    }
  }

  return (
    <section className="max-w-2xl mx-auto my-16 p-6 border rounded bg-card card-hover-scale" aria-labelledby="contact-heading">
      <h2 id="contact-heading" className="text-2xl font-bold mb-3">{t('contact.title')}</h2>
      <p className="mb-6 text-muted-foreground">{t('contact.description')}</p>
      {submitted && (
        <div className="mb-4 text-green-600 text-sm" role="status" aria-live="polite">
          {t('contact.thankyou')}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="contact-name" className="block text-sm font-medium mb-1">
            {t('contact.name')}
          </label>
          <input
            id="contact-name"
            className="w-full p-2 rounded border bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            type="text"
            autoComplete="name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium mb-1">
            {t('contact.email')}
          </label>
          <input
            id="contact-email"
            className="w-full p-2 rounded border bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            type="email"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="contact-message" className="block text-sm font-medium mb-1">
            {t('contact.message')}
          </label>
          <textarea
            id="contact-message"
            className="w-full p-2 rounded border bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            rows={5}
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full p-3 bg-primary text-primary-foreground rounded font-semibold transition-base hover:brightness-110 active:brightness-90">
          {t('contact.submit')}
        </button>
      </form>
    </section>
  );
}
import { useLanguage } from '@/contexts/LanguageContext';
function AboutSection() {
  const { t } = useLanguage();
  return (
    <section className="max-w-3xl mx-auto my-20 p-6 border rounded bg-card card-hover-scale" aria-labelledby="about-heading">
      <h2 id="about-heading" className="text-3xl font-bold mb-4">{t('about.title')}</h2>
      <p className="mb-4 leading-relaxed text-muted-foreground">{t('about.description')}</p>
      <p className="leading-relaxed">{t('about.mission')}</p>
    </section>
  );
}
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';

export default function Home() {
  return (
    <main id="main" tabIndex={-1} className="focus:outline-none">
      <HeroSection />
      <div className="section-y-md">
        <FeaturesSection />
      </div>
      <div className="section-y-md">
        <AboutSection />
      </div>
      {/* Glossary removed from homepage. Will be added to a separate page. */}
      {/* <Timeline /> */}
      <div className="section-y-md">
        <ContactSection />
      </div>
    </main>
  );
}