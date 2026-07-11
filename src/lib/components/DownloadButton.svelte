<script lang="ts">
	import { onMount } from 'svelte';
	import { Download } from '@lucide/svelte';
	import type { PlatformKey } from '$lib/releases';
	import { m as msgs } from '$lib/paraglide/messages';

	type Meta = { label: () => string };

	const META: Record<PlatformKey, Meta> = {
		mac: { label: msgs.platform_mac },
		win: { label: msgs.platform_win },
		'linux-deb': { label: msgs.platform_linux_deb },
		'linux-rpm': { label: msgs.platform_linux_rpm }
	};

	let { assets }: { assets: Record<PlatformKey, string> } = $props();
	let selected = $state<PlatformKey>('mac');

	const currentLabel = $derived(META[selected].label());
	const currentHref = $derived(assets[selected]);

	function detectPlatform(): PlatformKey {
		const ua = navigator.userAgent.toLowerCase();
		const platform = (
			(navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ||
			navigator.platform ||
			''
		).toLowerCase();

		if (ua.includes('mac') || platform.includes('mac')) return 'mac';
		if (ua.includes('win') || platform.includes('win')) return 'win';
		if (ua.includes('linux') || platform.includes('linux')) return 'linux-deb';
		return 'mac';
	}

	onMount(() => {
		selected = detectPlatform();
	});
</script>

<a class="download" href={currentHref}>
	<Download size={16} strokeWidth={2} />
	<span>{msgs.download_for()} {currentLabel}</span>
</a>

<style>
	.download {
		display: inline-flex;
		height: 44px;
		align-items: center;
		justify-content: center;
		gap: 10px;
		border-radius: var(--radius-field);
		background: var(--color-primary);
		color: var(--color-primary-content);
		padding: 0 20px;
		font-size: 14px;
		font-weight: 600;
		line-height: 1;
		transition: filter 200ms ease-out;
	}

	.download:hover {
		filter: brightness(1.06);
		text-decoration: none;
	}

	.download:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 3px;
	}

	@media (max-width: 639px) {
		.download {
			width: 100%;
		}
	}
</style>
