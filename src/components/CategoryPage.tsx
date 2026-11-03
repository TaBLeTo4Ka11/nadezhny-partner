import { ADDRESS, EMAIL, PHONES, WORKING_HOURS } from "../data/content";
import { catalog, verifiedCategoryProducts } from "../data/companyContent";

const slugs: Record<string,string> = {
"Двери с зеркалом":"dveri-s-zerkalom","Двери с терморазрывом":"dveri-s-termorazryvom","Двери МДФ-МДФ":"dveri-mdf-mdf","Коттеджные двери со стеклопакетом":"kottedzhnye-dveri-so-steklopaketom","Двери металл-металл":"dveri-metall-metall","Двери Металл-МДФ":"dveri-metall-mdf","Противопожарные двери":"protivopozharnye-dveri","Противопожарные ворота":"protivopozharnye-vorota","Противопожарные шторы":"protivopozharnye-shtory","Противопожарные люки":"protivopozharnye-ljuki","Светопрозрачные перегородки противопожарные":"svetoprozrachnye-peregorodki","Банковские лотки":"bankovskie-lotki","Двери 3 класса защиты":"dveri-3-klassa-zashchity","Двери защитные":"dveri-zashchitnye","Дверные блоки для строителей":"dvernye-bloki-dlya-stroitelej","Полнотелые деревянные двери":"polnotelye-derevyannye-dveri","Антипаника":"antipanika","Фурнитура для противопожарных дверей":"furnitura-dlya-protivopozharnyh-dverej","Выбрать цвет":"cveta-i-pokraska"
};

function findCategory(slug:string) {
 return catalog.flatMap(group=>group.items.map(name=>({name,group:group.group}))).find(item=>slugs[item.name]===slug);
}

export default function CategoryPage({slug}:{slug:string}) {
 const item=findCategory(slug);
 if(!item) return <main className="min-h-screen bg-white p-10"><h1 className="text-4xl font-extrabold">Раздел не найден</h1><a href="/#catalog" className="btn mt-8">Вернуться в каталог</a></main>;
 const products=verifiedCategoryProducts.filter(product=>product.category===item.name);
 const description="Раздел входит в ассортимент компании «Надёжный партнёр». Исполнение, размеры, материалы и комплектация определяются индивидуально по техническому заданию и проекту заказчика. Точные характеристики и стоимость подтвердит менеджер.";
 return <>
 <header className="border-b border-line bg-white px-6 py-5"><div className="mx-auto flex max-w-[1400px] justify-between"><a href="/" className="font-extrabold uppercase">Надёжный партнёр</a><a href="/#catalog">← Весь каталог</a></div></header>
 <main className="min-h-[70vh] bg-white px-6 py-16 lg:px-10"><div className="mx-auto max-w-[1200px]">
 <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-brand">{item.group}</p><h1 className="text-[clamp(2.5rem,7vw,6rem)] font-extrabold leading-none">{item.name}</h1><p className="mt-8 max-w-3xl text-xl leading-8 text-muted">{description}</p>
 <div className="mt-12 grid gap-5 border-y border-line py-8 sm:grid-cols-3"><div><p className="text-xs text-muted">Подбор</p><b>По техническому заданию</b></div><div><p className="text-xs text-muted">Комплектация</p><b>Согласуется индивидуально</b></div><div><p className="text-xs text-muted">Стоимость и сроки</p><b>По запросу КП</b></div></div>
 {products.length>0&&<section className="mt-14"><h2 className="text-2xl font-extrabold">Подтверждённые позиции</h2><div className="mt-6 divide-y divide-line border-y border-line">{products.map(product=><a key={product.href} href={product.href} target="_blank" rel="noreferrer" className="flex justify-between gap-4 py-5 font-semibold hover:text-brand"><span>{product.title}</span><span>↗</span></a>)}</div></section>}
 <section className="mt-16 bg-soft p-8 md:p-12"><h2 className="text-2xl font-extrabold">Запросите предложение по вашему проекту</h2><p className="mt-3 max-w-xl text-sm leading-6 text-muted">Подготовьте размеры, эскиз или проектную документацию. Параметры и стоимость подтвердит менеджер.</p><p className="mt-3 text-sm">{ADDRESS} · {WORKING_HOURS}</p><a href={"mailto:"+EMAIL} className="mt-2 inline-block underline">{EMAIL}</a><div className="mt-4 flex flex-wrap gap-5">{PHONES.map(phone=><a key={phone.href} href={phone.href} className="font-bold">{phone.label}</a>)}</div><a href="/#kp" className="btn mt-7 inline-block">Запросить КП</a></section>
 <nav className="mt-14 border-t border-line pt-8"><p className="mb-5 text-xs font-semibold uppercase text-muted">Другие разделы каталога</p><div className="flex flex-wrap gap-5">{catalog.flatMap(group=>group.items).filter(name=>name!==item.name).map(name=><a key={name} href={"/catalog/"+slugs[name]+"/"} className="text-sm underline underline-offset-4 hover:text-brand">{name}</a>)}</div></nav>
 </div></main><footer className="bg-graphite px-6 py-8 text-xs text-white/60"><div className="mx-auto max-w-[1400px]">© {new Date().getFullYear()} «Надёжный партнёр»</div></footer>
 </>;
}
