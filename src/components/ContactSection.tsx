import { useState } from "react";
import { company } from "../data/companyContent";

export default function ContactSection() {
  const [sent, setSent] = useState(false);
  return <section id="contacts" className="section bg-[#0a0c0d]">
    <div className="container grid gap-14 md:grid-cols-2">
      <div><p className="eyebrow mb-8">07 — Контакты</p><h2 className="section-title">Обсудим <span className="text-[#858d90]">вашу</span> задачу.</h2>
        <p className="mt-8 max-w-md text-sm leading-7 text-[#92989a]">Расскажите об объекте и требованиях — обсудим подходящее решение.</p>
        <div className="mt-12 space-y-5 border-t border-[#303638] pt-7 text-sm text-[#c0c5c6]">
          <p>{company.address}</p><p>{company.hours}</p><a className="block" href={"mailto:" + company.email}>{company.email}</a>
          {company.phones.map(p=><a className="block text-lg" href={p.href} key={p.href}>{p.label}</a>)}
          <a className="line-link mt-3" href={company.website} target="_blank" rel="noreferrer">Оригинальный сайт ↗</a>
        </div>
      </div>
      <form className="panel space-y-7 p-8" onSubmit={e => { e.preventDefault(); setSent(true); }}>
        <label className="block"><span className="eyebrow">Ваше имя</span><input required name="name" className="mt-3 w-full border-b border-[#454c4e] bg-transparent py-3 outline-none" placeholder="Имя" /></label>
        <label className="block"><span className="eyebrow">Телефон или почта</span><input required name="contact" className="mt-3 w-full border-b border-[#454c4e] bg-transparent py-3 outline-none" placeholder="+7 ___ ___-__-__" /></label>
        <label className="block"><span className="eyebrow">Задача</span><textarea name="message" className="mt-3 w-full border-b border-[#454c4e] bg-transparent py-3 outline-none" rows={3} placeholder="Кратко опишите объект" /></label>
        <label className="block text-xs text-[#92989a]"><input type="checkbox" required className="mr-2 accent-white" />Согласен на обработку персональных данных</label>
        <button className="line-link" type="submit">Подготовить запрос ↗</button>
        {sent && <p className="text-sm text-[#c0c5c6]">Форма пока демонстрационная: серверная отправка заявок не подключена.</p>}
        <p className="text-xs leading-5 text-[#656d70]">Перед публикацией добавьте действующую политику обработки персональных данных и настройте безопасную отправку формы.</p>
      </form>
    </div>
  </section>;
}