<script module lang="ts">
	export type CaptionVariant = 'hero' | 'overlay' | 'twitch';
	export type CaptionAlign = 'left' | 'center' | 'right';
</script>

<script lang="ts">
	let {
		text,
		variant,
		showCaret = true,
		align = 'center',
		fontSize,
		background = 'rgba(0, 0, 0, 0.76)',
		textColor = '#ffffff'
	}: {
		text: string;
		variant: CaptionVariant;
		showCaret?: boolean;
		align?: CaptionAlign;
		fontSize?: number;
		background?: string;
		textColor?: string;
	} = $props();

	const size = $derived(fontSize ?? (variant === 'hero' ? 20 : variant === 'twitch' ? 14 : 24));
</script>

<span
	class:hero={variant === 'hero'}
	class:overlay={variant === 'overlay'}
	class:twitch={variant === 'twitch'}
	class="caption"
	style={`--caption-bg: ${background}; --caption-color: ${textColor}; --caption-size: ${size}px; --caption-align: ${align}`}
>
	<span>{text || '\u00a0'}</span>
	{#if showCaret && variant !== 'twitch'}
		<span class="caret" aria-hidden="true"></span>
	{/if}
</span>

<style>
	.caption {
		display: inline-block;
		width: fit-content;
		max-width: 100%;
		min-height: 1.4em;
		background: var(--caption-bg);
		color: var(--caption-color);
		font-size: var(--caption-size);
		font-weight: 500;
		line-height: 1.4;
		text-align: var(--caption-align);
	}

	.caption.hero {
		border-radius: 12px;
		padding: 12px 22px;
		box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.4);
	}

	.caption.overlay {
		max-width: 82%;
		border-radius: 12px;
		padding: 10px 18px;
		box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.4);
	}

	.caption.twitch {
		max-width: 80%;
		border-radius: 4px;
		padding: 6px 12px;
	}

	.caret {
		display: inline-block;
		width: 2px;
		height: 1em;
		margin-left: 6px;
		animation: caret-blink 1.25s ease-out infinite;
		background: currentColor;
		vertical-align: -0.15em;
	}

	@media (prefers-reduced-motion: reduce) {
		.caret {
			display: none;
		}
	}
</style>
