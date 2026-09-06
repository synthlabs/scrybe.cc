<script lang="ts">
	import { onMount } from 'svelte';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { Code, LockKeyhole, ShieldCheck } from '@lucide/svelte';
	import DownloadButton from '$lib/components/DownloadButton.svelte';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import CaptionDisplay from '$lib/components/home/CaptionDisplay.svelte';
	import FeatureShowcase from '$lib/components/home/FeatureShowcase.svelte';
	import { fetchLatestRelease } from '$lib/releases';
	import { m as msgs } from '$lib/paraglide/messages';
	import type { PageData } from './$types';

	let githubTooltip = $state(false);

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

<div data-theme="scrybe">
  <a class="skip-link" href="#main">{msgs.skip_content()}</a>
  <nav class="site-nav" aria-label={msgs.nav_label()}>
    <div class="container nav-inner">
      <a class="wordmark" href={localizeHref('/')}>
        <img src="/scrybe-logo.png" alt="" width="32" height="32" />
        <span>SCRYBE</span>
      </a>
      <div class="section-links">
        <a href="#features">{msgs.nav_features()}</a>
        <a href="#setup">{msgs.nav_setup()}</a>
        <a href="#whisper">{msgs.nav_technical()}</a>
      </div>
      <div class="nav-actions">
        <span class="tooltip-wrap">
        <a class="web-button github-link" href="https://github.com/synthlabs/scrybe" target="_blank" rel="noopener" aria-label={msgs.nav_github()} aria-describedby="github-tip" onmouseenter={() => githubTooltip = true} onmouseleave={() => githubTooltip = false} onfocus={() => githubTooltip = true} onblur={() => githubTooltip = false} onkeydown={(event) => { if (event.key === 'Escape') githubTooltip = false; }}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.7.1-.7 1.2.1 1.8 1.3 1.8 1.3 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.3-3.2-.1-.3-.6-1.6.1-3.3 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.7.2 3 .1 3.3.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3" /></svg>
          <span>{msgs.nav_github()}</span>
        </a>
        <span class="control-tooltip github-tooltip" id="github-tip" role="tooltip" hidden={!githubTooltip}>{msgs.nav_github()}</span>
        </span>
        <LanguageSwitcher />
      </div>
    </div>
  </nav>

  <header class="landing-hero">
    <div class="container">
      <div class="hero-stage panel-frame">
        <div class="stream-meta metadata">
          <span>{msgs.stream_label()}</span>
          <span class="activity-label"><span class="status-dot"></span>{msgs.stream_live()}</span>
        </div>
        <div class="hero-copy">
          <span class="activity-label"><span class="status-dot idle"></span>{msgs.hero_status()}</span>
          <h1>{msgs.hero_headline()}</h1>
          <p class="hero-description secondary">{msgs.hero_subtitle()}</p>
          <p class="metadata caution">{msgs.hero_subtitle_caution()}</p>
          <div class="hero-actions">
            <DownloadButton {assets} />
            <a class="web-button" href="https://github.com/synthlabs/scrybe/releases" target="_blank" rel="noopener">{msgs.hero_meta_all_releases()}</a>
          </div>
          <div class="release-meta metadata">
            <span class="version">{version}</span><span aria-hidden="true">·</span><span>AGPL-3.0</span><span aria-hidden="true">·</span><span>macOS · Windows · Linux</span>
          </div>
        </div>
        <div class="hero-output">
          <div class="camera-placeholder metadata" aria-hidden="true">{msgs.stream_camera()}</div>
          <div class="hero-caption"><CaptionDisplay text={captionText} variant="hero" showCaret={!reducedMotion} /></div>
        </div>
      </div>
    </div>
  </header>

  <main id="main" tabindex="-1">
    <section class="trust-section">
      <div class="container trust-grid">
        <div class="trust-item"><Code size={20} strokeWidth={1.75} aria-hidden="true" /><div><h2>{msgs.trust_creator_title()}</h2><p class="secondary">{msgs.trust_creator_body()}</p></div></div>
        <div class="trust-item"><LockKeyhole size={20} strokeWidth={1.75} aria-hidden="true" /><div><h2>{msgs.trust_free_title()}</h2><p class="secondary">{msgs.trust_free_body()}</p></div></div>
        <div class="trust-item"><ShieldCheck size={20} strokeWidth={1.75} aria-hidden="true" /><div><h2>{msgs.trust_privacy_title()}</h2><p class="secondary">{msgs.trust_privacy_body()}</p></div></div>
      </div>
    </section>

    <section id="features" class="container section">
      <FeatureShowcase {captionText} {transcriptLines} showCaret={!reducedMotion} />
    </section>

    <section id="setup" class="setup-section section">
      <div class="container">
        <span class="section-label">{msgs.how_section_label()}</span>
        <div class="section-intro">
          <h2 class="section-heading">{msgs.how_heading()}</h2>
          <p class="secondary">{msgs.how_body()}</p>
        </div>
        <ol class="setup-grid">
          {#each setupSteps as step, index (index)}
            <li>
              <span class="step-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <h3>{step.title()}</h3>
              <p class="secondary">{step.body()}</p>
              {#if index === 2}<code class="overlay-url">http://localhost:3030/app/v1/overlay</code>{/if}
            </li>
          {/each}
        </ol>
      </div>
    </section>

    <section id="whisper" class="container section">
      <div class="technical-frame panel-frame">
        <div class="technical-copy">
          <span class="section-label">{msgs.tech_section_label()}</span>
          <h2 class="section-heading">{msgs.tech_heading()}</h2>
          <p class="secondary">{msgs.tech_body()}</p>
          <p class="secondary">{msgs.tech_whisper_body()} {msgs.tech_whisper_link_prefix()} <a href="https://github.com/ggml-org/whisper.cpp" target="_blank" rel="noopener">whisper.cpp</a>.</p>
        </div>
        <dl class="technical-stats">
          <div><dt>{msgs.tech_stat_runtime_label()}</dt><dd>{msgs.tech_stat_runtime_value()}</dd></div>
          <div><dt>{msgs.tech_stat_compute_label()}</dt><dd>{msgs.tech_stat_compute_value()}</dd></div>
          <div><dt>{msgs.tech_stat_cost_label()}</dt><dd>{msgs.tech_stat_cost_value()}</dd></div>
        </dl>
      </div>
      <p class="metadata platforms">{msgs.tech_platforms_body()}</p>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container footer-inner">
      <p>{msgs.foot_attribution()}</p>
      <div class="footer-links">
        <a href="https://github.com/synthlabs/scrybe" target="_blank" rel="noopener">{msgs.nav_github()}</a>
        <a href="https://github.com/synthlabs/scrybe/releases" target="_blank" rel="noopener">{msgs.foot_releases()}</a>
        <a href="https://github.com/synthlabs/scrybe/issues" target="_blank" rel="noopener">{msgs.foot_issues()}</a>
        <a href="https://github.com/synthlabs" target="_blank" rel="noopener">{msgs.foot_synth_labs()}</a>
      </div>
    </div>
  </footer>
</div>

<style>
  .site-nav { position: sticky; top: 0; z-index: 50; border-bottom: 1px solid var(--scrybe-color-border); background: var(--scrybe-color-canvas); }
  .nav-inner { display: flex; align-items: center; gap: 1.5rem; min-height: 4.5rem; padding-block: 0.5rem; }
  .wordmark { display: inline-flex; gap: 0.5rem; align-items: center; min-height: 2.75rem; flex-shrink: 0; }
  .wordmark:hover { text-decoration: none; }
  .wordmark span { font-size: var(--scrybe-text-wordmark); font-weight: 600; letter-spacing: 0.08em; }
  .section-links { display: flex; align-items: center; gap: 1rem; margin-left: auto; color: var(--scrybe-color-text-secondary); font-size: 0.875rem; }
  .section-links a { display: inline-flex; align-items: center; min-height: 2.75rem; }
  .nav-actions { display: flex; align-items: center; gap: 0.5rem; margin-left: auto; }
  .landing-hero { padding-block: 2rem; border-bottom: 1px solid var(--scrybe-color-border); }
  .hero-stage { padding: 1.5rem; }
  .stream-meta { display: flex; justify-content: space-between; gap: 1rem; }
  .hero-copy { max-width: 43rem; margin-inline: auto; padding: 1.5rem 0 2.5rem; text-align: center; }
  h1 { margin-top: 1.25rem; font-size: clamp(2rem, 5vw, 3.5rem); letter-spacing: -0.025em; line-height: 1.08; text-wrap: balance; }
  .hero-description { margin: 1.5rem auto 0; max-width: 38rem; text-wrap: pretty; }
  .caution { margin-top: 0.75rem; }
  .hero-actions { display: flex; justify-content: center; flex-wrap: wrap; gap: 0.75rem; margin-top: 1.75rem; }
  .release-meta { display: flex; flex-wrap: wrap; gap: 0.25rem 0.75rem; justify-content: center; margin-top: 1rem; }
  .version { font-family: var(--scrybe-font-mono); }
  .hero-output { position: relative; display: flex; align-items: end; justify-content: center; min-height: 7rem; padding: 1rem 10rem; }
  .hero-caption { display: flex; justify-content: center; min-width: 0; width: 100%; }
  .camera-placeholder { position: absolute; left: 0; bottom: 0; display: grid; place-items: center; width: 8rem; height: 5rem; border: 1px solid var(--scrybe-color-border); border-radius: var(--scrybe-radius-control); background: var(--scrybe-color-canvas); }
  .trust-section { border-bottom: 1px solid var(--scrybe-color-border); }
  .trust-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 2rem; padding-block: 2rem; }
  .trust-item { display: flex; align-items: start; gap: 0.75rem; }
  .trust-item :global(svg) { margin-top: 0.125rem; color: var(--scrybe-color-text-secondary); }
  .trust-item h2 { font-size: 1rem; line-height: 1.5; }
  .trust-item p { margin-top: 0.5rem; }
  .setup-section { border-block: 1px solid var(--scrybe-color-border); background: var(--scrybe-color-surface); }
  .section-intro { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: end; margin-top: 1rem; }
  .section-intro p { max-width: 30rem; justify-self: end; }
  .setup-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1.5rem; padding: 0; margin: 2.5rem 0 0; list-style: none; }
  .setup-grid li { border-top: 1px solid var(--scrybe-color-border); padding-top: 1rem; min-width: 0; }
  .step-number { color: var(--scrybe-color-text-secondary); font-size: 0.75rem; }
  .setup-grid h3 { margin-top: 0.75rem; font-size: 1rem; line-height: 1.5; }
  .setup-grid p { margin-top: 0.5rem; }
  .overlay-url { display: block; margin-top: 0.75rem; font-size: 0.75rem; font-family: var(--scrybe-font-mono); overflow-wrap: anywhere; color: var(--scrybe-color-brand); }
  .technical-frame { display: grid; grid-template-columns: 1.1fr 0.9fr; }
  .technical-copy { padding: 2rem; }
  .technical-copy h2 { margin-top: 1rem; }
  .technical-copy p { margin-top: 1rem; }
  .technical-copy a { color: var(--scrybe-color-brand); text-decoration: underline; text-underline-offset: 0.25em; }
  .technical-stats { display: flex; flex-direction: column; margin: 0; border-left: 1px solid var(--scrybe-color-border); }
  .technical-stats div { display: flex; flex: 1; align-items: center; justify-content: space-between; gap: 1.5rem; padding: 1.5rem 2rem; }
  .technical-stats div + div { border-top: 1px solid var(--scrybe-color-border); }
  .technical-stats dt { color: var(--scrybe-color-text-secondary); min-width: 0; overflow-wrap: anywhere; }
  .technical-stats dd { margin: 0; font-weight: 600; font-size: 1.25rem; white-space: nowrap; }
  .platforms { margin-top: 1rem; }
  .site-footer { border-top: 1px solid var(--scrybe-color-border); color: var(--scrybe-color-text-secondary); font-size: 0.875rem; }
  .footer-inner { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem 2rem; padding-block: 1.5rem; }
  .footer-links { display: flex; flex-wrap: wrap; gap: 0.5rem 1.5rem; margin-left: auto; }
  .footer-links a { display: inline-flex; align-items: center; min-height: 2.75rem; }
  @media (min-width: 40rem) { .github-tooltip { display: none; } }
  @media (max-width: 63.99rem) {
    .section-links { display: none; }
    .trust-grid { grid-template-columns: 1fr; gap: 1.5rem; }
    .setup-grid { grid-template-columns: 1fr 1fr; }
    .hero-output { padding-inline: 0; padding-bottom: 0; }
    .camera-placeholder { display: none; }
    .section-intro { grid-template-columns: 1fr; gap: 1rem; }
    .section-intro p { justify-self: start; }
    .technical-frame { grid-template-columns: 1fr; }
    .technical-stats { border-left: 0; border-top: 1px solid var(--scrybe-color-border); }
  }
  @media (max-width: 39.99rem) {
    .nav-inner { gap: 0.5rem; flex-wrap: wrap; }
    .github-link { padding-inline: 0.75rem; }
    .github-link span { display: none; }
    .landing-hero { padding-block: 1rem; }
    .hero-stage { padding: 1rem; }
    .hero-copy { padding-top: 1.5rem; }
    .hero-actions { flex-direction: column; align-items: stretch; }
    .hero-output { min-height: 4rem; }
    .setup-grid { grid-template-columns: 1fr; gap: 2rem; }
    .technical-copy { padding: 1.5rem; }
    .technical-stats div { flex-wrap: wrap; padding: 1.5rem; gap: 0.5rem 1rem; }
    .footer-links { margin-left: 0; gap: 0.5rem 1rem; }
  }
</style>
