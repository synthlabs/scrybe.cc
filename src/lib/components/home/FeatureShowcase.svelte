<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { AlignCenter, AlignLeft, AlignRight, AudioLines, Captions, Check, Cpu, LockKeyhole, Maximize, Mic, Play, Tv } from '@lucide/svelte';
  import { m as msgs } from '$lib/paraglide/messages';
  import CaptionDisplay, { type CaptionAlign } from './CaptionDisplay.svelte';
  import LevelMeter from './LevelMeter.svelte';

  type FeatureTab = 'local' | 'audio' | 'obs' | 'twitch';
  type CaptionColor = '#000000' | '#101216' | '#ffffff' | '#e98963';
  type TranscriptLine = { timestamp: string; text: string };
  let { captionText, transcriptLines, showCaret }: { captionText: string; transcriptLines: TranscriptLine[]; showCaret: boolean } = $props();
  const tabs = [
    { id: 'local' as const, label: msgs.feat_local_title, icon: Cpu },
    { id: 'audio' as const, label: msgs.feat_audio_title, icon: AudioLines },
    { id: 'obs' as const, label: msgs.feat_style_title, icon: Captions },
    { id: 'twitch' as const, label: msgs.feat_twitch_title, icon: Tv }
  ];
  const devices = [
    { name: msgs.demo_device_microphone, detail: () => 'Elgato Wave:3' },
    { name: msgs.demo_device_desktop_audio, detail: msgs.demo_device_system_output },
    { name: msgs.demo_device_virtual_cable, detail: () => 'VB-Audio Cable A' }
  ];
  const alignments = [
    { value: 'left' as const, label: msgs.overlay_align_left, icon: AlignLeft },
    { value: 'center' as const, label: msgs.overlay_align_center, icon: AlignCenter },
    { value: 'right' as const, label: msgs.overlay_align_right, icon: AlignRight }
  ];
  const colors: CaptionColor[] = ['#000000', '#101216', '#ffffff', '#e98963'];
  let activeTab = $state<FeatureTab>('local');
  let selectedDevice = $state(0);
  let captionAlign = $state<CaptionAlign>('center');
  let captionSize = $state(32);
  let captionOpacity = $state(55);
  let captionColor = $state<CaptionColor>('#000000');
  let vertical = $state(false);
  let tablist: HTMLDivElement;
  let marker = $state({ x: 0, y: 0, width: 0, height: 0 });
  let tooltip = $state<string | null>(null);
  const captionJustify = $derived(captionAlign === 'left' ? 'flex-start' : captionAlign === 'right' ? 'flex-end' : 'center');
  const captionBackground = $derived(toRgba(captionColor, captionOpacity / 100));
  const captionTextColor = $derived(captionColor === '#ffffff' ? '#101114' : '#ffffff');

  function toRgba(hex: CaptionColor, alpha: number): string {
    const value = Number.parseInt(hex.slice(1), 16);
    return 'rgba(' + [(value >> 16) & 255, (value >> 8) & 255, value & 255, alpha].join(',') + ')';
  }
  function colorLabel(color: CaptionColor): string {
    if (color === '#000000') return msgs.overlay_color_black();
    if (color === '#101216') return msgs.overlay_color_dark();
    if (color === '#ffffff') return msgs.overlay_color_white();
    return msgs.overlay_color_orange();
  }
  function measureMarker() {
    const tab = tablist?.querySelector<HTMLButtonElement>('[aria-selected="true"]');
    if (!tab) return;
    marker = vertical
      ? { x: tab.offsetLeft, y: tab.offsetTop + 8, width: 2, height: tab.offsetHeight - 16 }
      : { x: tab.offsetLeft + 8, y: tab.offsetTop + tab.offsetHeight - 2, width: tab.offsetWidth - 16, height: 2 };
  }
  $effect(() => {
    activeTab; vertical;
    void tick().then(measureMarker);
  });
  onMount(() => {
    const media = window.matchMedia('(min-width: 64rem)');
    const update = () => { vertical = media.matches; void tick().then(measureMarker); };
    update();
    media.addEventListener('change', update);
    const observer = new ResizeObserver(measureMarker);
    observer.observe(tablist);
    for (const tab of tablist.querySelectorAll('button')) observer.observe(tab);
    return () => { media.removeEventListener('change', update); observer.disconnect(); };
  });
  function tabKey(event: KeyboardEvent, index: number) {
    let next = index;
    if (event.key === (vertical ? 'ArrowUp' : 'ArrowLeft')) next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === (vertical ? 'ArrowDown' : 'ArrowRight')) next = (index + 1) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    activeTab = tabs[next].id;
    const button = tablist.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next];
    button?.focus({ preventScroll: true });
    button?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }
</script>

{#snippet plannedCallout(title: string, body: string)}
  <div class="planned-callout">
    <span class="planned">{msgs.roadmap_badge_next()}</span>
    <div><h3>{title}</h3><p class="secondary">{body}</p></div>
  </div>
{/snippet}

<span class="section-label">{msgs.features_section_label()}</span>
<div class="showcase-grid">
  <div class="feature-navigation">
    <div class="tab-scroll">
      <div class="feature-tabs" role="tablist" aria-label={msgs.features_section_label()} aria-orientation={vertical ? 'vertical' : 'horizontal'} bind:this={tablist}>
        <span class="selection-marker" aria-hidden="true" style:transform={'translate(' + marker.x + 'px,' + marker.y + 'px)'} style:width={marker.width + 'px'} style:height={marker.height + 'px'}></span>
        {#each tabs as tab, index (tab.id)}
          {@const Icon = tab.icon}
          <button type="button" id={'feature-tab-' + tab.id} role="tab" aria-controls="feature-panel" aria-selected={activeTab === tab.id} tabindex={activeTab === tab.id ? 0 : -1} onclick={() => { activeTab = tab.id; tooltip = null; }} onkeydown={(event) => tabKey(event, index)}>
            <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
            <span>{tab.label()}</span>
            {#if tab.id === 'twitch'}<span class="planned">{msgs.roadmap_badge_next()}</span>{/if}
          </button>
        {/each}
      </div>
    </div>
    <p class="secondary feature-summary">{msgs.features_body()}</p>
  </div>

  <div id="feature-panel" role="tabpanel" aria-labelledby={'feature-tab-' + activeTab} tabindex="0" class="feature-panel panel-frame">
    {#if activeTab === 'local'}
      <p class="secondary panel-description">{msgs.feat_local_body()}</p>
      <div class="signal-path">
        <span class="signal-node"><Mic size={16} strokeWidth={1.75} aria-hidden="true" />{msgs.demo_audio_in()}<LevelMeter bars={7} compact /></span>
        <span class="secondary" aria-hidden="true">→</span><span class="signal-node">whisper.cpp</span>
        <span class="secondary" aria-hidden="true">→</span><span>{msgs.demo_text_out()}</span>
      </div>
      <div class="local-note metadata"><LockKeyhole size={14} strokeWidth={1.75} aria-hidden="true" />{msgs.demo_localhost_only()}</div>
      <div class="transcript">
        {#each transcriptLines as line (line.timestamp)}
          <div class="transcript-line"><span class="timestamp">{line.timestamp}</span><span>{line.text}</span></div>
        {/each}
      </div>
      {@render plannedCallout(msgs.planned_transcripts_title(), msgs.planned_transcripts_body())}
    {:else if activeTab === 'audio'}
      <p class="secondary panel-description">{msgs.feat_audio_body()}</p>
      <div class="device-list">
        {#each devices as device, index (index)}
          <button type="button" class="device" class:selected={selectedDevice === index} aria-pressed={selectedDevice === index} onclick={() => selectedDevice = index}>
            <span class="device-choice">{#if selectedDevice === index}<Check size={16} strokeWidth={1.75} aria-hidden="true" />{/if}</span>
            <span class="device-copy"><span class="device-name">{device.name()}</span><span class="metadata">{device.detail()}</span></span>
            <span class="device-activity"><LevelMeter compact active={selectedDevice === index} /><span class="metadata">{selectedDevice === index ? msgs.demo_listening() : msgs.demo_ready()}</span></span>
          </button>
        {/each}
      </div>
      {@render plannedCallout(msgs.planned_audio_title(), msgs.planned_audio_body())}
    {:else if activeTab === 'obs'}
      <p class="secondary panel-description">{msgs.feat_style_body()}</p>
      <div class="browser-source"><code>http://localhost:3030/app/v1/overlay</code><span class="metadata">{msgs.demo_browser_source()}</span></div>
      <div class="overlay-preview">
        <div class="overlay-output" style:justify-content={captionJustify}>
          <CaptionDisplay text={captionText} variant="overlay" {showCaret} align={captionAlign} fontSize={captionSize} background={captionBackground} textColor={captionTextColor} />
        </div>
      </div>
      <div class="overlay-controls">
        <div class="control-group">
          <span class="control-label">{msgs.overlay_alignment()}</span>
          <div class="control-row">
            {#each alignments as alignment (alignment.value)}
              {@const Icon = alignment.icon}
              {@const id = 'align-' + alignment.value}
              <span class="tooltip-wrap">
                <button type="button" class="web-button icon-control alignment-control" class:selected={captionAlign === alignment.value} aria-label={alignment.label()} aria-describedby={id + '-tip'} aria-pressed={captionAlign === alignment.value} onclick={() => captionAlign = alignment.value} onmouseenter={() => tooltip = id} onmouseleave={() => tooltip = null} onfocus={() => tooltip = id} onblur={() => tooltip = null} onkeydown={(event) => { if (event.key === 'Escape') tooltip = null; }}><Icon size={18} strokeWidth={1.75} aria-hidden="true" /></button>
                <span class="control-tooltip" id={id + '-tip'} role="tooltip" hidden={tooltip !== id}>{alignment.label()}</span>
              </span>
            {/each}
          </div>
        </div>
        <label class="control-group">
          <span class="control-label">{msgs.overlay_font_size()} <span class="measurement">{captionSize}px</span></span>
          <input aria-label={msgs.overlay_font_size()} type="range" min="16" max="42" bind:value={captionSize} />
        </label>
        <label class="control-group">
          <span class="control-label">{msgs.overlay_transparency()} <span class="measurement">{captionOpacity}%</span></span>
          <input aria-label={msgs.overlay_transparency()} type="range" min="0" max="100" bind:value={captionOpacity} />
        </label>
        <div class="control-group color-group">
          <span class="control-label">{msgs.overlay_color()}</span>
          <div class="control-row">
            {#each colors as color, index (color)}
              {@const id = 'color-' + index}
              <span class="tooltip-wrap">
                <button type="button" class="web-button icon-control color-control" class:selected={captionColor === color} aria-label={msgs.overlay_color() + ': ' + colorLabel(color)} aria-describedby={id + '-tip'} aria-pressed={captionColor === color} onclick={() => captionColor = color} onmouseenter={() => tooltip = id} onmouseleave={() => tooltip = null} onfocus={() => tooltip = id} onblur={() => tooltip = null} onkeydown={(event) => { if (event.key === 'Escape') tooltip = null; }}>
                  <span class="swatch" style:background={color}></span>
                  {#if captionColor === color}<Check class="swatch-check" size={14} strokeWidth={2} aria-hidden="true" />{/if}
                </button>
                <span class="control-tooltip" id={id + '-tip'} role="tooltip" hidden={tooltip !== id}>{colorLabel(color)}</span>
              </span>
            {/each}
          </div>
        </div>
      </div>
      {@render plannedCallout(msgs.planned_obs_title(), msgs.planned_obs_body())}
    {:else}
      <div class="twitch-description"><span class="planned">{msgs.roadmap_badge_next()}</span><p class="secondary">{msgs.feat_twitch_body()}</p></div>
      <div class="signal-path"><span class="signal-node">Scrybe</span><span class="secondary" aria-hidden="true">→</span><span class="signal-node">{msgs.feat_twitch_obs_plugin()}</span><span class="secondary" aria-hidden="true">→</span><span>{msgs.feat_twitch_captions()}</span></div>
      <div class="twitch-player">
        <span class="metadata">{msgs.stream_label()}</span>
        <div class="twitch-caption"><CaptionDisplay text={captionText} variant="twitch" showCaret={false} background="rgba(0, 0, 0, 0.8)" /></div>
        <div class="player-chrome" aria-hidden="true"><Play size={16} strokeWidth={1.75} /><span class="activity-label"><span class="status-dot"></span>{msgs.stream_live()}</span><span class="twitch-cc">CC</span><Maximize size={16} strokeWidth={1.75} /></div>
      </div>
      <p class="secondary twitch-footnote">{msgs.feat_twitch_footnote()}</p>
    {/if}
  </div>
</div>

<style>
  .showcase-grid { display: grid; grid-template-columns: minmax(0, 20rem) minmax(0, 1fr); gap: 2rem; margin-top: 1.5rem; align-items: start; }
  .feature-navigation { min-width: 0; }
  .tab-scroll { padding: 0.25rem; margin: -0.25rem; }
  .feature-tabs { position: relative; display: flex; flex-direction: column; gap: 0.25rem; }
  .feature-tabs button { position: relative; display: flex; align-items: center; gap: 0.75rem; min-height: 3.5rem; width: 100%; padding: 0.75rem 1rem; border: 0; border-radius: var(--scrybe-radius-control); background: transparent; color: var(--scrybe-color-text-secondary); font-size: 0.875rem; font-weight: 500; text-align: left; line-height: 1.5; }
  .feature-tabs button:hover { background: var(--scrybe-color-surface); }
  .feature-tabs button[aria-selected="true"] { color: var(--scrybe-color-text); }
  .feature-tabs button[aria-selected="true"] :global(svg) { color: var(--scrybe-color-brand); }
  .feature-tabs .planned { margin-left: auto; }
  .selection-marker { position: absolute; top: 0; left: 0; z-index: 1; pointer-events: none; background: var(--scrybe-color-brand); transition: transform var(--scrybe-duration-fast) ease, width var(--scrybe-duration-fast) ease, height var(--scrybe-duration-fast) ease; }
  .feature-summary { margin-top: 1.5rem; padding-inline: 1rem; }
  .feature-panel { min-width: 0; min-height: 26rem; padding: 1.5rem; }
  .panel-description { margin-bottom: 1.5rem; }
  .signal-path { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; font-size: 0.875rem; }
  .signal-node { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; border: 1px solid var(--scrybe-color-border); border-radius: var(--scrybe-radius-control); }
  .local-note { display: flex; gap: 0.5rem; align-items: center; margin-top: 0.75rem; }
  .transcript { margin-top: 1rem; padding: 1rem; border: 1px solid var(--scrybe-color-border); border-radius: var(--scrybe-radius-panel); background: var(--scrybe-color-canvas); }
  .transcript-line { display: grid; grid-template-columns: 5.5rem minmax(0, 1fr); gap: 1rem; padding-block: 0.5rem; font-size: 0.9375rem; line-height: 1.6; }
  .transcript-line > span { overflow-wrap: anywhere; }
  .timestamp { font-family: var(--scrybe-font-mono); color: var(--scrybe-color-text-secondary); font-size: 0.75rem; padding-top: 0.125rem; }
  .planned-callout { display: flex; align-items: start; gap: 0.75rem; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--scrybe-color-border); }
  .planned-callout h3 { font-size: 0.875rem; line-height: 1.5; }
  .planned-callout p { margin-top: 0.5rem; }
  .device-list { display: flex; flex-direction: column; gap: 0.75rem; }
  .device { display: flex; align-items: center; gap: 0.75rem; width: 100%; min-width: 0; padding: 0.75rem; background: var(--scrybe-color-canvas); color: var(--scrybe-color-text); border: 1px solid var(--scrybe-color-border); border-radius: var(--scrybe-radius-control); text-align: left; }
  .device:hover { background: var(--scrybe-color-raised); }
  .device.selected { background: var(--scrybe-fill-selected); }
  .device-choice { display: grid; place-items: center; width: 1.25rem; height: 1.25rem; flex-shrink: 0; border: 1px solid var(--scrybe-color-border-control); border-radius: 50%; color: var(--scrybe-color-brand); }
  .device.selected .device-choice { border-color: var(--scrybe-color-brand); }
  .device-copy { display: flex; flex-direction: column; min-width: 0; flex: 1; overflow-wrap: anywhere; }
  .device-name { font-size: 0.875rem; font-weight: 500; }
  .device-activity { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; justify-content: end; }
  .browser-source { display: flex; align-items: center; flex-wrap: wrap; gap: 0.5rem 1rem; margin-bottom: 1rem; }
  .browser-source code { font-family: var(--scrybe-font-mono); font-size: 0.75rem; color: var(--scrybe-color-brand); overflow-wrap: anywhere; }
  .overlay-preview { display: flex; min-height: 14rem; border: 1px solid var(--scrybe-color-border); border-radius: var(--scrybe-radius-panel); background-color: #55585e; background-image: conic-gradient(#55585e 0 25%, #4b4e54 0 50%, #55585e 0 75%, #4b4e54 0); background-size: 2rem 2rem; }
  .overlay-output { display: flex; align-items: end; width: 100%; min-width: 0; padding: 1rem; }
  .overlay-output :global(.caption) { max-width: 100%; }
  .overlay-controls { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-top: 1.5rem; align-items: end; }
  .control-group { min-width: 0; }
  .control-label { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 0.25rem 0.5rem; color: var(--scrybe-color-text-secondary); font-size: 0.75rem; margin-bottom: 0.5rem; }
  .measurement { font-family: var(--scrybe-font-mono); }
  .control-row { display: flex; flex-wrap: wrap; gap: 0.5rem; }
  .alignment-control, .color-control { border-color: var(--scrybe-color-border-control); }
  .alignment-control.selected, .color-control.selected { background: var(--scrybe-fill-selected); color: var(--scrybe-color-brand); border-color: var(--scrybe-color-brand); }
  input[type="range"] { appearance: none; display: block; width: 100%; min-width: 0; height: 2.75rem; margin: 0; background: transparent; border-radius: var(--scrybe-radius-control); cursor: pointer; }
  input[type="range"]::-webkit-slider-runnable-track { height: 0.25rem; background: var(--scrybe-color-border-control); border-radius: 0.125rem; }
  input[type="range"]::-webkit-slider-thumb { appearance: none; width: 1.25rem; height: 1.25rem; margin-top: -0.5rem; border: 2px solid var(--scrybe-color-canvas); border-radius: 50%; background: var(--scrybe-color-brand); box-shadow: 0 0 0 1px var(--scrybe-color-brand); }
  input[type="range"]::-moz-range-track { height: 0.25rem; background: var(--scrybe-color-border-control); }
  input[type="range"]::-moz-range-thumb { width: 1rem; height: 1rem; border: 2px solid var(--scrybe-color-canvas); border-radius: 50%; background: var(--scrybe-color-brand); }
  .color-control { position: relative; }
  .swatch { display: block; width: 1.25rem; height: 1.25rem; border: 1px solid var(--scrybe-color-border-control); border-radius: 0.25rem; }
  .color-control :global(.swatch-check) { position: absolute; right: -0.125rem; bottom: -0.125rem; background: var(--scrybe-color-canvas); border-radius: 50%; }
  .twitch-description { margin-bottom: 1.5rem; }
  .twitch-description p { margin-top: 0.75rem; }
  .twitch-player { margin-top: 1rem; background: var(--scrybe-color-canvas); border: 1px solid var(--scrybe-color-border); border-radius: var(--scrybe-radius-panel); padding-top: 1rem; }
  .twitch-player > .metadata { padding-inline: 1rem; }
  .twitch-caption { display: flex; justify-content: center; align-items: end; min-height: 10rem; padding: 1.5rem; }
  .player-chrome { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; min-height: 2.75rem; padding: 0.5rem 1rem; border-top: 1px solid var(--scrybe-color-border); }
  .twitch-cc { margin-left: auto; padding: 0.125rem 0.5rem; border-radius: 0.25rem; color: white; background: #6d28d9; font-size: 0.75rem; font-weight: 600; }
  .twitch-footnote { margin-top: 1rem; }
  @media (max-width: 63.99rem) {
    .showcase-grid { grid-template-columns: minmax(0, 1fr); gap: 1.5rem; }
    .tab-scroll { overflow-x: auto; }
    .feature-tabs { flex-direction: row; width: max-content; min-width: 100%; }
    .feature-tabs button { width: auto; white-space: nowrap; min-height: 3.5rem; }
    .feature-summary { padding-inline: 0; margin-top: 1rem; }
  }
  @media (max-width: 39.99rem) {
    .feature-panel { padding: 1rem; }
    .planned-callout { flex-direction: column; }
    .transcript { padding: 0.75rem; }
    .transcript-line { grid-template-columns: 1fr; gap: 0.25rem; }
    .overlay-controls { grid-template-columns: 1fr; }
    .device { flex-wrap: wrap; }
    .device-activity { width: 100%; justify-content: start; padding-left: 2rem; }
    .signal-node { max-width: 100%; flex-wrap: wrap; }
  }
</style>
