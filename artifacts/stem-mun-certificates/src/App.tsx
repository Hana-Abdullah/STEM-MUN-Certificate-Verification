import { type FormEvent, type ReactNode, useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Award, ArrowLeft, ArrowRight, Check, ClipboardCheck, Copy, Download, FileCheck2, Hash, Landmark, Menu, QrCode, Search, ShieldCheck, X } from 'lucide-react';
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

const CREDENTIALS: Credential[] = [{
  id: 'hana-abdullah',
  recipient: 'Hana Abdullah',
  certificateName: 'Attendance Certificate',
  committee: 'United Nations Security Council',
  conference: 'STEM Model United Nations Conference',
  date: 'August 24, 2026',
  issued: 'August 24, 2026',
  email: 'hana.abdullah@delegate.edu',
  code: 'STEM-852278',
  role: 'Conference Delegate',
}];

const getCredentialById = (id?: string) => CREDENTIALS.find((record) => record.id === id);
const getCredentialByCode = (code?: string) => CREDENTIALS.find((record) => record.code.toLowerCase() === (code ?? '').toLowerCase());

function BrandMark({ light = false }: { light?: boolean }) {
  return <div className="flex items-center gap-3" data-testid="brand-mark">
    <div className={`relative flex h-11 w-11 items-center justify-center rounded-full border ${light ? 'border-[#d1af6e]/70 bg-[#d1af6e]/10' : 'border-[#580d00]/20 bg-[#580d00]'}`}>
      <Landmark size={20} strokeWidth={1.5} className={light ? 'text-[#d1af6e]' : 'text-[#f7f0df]'} /><span className="absolute -bottom-1 h-2 w-2 rotate-45 bg-[#d1af6e]" />
    </div>
    <div className="leading-none"><div className={`font-serif text-xl font-bold tracking-tight ${light ? 'text-[#f7f0df]' : 'text-[#580d00]'}`}>STEM MUN</div><div className={`mt-1 font-mono text-[8px] uppercase tracking-[.25em] ${light ? 'text-[#d1af6e]' : 'text-[#580d00]/60'}`}>Credential Desk</div></div>
  </div>;
}

function Header({ onLookup }: { onLookup?: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return <header className="relative z-20 border-b border-[#580d00]/10 bg-[#f8f4eb]/90 backdrop-blur-md">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-10">
      <Link href="/" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d1af6e]" data-testid="link-home-brand"><BrandMark /></Link>
      <nav className="hidden items-center gap-9 md:flex" aria-label="Primary navigation">
        <a href="#how-it-works" className="text-sm font-medium text-[#580d00]/65 transition-colors hover:text-[#580d00]" data-testid="link-how-it-works">How it works</a>
        <a href="#about" className="text-sm font-medium text-[#580d00]/65 transition-colors hover:text-[#580d00]" data-testid="link-about">About credentials</a>
        <button onClick={onLookup} className="flex items-center gap-2 text-sm font-semibold text-[#580d00] transition-colors hover:text-[#a36c22]" data-testid="button-header-lookup">Find a certificate <ArrowRight size={15} /></button>
      </nav>
      <button className="rounded-md p-2 text-[#580d00] md:hidden" onClick={() => setMenuOpen((open) => !open)} aria-label="Open navigation" data-testid="button-mobile-menu">{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
    </div>
    {menuOpen && <nav className="border-t border-[#580d00]/10 px-5 py-4 md:hidden" aria-label="Mobile navigation">
      <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="block py-2 text-sm font-medium text-[#580d00]/75" data-testid="link-mobile-how-it-works">How it works</a>
      <a href="#about" onClick={() => setMenuOpen(false)} className="block py-2 text-sm font-medium text-[#580d00]/75" data-testid="link-mobile-about">About credentials</a>
      <button onClick={() => { setMenuOpen(false); onLookup?.(); }} className="flex items-center gap-2 py-2 text-sm font-semibold text-[#580d00]" data-testid="button-mobile-lookup">Find a certificate <ArrowRight size={15} /></button>
    </nav>}
  </header>;
}

function Footer() {
  return <footer className="border-t border-[#d1af6e]/20 bg-[#580d00] text-[#f7f0df]"><div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 md:flex-row md:items-end md:justify-between lg:px-10"><div><BrandMark light /><p className="mt-5 max-w-xs text-sm leading-6 text-[#f7f0df]/60">The official public desk for STEM Model United Nations credentials.</p></div><div className="text-left md:text-right"><p className="font-mono text-[10px] uppercase tracking-[.22em] text-[#d1af6e]">Credential desk / 2026</p><p className="mt-2 text-xs text-[#f7f0df]/50">Built for clarity. Held to account.</p></div></div></footer>;
}

function Shell({ children, onLookup }: { children: ReactNode; onLookup?: () => void }) {
  return <div className="paper-grain min-h-[100dvh] bg-[#f8f4eb]"><Header onLookup={onLookup} />{children}<Footer /></div>;
}

function SearchPanel({ onSearch }: { onSearch: (value: string) => void }) {
  const [value, setValue] = useState('');
  const submit = (event: FormEvent) => { event.preventDefault(); onSearch(value.trim()); };
  return <form onSubmit={submit} className="relative mx-auto max-w-2xl" data-testid="form-certificate-lookup">
    <label className="mb-3 block text-left font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#f8f4eb]/60" htmlFor="certificate-name">Recipient name</label>
    <div className="flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f8f4eb]/45" size={19} /><input id="certificate-name" value={value} onChange={(event) => setValue(event.target.value)} placeholder="e.g. Hana Abdullah" className="h-14 w-full rounded-sm border border-[#d1af6e]/35 bg-[#4e1007] pl-12 pr-4 text-base text-[#f8f4eb] outline-none transition-shadow placeholder:text-[#f8f4eb]/35 focus:border-[#d1af6e] focus:ring-4 focus:ring-[#d1af6e]/15" autoComplete="off" data-testid="input-certificate-name" /></div><button type="submit" className="flex h-14 items-center justify-center gap-3 rounded-sm bg-[#d1af6e] px-7 text-sm font-bold text-[#580d00] transition-all hover:bg-[#e0c78e] active:translate-y-px" data-testid="button-find-certificate">Find certificate <ArrowRight size={17} /></button></div>
    <p className="mt-3 flex items-center gap-2 text-xs text-[#f8f4eb]/50"><ShieldCheck size={14} className="text-[#d1af6e]" /> Search is case-insensitive and respects the name as issued.</p>
  </form>;
}

function Home() {
  const [, setLocation] = useLocation();
  const scrollToLookup = () => document.getElementById('lookup')?.scrollIntoView({ behavior: 'smooth' });
  const [searched, setSearched] = useState(false);
  const handleSearch = (value: string) => { setSearched(true); setLocation(value ? `/certificate/${value.toLowerCase().replace(/\s+/g, '-')}` : '/'); };
  return <Shell onLookup={scrollToLookup}><main>
    <section className="relative overflow-hidden border-b border-[#580d00]/10 bg-[#f8f4eb]"><div className="pointer-events-none absolute -right-40 -top-32 h-[520px] w-[520px] rounded-full border border-[#d1af6e]/25 sm:-right-20 sm:-top-44" /><div className="pointer-events-none absolute right-[-210px] top-[-5px] h-[440px] w-[440px] rounded-full border border-[#d1af6e]/20" />
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-16 md:grid-cols-[1.05fr_.95fr] md:gap-10 md:pb-28 md:pt-24 lg:px-10"><div className="animate-rise"><div className="mb-8 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[.22em] text-[#580d00]/55"><span className="h-px w-8 bg-[#d1af6e]" /> Official record / 01</div><h1 className="gold-rule max-w-2xl font-serif text-[clamp(3.3rem,7vw,6.65rem)] font-semibold leading-[.85] tracking-[-.045em] text-[#580d00]">Your work<br /><span className="text-[#d1af6e]">deserves a</span><br />record.</h1><p className="mt-10 max-w-md text-base leading-7 text-[#580d00]/65 sm:text-lg">Find, download, and verify your official STEM Model United Nations certificate in one clear place.</p><button onClick={scrollToLookup} className="mt-8 flex items-center gap-3 border-b-2 border-[#580d00] pb-2 text-sm font-bold text-[#580d00] transition-colors hover:border-[#d1af6e] hover:text-[#a36c22]" data-testid="button-hero-find">Look up a certificate <ArrowRight size={17} /></button></div>
        <div className="relative min-h-[280px] animate-rise animate-rise-delay-2 md:min-h-[410px]"><div className="absolute right-2 top-6 h-56 w-56 rounded-full bg-[#580d00] sm:right-12 sm:h-72 sm:w-72" /><div className="absolute right-12 top-14 h-44 w-44 rounded-full border border-[#d1af6e]/70 sm:right-24 sm:h-60 sm:w-60" /><div className="absolute bottom-2 left-2 z-10 w-[min(100%,370px)] rotate-[-4deg] border border-[#d1af6e]/65 bg-[#fffdf8] p-6 shadow-[12px_16px_0_#d1af6e] sm:left-12 sm:p-8"><div className="flex items-start justify-between"><div className="h-8 w-8 border border-[#d1af6e] p-1.5 text-[#580d00]"><Award size={17} /></div><span className="font-mono text-[8px] uppercase tracking-[.18em] text-[#580d00]/45">No. 852278</span></div><div className="mt-12 text-center"><div className="font-mono text-[8px] uppercase tracking-[.25em] text-[#580d00]/55">STEM Model United Nations</div><div className="mt-3 font-serif text-3xl font-bold text-[#580d00]">Certificate</div><div className="mx-auto mt-4 h-px w-24 bg-[#d1af6e]" /><div className="mt-4 font-serif text-2xl font-semibold text-[#580d00]">Hana Abdullah</div><div className="mt-3 text-[10px] text-[#580d00]/55">Conference Delegate · UNSC</div></div><div className="mt-14 flex items-end justify-between"><div className="font-mono text-[8px] text-[#580d00]/55">AUG 24 / 2026</div><div className="h-7 w-7 rounded-full border border-[#d1af6e] text-center font-serif leading-6 text-[#d1af6e]">S</div></div></div><div className="absolute bottom-[-10px] right-0 z-20 flex h-20 w-20 rotate-[9deg] items-center justify-center border-4 border-[#f8f4eb] bg-[#d1af6e] text-center text-[9px] font-bold uppercase leading-3 tracking-wider text-[#580d00] shadow-lg sm:right-5"><span className="rounded-full border border-[#580d00]/30 p-2">Official<br />record</span></div></div>
      </div>
    </section>
    <section id="lookup" className="scroll-mt-10 bg-[#580d00] px-5 py-16 text-[#f8f4eb] md:py-20"><div className="mx-auto max-w-7xl lg:px-5"><div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#d1af6e]">Credential search</p><h2 className="mt-3 font-serif text-4xl font-semibold leading-none md:text-5xl">Start with a name.</h2></div><p className="max-w-xs text-sm leading-6 text-[#f8f4eb]/60">Your certificate record is held exactly as issued by the conference desk.</p></div><div className="rounded-sm border border-[#d1af6e]/35 bg-[#67190d] p-5 sm:p-8"><SearchPanel onSearch={handleSearch} /></div>{searched && <div className="mt-4 text-sm text-[#f8f4eb]/70">No match yet? Check the spelling and try again.</div>}</div></section>
    <section id="how-it-works" className="mx-auto max-w-7xl scroll-mt-8 px-5 py-20 lg:px-10 lg:py-28"><div className="grid gap-14 md:grid-cols-[.8fr_1.2fr]"><div><p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#580d00]/55">A dependable handoff</p><h2 className="mt-4 max-w-sm font-serif text-5xl font-semibold leading-[.9] text-[#580d00]">Clear at every step.</h2></div><div className="grid gap-0 border-t border-[#580d00]/15 sm:grid-cols-3">{[['01', 'Find', 'Search the name printed on your certificate.'], ['02', 'Confirm', 'Review the official record and its verification code.'], ['03', 'Share', 'Download a clean copy or send the verification link.']].map(([number, title, body]) => <div className="border-b border-[#580d00]/15 py-7 sm:border-b-0 sm:border-r sm:px-7 sm:first:pl-0 sm:last:border-r-0" key={number}><div className="font-mono text-xs text-[#d1af6e]">{number}</div><h3 className="mt-8 font-serif text-3xl font-semibold text-[#580d00]">{title}</h3><p className="mt-3 text-sm leading-6 text-[#580d00]/60">{body}</p></div>)}</div></div></section>
    <section id="about" className="border-y border-[#580d00]/10 bg-[#eee6d7] px-5 py-14 lg:px-10"><div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between"><div className="flex gap-4"><div className="mt-1 text-[#580d00]"><ClipboardCheck size={24} strokeWidth={1.5} /></div><div><p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#580d00]/55">About this desk</p><h2 className="mt-2 font-serif text-3xl font-semibold text-[#580d00]">One record. No guesswork.</h2></div></div><p className="max-w-lg text-sm leading-6 text-[#580d00]/65">A public-facing credential record gives schools, programs, and collaborators a straightforward way to confirm a delegate's participation.</p></div></section>
  </main></Shell>;
}

function NotFoundRecord({ searchedName, onBack }: { searchedName?: string; onBack: () => void }) {
  return <Shell onLookup={onBack}><main className="mx-auto flex min-h-[calc(100dvh-180px)] max-w-3xl flex-col items-center justify-center px-5 py-20 text-center"><div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#d1af6e]/60 bg-[#eee6d7] text-[#580d00]"><Search size={28} strokeWidth={1.5} /></div><p className="mt-8 font-mono text-[10px] uppercase tracking-[.22em] text-[#580d00]/55">No matching record</p><h1 className="mt-4 font-serif text-5xl font-semibold leading-none text-[#580d00] md:text-6xl">We could not find<br />that certificate.</h1><p className="mt-6 max-w-md text-sm leading-6 text-[#580d00]/60">{searchedName ? <>There is no credential filed under <strong className="text-[#580d00]">{searchedName}</strong>.</> : 'No certificate was found for that request.'} Try the recipient name as it appears on the issued document.</p><button onClick={onBack} className="mt-9 flex items-center gap-3 border-b-2 border-[#580d00] pb-2 text-sm font-bold text-[#580d00]" data-testid="button-return-to-lookup"><ArrowLeft size={17} /> Return to lookup</button></main></Shell>;
}

function QrLike({ code, onClick }: { code: string; onClick: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const verificationUrl = `${window.location.origin}${import.meta.env.BASE_URL}verify/${code}`;

  useEffect(() => {
    if (!canvasRef.current) return;
    void QRCode.toCanvas(canvasRef.current, verificationUrl, {
      width: 119,
      margin: 1,
      color: { dark: '#580d00', light: '#fffdf8' },
      errorCorrectionLevel: 'H',
    });
  }, [verificationUrl]);

  return <button onClick={onClick} className="group relative overflow-hidden border border-[#580d00]/20 bg-[#fffdf8] p-[7px] text-left transition-transform hover:scale-[1.03]" aria-label="Open verification record" data-testid="button-open-qr-verification"><canvas ref={canvasRef} className="block h-[119px] w-[119px]" aria-label={`QR code for ${verificationUrl}`} /><span className="absolute inset-x-[7px] bottom-[7px] bg-[#580d00]/90 py-1 text-center font-mono text-[7px] uppercase tracking-widest text-[#f8f4eb] opacity-0 transition-opacity group-hover:opacity-100">Verify</span></button>;
}

function CertificateCard({ credential, onVerify }: { credential: Credential; onVerify: () => void }) {
  const downloadCertificate = () => {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${credential.certificateName} — ${credential.recipient}</title><style>body{margin:0;background:#f8f4eb;color:#580d00;font-family:Georgia,serif}.page{box-sizing:border-box;margin:48px auto;padding:70px;max-width:900px;min-height:620px;border:12px double #d1af6e;background:#fffdf8;text-align:center}.eyebrow{font:12px monospace;letter-spacing:4px}.name{font-size:58px;margin:32px 0 16px}.rule{width:120px;border-top:2px solid #d1af6e;margin:auto}.details{margin:52px auto 0;max-width:570px;border-top:1px solid #d9ccb5;text-align:left;font:15px sans-serif}.row{display:flex;justify-content:space-between;padding:16px 0;border-bottom:1px solid #e7dfd1}.label{font:11px monospace;letter-spacing:1px;color:#81756c}.footer{margin-top:50px;font:11px monospace;letter-spacing:2px}</style></head><body><div class="page"><div class="eyebrow">STEM MODEL UNITED NATIONS · OFFICIAL RECORD</div><div class="name">${credential.certificateName}</div><div class="rule"></div><p>This is to certify that</p><div style="font-size:31px">${credential.recipient}</div><p>participated as a ${credential.role} in the<br>${credential.committee} committee.</p><div class="details"><div class="row"><span class="label">CONFERENCE</span><b>${credential.conference}</b></div><div class="row"><span class="label">DATE</span><b>${credential.date}</b></div><div class="row"><span class="label">VERIFICATION CODE</span><b>${credential.code}</b></div></div><div class="footer">STEM MUN CREDENTIAL DESK · ${credential.issued}</div></div></body></html>`;
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' })); const link = document.createElement('a'); link.href = url; link.download = `${credential.id}-certificate.html`; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
  };
  const copyCode = async () => { await navigator.clipboard?.writeText(credential.code); };
  return <div className="mx-auto max-w-7xl px-5 py-10 lg:px-10 lg:py-16"><div className="mb-12 flex flex-wrap items-center justify-between gap-4"><Link href="/" className="flex items-center gap-2 text-sm font-semibold text-[#580d00] transition-colors hover:text-[#a36c22]" data-testid="link-back-home"><ArrowLeft size={16} /> Back to lookup</Link><div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.18em] text-[#580d00]/50"><span className="h-2 w-2 rounded-full bg-[#238b6c]" /> Record available</div></div>
    <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:items-start"><article className="animate-rise relative overflow-hidden border border-[#d1af6e]/70 bg-[#fffdf8] p-6 shadow-[8px_8px_0_rgba(209,175,110,.25)] sm:p-12 md:p-16"><div className="pointer-events-none absolute left-4 top-4 h-7 w-7 border-l border-t border-[#d1af6e] sm:left-8 sm:top-8 sm:h-12 sm:w-12" /><div className="pointer-events-none absolute bottom-4 right-4 h-7 w-7 border-b border-r border-[#d1af6e] sm:bottom-8 sm:right-8 sm:h-12 sm:w-12" /><div className="text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#d1af6e] text-[#580d00]"><Award size={25} strokeWidth={1.25} /></div><div className="mt-6 font-mono text-[9px] font-bold uppercase tracking-[.28em] text-[#580d00]/55">Credential verified</div><h1 className="mt-4 font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[.9] tracking-[-.03em] text-[#580d00]">{credential.certificateName}</h1><p className="mt-4 text-sm text-[#580d00]/55">{credential.conference}</p><div className="mx-auto mt-8 h-px w-20 bg-[#d1af6e]" /></div><div className="mx-auto mt-9 max-w-xl border-t border-[#580d00]/10">{[['Recipient name', credential.recipient], ['Committee', credential.committee], ['Role', credential.role], ['Holding date', credential.date]].map(([label, detail]) => <div className="flex flex-col gap-2 border-b border-[#580d00]/10 py-4 sm:flex-row sm:items-center sm:justify-between" key={label}><span className="font-mono text-[9px] uppercase tracking-[.15em] text-[#580d00]/50">{label}</span><strong className="text-sm text-[#580d00] sm:text-right">{detail}</strong></div>)}</div><div className="mt-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><span className="font-mono text-[9px] uppercase tracking-[.15em] text-[#580d00]/50">Verification code</span><button onClick={copyCode} className="mt-2 flex items-center gap-2 font-mono text-sm font-bold text-[#580d00] hover:text-[#a36c22]" data-testid="button-copy-verification-code"><Hash size={14} className="text-[#d1af6e]" /> {credential.code} <Copy size={13} className="ml-1 opacity-50" /></button></div><span className="font-mono text-[9px] text-[#580d00]/40">Issued {credential.issued}</span></div></article>
      <aside className="animate-rise animate-rise-delay-1 space-y-4"><div className="border border-[#580d00]/15 bg-[#eee6d7] p-6"><div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[.18em] text-[#580d00]"><QrCode size={16} className="text-[#d1af6e]" /> Scan to verify</div><p className="mt-3 text-sm leading-6 text-[#580d00]/60">Anyone with this record can confirm its authenticity using the verification link.</p><div className="mt-6 flex justify-center"><QrLike code={credential.code} onClick={onVerify} /></div><button onClick={onVerify} className="mt-5 flex w-full items-center justify-center gap-2 border border-[#580d00]/20 py-3 text-xs font-bold text-[#580d00] transition-colors hover:border-[#580d00] hover:bg-[#f8f4eb]" data-testid="button-verify-record"><ShieldCheck size={15} /> Open verification view</button></div><button onClick={downloadCertificate} className="flex w-full items-center justify-center gap-3 bg-[#580d00] px-5 py-4 text-sm font-bold text-[#f8f4eb] transition-colors hover:bg-[#761d0e]" data-testid="button-download-certificate"><Download size={17} /> Download certificate</button><div className="flex items-start gap-3 border-t border-[#580d00]/10 pt-5 text-xs leading-5 text-[#580d00]/55"><FileCheck2 size={16} className="mt-0.5 shrink-0 text-[#d1af6e]" /> This record is publicly verifiable and can be shared with schools or program offices.</div></aside>
    </div></div>;
}

function CertificatePage({ id }: { id?: string }) {
  const [, setLocation] = useLocation(); const credential = getCredentialById(id);
  if (!credential) return <NotFoundRecord searchedName={id?.replace(/-/g, ' ')} onBack={() => setLocation('/')} />;
  return <Shell><CertificateCard credential={credential} onVerify={() => setLocation(`/verify/${credential.code}`)} /></Shell>;
}

function VerificationPage({ code }: { code?: string }) {
  const [, setLocation] = useLocation(); const credential = getCredentialByCode(code);
  return <Shell><main className="mx-auto max-w-4xl px-5 py-12 lg:px-10 lg:py-20"><Link href={credential ? `/certificate/${credential.id}` : '/'} className="mb-12 flex items-center gap-2 text-sm font-semibold text-[#580d00] hover:text-[#a36c22]" data-testid="link-back-from-verification"><ArrowLeft size={16} /> {credential ? 'Back to certificate' : 'Back to lookup'}</Link>
    {credential ? <div className="animate-rise border border-[#d1af6e]/70 bg-[#fffdf8] p-6 shadow-[8px_8px_0_rgba(209,175,110,.25)] sm:p-12"><div className="flex flex-col items-center text-center"><div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e1f1e9] text-[#238b6c]"><Check size={38} strokeWidth={2.5} /></div><div className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#238b6c]/25 bg-[#e1f1e9]/60 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[.15em] text-[#167458]"><ShieldCheck size={14} /> Credential verified</div><h1 className="mt-7 font-serif text-5xl font-semibold leading-none text-[#580d00] sm:text-6xl">{credential.certificateName}</h1><p className="mt-4 text-sm text-[#580d00]/55">STEM Model United Nations Conferences</p></div><div className="mx-auto mt-10 max-w-2xl border-t border-[#580d00]/10">{[['Recipient name', credential.recipient], ['Registered email', credential.email], ['Name on certificate', credential.recipient], ['Conference', credential.conference], ['Holding date', credential.date]].map(([label, detail]) => <div className="flex flex-col gap-2 border-b border-[#580d00]/10 py-5 sm:flex-row sm:items-center sm:justify-between" key={label}><span className="font-mono text-[10px] uppercase tracking-[.13em] text-[#580d00]/50">{label}</span><strong className="text-sm text-[#580d00] sm:text-right">{detail}</strong></div>)}</div><div className="mx-auto mt-8 flex max-w-2xl flex-col justify-between gap-3 text-xs sm:flex-row"><span className="font-mono text-[#580d00]/50">Verification code: <strong className="text-[#580d00]" data-testid="text-verification-code">{credential.code}</strong></span><span className="text-[#580d00]/45">Public record · STEM MUN</span></div></div> : <div className="animate-rise py-20 text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eee6d7] text-[#580d00]"><Search size={27} /></div><h1 className="mt-7 font-serif text-5xl font-semibold text-[#580d00]">Record not found.</h1><p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-[#580d00]/60">This verification code is not listed in the public credential desk.</p><button onClick={() => setLocation('/')} className="mt-8 border-b-2 border-[#580d00] pb-2 text-sm font-bold text-[#580d00]" data-testid="button-search-another-record">Search another record</button></div>}
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