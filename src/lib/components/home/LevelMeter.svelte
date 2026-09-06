<script lang="ts">
	let {
		bars = 5,
		active = true,
		compact = false
	}: {
		bars?: number;
		active?: boolean;
		compact?: boolean;
	} = $props();

	const items = $derived(Array.from({ length: bars }));
</script>

<span class:compact class="meter" aria-hidden="true">
	{#each items as _, index}
		<span
			class:active
			class="bar"
			style={`--meter-delay: ${index * 0.12}s; --meter-static: ${0.4 + (index % 4) * 0.15}`}
		></span>
	{/each}
</span>

<style>
	.meter {
		display: inline-flex;
		height: 20px;
		align-items: flex-end;
		gap: 3px;
		color: var(--scrybe-color-success);
	}

	.meter.compact {
		height: 18px;
	}

	.bar {
		width: 3px;
		height: 100%;
		transform: scaleY(0.35);
		transform-origin: 50% 100%;
		border-radius: 2px;
		background: var(--scrybe-color-idle);
	}

	.bar.active {
		animation: meter 0.9s ease-in-out var(--meter-delay) infinite alternate;
		background: currentColor;
	}

	@media (prefers-reduced-motion: reduce) {
		.bar.active {
			animation: none;
			transform: scaleY(var(--meter-static));
		}
	}
</style>
