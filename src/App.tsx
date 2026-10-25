import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Phone, 
  CheckCircle2, 
  X, 
  Scale, 
  Shield, 
  FileText, 
  Copy, 
  MessageSquare,
  MapPin
} from 'lucide-react';

interface BookingData {
  name: string;
  phone: string;
  practice: string;
  urgency: 'urgent' | 'standard';
  description: string;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'telegram' | 'practice' | 'process' | 'faq' | 'pricing' | null>(null);
  const [botUsername, setBotUsername] = useState('olena_kovalenko_law_bot');
  const [copied, setCopied] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [booking, setBooking] = useState<BookingData>({
    name: '',
    phone: '',
    practice: 'Кримінальний захист та супровід',
    urgency: 'urgent',
    description: ''
  });

  const heroPhotoRef = useRef<HTMLDivElement>(null);

  // Entrance animation listener & fallback per spec
  useEffect(() => {
    const appearElements = document.querySelectorAll<HTMLElement>('.appear');
    
    appearElements.forEach((el) => {
      const handleEnd = () => {
        el.classList.add('is-in');
      };
      el.addEventListener('animationend', handleEnd, { once: true });
    });

    if (heroPhotoRef.current) {
      const handlePhotoEnd = () => {
        heroPhotoRef.current?.classList.add('is-in');
      };
      heroPhotoRef.current.addEventListener('animationend', handlePhotoEnd, { once: true });
    }

    // Two rAF fallback check
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        appearElements.forEach((el) => {
          const animations = el.getAnimations ? el.getAnimations() : [];
          const isRunning = animations.some(
            (a) => a.playState === 'running' || a.playState === 'finished'
          );
          if (!isRunning) {
            el.classList.add('is-in');
          }
        });
        if (heroPhotoRef.current) {
          heroPhotoRef.current.classList.add('is-in');
        }
      });
    });

    // Handle ESC key to close modals or menu
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setActiveModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Handle resize >= 901px to close mobile menu
    const handleResize = () => {
      if (window.innerWidth >= 901) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Sync menu-open class with document body
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  }, [menuOpen]);

  const generateTelegramMessage = () => {
    return encodeURIComponent(
      `⚖️ Запит на правову допомогу (Кривий Ріг):\n` +
      `👤 Довіритель: ${booking.name || 'Не вказано'}\n` +
      `📞 Телефон: ${booking.phone || 'Не вказано'}\n` +
      `📁 Категорія: ${booking.practice}\n` +
      `⚡ Терміновість: ${booking.urgency === 'urgent' ? 'Терміново (сьогодні)' : 'Планова консультація'}\n` +
      (booking.description ? `📝 Коротко про справу: ${booking.description}\n` : '') +
      `📍 Локація: Кривий Ріг`
    );
  };

  const handleOpenTelegram = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const msg = generateTelegramMessage();
    const directTelegramUrl = `https://t.me/${botUsername}?start=${encodeURIComponent('consultation')}&text=${msg}`;
    
    window.open(directTelegramUrl, '_blank', 'noopener,noreferrer');
    setBookingSuccess(true);
    setTimeout(() => setBookingSuccess(false), 5000);
  };

  const copyToClipboard = () => {
    const rawMsg = 
      `⚖️ Запит на правову допомогу (Кривий Ріг):\n` +
      `👤 Довіритель: ${booking.name || 'Не вказано'}\n` +
      `📞 Телефон: ${booking.phone || 'Не вказано'}\n` +
      `📁 Категорія: ${booking.practice}\n` +
      `⚡ Терміновість: ${booking.urgency === 'urgent' ? 'Терміново (сьогодні)' : 'Планова консультація'}\n` +
      (booking.description ? `📝 Опис: ${booking.description}\n` : '') +
      `📍 Локація: Кривий Ріг`;
    
    navigator.clipboard.writeText(rawMsg).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <>
      {/* 1. Grain overlay */}
      <div className="grain" aria-hidden="true" />

      {/* 2. Hero Photo Background (Lady Justice / Themis shrouded in atmospheric mist, naturally holding scales) */}
      <div 
        ref={heroPhotoRef}
        className="hero-photo-wrapper"
        aria-hidden="true"
      >
        <div className="themis-stage">
          <img 
            src="/src/assets/images/themis_justice_mist_1792923117808.jpg" 
            alt="Феміда - символ правосуддя та закону" 
            className="themis-bg-img"
          />
          {/* Measured atmospheric scrim for contrast */}
          <div className="themis-scrim" />
          {/* Subtle volumetric mist pulse */}
          <div className="mist-layer" />
        </div>
      </div>

      {/* 3. Single-Viewport Page Framework */}
      <div className="page">
        {/* Mobile backdrop */}
        <div 
          className="menu-backdrop" 
          onClick={() => setMenuOpen(false)} 
          aria-hidden="true" 
        />

        {/* Header — 3-zone grid */}
        <header className="header" role="banner">
          {/* Zone 1: Logo (Left) */}
          <a 
            href="#top" 
            className="logo appear appear--scale" 
            style={{ '--d': '0.08s' } as React.CSSProperties}
            aria-label="Адвокат Олена Коваленко Кривий Ріг"
          >
            {/* Mark SVG 22x22 rotated -30 deg */}
            <svg 
              width="22" 
              height="22" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="shrink-0"
              aria-hidden="true"
            >
              <g transform="rotate(-30 12 12)">
                <circle cx="7.3" cy="3.2" r="1.45" />
                <rect x="5.5" y="4.7" width="3.6" height="14.6" rx="1.8" />
                <rect x="14.9" y="4.7" width="3.6" height="14.6" rx="1.8" />
                <circle cx="16.7" cy="20.8" r="1.45" />
              </g>
            </svg>
            <span>
              Коваленко<span className="logo-suffix">.law</span>
            </span>
          </a>

          {/* Zone 2: Liquid-metal Navigation (Center) */}
          <nav 
            id="site-nav" 
            aria-label="Primary"
            role="navigation"
          >
            <button
              type="button"
              onClick={() => { setActiveModal('practice'); setMenuOpen(false); }}
              className="nav-pill appear appear--scale"
              style={{ '--d': '0.16s' } as React.CSSProperties}
            >
              Практика
            </button>
            <button
              type="button"
              onClick={() => { setActiveModal('process'); setMenuOpen(false); }}
              className="nav-pill appear appear--soft"
              style={{ '--d': '0.28s' } as React.CSSProperties}
            >
              Як ми працюємо
            </button>
            <button
              type="button"
              onClick={() => { setActiveModal('faq'); setMenuOpen(false); }}
              className="nav-pill appear appear--scale"
              style={{ '--d': '0.40s' } as React.CSSProperties}
            >
              Питання
            </button>
            <button
              type="button"
              onClick={() => { setActiveModal('pricing'); setMenuOpen(false); }}
              className="nav-pill appear appear--soft"
              style={{ '--d': '0.52s' } as React.CSSProperties}
            >
              Гонорар
            </button>
          </nav>

          {/* Zone 3: CTA & Mobile Burger (Right) */}
          <div className="flex items-center gap-3 justify-self-end">
            <button
              type="button"
              onClick={() => setActiveModal('telegram')}
              className="btn btn-solid header-cta appear appear--scale"
              style={{ '--d': '0.34s' } as React.CSSProperties}
            >
              <Send className="w-3.5 h-3.5 mr-2" />
              Запис у Telegram
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="burger-btn appear appear--scale"
              style={{ '--d': '0.34s' } as React.CSSProperties}
              aria-controls="site-nav"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Закрити меню" : "Відкрити меню"}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className="burger-bar" />
              <span className="burger-bar" />
              <span className="burger-bar" />
            </button>
          </div>
        </header>

        {/* Main Hero Section (Bottom-centered) */}
        <main className="hero" id="top">
          <div className="hero-copy">
            {/* Badge */}
            <div 
              className="badge appear appear--pop"
              style={{ '--d': '0.22s' } as React.CSSProperties}
            >
              <span className="badge-star" aria-hidden="true">
                <svg width="18" height="20" viewBox="0 0 24 24" fill="#ffffff">
                  <path d="M12 2.6C12.55 2.6 12.88 3.15 13.08 4.7c.62 4.7 1.52 5.6 6.22 6.22 1.55.2 2.1.53 2.1 1.08s-.55.88-2.1 1.08c-4.7.62-5.6 1.52-6.22 6.22-.2 1.55-.53 2.1-1.08 2.1s-.88-.55-1.08-2.1c-.62-4.7-1.52-5.6-6.22-6.22C3.15 12.88 2.6 12.55 2.6 12s.55-.88 2.1-1.08c4.7-.62 5.6-1.52 6.22-6.22C11.12 3.15 11.45 2.6 12 2.6Z" />
                </svg>
              </span>
              <span>Адвокатська практика · Кривий Ріг</span>
            </div>

            {/* H1 Headline (Two masked lines) */}
            <h1>
              <span 
                className="headline-line appear appear--mask"
                style={{ '--d': '0.42s' } as React.CSSProperties}
              >
                Захист <em>ваших прав</em> та
              </span>
              <span 
                className="headline-line appear appear--mask"
                style={{ '--d': '0.62s' } as React.CSSProperties}
              >
                інтересів у Кривому Розі.
              </span>
            </h1>

            {/* Lede Paragraph */}
            <p 
              className="lede appear appear--soft"
              style={{ 
                '--d': '0.82s',
                animationDuration: '1.25s'
              } as React.CSSProperties}
            >
              Досвідчена адвокатеса Олена Коваленко. Безкомпромісний правовий захист у кримінальних, сімейних, цивільних та військових справах із персональною відповідальністю за результат.
            </p>

            {/* Hero Actions */}
            <div className="hero-actions">
              <button
                type="button"
                onClick={() => setActiveModal('telegram')}
                className="btn btn-solid hero-btn-solid appear appear--btn"
                style={{ '--d': '0.96s' } as React.CSSProperties}
              >
                <Send className="w-4 h-4 mr-2" />
                Швидкий запис у Telegram-бот
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('practice')}
                className="btn hero-btn-ghost appear appear--side"
                style={{ '--d': '1.10s' } as React.CSSProperties}
              >
                Переглянути галузі практики
              </button>
            </div>
          </div>
        </main>

        {/* Stats Footer (Exact 3 items with specific SVGs) */}
        <footer className="stats" role="contentinfo">
          {/* Stat 1: Dual-pill workflow icon */}
          <div 
            className="stat appear appear--stat"
            style={{ '--d': '1.12s' } as React.CSSProperties}
          >
            <svg 
              className="stat-icon" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="statPill1" x1="3" y1="2" x2="14" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#ffffff" stopOpacity="0.38" />
                  <stop offset="1" stopColor="#3a3a3a" stopOpacity="0.62" />
                </linearGradient>
                <linearGradient id="statPill2" x1="13" y1="2" x2="24" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3a3a3a" stopOpacity="0.38" />
                  <stop offset="1" stopColor="#ffffff" stopOpacity="0.62" />
                </linearGradient>
              </defs>
              <rect x="3.4" y="2.6" width="7.2" height="18.8" rx="3.6" fill="url(#statPill1)" />
              <rect x="13.4" y="2.6" width="7.2" height="18.8" rx="3.6" fill="url(#statPill2)" />
              <rect x="9.2" y="10.9" width="5.6" height="2.2" rx="1.1" fill="#4a4a4a" />
            </svg>
            <span>12+ років бездоганної практики</span>
          </div>

          {/* Stat 2: Download tile icon */}
          <div 
            className="stat appear appear--stat"
            style={{ '--d': '1.28s' } as React.CSSProperties}
          >
            <svg 
              className="stat-icon" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect x="2.4" y="2.4" width="19.2" height="19.2" rx="6.2" fill="#ffffff" />
              <path d="M12 7.1v7.4" stroke="#111111" strokeWidth="1.85" strokeLinecap="round" />
              <path d="M8.15 12.35L12 16.2l3.85-3.85" stroke="#111111" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>94% виграних справ та угод</span>
          </div>

          {/* Stat 3: Wide 3-avatars icon */}
          <div 
            className="stat appear appear--stat"
            style={{ '--d': '1.44s' } as React.CSSProperties}
          >
            <svg 
              className="stat-icon-wide" 
              viewBox="0 0 40 22" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Dark avatar */}
              <circle cx="10.2" cy="11" r="9.2" fill="#2b2b2b" />
              <ellipse cx="10.2" cy="12.1" rx="4.15" ry="3.7" fill="#f4f4f4" />
              <polygon points="7.2,5.5 8.8,3.2 9.8,5.5" fill="#f4f4f4" />
              <polygon points="13.2,5.5 11.6,3.2 10.6,5.5" fill="#f4f4f4" />
              <circle cx="8.9" cy="11.5" r="0.7" fill="#1a1a1a" />
              <circle cx="11.5" cy="11.5" r="0.7" fill="#1a1a1a" />

              {/* White avatar */}
              <circle cx="20.2" cy="11" r="9.2" fill="#ffffff" />
              <circle cx="17.8" cy="10" r="1.7" fill="#111111" />
              <circle cx="22.6" cy="10" r="1.7" fill="#111111" />
              <ellipse cx="20.2" cy="12.2" rx="1.1" ry="0.8" fill="#111111" />
              <path d="M18.4 14.2C19.2 15.3 21.2 15.3 22 14.2" stroke="#111111" strokeWidth="1.2" strokeLinecap="round" />

              {/* Orange badge avatar */}
              <circle cx="30.2" cy="11" r="9.2" fill="#f26b1d" />
              <text 
                x="30.2" 
                y="15.1" 
                fill="#ffffff" 
                fontSize="12.5" 
                fontWeight="700" 
                textAnchor="middle" 
                fontFamily="Inter, sans-serif"
              >
                §
              </text>
            </svg>
            <span>850+ захищених довірителів</span>
          </div>
        </footer>
      </div>

      {/* ================= MODAL: TELEGRAM BOT QUICK BOOKING ================= */}
      {activeModal === 'telegram' && (
        <div 
          className="glass-modal-backdrop" 
          onClick={() => setActiveModal(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="telegram-modal-title"
        >
          <div 
            className="glass-modal" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 rounded-md transition-colors"
              aria-label="Закрити вікно"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Lockup */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 shrink-0">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 id="telegram-modal-title" className="text-lg font-semibold text-white tracking-tight">
                  Швидкий запис через Telegram
                </h3>
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <span>Бот: @{botUsername}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-400">В мережі 24/7</span>
                </div>
              </div>
            </div>

            {/* Quick explanation */}
            <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
              Заповніть коротку форму для формування запиту або відкрийте Telegram-бот одразу. Бот збереже конфіденційність та запропонує найближчий зручний час для очної або онлайн-консультації.
            </p>

            {/* Form */}
            <form onSubmit={handleOpenTelegram} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Спеціалізація справи
                </label>
                <select 
                  value={booking.practice}
                  onChange={(e) => setBooking({ ...booking, practice: e.target.value })}
                  className="w-full bg-neutral-900/90 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-neutral-400 transition-colors"
                >
                  <option value="Кримінальний захист та супровід">⚖️ Кримінальний захист (ст. 208, допити, обшуки)</option>
                  <option value="Військове право та мобілізація">🛡️ Військове право (ВЛК, рапорти, відстрочки)</option>
                  <option value="Сімейне право та розлучення">🏛️ Сімейні спори (розлучення, поділ майна, аліменти)</option>
                  <option value="Цивільні та майнові спори">📑 Цивільні спори, спадщина, нерухомість</option>
                  <option value="Захист бізнесу та господарські спори">💼 Захист бізнесу та супровід договорів</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Ваше ім'я
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="Олександр"
                    value={booking.name}
                    onChange={(e) => setBooking({ ...booking, name: e.target.value })}
                    className="w-full bg-neutral-900/90 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-neutral-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Номер телефону
                  </label>
                  <input 
                    type="tel"
                    required
                    placeholder="+380 (67) 000-00-00"
                    value={booking.phone}
                    onChange={(e) => setBooking({ ...booking, phone: e.target.value })}
                    className="w-full bg-neutral-900/90 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-neutral-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Терміновість
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBooking({ ...booking, urgency: 'urgent' })}
                    className={`py-1.5 px-3 rounded-lg text-xs font-medium border text-center transition-all ${
                      booking.urgency === 'urgent'
                        ? 'bg-neutral-100 text-neutral-900 border-white'
                        : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    ⚡ Терміново (протягом години)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBooking({ ...booking, urgency: 'standard' })}
                    className={`py-1.5 px-3 rounded-lg text-xs font-medium border text-center transition-all ${
                      booking.urgency === 'standard'
                        ? 'bg-neutral-100 text-neutral-900 border-white'
                        : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    🗓️ Плановий запис
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Коротко про суть питання (за бажанням)
                </label>
                <textarea 
                  rows={2}
                  placeholder="Вкажіть ключові деталі ситуації..."
                  value={booking.description}
                  onChange={(e) => setBooking({ ...booking, description: e.target.value })}
                  className="w-full bg-neutral-900/90 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-neutral-400 transition-colors resize-none"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  className="w-full h-10 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-medium flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Send className="w-4 h-4" />
                  Відкрити Telegram-бот та надіслати запит
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="flex-1 py-2 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Скопійовано!' : 'Скопіювати текст'}</span>
                  </button>
                  <a
                    href="tel:+380674201122"
                    className="flex-1 py-2 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Зателефонувати</span>
                  </a>
                </div>
              </div>
            </form>

            {/* Custom Telegram handle setup drawer for testing/customization */}
            <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-neutral-400" />
                <span>Офіс: Кривий Ріг, пр. Поштовий, 28</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newBot = prompt('Введіть Telegram username бота або контакту:', botUsername);
                  if (newBot) setBotUsername(newBot.replace('@', '').trim());
                }}
                className="text-neutral-400 hover:text-white underline cursor-pointer"
              >
                Змінити бота
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: PRACTICE AREAS (ПРАКТИКА) ================= */}
      {activeModal === 'practice' && (
        <div 
          className="glass-modal-backdrop" 
          onClick={() => setActiveModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="glass-modal max-w-xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <Scale className="w-5 h-5 text-white" />
              <h3 className="text-lg font-semibold text-white tracking-tight">Галузі адвокатської практики</h3>
            </div>
            <p className="text-xs text-neutral-400 mb-5">
              Понад 12 років захисту інтересів громадян та юридичних осіб у судах Кривого Рогу та Дніпропетровської області.
            </p>

            <div className="space-y-3">
              <div className="p-3 bg-neutral-900/60 border border-neutral-800 rounded-lg">
                <div className="text-sm font-medium text-white mb-1">Кримінальне провадження</div>
                <div className="text-xs text-neutral-400">
                  Захист на стадії досудового розслідування, терміновий виїзд на затримання та обшук 24/7, зміна запобіжних заходів, представництво в суді всіх інстанцій.
                </div>
              </div>

              <div className="p-3 bg-neutral-900/60 border border-neutral-800 rounded-lg">
                <div className="text-sm font-medium text-white mb-1">Військове право та соціальний захист</div>
                <div className="text-xs text-neutral-400">
                  Оскарження рішень ВЛК, оформлення законних відстрочок, супровід рапортів на звільнення, виплати пораненим та сім'ям військовослужбовців.
                </div>
              </div>

              <div className="p-3 bg-neutral-900/60 border border-neutral-800 rounded-lg">
                <div className="text-sm font-medium text-white mb-1">Сімейні та спадкові спори</div>
                <div className="text-xs text-neutral-400">
                  Розірвання шлюбу без присутності клієнта, поділ майна подружжя, стягнення аліментів, визначення місця проживання дитини, оформлення спадщини через суд.
                </div>
              </div>

              <div className="p-3 bg-neutral-900/60 border border-neutral-800 rounded-lg">
                <div className="text-sm font-medium text-white mb-1">Цивільні справи та захист власності</div>
                <div className="text-xs text-neutral-400">
                  Визнання права власності, захист від незаконних дій банків та МФО, зняття арештів з рахунків та рухомого/нерухомого майна.
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-neutral-800 flex items-center justify-between">
              <span className="text-xs text-neutral-400">Потрібна термінова оцінка вашої справи?</span>
              <button
                type="button"
                onClick={() => setActiveModal('telegram')}
                className="btn btn-solid h-9 px-4 text-xs"
              >
                Запис у Telegram
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: PROCESS (ЯК МИ ПРАЦЮЄМО) ================= */}
      {activeModal === 'process' && (
        <div 
          className="glass-modal-backdrop" 
          onClick={() => setActiveModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="glass-modal max-w-xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-white" />
              <h3 className="text-lg font-semibold text-white tracking-tight">Етапи правового супроводу</h3>
            </div>
            <p className="text-xs text-neutral-400 mb-5">
              Чіткий алгоритм дій, що гарантує максимальний правовий результат та фінансову прозорість.
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-neutral-900/60 border border-neutral-800 rounded-lg">
                <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold shrink-0">1</span>
                <div>
                  <div className="text-sm font-medium text-white">Первинний аналіз та Telegram-запис</div>
                  <div className="text-xs text-neutral-400 mt-0.5">
                    Ви надсилаєте опис ситуації через бота або записуєтесь на особисту зустріч в офісі у Кривому Розі.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-neutral-900/60 border border-neutral-800 rounded-lg">
                <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold shrink-0">2</span>
                <div>
                  <div className="text-sm font-medium text-white">Вивчення матеріалів та правова стратегія</div>
                  <div className="text-xs text-neutral-400 mt-0.5">
                    Детальний аудит документів, оцінка ризиків та формування дієвої покрокової стратегії захисту.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-neutral-900/60 border border-neutral-800 rounded-lg">
                <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold shrink-0">3</span>
                <div>
                  <div className="text-sm font-medium text-white">Укладення офіційного договору</div>
                  <div className="text-xs text-neutral-400 mt-0.5">
                    Фіксація обсягу послуг, строків та фіксованого гонорару без прихованих платежів з дотриманням адвокатської таємниці.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-neutral-900/60 border border-neutral-800 rounded-lg">
                <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold shrink-0">4</span>
                <div>
                  <div className="text-sm font-medium text-white">Процесуальний захист до повного результату</div>
                  <div className="text-xs text-neutral-400 mt-0.5">
                    Підготовка позовів, скарг, адвокатських запитів та представництво у судових засіданнях.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-neutral-800 flex items-center justify-between">
              <span className="text-xs text-neutral-400">Почати співпрацю прямо зараз</span>
              <button
                type="button"
                onClick={() => setActiveModal('telegram')}
                className="btn btn-solid h-9 px-4 text-xs"
              >
                Запис у Telegram
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: FAQS (ПИТАННЯ) ================= */}
      {activeModal === 'faq' && (
        <div 
          className="glass-modal-backdrop" 
          onClick={() => setActiveModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="glass-modal max-w-xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-white" />
              <h3 className="text-lg font-semibold text-white tracking-tight">Часті запитання</h3>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-neutral-900/60 border border-neutral-800 rounded-lg">
                <div className="text-sm font-medium text-white mb-1">Чи можлива консультація онлайн без візиту в офіс?</div>
                <div className="text-xs text-neutral-400">
                  Так, первинну або повну юридичну консультацію можна отримати через Telegram, Zoom або телефоном з наданням копій документів у месенджері.
                </div>
              </div>

              <div className="p-3 bg-neutral-900/60 border border-neutral-800 rounded-lg">
                <div className="text-sm font-medium text-white mb-1">Як швидко адвокатеса може прибути на затримання чи обшук?</div>
                <div className="text-xs text-neutral-400">
                  У межах Кривого Рогу виїзд адвоката на невідкладні слідчі дії здійснюється негайно (орієнтовно 30-45 хвилин після дзвінка чи зв'язку в боті).
                </div>
              </div>

              <div className="p-3 bg-neutral-900/60 border border-neutral-800 rounded-lg">
                <div className="text-sm font-medium text-white mb-1">Чи гарантується повна адвокатська таємниця?</div>
                <div className="text-xs text-neutral-400">
                  Так, будь-яка інформація, передана адвокату, захищена ст. 22 Закону України «Про адвокатуру та адвокатську діяльність» та не підлягає розголошенню чи вилученню правоохоронцями.
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-neutral-800 flex items-center justify-between">
              <span className="text-xs text-neutral-400">Маєте індивідуальне запитання?</span>
              <button
                type="button"
                onClick={() => setActiveModal('telegram')}
                className="btn btn-solid h-9 px-4 text-xs"
              >
                Задати в боті
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: PRICING (ГОНОРАР) ================= */}
      {activeModal === 'pricing' && (
        <div 
          className="glass-modal-backdrop" 
          onClick={() => setActiveModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="glass-modal max-w-xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-white" />
              <h3 className="text-lg font-semibold text-white tracking-tight">Вартість адвокатських послуг</h3>
            </div>
            <p className="text-xs text-neutral-400 mb-5">
              Прозоре ціноутворення, офіційний договір та можливість поетапної оплати.
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-neutral-900/60 border border-neutral-800 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-white">Усна консультація з аналізом документів</div>
                  <div className="text-xs text-neutral-400">Особисто в офісі у Кривому Розі або онлайн</div>
                </div>
                <div className="text-sm font-semibold text-white whitespace-nowrap">від 1 000 ₴</div>
              </div>

              <div className="flex items-center justify-between p-3 bg-neutral-900/60 border border-neutral-800 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-white">Складання позовної заяви / скарги / відзиву</div>
                  <div className="text-xs text-neutral-400">Формування доказової бази та подання до суду</div>
                </div>
                <div className="text-sm font-semibold text-white whitespace-nowrap">від 3 500 ₴</div>
              </div>

              <div className="flex items-center justify-between p-3 bg-neutral-900/60 border border-neutral-800 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-white">Участь в одному судовому засіданні</div>
                  <div className="text-xs text-neutral-400">Представництво інтересів у судових інстанціях</div>
                </div>
                <div className="text-sm font-semibold text-white whitespace-nowrap">від 2 500 ₴</div>
              </div>

              <div className="flex items-center justify-between p-3 bg-neutral-900/60 border border-neutral-800 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-white">Комплексний захист у кримінальному провадженні</div>
                  <div className="text-xs text-neutral-400">Повний юридичний супровід "під ключ"</div>
                </div>
                <div className="text-sm font-semibold text-white whitespace-nowrap">договірна</div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-neutral-800 flex items-center justify-between">
              <span className="text-xs text-neutral-400">Отримайте індивідуальний розрахунок</span>
              <button
                type="button"
                onClick={() => setActiveModal('telegram')}
                className="btn btn-solid h-9 px-4 text-xs"
              >
                Уточнити в Telegram
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
