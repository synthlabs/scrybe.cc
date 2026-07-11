<script lang="ts">
	import { page } from '$app/state';
	import { Languages } from '@lucide/svelte';
	import { locales, getLocale, localizeHref } from '$lib/paraglide/runtime';
	import { m as msgs } from '$lib/paraglide/messages';

	let open = $state(false);
	let root: HTMLDivElement;

	const current = $derived(getLocale());

	const labels: Record<string, () => string> = {
		en: msgs.locale_label_en,
		ru: msgs.locale_label_ru
	};

	function toggle(e: MouseEvent) {
		e.stopPropagation();
		open = !open;
	}

	$effect(() => {
		const onDocClick = (e: MouseEvent) => {
			if (root && !root.contains(e.target as Node)) open = false;
		};
		document.addEventListener('click', onDocClick);
		return () => document.removeEventListener('click', onDocClick);
	});
</script>

<div class="ls" bind:this={root}>
	<button
		type="button"
		class="ls-button"
		aria-haspopup="menu"
		aria-expanded={open}
		onclick={toggle}
	>
		<Languages size={14} />
		<span>{current.toUpperCase()}</span>
	</button>

	<div
		class="ls-menu rounded-box border border-base-300 bg-base-200 text-base-content shadow-xl shadow-black/40"
		class:open
		role="menu"
	>
		{#each locales as locale (locale)}
			<a
				class="ls-item rounded-field hover:bg-base-300"
				class:active={locale === current}
				href={localizeHref(page.url.pathname, { locale })}
				role="menuitem"
				data-sveltekit-reload
			>
				<span class="ls-code">{locale.toUpperCase()}</span>
				<span class="ls-name">{labels[locale]?.() ?? locale}</span>
			</a>
		{/each}
	</div>
</div>

<style>
	.ls {
		position: relative;
		display: inline-flex;
		overflow: visible;
	}
	.ls-button {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 13px;
		color: color-mix(in oklab, var(--color-base-content) 72%, transparent);
		background: transparent;
		border: 1px solid var(--color-base-300);
		border-radius: var(--radius-field);
		padding: 6px 10px 6px 9px;
		cursor: pointer;
		font-family: inherit;
		transition:
			color 200ms ease-out,
			border-color 200ms ease-out,
			background-color 200ms ease-out;
	}
	.ls-button:hover {
		color: var(--color-base-content);
		border-color: color-mix(in oklab, var(--color-base-content) 30%, var(--color-base-300));
		background: var(--color-base-200);
	}
	.ls-button:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}
	.ls-menu {
		position: absolute;
		top: calc(100% + 8px);
		right: 0;
		min-width: 160px;
		padding: 6px;
		opacity: 0;
		transform: translateY(-4px);
		pointer-events: none;
		transition: opacity 200ms ease-out, transform 200ms ease-out;
		z-index: 20;
	}
	.ls-menu.open {
		opacity: 1;
		transform: translateY(0);
		pointer-events: auto;
	}
	.ls-item {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 8px 10px;
		font-size: 13px;
		cursor: pointer;
		transition: background-color 150ms ease-out;
	}
	.ls-item.active {
		color: var(--color-primary);
	}
	.ls-code {
		font-family: var(--font-mono);
		font-size: 11px;
		color: color-mix(in oklab, var(--color-base-content) 60%, transparent);
		min-width: 22px;
	}
	.ls-item.active .ls-code {
		color: var(--color-primary);
	}
	.ls-name {
		font-size: 13px;
	}
</style>
