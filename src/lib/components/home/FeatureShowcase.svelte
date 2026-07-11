<script lang="ts">
	import {
		AlignCenter,
		AlignLeft,
		AlignRight,
		AudioLines,
		Captions,
		Cpu,
		LockKeyhole,
		Maximize,
		Mic,
		Play,
		Tv
	} from '@lucide/svelte';
	import { m as msgs } from '$lib/paraglide/messages';
	import CaptionDisplay, { type CaptionAlign } from './CaptionDisplay.svelte';
	import LevelMeter from './LevelMeter.svelte';

	type FeatureTab = 'local' | 'audio' | 'obs' | 'twitch';
	type CaptionColor = '#000000' | '#101216' | '#ffffff' | '#eb8a5f';
	type TranscriptLine = { timestamp: string; text: string };

	let {
		captionText,
		transcriptLines,
		showCaret
	}: {
		captionText: string;
		transcriptLines: TranscriptLine[];
		showCaret: boolean;
	} = $props();

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

	const colors: CaptionColor[] = ['#000000', '#101216', '#ffffff', '#eb8a5f'];

	let activeTab = $state<FeatureTab>('local');
	let selectedDevice = $state(0);
	let captionAlign = $state<CaptionAlign>('center');
	let captionSize = $state(24);
	let captionOpacity = $state(76);
	let captionColor = $state<CaptionColor>('#000000');

	const captionJustify = $derived(
		captionAlign === 'left' ? 'flex-start' : captionAlign === 'right' ? 'flex-end' : 'center'
	);
	const captionBackground = $derived(toRgba(captionColor, captionOpacity / 100));
	const captionTextColor = $derived(captionColor === '#ffffff' ? '#16181d' : '#ffffff');

	function toRgba(hex: CaptionColor, alpha: number): string {
		const value = Number.parseInt(hex.slice(1), 16);
		return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`;
	}

	function selectTab(tab: FeatureTab) {
		activeTab = tab;
	}

	function handleTabKeydown(event: KeyboardEvent, index: number) {
		const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
		if (!keys.includes(event.key)) return;

		event.preventDefault();
		let next = index;
		if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
		if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
		if (event.key === 'Home') next = 0;
		if (event.key === 'End') next = tabs.length - 1;

		activeTab = tabs[next].id;
		const container = (event.currentTarget as HTMLButtonElement).parentElement;
		container?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
	}

	function alignmentClass(value: CaptionAlign): string {
		return captionAlign === value
			? 'border-primary/55 bg-primary/16 text-primary'
			: 'border-base-300 text-base-content/62 hover:text-base-content';
	}

	function colorLabel(color: CaptionColor): string {
		if (color === '#000000') return msgs.overlay_color_black();
		if (color === '#101216') return msgs.overlay_color_dark();
		if (color === '#ffffff') return msgs.overlay_color_white();
		return msgs.overlay_color_orange();
	}
</script>

{#snippet plannedCallout(title: string, body: string)}
	<div class="mt-4 flex items-start gap-3 rounded-lg border border-base-300 bg-base-100 p-3.5">
		<span class="mt-px shrink-0 rounded-full border border-accent/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-accent">
			{msgs.roadmap_badge_next()}
		</span>
		<div>
			<h3 class="text-[13px] font-semibold">{title}</h3>
			<p class="mt-0.5 text-xs leading-[1.55] text-base-content/55">{body}</p>
		</div>
	</div>
{/snippet}

<span class="inline-block rounded-full border border-accent/40 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.05em] text-accent">
	{msgs.features_section_label()}
</span>

<div class="mt-6 grid items-start gap-7 lg:grid-cols-[320px_minmax(0,1fr)]">
	<div class="min-w-0">
		<div class="flex gap-1.5 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0" role="tablist" aria-label={msgs.features_section_label()}>
			{#each tabs as tab, index (tab.id)}
				{@const Icon = tab.icon}
				<button
					type="button"
					id={`feature-tab-${tab.id}`}
					role="tab"
					aria-controls="feature-panel"
					aria-selected={activeTab === tab.id}
					tabindex={activeTab === tab.id ? 0 : -1}
					class={`flex min-w-max cursor-pointer items-center gap-3 rounded-lg border px-4 py-3.5 text-left text-sm font-semibold transition-colors duration-200 ease-out lg:w-full ${
						activeTab === tab.id
							? 'border-base-300 bg-base-200 text-base-content'
							: 'border-transparent text-base-content/62 hover:text-base-content'
					}`}
					onclick={() => selectTab(tab.id)}
					onkeydown={(event) => handleTabKeydown(event, index)}
				>
					<Icon size={20} strokeWidth={1.75} class={activeTab === tab.id ? 'text-primary' : 'text-base-content/45'} />
					<span>{tab.label()}</span>
					{#if tab.id === 'twitch'}
						<span class="ml-auto rounded-full border border-accent/40 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.06em] text-accent">
							{msgs.badge_soon()}
						</span>
					{/if}
				</button>
			{/each}
		</div>
		<p class="mx-1 mt-3.5 text-xs leading-[1.6] text-base-content/45">{msgs.features_body()}</p>
	</div>

	<div
		id="feature-panel"
		role="tabpanel"
		aria-labelledby={`feature-tab-${activeTab}`}
		class="min-h-[420px] min-w-0 rounded-[10px] border border-base-300 bg-base-200/50 p-4 sm:p-6"
	>
		{#if activeTab === 'local'}
			<p class="mb-4.5 text-sm leading-[1.65] text-base-content/68">{msgs.feat_local_body()}</p>
			<div class="flex flex-wrap items-center gap-2.5">
				<span class="inline-flex items-center gap-2 rounded-field border border-base-300 px-2.5 py-1.5 font-mono text-[11px] text-base-content/72">
					<Mic size={13} strokeWidth={1.75} />
					<span>{msgs.demo_audio_in()}</span>
					<LevelMeter bars={7} compact />
				</span>
				<span class="font-mono text-xs text-base-content/40" aria-hidden="true">→</span>
				<span class="rounded-field border border-primary/45 px-2.5 py-1.5 font-mono text-[11px] text-primary">whisper.cpp</span>
				<span class="font-mono text-xs text-base-content/40" aria-hidden="true">→</span>
				<span class="font-mono text-[11px] text-base-content/72">{msgs.demo_text_out()}</span>
				<span class="ml-auto inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.06em] text-base-content/45">
					<LockKeyhole size={12} strokeWidth={1.75} /> {msgs.demo_localhost_only()}
				</span>
			</div>

			<div class="mt-4 flex min-h-29.5 flex-col gap-2 rounded-lg border border-base-300 bg-base-100 p-4">
				{#each transcriptLines as line (line.timestamp)}
					<div class="flex gap-3 font-mono text-xs leading-4.5">
						<span class="shrink-0 text-base-content/38">{line.timestamp}</span>
						<span class="text-base-content/82">{line.text}</span>
					</div>
				{/each}
			</div>
			{@render plannedCallout(msgs.planned_transcripts_title(), msgs.planned_transcripts_body())}
		{:else if activeTab === 'audio'}
			<p class="mb-4.5 text-sm leading-[1.65] text-base-content/68">{msgs.feat_audio_body()}</p>
			<div class="flex flex-col gap-2">
				{#each devices as device, index (index)}
					<button
						type="button"
						aria-pressed={selectedDevice === index}
						class={`flex items-center gap-3.5 rounded-lg border px-4 py-3 text-left transition-colors duration-200 ease-out ${
							selectedDevice === index ? 'border-primary/50 bg-base-100' : 'border-base-300 hover:bg-base-100/45'
						}`}
						onclick={() => (selectedDevice = index)}
					>
						<span class={`size-2 shrink-0 rounded-full ${selectedDevice === index ? 'bg-primary' : 'bg-base-300'}`}></span>
						<span class="min-w-0 flex-1">
							<span class="block text-sm font-medium">{device.name()}</span>
							<span class="block font-mono text-[11px] text-base-content/45">{device.detail()}</span>
						</span>
						<LevelMeter compact active={selectedDevice === index} />
					</button>
				{/each}
			</div>
			{@render plannedCallout(msgs.planned_audio_title(), msgs.planned_audio_body())}
		{:else if activeTab === 'obs'}
			<p class="mb-4.5 text-sm leading-[1.65] text-base-content/68">{msgs.feat_style_body()}</p>
			<div class="mb-3.5 flex min-w-0 flex-wrap items-center gap-2.5">
				<code class="max-w-full overflow-x-auto rounded-field border border-base-300 bg-base-100 px-2.5 py-1.5 font-mono text-[11px] text-primary">http://localhost:3030/app/v1/overlay</code>
				<span class="font-mono text-[10px] uppercase tracking-[0.06em] text-base-content/45">{msgs.demo_browser_source()}</span>
			</div>

			<div class="checker relative h-55 overflow-hidden rounded-lg">
				<div class="absolute inset-0 bg-[rgba(110,110,110,.6)]"></div>
				<div class="absolute inset-0 flex items-end p-4 sm:p-5" style={`justify-content: ${captionJustify}`}>
					<CaptionDisplay
						text={captionText}
						variant="overlay"
						showCaret={showCaret}
						align={captionAlign}
						fontSize={captionSize}
						background={captionBackground}
						textColor={captionTextColor}
					/>
				</div>
			</div>

			<div class="mt-4 grid grid-cols-1 items-end gap-5 sm:grid-cols-2 lg:grid-cols-[auto_1fr_1fr_auto]">
				<div>
					<div class="mb-2 font-mono text-[10px] uppercase tracking-[0.08em] text-base-content/45">{msgs.overlay_alignment()}</div>
					<div class="flex gap-1.5">
						<button type="button" class={`grid size-[34px] place-items-center rounded-field border ${alignmentClass('left')}`} aria-label={msgs.overlay_align_left()} aria-pressed={captionAlign === 'left'} onclick={() => (captionAlign = 'left')}><AlignLeft size={15} strokeWidth={1.75} /></button>
						<button type="button" class={`grid size-[34px] place-items-center rounded-field border ${alignmentClass('center')}`} aria-label={msgs.overlay_align_center()} aria-pressed={captionAlign === 'center'} onclick={() => (captionAlign = 'center')}><AlignCenter size={15} strokeWidth={1.75} /></button>
						<button type="button" class={`grid size-[34px] place-items-center rounded-field border ${alignmentClass('right')}`} aria-label={msgs.overlay_align_right()} aria-pressed={captionAlign === 'right'} onclick={() => (captionAlign = 'right')}><AlignRight size={15} strokeWidth={1.75} /></button>
					</div>
				</div>
				<label>
					<span class="mb-2 block font-mono text-[10px] uppercase tracking-[0.08em] text-base-content/45">{msgs.overlay_font_size()} · {captionSize}px</span>
					<input class="w-full accent-primary" type="range" min="16" max="42" value={captionSize} oninput={(event) => (captionSize = Number(event.currentTarget.value))} />
				</label>
				<label>
					<span class="mb-2 block font-mono text-[10px] uppercase tracking-[0.08em] text-base-content/45">{msgs.overlay_transparency()} · {captionOpacity}%</span>
					<input class="w-full accent-primary" type="range" min="0" max="100" value={captionOpacity} oninput={(event) => (captionOpacity = Number(event.currentTarget.value))} />
				</label>
				<div>
					<div class="mb-2 font-mono text-[10px] uppercase tracking-[0.08em] text-base-content/45">{msgs.overlay_color()}</div>
					<div class="flex gap-1.5">
						{#each colors as color (color)}
							<button
								type="button"
								class={`size-6 rounded-field ${captionColor === color ? 'border-2 border-primary' : 'border border-base-300'}`}
								style={`background: ${color}`}
								aria-label={`${msgs.overlay_color()} ${colorLabel(color)}`}
								aria-pressed={captionColor === color}
								onclick={() => (captionColor = color)}
							></button>
						{/each}
					</div>
				</div>
			</div>
			{@render plannedCallout(msgs.planned_obs_title(), msgs.planned_obs_body())}
		{:else}
			<div class="mb-4.5">
				<span class="inline-flex rounded-full border border-accent/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-accent">{msgs.badge_coming_soon()}</span>
				<p class="mt-3 text-sm leading-[1.65] text-base-content/68">{msgs.feat_twitch_body()}</p>
			</div>
			<div class="mb-3.5 flex flex-wrap items-center gap-2.5">
				<span class="rounded-field border border-primary/45 px-2.5 py-1.5 font-mono text-[11px] text-primary">scrybe</span>
				<span class="font-mono text-xs text-base-content/40" aria-hidden="true">→</span>
				<span class="rounded-field border border-base-300 px-2.5 py-1.5 font-mono text-[11px] text-base-content/72">{msgs.feat_twitch_obs_plugin()}</span>
				<span class="font-mono text-xs text-base-content/40" aria-hidden="true">→</span>
				<span class="rounded-field border border-base-300 px-2.5 py-1.5 font-mono text-[11px] text-base-content/72">{msgs.feat_twitch_captions()}</span>
			</div>

			<div class="relative h-62.5 overflow-hidden rounded-lg border border-base-300 bg-[#0b0d11]">
				<span class="absolute left-4 top-3.5 font-mono text-[10px] uppercase tracking-[0.08em] text-base-content/30">{msgs.stream_label()}</span>
				<div class="absolute inset-x-0 bottom-14.5 flex justify-center px-10">
					<CaptionDisplay text={captionText} variant="twitch" showCaret={false} background="rgba(0, 0, 0, 0.8)" />
				</div>
				<div class="absolute inset-x-0 bottom-0 flex h-11 items-center gap-3.5 border-t border-base-300 bg-base-200/92 px-4">
					<Play size={16} strokeWidth={1.75} class="text-base-content/80" aria-label={msgs.action_play()} />
					<span class="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-error"><span class="size-[7px] rounded-full bg-error"></span>{msgs.stream_live()}</span>
					<span class="ml-auto rounded bg-[rgb(109_40_217)] px-2 py-0.5 font-mono text-[10px] font-bold text-white">CC</span>
					<Maximize size={15} strokeWidth={1.75} class="text-base-content/60" aria-label={msgs.action_maximize()} />
				</div>
			</div>
			<p class="mt-3.5 text-xs leading-[1.55] text-base-content/55">{msgs.feat_twitch_footnote()}</p>
		{/if}
	</div>
</div>

<style>
	.checker {
		background-color: #f0f0f0;
		background-image: conic-gradient(#f0f0f0 0 25%, #c9c9c9 0 50%, #f0f0f0 0 75%, #c9c9c9 0);
		background-size: 32px 32px;
	}
</style>
