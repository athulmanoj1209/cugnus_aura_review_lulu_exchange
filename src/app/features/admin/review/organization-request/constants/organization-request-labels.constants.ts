/* ── Icons for organization request values ────────────────────────────────
 * Display text on this page is translated with $localize (i18n ids), so it
 * stays in the component; only the non-translated mappings live here.
 */

/** Type icon on the cards / rows. Unknown types use ORG_REQUEST_TYPE_DEFAULT_ICON. */
export const ORG_REQUEST_TYPE_ICONS: Record<string, string> = {
  Company: 'pi-building',
  Division: 'pi-sitemap',
  'Sub-Division': 'pi-users',
};
export const ORG_REQUEST_TYPE_DEFAULT_ICON = 'pi-tag';

/** Sort indicator on the list-view column headers. */
export const ORG_REQUEST_SORT_ICONS = {
  Unsorted: 'pi-sort-alt',
  Asc: 'pi-sort-amount-up-alt',
  Desc: 'pi-sort-amount-down-alt',
} as const;
