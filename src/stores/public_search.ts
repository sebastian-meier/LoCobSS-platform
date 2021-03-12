import { writable, Writable, Readable, derived } from 'svelte/store'

export const search: Writable<string> = writable('');
export const taxonomies: Writable<number[]> = writable([]);
export const dates: Writable<Date[]> = writable([]);
export const hasReply: Writable<boolean> = writable(null);
export const page: Writable<number> = writable(0);

let cacheTimeoutId: number | null = null;
export const cache: Readable<publicQuestionResult> = derived(
  [
    search,
    taxonomies,
    dates,
    hasReply,
    page
  ],
  ([
    $search,
    $taxonomies,
    $dates,
    $hasReply,
    $page
  ], 
  set) => {
    const first = (cacheTimeoutId === null) ? true : false;
    if (cacheTimeoutId) {
      clearTimeout(cacheTimeoutId);
    }

    cacheTimeoutId = setTimeout(async () => {
      const queries = [];

      if ($search.length > 0) {
        queries.push('query=' + encodeURIComponent($search));
      }

      if ($taxonomies.length > 0) {
        queries.push('taxonomies=' + $taxonomies.map((t) => encodeURIComponent(t)).join(','));
      }

      if ($dates.length === 2) {
        queries.push('dates=' + $dates.map((d) => encodeURIComponent(d.toDateString())).join(','));
      }

      if ($hasReply === false || $hasReply === true) {
        queries.push('answer=' + $hasReply.toString());
      }

      const query = (queries.length > 0) ? '?' + queries.join('&') : '';

      const response = await fetch(
        // `https://europe-west3-bmbf-research-agenda.cloudfunctions.net/api/public/questions${($page > 0) ? '/' + $page : ''}${query}`,
        `http://localhost:5001/bmbf-research-agenda/europe-west3/api/public/questions${($page > 0) ? '/' + $page : ''}${query}`
      ).then((response) => response.json());

      set(response);
    }, (first) ? 0 : 1000);
  }
)
