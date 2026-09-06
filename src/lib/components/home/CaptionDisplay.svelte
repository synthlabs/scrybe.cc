<script module lang="ts">
  export type CaptionVariant = 'hero' | 'overlay' | 'twitch';
  export type CaptionAlign = 'left' | 'center' | 'right';
</script>
<script lang="ts">
  let { text, variant, showCaret = true, align = 'center', fontSize, background = 'rgba(0, 0, 0, 0.55)', textColor = '#ffffff' }: {
    text: string; variant: CaptionVariant; showCaret?: boolean; align?: CaptionAlign; fontSize?: number; background?: string; textColor?: string;
  } = $props();
  const size = $derived(fontSize ?? (variant === 'hero' ? 20 : variant === 'twitch' ? 16 : 32));
</script>
<span class="caption" class:hero={variant === 'hero'} class:overlay={variant === 'overlay'} class:twitch={variant === 'twitch'}
  style:--caption-bg={background} style:--caption-color={textColor} style:--caption-size={size / 16 + 'rem'} style:--caption-align={align}>
  <span>{text || '\u00a0'}</span>
  {#if showCaret && variant !== 'twitch'}<span class="caret" aria-hidden="true"></span>{/if}
</span>
<style>
  .caption { display: inline-block; width: fit-content; max-width: 100%; min-height: 1.4em; background: var(--caption-bg); color: var(--caption-color); font-family: var(--scrybe-font-sans); font-size: var(--caption-size); font-weight: 500; line-height: 1.4; text-align: var(--caption-align); overflow-wrap: anywhere; border-radius: 0.75rem; padding: 0.5rem 1rem; }
  .caption.twitch { border-radius: 0.25rem; padding: 0.375rem 0.75rem; }
  .caret { display: inline-block; width: 2px; height: 1em; margin-left: 0.25rem; animation: caret-blink 1.25s ease-out infinite; background: currentColor; vertical-align: -0.15em; }
  @media (prefers-reduced-motion: reduce) { .caret { display: none; } }
</style>
