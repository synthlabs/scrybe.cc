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

	<div class="ls-menu" class:open role="menu">
		{#each locales as locale (locale)}
			<a
				class="ls-item"
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
	}
	.ls-button {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 13px;
		color: var(--c-fg-muted);
		background: transparent;
		border: 1px solid var(--c-border);
		border-radius: var(--radius-full);
		padding: 5px 10px 5px 9px;
		cursor: pointer;
		font-family: inherit;
		transition: color 150ms ease, border-color 150ms ease;
	}
	.ls-button:hover {
		color: var(--c-fg);
		border-color: hsl(215 28% 30%);
	}
	.ls-menu {
		position: absolute;
		top: calc(100% + 8px);
		right: 0;
		min-width: 160px;
		background: hsl(var(--popover));
		border: 1px solid var(--c-border);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-popover);
		padding: 6px;
		opacity: 0;
		transform: translateY(-4px);
		pointer-events: none;
		transition: opacity 180ms ease-out, transform 180ms ease-out;
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
		border-radius: var(--radius-md);
		font-size: 13px;
		color: var(--c-fg);
		cursor: pointer;
		transition: background-color 150ms ease-out;
	}
	.ls-item:hover {
		background: hsl(var(--accent));
	}
	.ls-item.active {
		color: hsl(17 75% 72%);
	}
	.ls-code {
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--c-fg-muted);
		min-width: 22px;
	}
	.ls-item.active .ls-code {
		color: hsl(17 75% 72%);
	}
	.ls-name {
		font-size: 13px;
	}
</style>
