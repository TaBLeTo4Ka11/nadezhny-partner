import { useEffect, useState } from "react";

const STORAGE_KEY = "np-cookie-choice";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(!window.localStorage.getItem(STORAGE_KEY));
    } catch {
      setVisible(true);
    }
  }, []);

  const acknowledge = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "essential");
    } catch {
      // The notice will reappear on the next visit if storage is unavailable.
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Информация о технологиях сайта"
      className="fixed inset-x-4 bottom-4 z-[80] mx-auto max-w-3xl border border-line bg-white p-5 shadow-2xl sm:inset-x-6 sm:p-6"
      role="dialog"
      aria-live="polite"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <p className="font-bold text-ink">Настройки конфиденциальности</p>
          <p className="mt-1 text-sm leading-6 text-muted">
            Для запоминания этого выбора сайт использует локальное хранилище браузера. Аналитические и рекламные счётчики не подключены. Виджет Яндекс Карт загружается только после нажатия. Подробнее — в{" "}
            <a className="underline underline-offset-4" href="/cookies/">сведениях об использовании cookie</a>.
          </p>
        </div>
        <button type="button" onClick={acknowledge} className="btn shrink-0">
          Понятно
        </button>
      </div>
    </aside>
  );
}
