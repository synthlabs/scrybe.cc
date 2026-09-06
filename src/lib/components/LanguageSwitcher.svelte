<script lang="ts">
  import { tick } from 'svelte';
  import { page } from '$app/state';
  import { Languages, Check, ChevronDown } from '@lucide/svelte';
  import { locales, getLocale, localizeHref } from '$lib/paraglide/runtime';
  import { m as msgs } from '$lib/paraglide/messages';
  let open = $state(false);
  let root: HTMLDivElement;
  let trigger: HTMLButtonElement;
  let menu = $state<HTMLDivElement>();
  const current = $derived(getLocale());
  const labels: Record<string, () => string> = { en: msgs.locale_label_en, ru: msgs.locale_label_ru };
  async function show(last = false) {
    open = true;
    await tick();
    const links = menu?.querySelectorAll<HTMLAnchorElement>('[role="menuitem"]') ?? [];
    links[last ? links.length - 1 : Math.max(0, locales.indexOf(current))]?.focus();
  }
  function close(returnFocus = false) {
    open = false;
    if (returnFocus) trigger.focus();
  }
  function triggerKey(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      void show(event.key === 'ArrowUp');
    }
  }
  async function menuKey(event: KeyboardEvent) {
    const links = Array.from(menu?.querySelectorAll<HTMLAnchorElement>('[role="menuitem"]') ?? []);
    const index = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (event.key === 'Escape') { event.preventDefault(); close(true); return; }
    if (event.key === 'Tab') {
      event.preventDefault();
      close(true);
      await tick();
      if (!event.shiftKey) {
        const focusable = Array.from(document.querySelectorAll<HTMLElement>('a[href], button, input, [tabindex="0"]'))
          .filter(element => element.getClientRects().length && !element.hasAttribute('disabled'));
        focusable[focusable.indexOf(trigger) + 1]?.focus();
      }
      return;
    }
    let next = index;
    if (event.key === 'ArrowDown') next = (index + 1) % links.length;
    else if (event.key === 'ArrowUp') next = (index - 1 + links.length) % links.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = links.length - 1;
    else return;
    event.preventDefault();
    links[next]?.focus();
  }
  $effect(() => {
    const click = (event: MouseEvent) => { if (root && !root.contains(event.target as Node)) close(); };
    const focus = (event: FocusEvent) => { if (root && !root.contains(event.target as Node)) close(); };
    document.addEventListener('click', click);
    document.addEventListener('focusin', focus);
    return () => { document.removeEventListener('click', click); document.removeEventListener('focusin', focus); };
  });
</script>

<div class="language-picker" bind:this={root}>
  <button type="button" class="web-button language-trigger" bind:this={trigger} aria-label={msgs.language_choose()} aria-haspopup="menu" aria-expanded={open} aria-controls="language-menu" onclick={() => open ? close() : show()} onkeydown={triggerKey}>
    <Languages size={16} strokeWidth={1.75} aria-hidden="true" />
    <span>{current.toUpperCase()}</span>
    <ChevronDown size={14} strokeWidth={1.75} aria-hidden="true" />
  </button>
  {#if open}
    <div class="language-menu" id="language-menu" role="menu" tabindex="-1" aria-label={msgs.language_choose()} bind:this={menu} onkeydown={menuKey}>
      {#each locales as locale (locale)}
        <a class="language-item" class:active={locale === current} href={localizeHref(page.url.pathname, { locale })} role="menuitem" tabindex="-1" aria-current={locale === current ? 'true' : undefined} data-sveltekit-reload>
          <span class="language-code">{locale.toUpperCase()}</span><span>{labels[locale]?.() ?? locale}</span>
          {#if locale === current}<Check size={16} strokeWidth={1.75} aria-hidden="true" />{/if}
        </a>
      {/each}
    </div>
  {/if}
</div>
<style>
  .language-picker { position: relative; display: inline-flex; }
  .language-trigger { gap: 0.5rem; padding-inline: 0.75rem; }
  .language-menu { position: absolute; z-index: 60; top: calc(100% + 0.5rem); right: 0; min-width: 12rem; max-width: calc(100vw - 2rem); padding: 0.5rem; border: 1px solid var(--scrybe-color-border); border-radius: var(--scrybe-radius-panel); background: var(--scrybe-color-raised); box-shadow: 0 0.5rem 1.5rem rgb(0 0 0 / 0.25); }
  .language-item { display: flex; align-items: center; gap: 0.75rem; min-height: 2.75rem; padding: 0.5rem; border-radius: var(--scrybe-radius-control); font-size: 0.875rem; color: var(--scrybe-color-text); }
  .language-item:hover { background: var(--scrybe-color-surface); text-decoration: none; }
  .language-item.active { background: var(--scrybe-fill-selected); }
  .language-item :global(svg) { margin-left: auto; color: var(--scrybe-color-brand); }
  .language-code { color: var(--scrybe-color-text-secondary); font-size: 0.75rem; }
</style>
