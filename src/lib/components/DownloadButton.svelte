<script lang="ts">
	import { onMount } from 'svelte';
	import { Apple, ChevronDown, Terminal, HardDrive } from '@lucide/svelte';
	import type { PlatformKey } from '$lib/releases';
	import { m as msgs } from '$lib/paraglide/messages';

	type IconName = 'apple' | 'windows' | 'terminal' | 'harddrive';
	type Meta = { label: () => string; icon: IconName };

	const META: Record<PlatformKey, Meta> = {
		mac: { label: msgs.platform_mac, icon: 'apple' },
		win: { label: msgs.platform_win, icon: 'windows' },
		'linux-deb': { label: msgs.platform_linux_deb, icon: 'terminal' },
		'linux-rpm': { label: msgs.platform_linux_rpm, icon: 'harddrive' }
	};

	const ORDER: PlatformKey[] = ['mac', 'win', 'linux-deb', 'linux-rpm'];

	let {
		assets,
		filenames
	}: {
		assets: Record<PlatformKey, string>;
		filenames: Record<PlatformKey, string>;
	} = $props();

	let selected = $state<PlatformKey>('mac');
	let menuOpen = $state(false);
	let root: HTMLDivElement;

	const currentLabel = $derived(META[selected].label());
	const currentIcon = $derived(META[selected].icon);
	const currentHref = $derived(assets[selected]);

	function detectPlatform(): PlatformKey {
		const ua = navigator.userAgent.toLowerCase();
		const p = (
			(navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ||
			navigator.platform ||
			''
		).toLowerCase();
		if (ua.includes('mac') || p.includes('mac')) return 'mac';
		if (ua.includes('win') || p.includes('win')) return 'win';
		if (ua.includes('linux') || p.includes('linux')) return 'linux-deb';
		return 'mac';
	}

	onMount(() => {
		selected = detectPlatform();
		const onDocClick = (e: MouseEvent) => {
			if (root && !root.contains(e.target as Node)) menuOpen = false;
		};
		document.addEventListener('click', onDocClick);
		return () => document.removeEventListener('click', onDocClick);
	});

	function toggleMenu(e: MouseEvent) {
		e.stopPropagation();
		menuOpen = !menuOpen;
	}

	function pick(key: PlatformKey) {
		selected = key;
		menuOpen = false;
	}
</script>

<div class="dl" bind:this={root}>
	<a class="dl-primary" href={currentHref}>
		{#if currentIcon === 'apple'}
			<Apple class="plat-icon" size={18} />
		{:else if currentIcon === 'windows'}
			<svg
				class="plat-icon"
				viewBox="0 0 24 24"
				width="18"
				height="18"
				fill="currentColor"
				aria-hidden="true"
			>
				<path
					d="M3 5.5l7.5-1v7.5H3V5.5zm0 13l7.5 1v-7.5H3v6.5zm8.5 1.1L21 21V12h-9.5v7.6zm0-16.2V12H21V3l-9.5 1.4z"
				/>
			</svg>
		{:else if currentIcon === 'terminal'}
			<Terminal class="plat-icon" size={18} />
		{:else}
			<HardDrive class="plat-icon" size={18} />
		{/if}
		<span class="labels">
			<span class="label-small">{msgs.download_for()}</span>
			<span class="label-main">{currentLabel}</span>
		</span>
	</a>
	<button
		class="dl-split"
		type="button"
		aria-label="More platforms"
		aria-haspopup="menu"
		aria-expanded={menuOpen}
		onclick={toggleMenu}
	>
		<ChevronDown size={16} />
	</button>

	<div class="dl-menu" class:open={menuOpen} role="menu">
		{#each ORDER as key (key)}
			{@const m = META[key]}
			<a
				class="dl-menu-item"
				href={assets[key]}
				role="menuitem"
				onclick={() => pick(key)}
			>
				{#if m.icon === 'apple'}
					<Apple size={18} />
				{:else if m.icon === 'windows'}
					<svg
						viewBox="0 0 24 24"
						width="18"
						height="18"
						fill="currentColor"
						style="color: hsl(217.9 10.6% 64.9%);"
						aria-hidden="true"
					>
						<path
							d="M3 5.5l7.5-1v7.5H3V5.5zm0 13l7.5 1v-7.5H3v6.5zm8.5 1.1L21 21V12h-9.5v7.6zm0-16.2V12H21V3l-9.5 1.4z"
						/>
					</svg>
				{:else if m.icon === 'terminal'}
					<Terminal size={18} />
				{:else}
					<HardDrive size={18} />
				{/if}
				<span class="mi-text">
					<span class="mi-label">{m.label()}</span>
					<span class="mi-sub">{filenames[key]}</span>
				</span>
			</a>
		{/each}
	</div>
</div>

<style>
	.dl {
		display: inline-flex;
		align-items: stretch;
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-md);
		overflow: visible;
		position: relative;
		max-width: 100%;
	}
	.dl-primary {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		background: var(--c-scrybe-hex);
		color: hsl(221 71% 5.5%);
		padding: 0 20px;
		height: 48px;
		font-size: 14px;
		font-weight: 500;
		border: none;
		border-top-left-radius: var(--radius-lg);
		border-bottom-left-radius: var(--radius-lg);
		cursor: pointer;
		transition: background-color 180ms ease-out;
		font-family: inherit;
		min-width: 0;
	}
	.dl-primary:hover {
		background: hsl(17 78% 60%);
	}
	.dl-primary :global(.plat-icon) {
		width: 18px;
		height: 18px;
	}
	.label-small {
		font-size: 11px;
		color: hsl(221 71% 5.5% / 0.65);
		display: block;
		line-height: 1.2;
		margin-bottom: 2px;
		font-weight: 500;
	}
	.label-main {
		font-size: 14px;
		font-weight: 500;
		display: block;
		line-height: 1.2;
	}
	.labels {
		text-align: left;
		min-width: 0;
	}

	.dl-split {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: var(--c-scrybe-hex);
		color: hsl(221 71% 5.5%);
		width: 40px;
		height: 48px;
		border-top-right-radius: var(--radius-lg);
		border-bottom-right-radius: var(--radius-lg);
		cursor: pointer;
		border: none;
		border-left: 1px solid hsl(221 71% 5.5% / 0.2);
		transition: background-color 180ms ease-out;
	}
	.dl-split:hover {
		background: hsl(17 78% 60%);
	}

	.dl-menu {
		position: absolute;
		top: calc(100% + 8px);
		right: 0;
		width: min(320px, calc(100vw - 36px));
		min-width: min(260px, calc(100vw - 36px));
		background: hsl(var(--popover));
		border: 1px solid var(--c-border);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-popover);
		padding: 6px;
		opacity: 0;
		transform: translateY(-4px);
		pointer-events: none;
		transition:
			opacity 180ms ease-out,
			transform 180ms ease-out;
		z-index: 20;
	}
	.dl-menu.open {
		opacity: 1;
		transform: translateY(0);
		pointer-events: auto;
	}

	.dl-menu-item {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 10px 12px;
		border-radius: var(--radius-md);
		font-size: 14px;
		color: var(--c-fg);
		cursor: pointer;
		transition: background-color 150ms ease-out;
	}
	.dl-menu-item:hover {
		background: hsl(var(--accent));
	}
	.dl-menu-item :global(svg) {
		width: 18px;
		height: 18px;
		color: var(--c-fg-muted);
		flex-shrink: 0;
	}
	.mi-label {
		font-size: 14px;
		line-height: 1.2;
	}
	.mi-sub {
		font-size: 11px;
		color: var(--c-fg-muted);
		line-height: 1.2;
		margin-top: 2px;
		font-family: var(--font-mono);
		display: block;
		overflow-wrap: anywhere;
	}
	.mi-text {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	@media (max-width: 480px) {
		.dl {
			display: flex;
			width: 100%;
		}
		.dl-primary {
			flex: 1 1 auto;
			justify-content: center;
			padding: 0 16px;
		}
		.dl-split {
			flex: 0 0 48px;
			width: 48px;
		}
		.label-main {
			font-size: 15px;
		}
	}
</style>
