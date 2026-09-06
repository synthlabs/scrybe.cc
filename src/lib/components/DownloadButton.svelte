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

<a class="web-button primary download" href={currentHref}>
	<Download size={16} strokeWidth={1.75} aria-hidden="true" />
	<span>{msgs.download_for()} {currentLabel}</span>
</a>

<style>
  .download { min-width: min(12rem, 100%); }
  .download span { min-width: 0; overflow-wrap: anywhere; }
</style>
