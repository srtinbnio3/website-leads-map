interface Sortable {
  websiteStatus: string;
  userRatingCount?: number;
  distance: number;
}

export function sortSearchResults<T extends Sortable>(results: T[]): T[] {
  return [...results].sort((a, b) => {
    // ウェブサイトなしを優先
    const aNoSite = a.websiteStatus === "none" ? 0 : 1;
    const bNoSite = b.websiteStatus === "none" ? 0 : 1;
    if (aNoSite !== bNoSite) return aNoSite - bNoSite;
    // レビュー数が少ない（新規店舗の代理指標）を優先
    const aReviews = a.userRatingCount ?? 0;
    const bReviews = b.userRatingCount ?? 0;
    if (aReviews !== bReviews) return aReviews - bReviews;
    // 同条件なら距離順
    return a.distance - b.distance;
  });
}
