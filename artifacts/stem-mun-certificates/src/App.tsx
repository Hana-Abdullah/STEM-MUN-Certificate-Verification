import { type FormEvent, type ReactNode, useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Award, ArrowLeft, ArrowRight, Check, Copy, Download, FileCheck2, Hash, QrCode, Search, ShieldCheck } from 'lucide-react';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import QRCode from 'qrcode';

const queryClient = new QueryClient();

type Credential = {
  id: string;
  recipient: string;
  certificateName: string;
  committee: string;
  conference: string;
  date: string;
  issued: string;
  email: string;
  code: string;
  role: string;
};

const ISSUED_DATE = 'August 23, 2026';
const HOLDING_DATE = 'August 23, 2026';
const CONFERENCE_NAME = 'STEM MUN International Online Conference 2026';
const LOGO_SRC = `${import.meta.env.BASE_URL}stem-mun-logo.png`;
const SUPPLIED_CERTIFICATE_FILES: Record<string, string> = {
  'aseel-ahmad': 'certificates/aseel-ahmad.pdf',
  'bernard-kalenga': 'certificates/bernard-kalenga.pdf',
  'haneen-ahmed-attendance': 'certificates/haneen-ahmed-attendance.pdf',
  'haneen-ahmed-best-delegate': 'certificates/haneen-ahmed-best-delegate.pdf',
  'humairaa-khan': 'certificates/humairaa-khan.pdf',
  'jana-elkholy': 'certificates/jana-elkholy.pdf',
  'joudy-ahmed-attendance': 'certificates/joudy-ahmed-attendance.pdf',
  'joudy-ahmed-outstanding-delegate': 'certificates/joudy-ahmed-outstanding-delegate.pdf',
  'khadija-nawaf': 'certificates/khadija-nawaf.pdf',
  'maha-ahmed': 'certificates/maha-ahmed.pdf',
  'malak-mohamed': 'certificates/malak-mohamed.pdf',
  'mazen-mohamed': 'certificates/mazen-mohamed.pdf',
  'mohamed-raoof': 'certificates/mohamed-raoof.pdf',
  'mostafa-ashraf-honourable-mention': 'certificates/mostafa-ashraf-honourable-mention.pdf',
  'mostafa-ashraf-best-position-paper-wto': 'certificates/mostafa-ashraf-best-position-paper-wto.pdf',
  'ntando-hara': 'certificates/ntando-hara.pdf',
  'nur-saidatul-fatimah': 'certificates/nur-saidatul-fatimah.pdf',
  'reham-ahmed': 'certificates/reham-ahmed.pdf',
  'renad-mahmoud': 'certificates/renad-mahmoud.pdf',
  'roba-ahmed-attendance': 'certificates/roba-ahmed-attendance.pdf',
  'roba-ahmed-outstanding-delegate': 'certificates/roba-ahmed-outstanding-delegate.pdf',
  'roba-ahmed-best-position-paper': 'certificates/roba-ahmed-best-position-paper.pdf',
  'salma-beshir': 'certificates/salma-beshir.pdf',
  'shaden-roza': 'certificates/shaden-roza.pdf',
  'stephani-amisi': 'certificates/stephani-amisi.pdf',
  'yashfa-ahsan': 'certificates/yashfa-ahsan.pdf',
  'yousr-ahmed': 'certificates/yousr-ahmed.pdf',
  'marina-harby-wto-attendance': 'certificates/marina-harby-wto-attendance.pdf',
};

const CREDENTIALS: Credential[] = [
  {
    id: 'hana-abdullah',
    recipient: 'Hana Abdullah',
    certificateName: 'Attendance Certificate',
    committee: 'United Nations Security Council (UNSC)',
    conference: 'STEM Model United Nations Conference',
    date: 'August 24, 2026',
    issued: 'August 24, 2026',
    email: 'hana.abdullah@delegate.edu',
    code: 'STEM-852278',
    role: 'Conference Delegate',
  },
  {
    id: 'bernard-kalenga',
    recipient: 'Bernard Kalenga',
    certificateName: 'Chair Certificate',
    committee: 'United Nations Office on Drugs and Crime (UNODC)',
    conference: 'STEM Model United Nations Conference',
    date: 'August 24, 2026',
    issued: 'August 24, 2026',
    email: 'Not provided',
    code: 'STEM-310421',
    role: 'Chair',
  },
  {
    id: 'mohamed-raoof',
    recipient: 'Mohamed Raoof',
    certificateName: 'STEM MUN Team Member Certificate',
    committee: 'Conference Office',
    conference: 'STEM Model United Nations Conference',
    date: 'August 24, 2026',
    issued: 'August 24, 2026',
    email: 'Not provided',
    code: 'STEM-310422',
    role: 'Conference Organizer / Academics Member',
  },
  {
    id: 'shaden-roza',
    recipient: 'Shaden Roza',
    certificateName: 'Chair Certificate',
    committee: 'United Nations Human Rights Council (UNHRC)',
    conference: 'STEM Model United Nations Conference',
    date: 'August 24, 2026',
    issued: 'August 24, 2026',
    email: 'Not provided',
    code: 'STEM-310423',
    role: 'Chair',
  },
  {
    id: 'yashfa-ahsan',
    recipient: 'Yashfa Ahsan',
    certificateName: 'Chair Certificate',
    committee: 'Economic and Social Council (ECOSOC)',
    conference: 'STEM Model United Nations Conference',
    date: 'August 24, 2026',
    issued: 'August 24, 2026',
    email: 'Not provided',
    code: 'STEM-310424',
    role: 'Chair',
  },
  {
    id: 'ntando-hara',
    recipient: 'Ntando Hara',
    certificateName: 'Committee Trainer Certificate',
    committee: 'World Trade Organization (WTO)',
    conference: 'STEM Model United Nations Conference',
    date: 'August 24, 2026',
    issued: 'August 24, 2026',
    email: 'Not provided',
    code: 'STEM-310425',
    role: 'Committee Trainer',
  },
  {
    id: 'nur-saidatul-fatimah',
    recipient: 'Nur Saidatul Fatimah',
    certificateName: 'Honourable Mention',
    committee: 'UN Women',
    conference: 'STEM Model United Nations Conference',
    date: 'August 24, 2026',
    issued: 'August 24, 2026',
    email: 'Not provided',
    code: 'STEM-310426',
    role: 'Delegate / Award Winner',
  },
  {
    id: 'humairaa-khan',
    recipient: 'Humairaa Khan',
    certificateName: 'Chair Certificate',
    committee: 'United Nations Security Council (UNSC)',
    conference: 'STEM Model United Nations Conference',
    date: 'August 24, 2026',
    issued: 'August 24, 2026',
    email: 'Not provided',
    code: 'STEM-310427',
    role: 'Chair',
  },
  {
    id: 'salma-beshir',
    recipient: 'Salma Beshir',
    certificateName: 'STEM MUN Team Member Certificate',
    committee: 'Conference Office',
    conference: 'STEM Model United Nations Conference',
    date: 'August 24, 2026',
    issued: 'August 24, 2026',
    email: 'Not provided',
    code: 'STEM-310428',
    role: 'Conference Organizer / Academics Member',
  },
  {
    id: 'stephani-amisi',
    recipient: 'Stephani Amisi',
    certificateName: 'Chair Certificate',
    committee: 'United Nations Environment Programme (UNEP)',
    conference: 'STEM Model United Nations Conference',
    date: 'August 24, 2026',
    issued: 'August 24, 2026',
    email: 'Not provided',
    code: 'STEM-310429',
    role: 'Chair',
  },
  {
    id: 'aseel-ahmad',
    recipient: 'Aseel Ahmad',
    certificateName: 'STEM MUN Team Member Certificate',
    committee: 'Conference Office',
    conference: 'STEM Model United Nations Conference',
    date: 'August 24, 2026',
    issued: 'August 24, 2026',
    email: 'Not provided',
    code: 'STEM-310430',
    role: 'Conference Organizer / Organizing Committee Member',
  },
  {
    id: 'haneen-ahmed-best-delegate',
    recipient: 'Haneen Ahmed',
    certificateName: 'Best Delegate',
    committee: 'United Nations Human Rights Council (UNHRC)',
    conference: 'STEM Model United Nations Conference',
    date: 'August 24, 2026',
    issued: 'August 24, 2026',
    email: 'Not provided',
    code: 'STEM-310431',
    role: 'Best Delegate',
  },
  {
    id: 'haneen-ahmed-attendance',
    recipient: 'Haneen Ahmed',
    certificateName: 'Certificate of Attendance',
    committee: 'United Nations Human Rights Council (UNHRC)',
    conference: 'STEM Model United Nations Conference',
    date: 'August 24, 2026',
    issued: 'August 24, 2026',
    email: 'Not provided',
    code: 'STEM-310432',
    role: 'Delegate',
  },
  {
    id: 'jana-elkholy',
    recipient: 'Jana Elkholy',
    certificateName: 'Honourable Mention',
    committee: 'United Nations Environment Programme (UNEP)',
    conference: 'STEM Model United Nations Conference',
    date: 'August 24, 2026',
    issued: 'August 24, 2026',
    email: 'Not provided',
    code: 'STEM-310433',
    role: 'Honourable Mention',
  },
  {
    id: 'joudy-ahmed-attendance',
    recipient: 'Joudy Ahmed',
    certificateName: 'Certificate of Attendance',
    committee: 'Conference Delegate',
    conference: 'STEM Model United Nations Conference',
    date: 'August 24, 2026',
    issued: 'August 24, 2026',
    email: 'Not provided',
    code: 'STEM-310434',
    role: 'Delegate',
  },
  {
    id: 'joudy-ahmed-outstanding-delegate',
    recipient: 'Joudy Ahmed',
    certificateName: 'Outstanding Delegate',
    committee: 'United Nations Environment Programme (UNEP)',
    conference: 'STEM Model United Nations Conference',
    date: 'August 24, 2026',
    issued: 'August 24, 2026',
    email: 'Not provided',
    code: 'STEM-310435',
    role: 'Outstanding Delegate',
  },
  {
    id: 'khadija-nawaf',
    recipient: 'Khadija Nawaf',
    certificateName: 'Best Position Paper',
    committee: 'United Nations Security Council (UNSC)',
    conference: 'STEM Model United Nations Conference',
    date: 'August 24, 2026',
    issued: 'August 24, 2026',
    email: 'Not provided',
    code: 'STEM-310436',
    role: 'Best Position Paper',
  },
  {
    id: 'maha-ahmed',
    recipient: 'Maha Ahmed',
    certificateName: 'Certificate of Attendance',
    committee: 'Conference Delegate',
    conference: 'STEM Model United Nations Conference',
    date: 'August 24, 2026',
    issued: 'August 24, 2026',
    email: 'Not provided',
    code: 'STEM-310437',
    role: 'Delegate',
  },
  {
    id: 'malak-mohamed',
    recipient: 'Malak Mohamed',
    certificateName: 'Certificate of Attendance',
    committee: 'Conference Delegate',
    conference: 'STEM Model United Nations Conference',
    date: 'August 24, 2026',
    issued: 'August 24, 2026',
    email: 'Not provided',
    code: 'STEM-310438',
    role: 'Delegate',
  },
  {
    id: 'mazen-mohamed',
    recipient: 'Mazen Mohamed',
    certificateName: 'Honourable Mention',
    committee: 'United Nations Human Rights Council (UNHRC)',
    conference: 'STEM Model United Nations Conference',
    date: 'August 24, 2026',
    issued: 'August 24, 2026',
    email: 'Not provided',
    code: 'STEM-310439',
    role: 'Honourable Mention',
  },
  {
    id: 'reham-ahmed',
    recipient: 'Reham Ahmed',
    certificateName: 'Certificate of Attendance',
    committee: 'Conference Delegate',
    conference: 'STEM Model United Nations Conference',
    date: 'August 24, 2026',
    issued: 'August 24, 2026',
    email: 'Not provided',
    code: 'STEM-310441',
    role: 'Delegate',
  },
  {
    id: 'renad-mahmoud',
    recipient: 'Renad Mahmoud',
    certificateName: 'Certificate of Attendance',
    committee: 'Conference Delegate',
    conference: 'STEM Model United Nations Conference',
    date: 'August 24, 2026',
    issued: 'August 24, 2026',
    email: 'Not provided',
    code: 'STEM-310442',
    role: 'Delegate',
  },
  {
    id: 'roba-ahmed-outstanding-delegate',
    recipient: 'Roba Ahmed',
    certificateName: 'Outstanding Delegate',
    committee: 'UN Women',
    conference: 'STEM Model United Nations Conference',
    date: 'August 24, 2026',
    issued: 'August 24, 2026',
    email: 'Not provided',
    code: 'STEM-310443',
    role: 'Outstanding Delegate',
  },
  {
    id: 'roba-ahmed-attendance',
    recipient: 'Roba Ahmed',
    certificateName: 'Certificate of Attendance',
    committee: 'Conference Delegate',
    conference: 'STEM Model United Nations Conference',
    date: 'August 24, 2026',
    issued: 'August 24, 2026',
    email: 'Not provided',
    code: 'STEM-310444',
    role: 'Delegate',
  },
  {
    id: 'roba-ahmed-best-position-paper',
    recipient: 'Roba Ahmed',
    certificateName: 'Best Position Paper',
    committee: 'UN Women',
    conference: 'STEM Model United Nations Conference',
    date: 'August 24, 2026',
    issued: 'August 24, 2026',
    email: 'Not provided',
    code: 'STEM-310445',
    role: 'Best Position Paper',
  },
  {
    id: 'yousr-ahmed',
    recipient: 'Yousr Ahmed',
    certificateName: 'Certificate of Attendance',
    committee: 'Conference Delegate',
    conference: 'STEM Model United Nations Conference',
    date: 'August 24, 2026',
    issued: 'August 24, 2026',
    email: 'Not provided',
    code: 'STEM-310446',
    role: 'Delegate',
  },
  {
    id: 'marina-harby-wto-attendance',
    recipient: 'Marina Harby',
    certificateName: 'Certificate of Attendance',
    committee: 'World Trade Organization (WTO)',
    conference: CONFERENCE_NAME,
    date: HOLDING_DATE,
    issued: ISSUED_DATE,
    email: 'Not provided',
    code: 'STEM-310447',
    role: 'Conference Delegate',
  },
  {
    id: 'adam-hussein-chair-fao',
    recipient: 'Adam Hussein',
    certificateName: 'Chair Certificate',
    committee: 'Food and Agriculture Organization (FAO)',
    conference: CONFERENCE_NAME,
    date: HOLDING_DATE,
    issued: ISSUED_DATE,
    email: 'Not provided',
    code: 'STEM-310448',
    role: 'Chair',
  },
  {
    id: 'stephanie-nehema-chair-unep',
    recipient: 'Stephanie Nehema',
    certificateName: 'Chair Certificate',
    committee: 'United Nations Environment Programme (UNEP)',
    conference: CONFERENCE_NAME,
    date: HOLDING_DATE,
    issued: ISSUED_DATE,
    email: 'Not provided',
    code: 'STEM-310449',
    role: 'Chair',
  },
  {
    id: 'sondos-madhi-chair-ecosoc',
    recipient: 'Sondos Madhi',
    certificateName: 'Chair Certificate',
    committee: 'Economic and Social Council (ECOSOC)',
    conference: CONFERENCE_NAME,
    date: HOLDING_DATE,
    issued: ISSUED_DATE,
    email: 'Not provided',
    code: 'STEM-310450',
    role: 'Chair',
  },
  {
    id: 'ammar-kablan-un-women-trainer',
    recipient: 'Ammar Kablan',
    certificateName: 'Committee Trainer Certificate',
    committee: 'UN Women',
    conference: CONFERENCE_NAME,
    date: HOLDING_DATE,
    issued: ISSUED_DATE,
    email: 'Not provided',
    code: 'STEM-310451',
    role: 'Committee Trainer',
  },
  {
    id: 'salma-ali-attendance',
    recipient: 'Salma Ali',
    certificateName: 'Certificate of Attendance',
    committee: 'Conference Delegate',
    conference: CONFERENCE_NAME,
    date: HOLDING_DATE,
    issued: ISSUED_DATE,
    email: 'Not provided',
    code: 'STEM-310452',
    role: 'Delegate',
  },
  {
    id: 'yassin-kamal-attendance',
    recipient: 'Yassin Kamal',
    certificateName: 'Certificate of Attendance',
    committee: 'Conference Delegate',
    conference: CONFERENCE_NAME,
    date: HOLDING_DATE,
    issued: ISSUED_DATE,
    email: 'Not provided',
    code: 'STEM-310453',
    role: 'Delegate',
  },
  {
    id: 'nur-saidatul-attendance',
    recipient: 'Nur Saidatul',
    certificateName: 'Certificate of Attendance',
    committee: 'Conference Delegate',
    conference: CONFERENCE_NAME,
    date: HOLDING_DATE,
    issued: ISSUED_DATE,
    email: 'Not provided',
    code: 'STEM-310454',
    role: 'Delegate',
  },
  {
    id: 'rokaia-ismail-attendance',
    recipient: 'Rokaia Ismail',
    certificateName: 'Certificate of Attendance',
    committee: 'Conference Delegate',
    conference: CONFERENCE_NAME,
    date: HOLDING_DATE,
    issued: ISSUED_DATE,
    email: 'Not provided',
    code: 'STEM-310455',
    role: 'Delegate',
  },
  {
    id: 'ashrakat-mohammed-best-position-paper',
    recipient: 'Ashrakat Mohammed',
    certificateName: 'Best Position Paper',
    committee: 'United Nations Human Rights Council (UNHRC)',
    conference: CONFERENCE_NAME,
    date: HOLDING_DATE,
    issued: ISSUED_DATE,
    email: 'Not provided',
    code: 'STEM-310456',
    role: 'Best Position Paper',
  },
  {
    id: 'mostafa-ashraf-honourable-mention',
    recipient: 'Mostafa Ashraf',
    certificateName: 'Honourable Mention',
    committee: 'World Trade Organization (WTO)',
    conference: CONFERENCE_NAME,
    date: HOLDING_DATE,
    issued: ISSUED_DATE,
    email: 'Not provided',
    code: 'STEM-310440',
    role: 'Honourable Mention',
  },
  {
    id: 'mostafa-ashraf-best-position-paper-wto',
    recipient: 'Mostafa Ashraf',
    certificateName: 'Best Position Paper',
    committee: 'World Trade Organization (WTO)',
    conference: CONFERENCE_NAME,
    date: HOLDING_DATE,
    issued: ISSUED_DATE,
    email: 'Not provided',
    code: 'STEM-310457',
    role: 'Best Position Paper',
  },
  {
    id: 'noreen-sallam-organiser',
    recipient: 'Noreen Sallam',
    certificateName: 'STEM MUN Team Member Certificate',
    committee: 'Conference Office',
    conference: CONFERENCE_NAME,
    date: HOLDING_DATE,
    issued: ISSUED_DATE,
    email: 'Not provided',
    code: 'STEM-310458',
    role: 'Organiser',
  },
  {
    id: 'abdelrahman-shosha-organiser',
    recipient: 'Abdelrahman Shosha',
    certificateName: 'STEM MUN Team Member Certificate',
    committee: 'Conference Office',
    conference: CONFERENCE_NAME,
    date: HOLDING_DATE,
    issued: ISSUED_DATE,
    email: 'Not provided',
    code: 'STEM-310459',
    role: 'Organiser',
  },
  {
    id: 'mohammed-khaled-organiser',
    recipient: 'Mohammed Khaled',
    certificateName: 'STEM MUN Team Member Certificate',
    committee: 'Conference Office',
    conference: CONFERENCE_NAME,
    date: HOLDING_DATE,
    issued: ISSUED_DATE,
    email: 'Not provided',
    code: 'STEM-310460',
    role: 'Organiser',
  },
  {
    id: 'nour-hassanen-outstanding-delegate-fao',
    recipient: 'Nour Hassanen',
    certificateName: 'Outstanding Delegate',
    committee: 'Food and Agriculture Organization (FAO)',
    conference: CONFERENCE_NAME,
    date: HOLDING_DATE,
    issued: ISSUED_DATE,
    email: 'Not provided',
    code: 'STEM-310461',
    role: 'Outstanding Delegate',
  },
  {
    id: 'layal-elzeiny-best-position-paper-unep',
    recipient: 'Layal Elzeiny',
    certificateName: 'Best Position Paper',
    committee: 'United Nations Environment Programme (UNEP)',
    conference: CONFERENCE_NAME,
    date: HOLDING_DATE,
    issued: ISSUED_DATE,
    email: 'Not provided',
    code: 'STEM-310462',
    role: 'Best Position Paper',
  },
].map((credential) => ({ ...credential, conference: CONFERENCE_NAME, date: HOLDING_DATE, issued: ISSUED_DATE }));

const getCredentialById = (id?: string) => CREDENTIALS.find((record) => record.id === id);
const getCredentialByCode = (code?: string) => CREDENTIALS.find((record) => record.code.toLowerCase() === (code ?? '').toLowerCase());
const getCredentialsByRecipient = (slug?: string) => CREDENTIALS.filter((record) => record.recipient.toLowerCase().replace(/\s+/g, '-') === (slug ?? '').toLowerCase());

function BrandMark({ light = false }: { light?: boolean }) {
  return <div className="flex items-center gap-3" data-testid="brand-mark">
    <div className={`relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border ${light ? 'border-[#d1af6e]/70 bg-[#580d00]' : 'border-[#580d00]/20 bg-[#580d00]'}`}>
      <img src={LOGO_SRC} alt="" className="h-full w-full object-contain p-1" /><span className="absolute -bottom-1 h-2 w-2 rotate-45 bg-[#d1af6e]" />
    </div>
    <div className="leading-none"><div className={`font-serif text-xl font-bold tracking-tight ${light ? 'text-[#f7f0df]' : 'text-[#580d00]'}`}>STEM MUN</div><div className={`mt-1 font-mono text-xs tracking-wide ${light ? 'text-[#f7f0df]/70' : 'text-[#580d00]/60'}`}>Certificate Verification</div></div>
  </div>;
}

function Header({ onLookup }: { onLookup?: () => void }) {
  return <header className="relative z-20 border-b border-[#d1af6e]/35 bg-[#580d00] text-[#f8f4eb]">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-10">
      <Link href="/" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d1af6e]" data-testid="link-home-brand"><BrandMark light /></Link>
      <button onClick={onLookup} className="flex items-center gap-2 border border-[#d1af6e]/70 px-4 py-3 text-xs font-semibold text-[#f8f4eb] transition-colors hover:bg-[#6f1a0e]" data-testid="button-lookup"><Search size={16} /> Lookup</button>
    </div>
  </header>;
}

function Shell({ children, onLookup }: { children: ReactNode; onLookup?: () => void }) {
  return <div className="paper-grain min-h-[100dvh] bg-[#f8f4eb]"><Header onLookup={onLookup} />{children}</div>;
}

function SearchPanel({ onSearch }: { onSearch: (value: string) => void }) {
  const [value, setValue] = useState('');
  const submit = (event: FormEvent) => { event.preventDefault(); onSearch(value.trim()); };
  return <form onSubmit={submit} className="relative mx-auto max-w-2xl" data-testid="form-certificate-lookup">
    <label className="mb-3 block text-left font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#f8f4eb]/60" htmlFor="certificate-name">Recipient name</label>
    <div className="flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f8f4eb]/45" size={19} /><input id="certificate-name" type="text" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g., Mostafa Ashraf" className="w-full border border-[#d1af6e]/70 bg-white px-4 py-3 pl-11 text-sm text-[#580d00] placeholder-[#580d00]/40 transition-colors focus:border-[#d1af6e] focus:outline-none" data-testid="input-certificate-name" /></div><button type="submit" className="flex items-center justify-center gap-2 border border-[#d1af6e] bg-[#d1af6e] px-6 py-3 font-semibold text-[#580d00] transition-colors hover:bg-[#d1af6e]/90" data-testid="button-search"><Check size={18} /> Verify</button></div>
    <p className="mt-3 flex items-center gap-2 text-xs text-[#f8f4eb]/50"><ShieldCheck size={14} className="text-[#d1af6e]" /> Search is case-insensitive and respects the name as issued.</p>
  </form>;
}

function Home() {
  const [, setLocation] = useLocation();
  const scrollToLookup = () => document.getElementById('lookup')?.scrollIntoView({ behavior: 'smooth' });
  const handleSearch = (value: string) => { setLocation(value ? `/certificate/${value.toLowerCase().replace(/\s+/g, '-')}` : '/'); };
  return <Shell onLookup={scrollToLookup}><main>
    <section id="lookup" className="min-h-[calc(100dvh-83px)] scroll-mt-10 bg-[#580d00] px-5 py-16 text-[#f8f4eb] md:py-24"><div className="mx-auto flex max-w-5xl flex-col justify-center"><div className="mb-12 text-center"><BrandMark /><h1 className="mt-8 font-serif text-5xl font-bold md:text-6xl">Verify Your Certificate</h1><p className="mt-4 text-lg opacity-80">Search for your name to view and download your STEM MUN certificate</p></div><SearchPanel onSearch={handleSearch} /></div></section>
  </main></Shell>;
}

function NotFoundRecord({ searchedName, onBack }: { searchedName?: string; onBack: () => void }) {
  return <Shell onLookup={onBack}><main className="mx-auto flex min-h-[calc(100dvh-180px)] max-w-3xl flex-col items-center justify-center px-5 py-20 text-center"><div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100/20 mb-6"><FileCheck2 size={40} className="text-red-600" /></div><h1 className="font-serif text-3xl font-bold text-[#580d00]">Certificate Not Found</h1><p className="mt-4 text-[#580d00]/70">We couldn't find a certificate for "<span className="font-semibold">{searchedName}</span>". Please check the name and try again.</p><Link href="/" className="mt-8 inline-flex items-center gap-2 rounded-md border border-[#d1af6e] bg-[#d1af6e] px-6 py-3 font-semibold text-[#580d00] transition-colors hover:bg-transparent"><ArrowLeft size={18} /> Back to Search</Link></main></Shell>;
}

function QrLike({ code, onClick }: { code: string; onClick: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const verificationUrl = `${window.location.origin}${import.meta.env.BASE_URL}verify/${code}`;

  useEffect(() => {
    if (!canvasRef.current) return;
    void QRCode.toCanvas(canvasRef.current, verificationUrl, {
      width: 200,
      margin: 2,
      color: { dark: '#d1af6e', light: '#580d00' },
      errorCorrectionLevel: 'H',
    });
  }, [verificationUrl]);

  return <button onClick={onClick} className="group relative overflow-hidden border border-[#580d00] bg-[#580d00] p-2 text-left transition-transform hover:scale-[1.03]" aria-label="Open verification page" data-testid="button-qr-code"><canvas ref={canvasRef} className="block" /></button>;
}

function CertificateCard({ credential, onVerify }: { credential: Credential; onVerify: () => void }) {
  const downloadCertificate = () => {
    const suppliedFile = SUPPLIED_CERTIFICATE_FILES[credential.id];
    if (suppliedFile) {
      const link = document.createElement('a');
      link.href = `${import.meta.env.BASE_URL}${suppliedFile}`;
      link.download = `${credential.id}-certificate.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      return;
    }
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${credential.certificateName} — ${credential.recipient}</title><style>body{margin:0;background:#f8f4eb;color:#580d00;font-family:system-ui;padding:40px}h1{font-size:24px;font-weight:bold;margin-bottom:20px}p{margin:10px 0;line-height:1.6}</style></head><body><h1>${credential.certificateName}</h1><p><strong>Recipient:</strong> ${credential.recipient}</p><p><strong>Role:</strong> ${credential.role}</p><p><strong>Committee:</strong> ${credential.committee}</p><p><strong>Date:</strong> ${credential.date}</p><p><strong>Code:</strong> ${credential.code}</p></body></html>`;
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' })); const link = document.createElement('a'); link.href = url; link.download = `${credential.id}-certificate.html`; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
  };
  const copyCode = async () => { await navigator.clipboard?.writeText(credential.code); };
  return <div className="mx-auto max-w-7xl px-5 py-10 lg:px-10 lg:py-16"><div className="mb-12 flex flex-wrap items-center justify-between gap-4"><Link href="/" className="flex items-center gap-2 text-sm font-semibold text-[#580d00] hover:text-[#d1af6e] transition-colors" data-testid="link-back"><ArrowLeft size={16} /> Back</Link><button onClick={downloadCertificate} className="flex items-center gap-2 rounded-md border border-[#d1af6e] bg-[#d1af6e] px-4 py-3 font-semibold text-[#580d00] transition-colors hover:bg-transparent hover:text-[#d1af6e]" data-testid="button-download"><Download size={18} /> Download</button></div>

      <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:items-start"><article className="animate-rise relative overflow-hidden border border-[#d1af6e]/70 bg-[#fffdf8] p-6 shadow-[8px_8px_0_rgba(209,175,110,.25)] sm:p-12"><div className="mb-8"><div className="mb-4 flex items-center gap-2"><Award size={24} className="text-[#d1af6e]" /><h1 className="font-serif text-3xl font-bold text-[#580d00]">{credential.certificateName}</h1></div><p className="text-sm text-[#580d00]/60 font-mono uppercase tracking-widest">Presented to</p></div><h2 className="mb-6 font-serif text-4xl font-bold text-[#d1af6e]">{credential.recipient}</h2><div className="border-b border-[#d1af6e]/30 pb-6 mb-6"><p className="text-[#580d00]/70 text-sm"><span className="font-semibold">Role:</span> {credential.role}</p>{credential.committee && credential.committee !== 'Conference Delegate' && <p className="text-[#580d00]/70 text-sm mt-2"><span className="font-semibold">Committee:</span> {credential.committee}</p>}<p className="text-[#580d00]/70 text-sm mt-2"><span className="font-semibold">Date:</span> {credential.date}</p></div><p className="text-xs text-[#580d00]/50">Certificate Code: {credential.code}</p></article>

        <aside className="animate-rise animate-rise-delay-1 space-y-4"><div className="border border-[#580d00]/30 bg-white p-6 rounded-lg shadow-md"><div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-[#580d00] mb-4"><Hash size={14} /> Verification</div><QrLike code={credential.code} onClick={onVerify} /><p className="text-[10px] text-[#580d00]/50 mt-3 text-center">Scan to verify</p></div>

          <div className="border border-[#580d00]/30 bg-white p-6 rounded-lg shadow-md"><div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-[#580d00] mb-4"><FileCheck2 size={14} /> Details</div><div className="space-y-3 text-sm"><div><p className="font-mono text-[9px] uppercase text-[#580d00]/60">Type</p><p className="text-[#580d00] font-semibold">{credential.certificateName}</p></div>{credential.committee && credential.committee !== 'Conference Delegate' && <div><p className="font-mono text-[9px] uppercase text-[#580d00]/60">Committee</p><p className="text-[#580d00] font-semibold text-xs">{credential.committee}</p></div>}<div><p className="font-mono text-[9px] uppercase text-[#580d00]/60">Date</p><p className="text-[#580d00] font-semibold">{credential.date}</p></div></div></div>

          <div className="border border-[#d1af6e] bg-[#f0e8d8] p-4 rounded-lg"><button onClick={copyCode} className="w-full flex items-center justify-center gap-2 font-mono font-bold text-[#580d00] text-sm py-2 px-3 rounded transition-colors hover:bg-white active:scale-95"><Copy size={14} /> {credential.code}</button></div></aside>
      </div>
    </div>;
}

function CredentialChoices({ credentials, onBack }: { credentials: Credential[]; onBack: () => void }) {
  return <Shell><main className="mx-auto max-w-4xl px-5 py-12 lg:px-10 lg:py-20"><button onClick={onBack} className="mb-12 flex items-center gap-2 text-sm font-semibold text-[#580d00] hover:text-[#d1af6e] transition-colors" data-testid="button-back"><ArrowLeft size={16} /> Back</button><div className="mb-8"><h1 className="font-serif text-3xl font-bold text-[#580d00] mb-2">Multiple Certificates Found</h1><p className="text-[#580d00]/70">Please select the certificate you'd like to view:</p></div><div className="grid gap-4 sm:grid-cols-2"><>{credentials.map((cred, idx) => (<Link key={idx} href={`/certificate/${cred.id}`} className="group block rounded-lg border border-[#d1af6e]/70 bg-white p-6 transition-all hover:border-[#d1af6e] hover:shadow-lg" data-testid={`link-certificate-${idx}`}><h3 className="font-semibold text-[#580d00] group-hover:text-[#d1af6e] transition-colors">{cred.certificateName}</h3><p className="mt-2 text-sm text-[#580d00]/60">{cred.role}</p><p className="mt-1 text-xs text-[#580d00]/50">{cred.committee}</p></Link>))}</></div></main></Shell>;
}

function CertificatePage({ id }: { id?: string }) {
  const [, setLocation] = useLocation();
  const credential = getCredentialById(id);
  const recipientMatches = credential ? [] : getCredentialsByRecipient(id);
  if (!credential && recipientMatches.length > 1) return <CredentialChoices credentials={recipientMatches} onBack={() => setLocation('/')} />;
  const selectedCredential = credential ?? recipientMatches[0];
  if (!selectedCredential) return <NotFoundRecord searchedName={id?.replace(/-/g, ' ')} onBack={() => setLocation('/')} />;
  return <Shell><CertificateCard credential={selectedCredential} onVerify={() => setLocation(`/verify/${selectedCredential.code}`)} /></Shell>;
}

function VerificationPage({ code }: { code?: string }) {
  const [, setLocation] = useLocation(); const credential = getCredentialByCode(code);
  return <Shell><main className="mx-auto max-w-4xl px-5 py-12 lg:px-10 lg:py-20"><Link href={credential ? `/certificate/${credential.id}` : '/'} className="mb-12 flex items-center gap-2 text-sm font-semibold text-[#580d00] hover:text-[#d1af6e] transition-colors" data-testid="link-back"><ArrowLeft size={16} /> Back</Link>
    {credential ? <div className="animate-rise border border-[#d1af6e]/70 bg-[#fffdf8] p-6 shadow-[8px_8px_0_rgba(209,175,110,.25)] sm:p-12"><div className="flex flex-col items-center text-center"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4"><Check size={32} className="text-green-600" /></div><h1 className="font-serif text-3xl font-bold text-[#580d00]">Certificate Verified</h1><p className="mt-4 text-lg text-[#580d00]/70"><span className="font-semibold">{credential.recipient}</span>'s certificate is authentic and valid.</p><div className="mt-8 space-y-3 rounded-lg bg-[#f0e8d8] p-6 text-left"><div className="flex justify-between"><span className="font-mono text-sm font-semibold text-[#580d00]/60">CERTIFICATE TYPE</span><span className="text-[#580d00]">{credential.certificateName}</span></div><div className="flex justify-between"><span className="font-mono text-sm font-semibold text-[#580d00]/60">COMMITTEE</span><span className="text-[#580d00]">{credential.committee}</span></div><div className="flex justify-between"><span className="font-mono text-sm font-semibold text-[#580d00]/60">ROLE</span><span className="text-[#580d00]">{credential.role}</span></div><div className="flex justify-between"><span className="font-mono text-sm font-semibold text-[#580d00]/60">DATE ISSUED</span><span className="text-[#580d00]">{credential.issued}</span></div><div className="flex justify-between"><span className="font-mono text-sm font-semibold text-[#580d00]/60">CODE</span><span className="font-mono text-[#580d00]">{credential.code}</span></div></div><Link href={`/certificate/${credential.id}`} className="mt-8 inline-flex items-center gap-2 rounded-md border border-[#d1af6e] bg-[#d1af6e] px-6 py-3 font-semibold text-[#580d00] transition-colors hover:bg-transparent hover:text-[#d1af6e]" data-testid="link-certificate"><Download size={18} /> Download Certificate</Link></div></div> : <div className="text-center"><h1 className="font-serif text-3xl font-bold text-red-600">Invalid Certificate</h1><p className="mt-4 text-[#580d00]/70">The certificate code "{code}" could not be verified.</p></div>}
  </main></Shell>;
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route path="/certificate/:id">{(params) => <CertificatePage id={params.id} />}</Route><Route path="/verify/:code">{(params) => <VerificationPage code={params.code} />}</Route><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation(); return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;