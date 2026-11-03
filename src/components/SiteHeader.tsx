export default function SiteHeader() {
  return <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#050708]/80 backdrop-blur-xl">
    <div className="container flex h-[76px] items-center justify-between gap-6">
      <a href="#top" className="shrink-0 text-sm font-semibold tracking-[.12em]">НАДЁЖНЫЙ<br/><span className="text-[#858d90]">ПАРТНЁР.</span></a>
      <nav className="hidden items-center gap-6 text-[10px] uppercase tracking-[.16em] text-[#aeb5b7] lg:flex">
        <a href="#catalog">Каталог</a><a href="#about">Компания</a><a href="#production">Производство</a><a href="#gallery">Работы</a><a href="#reviews">Отзывы</a>
      </nav>
      <a href="#contacts" className="border border-[#687174] px-4 py-3 text-[10px] uppercase tracking-[.15em] transition hover:bg-white hover:text-black">Связаться ↗</a>
    </div>
  </header>;
}
