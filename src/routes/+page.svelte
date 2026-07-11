<script lang="ts">
	import { onMount } from 'svelte';
	import { Code, LockKeyhole, ShieldCheck } from '@lucide/svelte';
	import DownloadButton from '$lib/components/DownloadButton.svelte';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import CaptionDisplay from '$lib/components/home/CaptionDisplay.svelte';
	import FeatureShowcase from '$lib/components/home/FeatureShowcase.svelte';
	import { fetchLatestRelease } from '$lib/releases';
	import { m as msgs } from '$lib/paraglide/messages';
	import type { PageData } from './$types';

	type TranscriptLine = { timestamp: string; text: string };

	let { data }: { data: PageData } = $props();

	// svelte-ignore state_referenced_locally
	let version = $state(data.version);
	// svelte-ignore state_referenced_locally
	let assets = $state(data.assets);

	let reducedMotion = $state(false);
	let phraseIndex = $state(0);
	let wordIndex = $state(3);
	let holdTicks = $state(0);
	let transcriptIndex = $state(4);

	const phrases = $derived([
		msgs.hero_caption_float(),
		msgs.hero_caption_phrase_2(),
		msgs.hero_caption_phrase_3()
	]);
	const transcriptPool = $derived([
		msgs.demo_transcript_1(),
		msgs.demo_transcript_2(),
		msgs.demo_transcript_3(),
		msgs.demo_transcript_4(),
		msgs.demo_transcript_5(),
		msgs.demo_transcript_6()
	]);

	const captionText = $derived.by(() => {
		if (reducedMotion) return phrases[0];
		return phrases[phraseIndex].split(' ').slice(0, wordIndex).join(' ');
	});

	const transcriptLines = $derived.by((): TranscriptLine[] => {
		const end = reducedMotion ? 3 : transcriptIndex;
		const lines: TranscriptLine[] = [];
		for (let index = Math.max(0, end - 3); index <= end; index += 1) {
			const seconds = index * 2.6;
			const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
			const remainder = (seconds % 60).toFixed(1).padStart(4, '0');
			lines.push({
				timestamp: `[${minutes}:${remainder}]`,
				text: transcriptPool[index % transcriptPool.length]
			});
		}
		return lines;
	});

	const setupSteps = [
		{ title: msgs.how_step_1_title, body: msgs.how_step_1_body },
		{ title: msgs.how_step_2_title, body: msgs.how_step_2_body },
		{ title: msgs.how_step_3_title, body: msgs.how_step_3_body },
		{ title: msgs.how_step_4_title, body: msgs.how_step_4_body }
	];

	onMount(async () => {
		try {
			const fresh = await fetchLatestRelease();
			if (fresh.version !== version) {
				version = fresh.version;
				assets = fresh.assets;
			}
		} catch {
			// Keep build-time release data when GitHub is unavailable.
		}
	});

	onMount(() => {
		const media = window.matchMedia('(prefers-reduced-motion: reduce)');
		let timer: ReturnType<typeof setInterval> | undefined;
		let accumulator = 0;
		let wordTicks = 0;

		function stopTimer() {
			if (timer) clearInterval(timer);
			timer = undefined;
		}

		function startTimer() {
			if (timer || media.matches) return;
			timer = setInterval(() => {
				accumulator += 60;
				if (accumulator < 170) return;
				accumulator = 0;
				wordTicks += 1;
				if (wordTicks % 9 === 0) transcriptIndex += 1;

				const words = phrases[phraseIndex].split(' ');
				if (wordIndex < words.length) {
					wordIndex += 1;
					holdTicks = 0;
					return;
				}
				if (holdTicks < 11) {
					holdTicks += 1;
					return;
				}

				phraseIndex = (phraseIndex + 1) % phrases.length;
				wordIndex = 0;
				holdTicks = 0;
			}, 60);
		}

		function applyMotionPreference() {
			reducedMotion = media.matches;
			if (media.matches) {
				stopTimer();
				return;
			}
			phraseIndex = 0;
			wordIndex = 3;
			holdTicks = 0;
			transcriptIndex = 4;
			startTimer();
		}

		applyMotionPreference();
		media.addEventListener('change', applyMotionPreference);
		return () => {
			stopTimer();
			media.removeEventListener('change', applyMotionPreference);
		};
	});
</script>

<svelte:head>
	<title>{msgs.meta_title()}</title>
	<meta name="description" content={msgs.meta_description()} />
	<link rel="alternate" hreflang="en" href="https://scrybe.cc/" />
	<link rel="alternate" hreflang="ru" href="https://scrybe.cc/ru" />
	<link rel="alternate" hreflang="x-default" href="https://scrybe.cc/" />
</svelte:head>

<div class="min-h-screen bg-base-100 text-sm text-base-content" data-theme="scrybe">
	<nav class="sticky top-0 z-50 overflow-visible border-b border-base-300 bg-base-100/95 backdrop-blur-xl">
		<div class="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-12">
			<a href="/" class="inline-flex min-w-0 items-center gap-3 no-underline">
				<img class="size-[34px] rounded-lg" src="/scrybe-logo.png" alt="" />
				<span class="text-[15px] font-semibold uppercase tracking-[0.08em]">scrybe</span>
			</a>

			<div class="ml-auto hidden items-center gap-1.5 text-[13px] text-base-content/72 lg:flex">
				<a class="rounded-field px-2.5 py-1.5 hover:underline hover:underline-offset-4" href="#features">{msgs.nav_features()}</a>
				<a class="rounded-field px-2.5 py-1.5 hover:underline hover:underline-offset-4" href="#setup">{msgs.nav_setup()}</a>
				<a class="rounded-field px-2.5 py-1.5 hover:underline hover:underline-offset-4" href="#whisper">{msgs.nav_technical()}</a>
			</div>

			<div class="ml-auto flex items-center gap-2 lg:ml-0">
				<a
					href="https://github.com/synthlabs/scrybe"
					class="inline-flex h-8 items-center gap-2 rounded-field border border-base-300 px-2.5 text-[13px] text-base-content transition-colors duration-200 ease-out hover:bg-base-200 hover:no-underline"
					target="_blank"
					rel="noopener"
					aria-label={msgs.nav_github()}
				>
					<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
						<path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.7.1-.7 1.2.1 1.8 1.3 1.8 1.3 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.3-3.2-.1-.3-.6-1.6.1-3.3 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.7.2 3 .1 3.3.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3" />
					</svg>
					<span class="hidden sm:inline">{msgs.nav_github()}</span>
				</a>
				<LanguageSwitcher />
			</div>
		</div>
	</nav>

	<header class="relative isolate min-h-[760px] overflow-hidden border-b border-base-300 bg-[#0b0d11] sm:min-h-[690px] lg:h-[600px] lg:min-h-0">
		<div class="absolute inset-y-5 left-1/2 w-[calc(100%-2.5rem)] max-w-6xl -translate-x-1/2 rounded-[10px] border border-base-300/60">
			<span class="absolute left-2 top-3 font-mono text-[10px] uppercase tracking-[0.08em] text-base-content/30 sm:left-5 sm:top-4">{msgs.stream_label()}</span>
			<span class="absolute right-2 top-3 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-error sm:right-5 sm:top-3.5">
				<span class="size-[7px] rounded-full bg-error"></span>{msgs.stream_live()}
			</span>
			<div class="absolute bottom-5 left-5 hidden h-22 w-37.5 items-center justify-center rounded-field border border-base-300 bg-base-200/60 sm:flex">
				<span class="font-mono text-[10px] text-base-content/32">{msgs.stream_camera()}</span>
			</div>

			<div class="relative mx-auto flex max-w-190 flex-col items-center px-4 pb-40 pt-16 text-center sm:px-6 lg:px-12">
				<div class="inline-flex items-center gap-2 rounded-full border border-primary/45 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.04em] text-primary">
					<span class="size-[7px] rounded-full bg-primary"></span>{msgs.hero_status()}
				</div>
				<h1 class="mt-5.5 text-balance text-4xl font-semibold leading-[1.06] tracking-[-0.01em] sm:text-[46px] lg:text-[54px]">
					{msgs.hero_headline()}
				</h1>
				<p class="mt-5 max-w-155 text-pretty text-[15px] leading-[1.6] text-base-content/72 sm:text-base">{msgs.hero_subtitle()}</p>
				<p class="mt-2.5 max-w-155 text-pretty text-[13px] leading-[1.5] text-base-content/50">{msgs.hero_subtitle_caution()}</p>

				<div class="mt-6.5 flex w-full max-w-sm flex-col items-stretch justify-center gap-3 sm:max-w-none sm:flex-row sm:items-center">
					<DownloadButton {assets} />
					<a class="inline-flex h-11 items-center justify-center rounded-field border border-base-300 px-4 text-sm text-base-content/85 transition-colors duration-200 ease-out hover:bg-base-200 hover:no-underline" href="https://github.com/synthlabs/scrybe/releases" target="_blank" rel="noopener">
						{msgs.hero_meta_all_releases()}
					</a>
				</div>

				<div class="mt-3.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-base-content/52">
					<span>{version}</span><span aria-hidden="true">/</span><span>AGPL-3.0</span><span aria-hidden="true">/</span><span>macOS · Windows · Linux</span><span aria-hidden="true">/</span>
					<a class="hover:underline hover:underline-offset-4" href="https://github.com/synthlabs/scrybe" target="_blank" rel="noopener">{msgs.nav_github()}</a>
				</div>
			</div>

			<div class="absolute inset-x-0 bottom-4 flex justify-center px-8 sm:bottom-6 sm:px-55">
				<CaptionDisplay text={captionText} variant="hero" showCaret={!reducedMotion} />
			</div>
		</div>
	</header>

	<main>
		<section class="border-b border-base-300">
			<div class="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 md:grid-cols-3 md:gap-10 lg:px-12">
                <div class="flex items-start gap-3.5">
                    <Code size={18} strokeWidth={1.75} class="mt-0.5 shrink-0 text-accent" />
                    <div><h2 class="text-sm font-semibold">{msgs.trust_creator_title()}</h2><p class="mt-0.5 text-xs leading-[1.55] text-base-content/58">{msgs.trust_creator_body()}</p></div>
                </div>
				<div class="flex items-start gap-3.5">
					<LockKeyhole size={18} strokeWidth={1.75} class="mt-0.5 shrink-0 text-accent" />
					<div><h2 class="text-sm font-semibold">{msgs.trust_free_title()}</h2><p class="mt-0.5 text-xs leading-[1.55] text-base-content/58">{msgs.trust_free_body()}</p></div>
				</div>
				<div class="flex items-start gap-3.5">
					<ShieldCheck size={18} strokeWidth={1.75} class="mt-0.5 shrink-0 text-primary" />
					<div><h2 class="text-sm font-semibold">{msgs.trust_privacy_title()}</h2><p class="mt-0.5 text-xs leading-[1.55] text-base-content/58">{msgs.trust_privacy_body()}</p></div>
				</div>
			</div>
		</section>

		<section id="features" class="mx-auto max-w-7xl scroll-mt-20 px-4 py-14 sm:px-6 sm:py-16 lg:px-12">
			<FeatureShowcase {captionText} {transcriptLines} showCaret={!reducedMotion} />
		</section>

		<section id="setup" class="scroll-mt-16 border-y border-base-300 bg-base-200/35">
			<div class="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-12">
				<span class="inline-block rounded-full border border-secondary/40 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.05em] text-secondary">{msgs.how_section_label()}</span>
				<div class="mt-4 grid items-end gap-5 lg:grid-cols-2 lg:gap-8">
					<h2 class="max-w-130 text-balance text-[28px] font-semibold leading-[1.15] tracking-[-0.01em] sm:text-[32px]">{msgs.how_heading()}</h2>
					<p class="max-w-110 text-sm leading-[1.6] text-base-content/62 lg:justify-self-end">{msgs.how_body()}</p>
				</div>

				<div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
					{#each setupSteps as step, index (index)}
						<div class="border-t-2 border-primary pt-4">
							<span class="font-mono text-[11px] text-primary">{String(index + 1).padStart(2, '0')}</span>
							<h3 class="mt-2 text-sm font-semibold leading-[1.4]">{step.title()}</h3>
							{#if index === 2}
								<code class="mt-2 inline-block max-w-full overflow-x-auto rounded-field border border-base-300 bg-base-100 px-2 py-1 font-mono text-[11px] text-primary">localhost:3030/app/v1/overlay</code>
							{:else}
								<p class="mt-1.5 text-xs leading-[1.55] text-base-content/55">{step.body()}</p>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</section>

		<section id="whisper" class="mx-auto max-w-7xl scroll-mt-20 px-4 py-14 sm:px-6 lg:px-12">
			<div class="overflow-hidden rounded-[10px] border border-base-300 lg:grid lg:grid-cols-[1.1fr_0.9fr]">
				<div class="p-6 sm:p-7 lg:border-r lg:border-base-300">
					<span class="inline-block rounded-full border border-accent/40 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.05em] text-accent">{msgs.tech_section_label()}</span>
					<h2 class="mt-3.5 text-[26px] font-semibold leading-[1.2]">{msgs.tech_heading()}</h2>
					<p class="mt-2.5 text-sm leading-[1.6] text-base-content/68">{msgs.tech_body()}</p>
					<p class="mt-2.5 text-xs leading-[1.6] text-base-content/50">
						{msgs.tech_whisper_body()} {msgs.tech_whisper_link_prefix()}
						<a class="text-base-content/72 hover:underline hover:underline-offset-4" href="https://github.com/ggml-org/whisper.cpp" target="_blank" rel="noopener">github.com/ggml-org/whisper.cpp</a>.
					</p>
				</div>
				<div class="grid bg-base-200/40">
					<div class="flex items-center justify-between gap-4 border-t border-base-300 px-6 py-5 lg:border-t-0 lg:px-7"><span class="text-xs text-base-content/50">{msgs.tech_stat_runtime_label()}</span><span class="text-xl font-semibold text-primary">{msgs.tech_stat_runtime_value()}</span></div>
					<div class="flex items-center justify-between gap-4 border-t border-base-300 px-6 py-5 lg:px-7"><span class="max-w-60 text-xs text-base-content/50">{msgs.tech_stat_compute_label()}</span><span class="text-xl font-semibold text-secondary">{msgs.tech_stat_compute_value()}</span></div>
					<div class="flex items-center justify-between gap-4 border-t border-base-300 px-6 py-5 lg:px-7"><span class="text-xs text-base-content/50">{msgs.tech_stat_cost_label()}</span><span class="text-xl font-semibold text-accent">{msgs.tech_stat_cost_value()}</span></div>
				</div>
			</div>
			<p class="mt-3.5 text-xs text-base-content/50">{msgs.tech_platforms_body()}</p>
		</section>
	</main>

	<footer class="border-t border-base-300">
		<div class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-7 text-[13px] text-base-content/58 sm:flex-row sm:items-center sm:px-6 lg:px-12">
			<div>{msgs.foot_attribution()}</div>
			<div class="flex flex-wrap gap-x-5 gap-y-2 sm:ml-auto">
				<a class="hover:underline hover:underline-offset-4" href="https://github.com/synthlabs/scrybe" target="_blank" rel="noopener">{msgs.nav_github()}</a>
				<a class="hover:underline hover:underline-offset-4" href="https://github.com/synthlabs/scrybe/releases" target="_blank" rel="noopener">{msgs.foot_releases()}</a>
				<a class="hover:underline hover:underline-offset-4" href="https://github.com/synthlabs/scrybe/issues" target="_blank" rel="noopener">{msgs.foot_issues()}</a>
				<a class="hover:underline hover:underline-offset-4" href="https://github.com/synthlabs" target="_blank" rel="noopener">{msgs.foot_synth_labs()}</a>
			</div>
		</div>
	</footer>
</div>
