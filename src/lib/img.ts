/**
 * Картинки iv-partner.ru через прокси images.weserv.nl (обход блокировки хотлинка, webp, ресайз).
 * Если у адреса нет http(s) (локальный файл из /public), он возвращается как есть.
 */
export function proxied(url: string, width = 900): string {
  if (!/^https?:\/\//i.test(url)) return url;
  const bare = url.replace(/^https?:\/\//i, "");
  return (
    "https://images.weserv.nl/?url=" +
    encodeURIComponent(bare) +
    "&w=" + width +
    "&we&output=webp&q=82"
  );
}
