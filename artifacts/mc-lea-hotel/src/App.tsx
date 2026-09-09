import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  ArrowDown,
  ArrowRight,
  BedDouble,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clipboard,
  Clock3,
  Copy,
  DoorOpen,
  MapPin,
  Menu,
  MessageCircle,
  Navigation,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  X,
} from 'lucide-react';
import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

const HOTEL = {
  name: 'MC-LEA Hotel & Suite',
  shortName: 'MC-LEA',
  address: 'Mandella Estate, H18 11 Road, off SARS Road, Port Harcourt 500101, Rivers State, Nigeria.',
  shortAddress: 'Mandella Estate · H18 11 Road · off SARS Road',
  locationLabel: 'Mandella Estate, Port Harcourt',
  phone: '[Phone number to be supplied]',
  email: '[Email address to be supplied]',
  whatsappNumber: '2340000000000',
  whatsappLabel: '[WhatsApp contact to be supplied]',
  directions: 'https://www.google.com/maps/search/?api=1&query=MC-LEA+Hotel+and+Suite+Mandella+Estate+Port+Harcourt',
};

const HOSPITALITY_NOTES = [
  { title: 'Choose a room', text: 'Browse the room categories, then ask the hotel team about the best fit for your visit.' },
  { title: 'Share your dates', text: 'Include arrival, departure and guest count so the team can check the right availability.' },
  { title: 'Keep it clear', text: 'Your message starts an enquiry. Any stay details remain to be confirmed by the hotel team.' },
];

const IMAGES = {
  hero: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=2200',
  intro: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=1400',
  roomA: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200',
  roomB: 'https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg?auto=compress&cs=tinysrgb&w=1200',
  roomC: 'https://images.pexels.com/photos/2029698/pexels-photo-2029698.jpeg?auto=compress&cs=tinysrgb&w=1200',
  roomD: 'https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg?auto=compress&cs=tinysrgb&w=1200',
};

type Room = {
  name: string;
  description: string;
  image: string;
  details: string[];
  note: string;
};

type EnquiryDraft = {
  checkIn: string;
  checkOut: string;
  guests: string;
  room: string;
  note: string;
};

type BookingPrefill = Partial<EnquiryDraft>;

const ROOMS: Room[] = [
  {
    name: 'Standard Room',
    description: 'A considered starting point for nights that call for ease, quiet and a little room to exhale.',
    image: IMAGES.roomA,
    details: ['Room details being confirmed', 'Availability by enquiry'],
    note: 'Preview image — replace with MC-LEA photography',
  },
  {
    name: 'Deluxe Room',
    description: 'A generous, calm setting for settling in after a day across Port Harcourt.',
    image: IMAGES.roomB,
    details: ['Room details being confirmed', 'Availability by enquiry'],
    note: 'Preview image — replace with MC-LEA photography',
  },
  {
    name: 'Executive Room',
    description: 'A polished retreat for guests who value a little more space and a quietly elevated stay.',
    image: IMAGES.roomC,
    details: ['Room details being confirmed', 'Availability by enquiry'],
    note: 'Preview image — replace with MC-LEA photography',
  },
  {
    name: 'Suite',
    description: 'A more expansive placeholder for a stay with room to slow down, work or gather.',
    image: IMAGES.roomD,
    details: ['Room details being confirmed', 'Availability by enquiry'],
    note: 'Preview image — replace with MC-LEA photography',
  },
];

type GalleryItem = { src: string; title: string; category: string; alt: string };
const GALLERY: GalleryItem[] = [
  { src: IMAGES.hero, title: 'A quiet welcome', category: 'Atmosphere', alt: 'Warm contemporary hotel interior with a bed and soft daylight' },
  { src: IMAGES.roomA, title: 'A place to settle', category: 'Rooms', alt: 'Contemporary bedroom with textured neutral bedding' },
  { src: 'https://images.pexels.com/photos/6585755/pexels-photo-6585755.jpeg?auto=compress&cs=tinysrgb&w=1200', title: 'The details of rest', category: 'Rooms', alt: 'Neutral bedroom details in soft afternoon light' },
  { src: IMAGES.intro, title: 'Light, texture, calm', category: 'Atmosphere', alt: 'Elegant hotel lounge interior with plants and warm wood' },
  { src: 'https://images.pexels.com/photos/3637739/pexels-photo-3637739.jpeg?auto=compress&cs=tinysrgb&w=1200', title: 'A considered pause', category: 'Lounge', alt: 'Quiet hotel seating area with warm natural textures' },
  { src: 'https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=1200', title: 'A softer morning', category: 'Rooms', alt: 'Boutique hotel room with a light linen bed' },
];

const TESTIMONIALS = [
  { quote: 'Verified guest reviews will appear here once supplied by the hotel.', name: 'Guest review placeholder', meta: 'Content awaiting approval' },
  { quote: 'This space is reserved for an authentic guest perspective, not a made-up endorsement.', name: 'Guest review placeholder', meta: 'Content awaiting approval' },
  { quote: 'Share the feeling of a real stay here — with the guest’s permission and exact words.', name: 'Guest review placeholder', meta: 'Content awaiting approval' },
];

const NAV_ITEMS = [
  ['Rooms', '#rooms'],
  ['About', '#about'],
  ['Amenities', '#amenities'],
  ['Gallery', '#gallery'],
  ['Reviews', '#reviews'],
  ['Contact', '#contact'],
];

function scrollToId(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function openWhatsApp(message: string) {
  const url = `https://wa.me/${HOTEL.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

function PreviewLabel({ dark = false }: { dark?: boolean }) {
  return (
    <span className={`absolute bottom-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono-label text-[9px] uppercase tracking-[.08em] ${dark ? 'bg-black/35 text-white/85' : 'bg-[#f5f1e9]/90 text-[#5a5144]'}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-[#b28c52]" />
      Preview image
    </span>
  );
}

function SectionIntro({ eyebrow, title, copy, align = 'left' }: { eyebrow: string; title: string; copy?: string; align?: 'left' | 'center' }) {
  return (
    <div className={`reveal ${align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}`}>
      <div className="eyebrow mb-5 text-[#a07d48]">{eyebrow}</div>
      <h2 className="font-display text-balance text-4xl leading-[1.06] tracking-[-.035em] text-[#2c2b27] sm:text-5xl md:text-6xl">{title}</h2>
      {copy && <p className="mt-6 max-w-xl text-[15px] leading-7 text-[#6e685e]">{copy}</p>}
    </div>
  );
}

function Header({ onBook }: { onBook: (prefill?: BookingPrefill) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${scrolled ? 'nav-scrolled' : 'text-white'}`} data-testid="site-header">
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <a href="#home" className={`nav-mark focus-ring flex items-center gap-3 ${scrolled ? 'text-[#2c2b27]' : 'text-white'}`} data-testid="link-brand">
          <span className="grid h-9 w-9 place-items-center border border-current/50 font-display text-lg italic">M</span>
          <span className="leading-none">
            <span className="block text-[15px] font-semibold tracking-[.16em]">MC-LEA</span>
            <span className={`nav-muted mt-1 block text-[8px] tracking-[.28em] ${scrolled ? 'text-[#766d60]' : 'text-white/70'}`}>HOTEL &amp; SUITE</span>
          </span>
        </a>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          {NAV_ITEMS.map(([label, href]) => (
            <a key={href} href={href} className={`nav-muted focus-ring text-[12px] tracking-[.08em] transition-colors hover:text-[#b79358] ${scrolled ? 'text-[#70695f]' : 'text-white/80'}`} data-testid={`link-nav-${label.toLowerCase()}`}>{label}</a>
          ))}
        </nav>
        <button type="button" onClick={() => onBook()} className={`focus-ring hidden items-center gap-3 border px-5 py-3 text-[11px] font-semibold tracking-[.12em] transition-all hover:-translate-y-0.5 lg:flex ${scrolled ? 'border-[#b99b6a] bg-[#b99b6a] text-[#2d2a24]' : 'border-white/60 bg-white/10 text-white backdrop-blur-sm hover:bg-white hover:text-[#2d2a24]'}`} data-testid="button-header-book">
          Book your stay <ArrowRight size={14} strokeWidth={1.7} />
        </button>
        <button type="button" onClick={() => setOpen((value) => !value)} className={`focus-ring grid h-11 w-11 place-items-center lg:hidden ${scrolled ? 'text-[#2c2b27]' : 'text-white'}`} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} data-testid="button-mobile-menu">
          {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
        </button>
      </div>
      <div className={`overflow-hidden border-t border-[#cfc5b5]/40 bg-[#f5f1e9] transition-[max-height,opacity] duration-500 lg:hidden ${open ? 'max-h-[430px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <nav className="flex flex-col px-6 py-4" aria-label="Mobile navigation">
          {NAV_ITEMS.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="focus-ring border-b border-[#dcd3c6] py-4 text-[13px] tracking-[.1em] text-[#5c554a]" data-testid={`link-mobile-${label.toLowerCase()}`}>{label}</a>
          ))}
          <button type="button" onClick={() => { setOpen(false); onBook(); }} className="my-4 flex items-center justify-between bg-[#b99b6a] px-4 py-3 text-left text-[12px] font-semibold tracking-[.1em] text-[#2e2a24]" data-testid="button-mobile-book">Book your stay <ArrowRight size={15} /></button>
        </nav>
      </div>
    </header>
  );
}

function Hero({ onBook }: { onBook: () => void }) {
  return (
    <section id="home" className="relative flex min-h-[720px] items-end overflow-hidden bg-[#302d28] pb-14 pt-36 text-white sm:min-h-[800px] sm:pb-20 lg:min-h-[92vh]" data-testid="section-hero">
      <img src={IMAGES.hero} alt="Warm, quiet hotel bedroom interior" className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(27,25,21,.72)_0%,rgba(27,25,21,.30)_58%,rgba(27,25,21,.20)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#211f1b]/70 via-transparent to-[#211f1b]/15" />
      <PreviewLabel dark />
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="max-w-3xl">
          <div className="reveal eyebrow mb-7 text-[#dfc18d]">A quieter way to stay · Port Harcourt</div>
          <h1 className="reveal font-display text-balance text-[3.5rem] leading-[.98] tracking-[-.055em] sm:text-7xl md:text-[6.2rem]">Your comfort.<br /><em className="font-normal text-[#dfc995]">Your space.</em><br />Your stay.</h1>
          <p className="reveal mt-7 max-w-md text-[15px] leading-7 text-white/75 sm:text-base">Experience comfort, elegance and warm hospitality at MC-LEA Hotel &amp; Suite in Port Harcourt.</p>
          <div className="reveal mt-9 flex flex-wrap items-center gap-3">
            <button type="button" onClick={onBook} className="focus-ring group inline-flex min-h-12 items-center gap-6 bg-[#c2a875] px-5 text-[11px] font-semibold tracking-[.12em] text-[#2f2a23] transition-all hover:-translate-y-1 hover:bg-[#d4bc8c]" data-testid="button-hero-book">
              Book your stay <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </button>
            <a href="#rooms" className="focus-ring inline-flex min-h-12 items-center gap-3 border border-white/45 px-5 text-[11px] font-semibold tracking-[.12em] text-white transition-colors hover:border-white hover:bg-white/10" data-testid="link-hero-rooms">
              Explore rooms <ArrowDown size={15} />
            </a>
          </div>
           <div className="reveal mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] uppercase tracking-[.12em] text-white/60">
             <span className="inline-flex items-center gap-2"><Check size={13} className="text-[#dfc18d]" /> Enquiry first</span>
             <span className="inline-flex items-center gap-2"><ShieldCheck size={13} className="text-[#dfc18d]" /> No payment here</span>
           </div>
        </div>
        <div className="mt-20 flex items-center gap-4 text-white/60 sm:mt-24">
          <span className="h-px w-10 bg-[#c2a875]" />
          <span className="font-mono-label text-[9px] uppercase tracking-[.2em]">Scroll to explore</span>
        </div>
      </div>
    </section>
  );
}

function BookingBar({ onBook }: { onBook: (prefill?: BookingPrefill) => void }) {
  const [details, setDetails] = useState<BookingPrefill>({ checkIn: '', checkOut: '', guests: '1', room: '' });
  return (
    <section className="relative z-20 -mt-1 bg-[#eeeadf] px-5 py-5 sm:px-8 lg:px-12" aria-label="Booking enquiry">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-5 lg:flex-row lg:items-end lg:gap-6">
        <div className="mr-auto min-w-[155px]">
          <div className="eyebrow mb-2 text-[#a07d48]">Start an enquiry</div>
          <p className="font-display text-2xl text-[#34312b]">Check availability</p>
          <p className="mt-2 text-[11px] leading-5 text-[#81776a]">Dates and guests help us prepare a useful reply.</p>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4 lg:gap-6">
          <label className="flex flex-col gap-2 text-[#6d675e]">
            <span className="font-mono-label text-[9px] uppercase tracking-[.13em]">Check-in</span>
            <span className="flex items-center gap-2 border-b border-[#cfc3b0] pb-2 text-[13px] text-[#403b33]"><CalendarDays size={15} className="text-[#aa8855]" /><input type="date" value={details.checkIn} onChange={(event) => setDetails((current) => ({ ...current, checkIn: event.target.value }))} className="min-w-0 bg-transparent outline-none" aria-label="Check-in date" data-testid="input-bar-checkin" /></span>
          </label>
          <label className="flex flex-col gap-2 text-[#6d675e]">
            <span className="font-mono-label text-[9px] uppercase tracking-[.13em]">Check-out</span>
            <span className="flex items-center gap-2 border-b border-[#cfc3b0] pb-2 text-[13px] text-[#403b33]"><CalendarDays size={15} className="text-[#aa8855]" /><input type="date" value={details.checkOut} onChange={(event) => setDetails((current) => ({ ...current, checkOut: event.target.value }))} className="min-w-0 bg-transparent outline-none" aria-label="Check-out date" data-testid="input-bar-checkout" /></span>
          </label>
          <label className="flex flex-col gap-2 text-[#6d675e]">
            <span className="font-mono-label text-[9px] uppercase tracking-[.13em]">Guests</span>
            <span className="flex items-center gap-2 border-b border-[#cfc3b0] pb-2 text-[13px] text-[#403b33]"><Users size={15} className="text-[#aa8855]" /><select className="w-full bg-transparent outline-none" aria-label="Number of guests" value={details.guests} onChange={(event) => setDetails((current) => ({ ...current, guests: event.target.value }))} data-testid="select-bar-guests"><option value="1">1 guest</option><option value="2">2 guests</option><option value="3">3 guests</option><option value="4">4 guests</option><option value="5">5+ guests</option></select></span>
          </label>
          <label className="flex flex-col gap-2 text-[#6d675e]">
            <span className="font-mono-label text-[9px] uppercase tracking-[.13em]">Room preference</span>
            <span className="flex items-center gap-2 border-b border-[#cfc3b0] pb-2 text-[13px] text-[#403b33]"><BedDouble size={15} className="text-[#aa8855]" /><select className="w-full bg-transparent outline-none" aria-label="Room preference" value={details.room} onChange={(event) => setDetails((current) => ({ ...current, room: event.target.value }))} data-testid="select-bar-room"><option value="">Any available</option>{ROOMS.map((room) => <option key={room.name} value={room.name}>{room.name}</option>)}</select></span>
          </label>
        </div>
        <button type="button" onClick={() => onBook(details)} className="focus-ring flex min-h-12 shrink-0 items-center justify-center gap-4 bg-[#34312b] px-6 text-[11px] font-semibold tracking-[.1em] text-[#f7f2e8] transition-colors hover:bg-[#b08c55]" data-testid="button-check-availability">Prepare enquiry <ArrowRight size={15} /></button>
      </div>
      <div className="mx-auto mt-4 flex max-w-[1320px] items-center gap-2 text-[10px] uppercase tracking-[.1em] text-[#897961]"><ShieldCheck size={14} className="text-[#a8844f]" /> Availability is confirmed by the hotel team · no payment is taken here</div>
    </section>
  );
}

function WhatToExpect() {
  return (
    <section className="border-b border-[#d8cebf] bg-[#f5f1e9] px-5 py-10 sm:px-8 lg:px-12" aria-labelledby="expect-title" data-testid="section-what-to-expect">
      <div className="mx-auto grid max-w-[1320px] gap-8 lg:grid-cols-[.7fr_1.3fr] lg:items-center lg:gap-16">
        <div>
          <div className="eyebrow text-[#a07d48]">A simple start</div>
          <h2 id="expect-title" className="mt-3 font-display text-3xl leading-tight text-[#34312b]">What to expect</h2>
          <p className="mt-2 max-w-sm text-[12px] leading-5 text-[#81776a]">A clear path from first enquiry to a stay that feels right for you.</p>
        </div>
        <ol className="grid gap-6 sm:grid-cols-3 sm:gap-0">
          {HOSPITALITY_NOTES.map((item, index) => (
            <li key={item.title} className={`relative flex gap-4 sm:block sm:px-6 ${index === 0 ? 'sm:pl-0' : ''} ${index < HOSPITALITY_NOTES.length - 1 ? 'sm:border-r sm:border-[#d8cebf]' : ''}`} data-testid={`item-expect-${index}`}>
              <span className="font-mono-label text-[10px] text-[#ab8751]">0{index + 1}</span>
              <div className="sm:mt-5">
                <h3 className="font-display text-xl text-[#403b33]">{item.title}</h3>
                <p className="mt-2 max-w-[220px] text-[12px] leading-5 text-[#81776a]">{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Intro() {
  return (
    <section id="about" className="bg-[#f5f1e9] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40" data-testid="section-about">
      <div className="mx-auto grid max-w-[1250px] items-center gap-14 md:grid-cols-[.8fr_1fr] md:gap-20 lg:gap-28">
        <div className="reveal relative order-2 md:order-1">
          <div className="absolute -bottom-5 -left-5 h-28 w-28 border-b border-l border-[#c6a671]" />
          <div className="relative aspect-[.88] overflow-hidden sm:aspect-[.92]">
            <img src={IMAGES.intro} alt="Preview image of a calm contemporary hotel lounge" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]" />
            <PreviewLabel />
          </div>
          <div className="absolute -right-4 -top-5 hidden w-36 bg-[#e5dccd] p-5 sm:block">
            <Sparkles size={19} strokeWidth={1.2} className="mb-9 text-[#a6814d]" />
            <p className="font-display text-lg leading-tight text-[#403b33]">A little more considered.</p>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <SectionIntro eyebrow="The MC-LEA feeling" title="A comfortable stay, thoughtfully designed." copy="MC-LEA Hotel & Suite is a calm, welcoming base in Port Harcourt — a place to arrive, settle in and feel looked after. Every detail on this page is an invitation to discover a stay shaped around comfort, privacy and ease." />
          <a href="#rooms" className="focus-ring mt-9 inline-flex items-center gap-4 border-b border-[#b08c55] pb-2 text-[11px] font-semibold tracking-[.12em] text-[#554936] transition-all hover:gap-6" data-testid="link-discover-mclea">Discover MC-LEA <ArrowRight size={15} /></a>
        </div>
      </div>
    </section>
  );
}

function Rooms({ onBook }: { onBook: (prefill?: BookingPrefill) => void }) {
  return (
    <section id="rooms" className="bg-[#e9e1d5] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-36" data-testid="section-rooms">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-12 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end">
          <SectionIntro eyebrow="Stay awhile" title="Rooms designed for rest" copy="Room categories are shown as a flexible preview while final room details are confirmed. Enquire for current availability and the right fit for your visit." />
          <span className="font-mono-label text-[10px] tracking-[.14em] text-[#897961]">01 — 04</span>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {ROOMS.map((room, index) => (
            <article key={room.name} className={`reveal group flex flex-col bg-[#f5f1e9] ${index % 2 === 1 ? 'md:mt-16' : ''}`} data-testid={`card-room-${index}`}>
              <div className="relative aspect-[1.48] overflow-hidden">
                <img src={room.image} alt={`Preview image for ${room.name}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.045]" />
                <PreviewLabel />
                <span className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-[#f5f1e9]/90 text-[#9b7847]"><span className="font-mono-label text-[10px]">0{index + 1}</span></span>
              </div>
              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-3xl text-[#34312b]">{room.name}</h3>
                  <DoorOpen size={20} strokeWidth={1.2} className="mt-1 text-[#ae8953]" />
                </div>
                <p className="mt-4 max-w-md text-[13px] leading-6 text-[#70695e]">{room.description}</p>
                <ul className="mt-6 space-y-2 border-t border-[#ded5c8] pt-5 text-[11px] text-[#81776a]">
                  {room.details.map((detail) => <li key={detail} className="flex items-center gap-2"><Check size={13} className="text-[#b08a53]" />{detail}</li>)}
                </ul>
                <div className="mt-7 flex items-center gap-5">
                   <button type="button" onClick={() => onBook({ room: room.name })} className="focus-ring inline-flex items-center gap-3 bg-[#37332d] px-4 py-3 text-[10px] font-semibold tracking-[.1em] text-[#f6f0e6] transition-colors hover:bg-[#ad8954]" data-testid={`button-view-room-${index}`}>Enquire for this room <ArrowRight size={14} /></button>
                   <button type="button" onClick={() => onBook({ room: room.name })} className="focus-ring text-[10px] font-semibold tracking-[.1em] text-[#76634a] underline decoration-[#b18c57] underline-offset-4 transition-colors hover:text-[#a17b44]" data-testid={`button-book-room-${index}`}>Add to enquiry</button>
                </div>
                <p className="mt-6 font-mono-label text-[8px] uppercase tracking-[.08em] text-[#a2988b]">{room.note}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Amenities() {
  const items = [
    { icon: ShieldCheck, title: 'Guest essentials', text: 'Final amenity information will be added after hotel confirmation.' },
    { icon: DoorOpen, title: 'Room comforts', text: 'In-room details are being gathered so every promise stays accurate.' },
    { icon: Clock3, title: 'Arrival details', text: 'Ask the hotel team about check-in and stay arrangements when enquiring.' },
    { icon: Sparkles, title: 'Thoughtful extras', text: 'A curated list of confirmed services is coming soon.' },
  ];
  return (
    <section id="amenities" className="bg-[#f5f1e9] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-36" data-testid="section-amenities">
      <div className="mx-auto grid max-w-[1250px] gap-16 lg:grid-cols-[.8fr_1.2fr] lg:gap-28">
        <div>
          <SectionIntro eyebrow="The essentials" title="Good stays are felt in the details." copy="We are keeping this list intentionally honest. Confirmed amenities and services will be published here as the hotel supplies them." />
          <div className="mt-10 flex items-center gap-3 text-[#81776a]"><Clipboard size={17} strokeWidth={1.3} /><span className="text-[11px] tracking-[.08em]">Amenities · pending confirmation</span></div>
        </div>
        <div className="grid gap-px self-start bg-[#d8cebf] sm:grid-cols-2">
          {items.map(({ icon: Icon, title, text }, index) => (
            <div key={title} className="reveal bg-[#f5f1e9] p-7 sm:min-h-[205px] sm:p-8" data-testid={`card-amenity-${index}`}>
              <Icon size={22} strokeWidth={1.2} className="text-[#ae8851]" />
              <h3 className="mt-11 font-display text-2xl text-[#38342e]">{title}</h3>
              <p className="mt-3 text-[12px] leading-5 text-[#81776a]">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const [filter, setFilter] = useState('All');
  const [active, setActive] = useState<number | null>(null);
  const categories = ['All', ...Array.from(new Set(GALLERY.map((item) => item.category)))];
  const visible = useMemo(() => filter === 'All' ? GALLERY : GALLERY.filter((item) => item.category === filter), [filter]);

  useEffect(() => {
    document.body.style.overflow = active !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [active]);

  const activeItem = active === null ? null : visible[active];
  return (
    <section id="gallery" className="bg-[#302d28] px-5 py-24 text-[#f4efe6] sm:px-8 sm:py-32 lg:px-12 lg:py-36" data-testid="section-gallery">
      <div className="mx-auto max-w-[1320px]">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="reveal max-w-xl">
            <div className="eyebrow mb-5 text-[#d1b27b]">A visual preview</div>
            <h2 className="font-display text-balance text-4xl leading-[1.06] tracking-[-.035em] sm:text-5xl md:text-6xl">See the mood before you arrive.</h2>
            <p className="mt-6 max-w-md text-[14px] leading-7 text-white/60">A temporary visual study of the atmosphere we are building. Replace these preview images with photographs of MC-LEA when ready.</p>
          </div>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Gallery categories">
            {categories.map((category) => (
              <button type="button" key={category} onClick={() => setFilter(category)} className={`focus-ring rounded-full border px-4 py-2 text-[10px] tracking-[.08em] transition-colors ${filter === category ? 'border-[#c4a46e] bg-[#c4a46e] text-[#302d28]' : 'border-white/20 text-white/60 hover:border-white/60 hover:text-white'}`} aria-selected={filter === category} role="tab" data-testid={`button-gallery-filter-${category.toLowerCase()}`}>{category}</button>
            ))}
          </div>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {visible.map((item, index) => (
            <button type="button" key={item.title} onClick={() => setActive(index)} className={`focus-ring group relative overflow-hidden text-left ${index === 0 ? 'col-span-2 row-span-2' : ''}`} data-testid={`button-gallery-image-${index}`}>
              <img src={item.src} alt={item.alt} loading="lazy" className={`h-full min-h-[190px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.045] ${index === 0 ? 'aspect-square md:aspect-auto' : 'aspect-square'}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#171614]/75 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="absolute bottom-4 left-4 right-4 translate-y-2 text-[11px] text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">{item.title}</span>
              <PreviewLabel dark />
            </button>
          ))}
        </div>
      </div>
      {activeItem && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#181714]/95 p-5" role="dialog" aria-modal="true" aria-label="Gallery image preview" onClick={() => setActive(null)}>
          <div className="relative flex max-h-[90vh] w-full max-w-5xl flex-col items-center" onClick={(event) => event.stopPropagation()}>
            <img src={activeItem.src} alt={activeItem.alt} className="max-h-[75vh] w-auto max-w-full object-contain" />
            <div className="mt-4 flex w-full items-center justify-between gap-5">
              <div><p className="font-display text-xl text-white">{activeItem.title}</p><p className="mt-1 font-mono-label text-[9px] uppercase tracking-[.12em] text-white/45">{activeItem.category} · preview image</p></div>
              <button type="button" onClick={() => setActive(null)} className="focus-ring grid h-11 w-11 shrink-0 place-items-center border border-white/25 text-white hover:bg-white/10" aria-label="Close gallery" data-testid="button-close-gallery"><X size={18} /></button>
            </div>
            <button type="button" onClick={() => setActive((active === 0 ? visible.length : active!) - 1)} className="focus-ring absolute left-0 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center border border-white/25 bg-black/20 text-white hover:bg-white/10 sm:-left-16" aria-label="Previous image" data-testid="button-gallery-previous"><ChevronLeft size={20} /></button>
            <button type="button" onClick={() => setActive((active! + 1) % visible.length)} className="focus-ring absolute right-0 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center border border-white/25 bg-black/20 text-white hover:bg-white/10 sm:-right-16" aria-label="Next image" data-testid="button-gallery-next"><ChevronRight size={20} /></button>
          </div>
        </div>
      )}
    </section>
  );
}

function WhyChoose() {
  const reasons = [
    { number: '01', title: 'Comfort', copy: 'Thoughtfully prepared spaces designed for a relaxing stay.' },
    { number: '02', title: 'Location', copy: 'Set in Mandella Estate, off SARS Road, Port Harcourt.' },
    { number: '03', title: 'Hospitality', copy: 'A welcoming environment with guest comfort at its centre.' },
    { number: '04', title: 'Peace & privacy', copy: 'A calm setting where guests can relax and recharge.' },
  ];
  return (
    <section className="bg-[#e9e1d5] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-36" data-testid="section-why">
      <div className="mx-auto max-w-[1250px]">
        <div className="flex flex-col justify-between gap-7 border-b border-[#cec2b0] pb-10 sm:flex-row sm:items-end">
          <SectionIntro eyebrow="Why MC-LEA" title="A stay with room to breathe." />
          <p className="max-w-xs text-[13px] leading-6 text-[#756c60] sm:pb-1">The essentials for a confident choice, without overpromising what has not yet been confirmed.</p>
        </div>
        <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, index) => (
            <div key={reason.title} className={`reveal border-b border-[#cec2b0] py-8 sm:px-6 sm:py-10 lg:border-b-0 lg:border-r ${index === 0 ? 'sm:pl-0' : ''} ${index === reasons.length - 1 ? 'lg:border-r-0' : ''}`} data-testid={`card-reason-${index}`}>
              <span className="font-mono-label text-[10px] text-[#ab8751]">{reason.number}</span>
              <h3 className="mt-10 font-display text-3xl text-[#38342e]">{reason.title}</h3>
              <p className="mt-4 text-[13px] leading-6 text-[#756c60]">{reason.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  const [active, setActive] = useState(0);
  const review = TESTIMONIALS[active];
  return (
    <section id="reviews" className="bg-[#f5f1e9] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-36" data-testid="section-reviews">
      <div className="mx-auto max-w-[1000px]">
        <div className="eyebrow text-center text-[#a07d48]">Guest voices</div>
        <div className="relative mt-8 min-h-[320px] overflow-hidden border-y border-[#d8cebf] px-5 py-12 text-center sm:px-20 sm:py-16">
          <div className="mx-auto flex justify-center gap-1 text-[#b28c55]" aria-label="Rating placeholder">
            {[0, 1, 2, 3, 4].map((star) => <Star key={star} size={15} fill="currentColor" strokeWidth={1} />)}
          </div>
          <blockquote className="mx-auto mt-8 max-w-2xl font-display text-3xl leading-[1.2] tracking-[-.02em] text-[#38342d] sm:text-4xl">“{review.quote}”</blockquote>
          <p className="mt-8 text-[11px] font-semibold tracking-[.1em] text-[#574d40]">{review.name}</p>
          <p className="mt-2 font-mono-label text-[9px] uppercase tracking-[.12em] text-[#a39a8e]">{review.meta}</p>
          <button type="button" onClick={() => setActive((active + TESTIMONIALS.length - 1) % TESTIMONIALS.length)} className="focus-ring absolute left-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center text-[#806a4c] hover:bg-[#e9e1d5] sm:left-7" aria-label="Previous review" data-testid="button-review-previous"><ChevronLeft size={19} /></button>
          <button type="button" onClick={() => setActive((active + 1) % TESTIMONIALS.length)} className="focus-ring absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center text-[#806a4c] hover:bg-[#e9e1d5] sm:right-7" aria-label="Next review" data-testid="button-review-next"><ChevronRight size={19} /></button>
        </div>
        <div className="mt-6 flex justify-center gap-2" aria-label="Review slides">
          {TESTIMONIALS.map((item, index) => <button type="button" key={item.name + index} onClick={() => setActive(index)} className={`focus-ring h-1 transition-all ${active === index ? 'w-8 bg-[#ab8751]' : 'w-3 bg-[#d4c8b7]'}`} aria-label={`Go to review ${index + 1}`} data-testid={`button-review-dot-${index}`} />)}
        </div>
      </div>
    </section>
  );
}

function LocationContact({ onBook }: { onBook: () => void }) {
  const [copied, setCopied] = useState(false);
  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(HOTEL.address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };
  return (
    <section id="contact" className="bg-[#302d28] px-5 py-24 text-[#f4efe6] sm:px-8 sm:py-32 lg:px-12 lg:py-36" data-testid="section-contact">
      <div className="mx-auto grid max-w-[1250px] gap-14 lg:grid-cols-[.9fr_1.1fr] lg:gap-28">
        <div>
          <div className="eyebrow mb-5 text-[#d0b178]">Find your way here</div>
          <h2 className="font-display text-balance text-4xl leading-[1.05] tracking-[-.035em] sm:text-5xl md:text-6xl">A place to arrive.<br /><em className="font-normal text-[#d0b178]">A world apart.</em></h2>
           <p className="mt-7 max-w-md text-[14px] leading-7 text-white/60">Make your way to MC-LEA Hotel &amp; Suite in Mandella Estate, Port Harcourt. Use the address below to plan your route, then enquire directly when you are ready.</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <button type="button" onClick={onBook} className="focus-ring inline-flex min-h-12 items-center gap-4 bg-[#c2a875] px-5 text-[11px] font-semibold tracking-[.11em] text-[#302d28] transition-colors hover:bg-[#dec697]" data-testid="button-contact-book">Book your stay <ArrowRight size={15} /></button>
            <a href={HOTEL.directions} target="_blank" rel="noreferrer" className="focus-ring inline-flex min-h-12 items-center gap-3 border border-white/30 px-5 text-[11px] font-semibold tracking-[.11em] text-white transition-colors hover:border-white" data-testid="link-directions"><Navigation size={14} /> Get directions</a>
          </div>
        </div>
        <div className="relative overflow-hidden bg-[#3a3630] p-7 sm:p-10">
          <div className="absolute right-0 top-0 h-36 w-36 border-l border-b border-[#8d744e]/40" />
           <div className="flex items-center justify-between gap-4">
             <MapPin size={23} strokeWidth={1.2} className="text-[#c2a875]" />
             <span className="font-mono-label text-[9px] uppercase tracking-[.12em] text-white/35">Location &amp; contact</span>
           </div>
          <p className="mt-8 max-w-md font-display text-2xl leading-snug text-white sm:text-3xl">{HOTEL.name}</p>
           <p className="mt-2 text-[11px] uppercase tracking-[.12em] text-[#c2a875]">{HOTEL.locationLabel}</p>
           <p className="mt-4 max-w-md text-[13px] leading-6 text-white/60" data-testid="text-hotel-address">{HOTEL.address}</p>
          <button type="button" onClick={copyAddress} className="focus-ring mt-6 inline-flex items-center gap-2 text-[10px] font-semibold tracking-[.11em] text-[#d2b57f] hover:text-white" data-testid="button-copy-address">{copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Address copied' : 'Copy address'}</button>
          <div className="my-9 h-px bg-white/10" />
           <p className="mb-6 max-w-md text-[12px] leading-5 text-white/50">For availability, arrival planning or room preference, use the enquiry form. Contact details below are shown as supplied placeholders until the hotel provides the final information.</p>
          <div className="grid gap-5 sm:grid-cols-2">
            <div><div className="eyebrow mb-2 text-white/35">Phone</div><p className="text-[12px] text-white/65" data-testid="text-phone-placeholder">{HOTEL.phone}</p></div>
            <div><div className="eyebrow mb-2 text-white/35">WhatsApp</div><p className="text-[12px] text-white/65" data-testid="text-whatsapp-placeholder">{HOTEL.whatsappLabel}</p></div>
             <div><div className="eyebrow mb-2 text-white/35">Email</div><p className="text-[12px] text-white/65" data-testid="text-email-placeholder">{HOTEL.email}</p></div>
          </div>
          <button type="button" onClick={() => openWhatsApp(`Hello MC-LEA Hotel & Suite, I would like to enquire about a stay at ${HOTEL.address}`)} className="focus-ring mt-9 inline-flex items-center gap-3 border-b border-[#c2a875] pb-2 text-[11px] font-semibold tracking-[.11em] text-[#dbc08d] hover:text-white" data-testid="button-contact-whatsapp"><MessageCircle size={15} /> Chat on WhatsApp</button>
          <p className="mt-5 font-mono-label text-[8px] uppercase tracking-[.09em] text-white/35">WhatsApp link uses a configurable placeholder until the hotel supplies its number.</p>
        </div>
      </div>
    </section>
  );
}

function FinalCta({ onBook }: { onBook: () => void }) {
  return (
    <section className="bg-[#b79a69] px-5 py-20 text-[#302d28] sm:px-8 sm:py-24 lg:px-12" data-testid="section-final-cta">
      <div className="mx-auto flex max-w-[1250px] flex-col justify-between gap-10 md:flex-row md:items-end">
        <div className="reveal max-w-2xl">
          <div className="eyebrow mb-5 text-[#67543a]">A good next step</div>
          <h2 className="font-display text-balance text-4xl leading-[1.04] tracking-[-.035em] sm:text-5xl md:text-6xl">Ready for a comfortable stay?</h2>
          <p className="mt-5 max-w-lg text-[14px] leading-7 text-[#5f5039]">Make MC-LEA Hotel &amp; Suite your next destination in Port Harcourt.</p>
        </div>
        <div className="reveal flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <button type="button" onClick={onBook} className="focus-ring inline-flex min-h-12 items-center justify-center gap-4 bg-[#302d28] px-5 text-[11px] font-semibold tracking-[.1em] text-[#f6f0e6] transition-all hover:-translate-y-1 hover:bg-[#4b4235]" data-testid="button-final-book">Book your stay <ArrowRight size={15} /></button>
          <a href="#contact" className="focus-ring inline-flex min-h-12 items-center justify-center border border-[#6f5a3b]/60 px-5 text-[11px] font-semibold tracking-[.1em] text-[#403527] transition-colors hover:border-[#302d28]" data-testid="link-final-contact">Contact us</a>
          <button type="button" onClick={() => openWhatsApp(`Hello MC-LEA Hotel & Suite, I would like to enquire about a stay at ${HOTEL.address}`)} className="focus-ring inline-flex min-h-12 items-center justify-center gap-3 px-3 text-[11px] font-semibold tracking-[.1em] text-[#403527] transition-colors hover:text-[#8b673a]" data-testid="button-final-whatsapp"><MessageCircle size={15} /> Chat on WhatsApp</button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#24221f] px-5 py-14 text-white/70 sm:px-8 lg:px-12" data-testid="site-footer">
      <div className="mx-auto max-w-[1250px]">
        <div className="grid gap-12 border-b border-white/10 pb-12 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <a href="#home" className="focus-ring inline-flex items-center gap-3 text-white" data-testid="link-footer-brand">
              <span className="grid h-9 w-9 place-items-center border border-white/35 font-display text-lg italic">M</span>
              <span className="leading-none"><span className="block text-[15px] font-semibold tracking-[.16em]">MC-LEA</span><span className="mt-1 block text-[8px] tracking-[.28em] text-white/45">HOTEL &amp; SUITE</span></span>
            </a>
            <p className="mt-6 max-w-xs text-[12px] leading-6 text-white/45">{HOTEL.address}</p>
          </div>
          <div><div className="eyebrow mb-5 text-[#c2a875]">Explore</div><div className="grid grid-cols-2 gap-y-3">{[['Home', '#home'], ['Rooms', '#rooms'], ['About', '#about'], ['Amenities', '#amenities'], ['Gallery', '#gallery'], ['Reviews', '#reviews'], ['Contact', '#contact']].map(([label, href]) => <a key={href} href={href} className="focus-ring text-[12px] text-white/50 transition-colors hover:text-white" data-testid={`link-footer-${label.toLowerCase()}`}>{label}</a>)}</div></div>
          <div><div className="eyebrow mb-5 text-[#c2a875]">Contact</div><div className="space-y-3 text-[12px] text-white/50"><p className="flex items-center gap-2"><Phone size={13} />{HOTEL.phone}</p><p className="flex items-center gap-2"><MessageCircle size={13} />{HOTEL.whatsappLabel}</p><p>{HOTEL.email}</p></div></div>
        </div>
        <div className="flex flex-col justify-between gap-4 pt-7 text-[10px] text-white/35 sm:flex-row"><p>© 2026 MC-LEA Hotel &amp; Suite. All rights reserved.</p><p className="font-mono-label uppercase tracking-[.08em]">Port Harcourt · Rivers State · Nigeria</p></div>
      </div>
    </footer>
  );
}

function BookingModal({ initialValues, onClose }: { initialValues?: BookingPrefill; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<EnquiryDraft>({
    checkIn: initialValues?.checkIn ?? '',
    checkOut: initialValues?.checkOut ?? '',
    guests: initialValues?.guests ?? '1',
    room: initialValues?.room ?? '',
    note: initialValues?.note ?? '',
  });

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const displayDate = (value: string) => value ? value.split('-').reverse().join('/') : 'To be confirmed';
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = [`Hello MC-LEA Hotel & Suite, I would like to enquire about a stay.`, `Check-in: ${form.checkIn || 'To be confirmed'}`, `Check-out: ${form.checkOut || 'To be confirmed'}`, `Guests: ${form.guests}`, `Room preference: ${form.room || 'Any available room'}`, form.note ? `Note: ${form.note}` : ''].filter(Boolean).join('\n');
    setSubmitted(true);
    openWhatsApp(message);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#211f1b]/70 p-0 backdrop-blur-sm sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-labelledby="booking-title" data-testid="booking-modal">
      <div className="relative max-h-[94dvh] w-full max-w-2xl overflow-y-auto bg-[#f5f1e9] p-6 sm:p-10" onClick={(event) => event.stopPropagation()}>
        <button type="button" onClick={onClose} className="focus-ring absolute right-5 top-5 grid h-10 w-10 place-items-center text-[#766d60] hover:bg-[#e8e0d3]" aria-label="Close booking enquiry" data-testid="button-close-booking"><X size={19} /></button>
        <div className="eyebrow text-[#a07d48]">Your next stay</div>
        <h2 id="booking-title" className="mt-4 max-w-lg font-display text-4xl leading-tight text-[#302d28] sm:text-5xl">Let’s make room for you.</h2>
        <p className="mt-4 max-w-lg text-[13px] leading-6 text-[#726a5e]">Share a few details and we’ll prepare an enquiry for the MC-LEA team via WhatsApp. No payment is taken here.</p>
         {submitted && <div className="mt-6 flex items-start gap-3 border border-[#cdb88d] bg-[#ede2c9] p-4 text-[12px] leading-5 text-[#554632]" role="status" data-testid="status-booking-sent"><Check size={17} className="mt-0.5 shrink-0 text-[#97733f]" /> Your enquiry is ready in WhatsApp. The contact currently uses a clearly marked placeholder until the hotel supplies its number.</div>}
         <div className="mt-7 border border-[#ddd2c2] bg-[#eee7da] p-4 sm:p-5" aria-live="polite" data-testid="summary-booking-enquiry">
           <div className="flex items-center justify-between gap-4">
             <div className="eyebrow text-[#a07d48]">Enquiry summary</div>
             <span className="font-mono-label text-[9px] uppercase tracking-[.1em] text-[#9a8d7d]">Not a reservation</span>
           </div>
           <div className="mt-4 grid gap-4 text-[12px] text-[#554d42] sm:grid-cols-3">
             <div><div className="font-mono-label text-[9px] uppercase tracking-[.1em] text-[#9a8d7d]">Dates</div><p className="mt-1">{displayDate(form.checkIn)} → {displayDate(form.checkOut)}</p></div>
             <div><div className="font-mono-label text-[9px] uppercase tracking-[.1em] text-[#9a8d7d]">Guests</div><p className="mt-1">{form.guests} {form.guests === '1' ? 'guest' : 'guests'}</p></div>
             <div><div className="font-mono-label text-[9px] uppercase tracking-[.1em] text-[#9a8d7d]">Room</div><p className="mt-1">{form.room || 'Any available room'}</p></div>
           </div>
         </div>
        <form className="mt-8 grid gap-5 sm:grid-cols-2" onSubmit={submit}>
          <label className="flex flex-col gap-2 text-[11px] font-semibold tracking-[.08em] text-[#5e574c]">Check-in<input type="date" value={form.checkIn} onChange={(event) => update('checkIn', event.target.value)} className="min-h-12 border border-[#d1c5b5] bg-[#fbf8f2] px-3 text-[13px] font-normal tracking-normal text-[#39352e] outline-none focus:border-[#ae8852] focus:ring-1 focus:ring-[#ae8852]" data-testid="input-modal-checkin" /></label>
          <label className="flex flex-col gap-2 text-[11px] font-semibold tracking-[.08em] text-[#5e574c]">Check-out<input type="date" value={form.checkOut} onChange={(event) => update('checkOut', event.target.value)} className="min-h-12 border border-[#d1c5b5] bg-[#fbf8f2] px-3 text-[13px] font-normal tracking-normal text-[#39352e] outline-none focus:border-[#ae8852] focus:ring-1 focus:ring-[#ae8852]" data-testid="input-modal-checkout" /></label>
          <label className="flex flex-col gap-2 text-[11px] font-semibold tracking-[.08em] text-[#5e574c]">Guests<select value={form.guests} onChange={(event) => update('guests', event.target.value)} className="min-h-12 border border-[#d1c5b5] bg-[#fbf8f2] px-3 text-[13px] font-normal tracking-normal text-[#39352e] outline-none focus:border-[#ae8852] focus:ring-1 focus:ring-[#ae8852]" data-testid="select-modal-guests"><option value="1">1 guest</option><option value="2">2 guests</option><option value="3">3 guests</option><option value="4">4 guests</option><option value="5+">5+ guests</option></select></label>
          <label className="flex flex-col gap-2 text-[11px] font-semibold tracking-[.08em] text-[#5e574c]">Room preference<select value={form.room} onChange={(event) => update('room', event.target.value)} className="min-h-12 border border-[#d1c5b5] bg-[#fbf8f2] px-3 text-[13px] font-normal tracking-normal text-[#39352e] outline-none focus:border-[#ae8852] focus:ring-1 focus:ring-[#ae8852]" data-testid="select-modal-room"><option value="">Any available room</option>{ROOMS.map((room) => <option key={room.name} value={room.name}>{room.name}</option>)}</select></label>
          <label className="flex flex-col gap-2 text-[11px] font-semibold tracking-[.08em] text-[#5e574c] sm:col-span-2">Anything we should know? <textarea value={form.note} onChange={(event) => update('note', event.target.value)} placeholder="Optional note" rows={3} className="resize-none border border-[#d1c5b5] bg-[#fbf8f2] px-3 py-3 text-[13px] font-normal tracking-normal text-[#39352e] outline-none placeholder:text-[#a39a8d] focus:border-[#ae8852] focus:ring-1 focus:ring-[#ae8852]" data-testid="textarea-modal-note" /></label>
          <div className="flex flex-col items-start gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xs font-mono-label text-[8px] uppercase leading-4 tracking-[.08em] text-[#9b9081]">This is an enquiry, not a confirmed reservation.</p>
            <button type="submit" className="focus-ring inline-flex min-h-12 w-full items-center justify-center gap-4 bg-[#37332d] px-6 text-[11px] font-semibold tracking-[.1em] text-[#f7f2e8] transition-colors hover:bg-[#ad8954] sm:w-auto" data-testid="button-submit-booking">Prepare WhatsApp enquiry <ArrowRight size={15} /></button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Home() {
  const [booking, setBooking] = useState<{ open: boolean; prefill?: BookingPrefill }>({ open: false });
  const openBooking = (prefill?: BookingPrefill) => setBooking({ open: true, prefill });
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: 0.12 });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    document.title = 'MC-LEA Hotel & Suite | Comfortable Stay in Port Harcourt';
    const description = 'Discover MC-LEA Hotel & Suite in Mandella Estate, off SARS Road, Port Harcourt. Explore our rooms, amenities and booking options for a comfortable stay.';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.setAttribute('name', 'description'); document.head.appendChild(meta); }
    meta.setAttribute('content', description);
    const og = [['og:title', document.title], ['og:description', description], ['og:type', 'website'], ['og:locale', 'en_NG']];
    og.forEach(([property, content]) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) { tag = document.createElement('meta'); tag.setAttribute('property', property); document.head.appendChild(tag); }
      tag.setAttribute('content', content);
    });
    const schema = { '@context': 'https://schema.org', '@type': 'Hotel', name: HOTEL.name, description, address: { '@type': 'PostalAddress', streetAddress: 'Mandella Estate, H18 11 Road, off SARS Road', addressLocality: 'Port Harcourt', postalCode: '500101', addressRegion: 'Rivers State', addressCountry: 'NG' }, url: window.location.href };
    let script = document.getElementById('hotel-schema');
    if (!script) { script = document.createElement('script'); script.id = 'hotel-schema'; script.setAttribute('type', 'application/ld+json'); document.head.appendChild(script); }
    script.textContent = JSON.stringify(schema);
  }, []);
  return (
    <div className="grain min-h-[100dvh] overflow-hidden">
      <Header onBook={openBooking} />
      <main>
        <Hero onBook={() => openBooking()} />
        <BookingBar onBook={openBooking} />
        <WhatToExpect />
        <Intro />
        <Rooms onBook={openBooking} />
        <Amenities />
        <Gallery />
        <WhyChoose />
        <Reviews />
        <LocationContact onBook={() => openBooking()} />
        <FinalCta onBook={() => openBooking()} />
      </main>
      <Footer />
       {booking.open && <BookingModal initialValues={booking.prefill} onClose={() => setBooking({ open: false })} />}
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <ErrorBoundary>
            <Router />
          </ErrorBoundary>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;