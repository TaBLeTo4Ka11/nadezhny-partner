import { useState } from "react";
import { ADDRESS, EMAIL, PHONES, WORKING_HOURS } from "../data/content";
import { catalog, verifiedCategoryProducts } from "../data/companyContent";

const slugs: Record<string,string> = {
"Двери с зеркалом":"dveri-s-zerkalom","Двери с терморазрывом":"dveri-s-termorazryvom","Двери МДФ-МДФ":"dveri-mdf-mdf","Коттеджные двери со стеклопакетом":"kottedzhnye-dveri-so-steklopaketom","Двери металл-металл":"dveri-metall-metall","Двери Металл-МДФ":"dveri-metall-mdf","Противопожарные двери":"protivopozharnye-dveri","Противопожарные ворота":"protivopozharnye-vorota","Противопожарные шторы":"protivopozharnye-shtory","Противопожарные люки":"protivopozharnye-ljuki","Светопрозрачные перегородки противопожарные":"svetoprozrachnye-peregorodki","Банковские лотки":"bankovskie-lotki","Двери 3 класса защиты":"dveri-3-klassa-zashchity","Двери защитные":"dveri-zashchitnye","Дверные блоки для строителей":"dvernye-bloki-dlya-stroitelej","Полнотелые деревянные двери":"polnotelye-derevyannye-dveri","Антипаника":"antipanika","Фурнитура для противопожарных дверей":"furnitura-dlya-protivopozharnyh-dverej","Выбрать цвет":"cveta-i-pokraska"
};

function findCategory(slug:string) {
 return catalog.flatMap(group=>group.items.map(name=>({name,group:group.group}))).find(item=>slugs[item.name]===slug);
}


const RAL_COLORS = [
["RAL 1000","Зелёно-бежевый","#BEBD7F"],["RAL 1001","Бежевый","#C2B078"],["RAL 1002","Песочно-жёлтый","#C6A664"],["RAL 1003","Сигнальный жёлтый","#E5BE01"],["RAL 1013","Жемчужно-белый","#EAE6CA"],["RAL 1015","Светлая слоновая кость","#E6D690"],["RAL 2000","Жёлто-оранжевый","#ED760E"],["RAL 2004","Оранжевый","#F44611"],["RAL 3000","Огненно-красный","#AF2B1E"],["RAL 3003","Рубиново-красный","#9B111E"],["RAL 3020","Транспортный красный","#CC0605"],["RAL 4001","Красно-сиреневый","#6D3F5B"],["RAL 5002","Ультрамариново-синий","#20214F"],["RAL 5015","Небесно-синий","#2271B3"],["RAL 6005","Зелёный мох","#2F4538"],["RAL 6018","Жёлто-зелёный","#57A639"],["RAL 7001","Серебристо-серый","#8A9597"],["RAL 7016","Антрацитово-серый","#293133"],["RAL 7024","Графитовый серый","#474A51"],["RAL 7035","Светло-серый","#D7D7D7"],["RAL 8017","Шоколадно-коричневый","#45322E"],["RAL 9001","Кремово-белый","#FDF4E3"],["RAL 9005","Чёрный янтарь","#0A0A0A"],["RAL 9010","Белый","#FFFFFF"],["RAL 9016","Транспортный белый","#F6F6F6"]
] as const;

export default function CategoryPage({slug}:{slug:string}) {
 const item=findCategory(slug);
 const [ralQuery,setRalQuery]=useState("");
 const [selectedRal,setSelectedRal]=useState<(typeof RAL_COLORS)[number]>(RAL_COLORS[0]);
 if(!item) return <main className="min-h-screen bg-white p-10"><h1 className="text-4xl font-extrabold">Раздел не найден</h1><a href="/#catalog" className="btn mt-8">Вернуться в каталог</a></main>;

 if(item.name==="Выбрать цвет") return <>
 <header className="border-b border-line bg-white px-6 py-5"><div className="mx-auto flex max-w-[1400px] justify-between"><a href="/" className="font-extrabold uppercase">Надёжный партнёр</a><a href="/#catalog">← Весь каталог</a></div></header>
 <main className="min-h-[70vh] bg-white px-6 py-16 lg:px-10"><div className="mx-auto max-w-[1200px]">
 <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-brand">Цвета и покраска</p><h1 className="text-[clamp(2.5rem,7vw,6rem)] font-extrabold leading-none">RAL Classic</h1>
 <p className="mt-7 max-w-3xl text-lg leading-8 text-muted">На исходном сайте опубликована палитра RAL Classic. Ниже — выборка оттенков, для которых удалось подтвердить код, название и HEX-значение. Экранные цвета ориентировочные: итог зависит от материала, фактуры и освещения. Перед заказом согласуйте оттенок с менеджером.</p>
 <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_300px]"><div>
 <label htmlFor="ral-search" className="mb-2 block text-sm font-semibold">Поиск по коду, названию или HEX</label><input id="ral-search" value={ralQuery} onChange={event=>setRalQuery(event.target.value)} placeholder="Например, 7016 или графитовый" className="w-full border border-line px-4 py-3 outline-none focus:border-brand"/>
 <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">{RAL_COLORS.filter(color=>(color[0]+" "+color[1]+" "+color[2]).toLowerCase().includes(ralQuery.toLowerCase())).map(color=><button type="button" key={color[0]} onClick={()=>setSelectedRal(color)} className={"overflow-hidden border text-left "+(selectedRal[0]===color[0]?"border-brand":"border-line")}><span className="block h-20 border-b border-black/10" style={{backgroundColor:color[2]}}/><span className="block p-3"><b className="block text-sm">{color[0]}</b><span className="mt-1 block text-xs text-muted">{color[1]}</span><span className="mt-1 block font-mono text-xs">{color[2]}</span></span></button>)}</div>
 </div><aside className="h-fit border border-line p-5 lg:sticky lg:top-8"><p className="text-xs font-semibold uppercase tracking-wider text-muted">Выбранный оттенок</p><div className="mt-4 h-40 border border-line" style={{backgroundColor:selectedRal[2]}}/><h2 className="mt-4 text-2xl font-extrabold">{selectedRal[0]}</h2><p className="mt-1 text-muted">{selectedRal[1]}</p><p className="mt-4 font-mono">{selectedRal[2]}</p><button type="button" onClick={()=>navigator.clipboard?.writeText(selectedRal[0]+" "+selectedRal[2])} className="btn mt-5 w-full">Скопировать код и HEX</button><p className="mt-3 text-xs leading-5 text-muted">Это выборка, а не полный перечень RAL Classic. Точную доступность цвета уточните у компании.</p></aside></div>
 <section className="mt-16 bg-soft p-8"><h2 className="text-2xl font-extrabold">Нужен конкретный цвет?</h2><p className="mt-3 text-sm text-muted">Отправьте менеджеру код RAL и укажите тип конструкции. Возможность окраски подтвердят при расчёте заказа.</p><a href="/#kp" className="btn mt-6 inline-block">Запросить КП</a></section>
 </div></main><footer className="bg-graphite px-6 py-8 text-xs text-white/60"><div className="mx-auto max-w-[1400px]">© {new Date().getFullYear()} «Надёжный партнёр»</div></footer>
 </>;

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
