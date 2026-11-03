import { company } from "../data/companyContent";
export default function Footer() {
  return <footer className="border-t border-[#292d2f] py-12">
    <div className="container grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
      <div><strong className="text-xl">НАДЁЖНЫЙ ПАРТНЁР.</strong><p className="mt-4 max-w-xs text-sm leading-6 text-[#777f82]">Производство, поставка и монтаж противопожарных дверей и конструкций.</p></div>
      <div className="space-y-3 text-sm text-[#a4abad]"><a className="block" href="#catalog">Каталог продукции</a><a className="block" href="#production">Производство</a><a className="block" href="#gallery">Наши работы</a><a className="block" href="#reviews">Отзывы</a><a className="block" href="#contacts">Контакты</a></div>
      <div className="space-y-3 text-sm text-[#a4abad]"><p>{company.address}</p><p>{company.hours}</p><a className="block" href={"mailto:" + company.email}>{company.email}</a>{company.phones.map(p=><a className="block" href={p.href} key={p.href}>{p.label}</a>)}</div>
    </div>
    <div className="container mt-10 flex flex-col justify-between gap-4 border-t border-[#292d2f] pt-6 text-xs text-[#656d70] md:flex-row"><span>© {new Date().getFullYear()} «Надёжный партнёр»</span><span>Информация и реквизиты требуют финальной сверки перед публикацией.</span></div>
  </footer>;
}