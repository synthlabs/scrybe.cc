<script lang="ts">
	import { onMount } from 'svelte';
	import { AudioLines, Captions, Cpu, HardDriveDownload, Mic, Projector, SlidersHorizontal } from '@lucide/svelte';
	import DownloadButton from '$lib/components/DownloadButton.svelte';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import { fetchLatestRelease } from '$lib/releases';
	import { m as msgs } from '$lib/paraglide/messages';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// svelte-ignore state_referenced_locally
	let version = $state(data.version);
	// svelte-ignore state_referenced_locally
	let assets = $state(data.assets);
	// svelte-ignore state_referenced_locally
	let filenames = $state(data.filenames);

	const shortVersion = $derived(version.replace(/^v/, '').split('.').slice(0, 2).join('.'));

	onMount(async () => {
		try {
			const fresh = await fetchLatestRelease();
			if (fresh.version !== version) {
				version = fresh.version;
				assets = fresh.assets;
				filenames = fresh.filenames;
			}
		} catch {
			/* silent — keep build-time data */
		}
	});
</script>

<svelte:head>
	<title>{msgs.meta_title()}</title>
	<meta name="description" content={msgs.meta_description()} />
	<link rel="alternate" hreflang="en" href="https://scrybe.cc/" />
	<link rel="alternate" hreflang="ru" href="https://scrybe.cc/ru" />
	<link rel="alternate" hreflang="x-default" href="https://scrybe.cc/" />
</svelte:head>

<div class="page">
		<!-- NAV -->
		<nav class="nav">
			<a href="/" class="brand">
				<img src="/scrybe-logo.png" alt="" />
				<span>scrybe</span>
			</a>
			<div class="nav-links">
				<a href="#features">{msgs.nav_features()}</a>
				<a href="#planned">{msgs.nav_planned()}</a>
				<a href="#how">{msgs.nav_setup()}</a>
				<a href="#whisper">whisper.cpp</a>
				<a
					href="https://github.com/synthlabs/scrybe"
					class="gh"
					target="_blank"
					rel="noopener"
				>
					<svg
						viewBox="0 0 24 24"
						width="16"
						height="16"
						fill="currentColor"
						aria-hidden="true"
					>
						<path
							d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.7.1-.7 1.2.1 1.8 1.3 1.8 1.3 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.3-3.2-.1-.3-.6-1.6.1-3.3 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.7.2 3 .1 3.3.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3"
						/>
					</svg>
					<span>{msgs.nav_github()}</span>
				</a>
				<LanguageSwitcher />
			</div>
		</nav>

	<!-- HERO -->
	<section class="hero">
		<div class="hero-copy">
			<span class="eyebrow">
				<span class="dot"></span>
				<span>v{shortVersion} · {msgs.hero_status()}</span>
			</span>

			<h1 class="headline">
				{msgs.hero_headline()}
			</h1>

			<p class="sub">
				{msgs.hero_subtitle()} <span class="sub-caution">{msgs.hero_subtitle_caution()}</span>
			</p>

			<DownloadButton {assets} {filenames} />

			<div class="dl-meta">
				<span>{version}</span>
				<span class="sep">·</span>
				<span>AGPL-3.0</span>
				<span class="sep">·</span>
				<a
					href="https://github.com/synthlabs/scrybe/releases"
					target="_blank"
					rel="noopener">{msgs.hero_meta_all_releases()}</a
				>
			</div>
		</div>

		<div class="hero-visual-wrap">
			<div class="hero-visual">
				<img src="/scrybe_NNC63fbGrP.png" alt="Scrybe overlay editor" />
			</div>
			<div class="caption-float">
				{msgs.hero_caption_float()}<span class="cursor"></span>
			</div>
		</div>
	</section>

	<!-- FEATURES -->
	<section id="features">
		<div class="section-label">
			<span>{msgs.features_section_label()}</span>
		</div>
		<div class="features">
			<div class="feat">
				<div class="feat-heading">
					<div class="ico"><Cpu size={18} /></div>
					<h3>{msgs.feat_local_title()}</h3>
				</div>
				<p>{msgs.feat_local_body()}</p>
			</div>
			<div class="feat">
				<div class="feat-heading">
					<div class="ico"><Mic size={18} /></div>
					<h3>{msgs.feat_audio_title()}</h3>
				</div>
				<p>{msgs.feat_audio_body()}</p>
			</div>
				<div class="feat">
					<div class="feat-heading">
						<div class="ico"><Projector size={18} /></div>
						<h3>{msgs.feat_obs_title()}</h3>
					</div>
					<p>
						{msgs.feat_obs_body_pre()} <span class="inline-code">localhost:3030</span> {msgs.feat_obs_body_post()}
					</p>
				</div>
				<div class="feat">
					<div class="feat-heading">
						<div class="ico"><SlidersHorizontal size={18} /></div>
						<h3>{msgs.feat_settings_title()}</h3>
					</div>
					<p>{msgs.feat_settings_body()}</p>
				</div>
			</div>
		</section>

			<!-- PLANNED FEATURES -->
			<section id="planned" class="planned">
					<div class="section-label section-label-stacked">
						<span>{msgs.planned_section_label()}</span>
					</div>
				<div class="planned-head">
					<h2>{msgs.planned_heading()}</h2>
					<p>{msgs.planned_body()}</p>
				</div>
			<div class="planned-grid">
				<div class="feat">
					<div class="feat-heading">
						<div class="ico"><AudioLines size={18} /></div>
						<h3>{msgs.planned_audio_title()}</h3>
					</div>
					<p>{msgs.planned_audio_body()}</p>
				</div>
				<div class="feat">
					<div class="feat-heading">
						<div class="ico"><Captions size={18} /></div>
						<h3>{msgs.planned_transcripts_title()}</h3>
					</div>
					<p>{msgs.planned_transcripts_body()}</p>
				</div>
				<div class="feat">
					<div class="feat-heading">
						<div class="ico"><Projector size={18} /></div>
						<h3>{msgs.planned_obs_title()}</h3>
					</div>
					<p>{msgs.planned_obs_body()}</p>
				</div>
				<div class="feat">
					<div class="feat-heading">
						<div class="ico"><HardDriveDownload size={18} /></div>
						<h3>{msgs.planned_control_title()}</h3>
					</div>
					<p>{msgs.planned_control_body()}</p>
				</div>
			</div>
		</section>

			<!-- HOW IT WORKS -->
			<section id="how" class="how">
					<div class="section-label section-label-stacked how-label">
						<span>{msgs.how_section_label()}</span>
					</div>
				<div class="how-copy">
					<h2>{msgs.how_heading()}</h2>
					<p>{msgs.how_body()}</p>
				</div>
			<ol class="how-steps">
			<li class="step">
				<span class="step-n">1</span>
				<span class="step-label">{msgs.how_step_1()}</span>
				<span class="step-tag"></span>
			</li>
			<li class="step">
				<span class="step-n">2</span>
				<span class="step-label">{msgs.how_step_2()}</span>
				<span class="step-tag">large-v3-turbo</span>
			</li>
			<li class="step">
				<span class="step-n">3</span>
				<span class="step-label"
					>{msgs.how_step_3_pre()} <code>http://localhost:3030/app/v1/overlay</code> {msgs.how_step_3_post()}</span
				>
				<span class="step-tag">960 × 240</span>
			</li>
			<li class="step">
				<span class="step-n">4</span>
				<span class="step-label"
					>{msgs.how_step_4_pre()} <code>Start</code>{msgs.how_step_4_post()}</span
				>
				<span class="step-tag">{msgs.how_step_4_tag()}</span>
			</li>
		</ol>
	</section>

	<!-- WHISPER EXPLAINER -->
	<section id="whisper" class="whisper">
		<div class="whisper-head">
			<span class="whisper-tag">
				<span class="dot"></span>
				<span>{msgs.whisper_tag()}</span>
			</span>
			<h2>{msgs.whisper_heading_prefix()} <span class="mono">whisper.cpp</span>.</h2>
			<div class="whisper-stats">
				<div class="wstat">
					<div class="wstat-val">C/C++</div>
					<div class="wstat-lbl">{msgs.whisper_stat_runtime_label()}</div>
				</div>
				<div class="wstat">
					<div class="wstat-val">CPU + GPU</div>
					<div class="wstat-lbl">{msgs.whisper_stat_compute_label()}</div>
				</div>
				<div class="wstat">
					<div class="wstat-val">$0</div>
					<div class="wstat-lbl">{msgs.whisper_stat_cost_label()}</div>
				</div>
			</div>
		</div>
		<div class="whisper-body">
			<p>{msgs.whisper_body_p1_pre()}</p>
			<p>
				{msgs.whisper_body_p2_pre()}
				<span class="inline-code">tiny</span> {msgs.whisper_body_p2_mid()}
				<span class="inline-code">large-v3-turbo</span> {msgs.whisper_body_p2_post()}
			</p>
			<p class="whisper-link">
				{msgs.whisper_link_prefix()} <a
					href="https://github.com/ggml-org/whisper.cpp"
					target="_blank"
					rel="noopener">github.com/ggml-org/whisper.cpp</a
				>.
			</p>
		</div>
	</section>

	<!-- FOOTER -->
	<footer class="foot">
		<div>
			{msgs.foot_built_by()}
			<a
				href="https://github.com/synthlabs"
				target="_blank"
				rel="noopener"
				class="foot-inline">synthlabs</a
			>. {msgs.foot_open_source_prefix()}
			<a
				href="https://github.com/synthlabs/scrybe"
				target="_blank"
				rel="noopener"
				class="foot-inline">{msgs.foot_repository()}</a
			>.
		</div>
		<div class="foot-links">
			<a href="https://github.com/synthlabs/scrybe/issues" target="_blank" rel="noopener"
				>{msgs.foot_issues()}</a
			>
			<a href="https://github.com/synthlabs/scrybe/releases" target="_blank" rel="noopener"
				>{msgs.foot_releases()}</a
			>
			<a href="https://github.com/synthlabs/pepo" target="_blank" rel="noopener">Pepo</a>
		</div>
	</footer>
</div>

<style>
	.page {
		--app-shell: hsl(220 13% 7%);
		--app-panel: hsl(220 14% 9%);
		--app-border: hsl(216 15% 17%);
		--app-muted: hsl(207 28% 76%);
		max-width: 1180px;
		margin: 0 auto;
		padding: 16px clamp(18px, 5vw, 34px) 72px;
		position: relative;
	}

	/* ---------- HEADER ---------- */
	.nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 0 14px;
		min-height: 64px;
		gap: 18px;
		border-bottom: 1px solid var(--app-border);
	}
	.brand {
		display: flex;
		align-items: center;
		gap: 10px;
		font-weight: 600;
		font-size: 14px;
		letter-spacing: 0;
		text-transform: uppercase;
	}
	.brand img {
		width: 42px;
		height: 42px;
		display: block;
	}
	.nav-links {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 13px;
		color: var(--c-fg-muted);
		min-width: 0;
	}
	.nav-links a {
		padding: 7px 10px;
		border: 1px solid transparent;
		border-radius: var(--radius-md);
		transition:
			border-color 150ms ease-out,
			color 150ms ease-out,
			background-color 150ms ease-out;
	}
	.nav-links a:hover {
		color: var(--c-fg);
		background: var(--app-panel);
		border-color: var(--app-border);
	}
	.nav-links .gh {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}

	/* ---------- HERO ---------- */
	.hero {
		padding: 36px 0 56px;
		display: grid;
		grid-template-columns: 1fr;
		gap: 28px;
		align-items: center;
		border-bottom: 1px solid var(--app-border);
	}
	@media (min-width: 880px) {
		.hero {
			grid-template-columns: minmax(0, 0.9fr) minmax(430px, 1.1fr);
			gap: 44px;
			padding: 56px 0 82px;
		}
	}

	.hero-copy {
		position: relative;
		padding-left: 18px;
		border-left: 2px solid var(--c-scrybe-hex);
	}

	.eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--c-fg-muted);
		padding: 6px 9px;
		border: 1px solid var(--app-border);
		border-radius: var(--radius-md);
		margin-bottom: 22px;
		background: var(--app-panel);
		text-transform: uppercase;
	}
	.eyebrow .dot {
		width: 6px;
		height: 6px;
		border-radius: 1px;
		background: var(--c-scrybe-hex);
		box-shadow: 0 0 0 3px hsl(17 75% 65% / 0.14);
	}

	h1.headline {
		font-size: 42px;
		line-height: 1;
		letter-spacing: 0;
		font-weight: 600;
		margin: 0 0 20px;
		text-wrap: balance;
	}
	@media (min-width: 720px) {
		h1.headline {
			font-size: 64px;
		}
	}
	h1.headline .accent-word {
		color: var(--c-scrybe-hex);
		text-decoration: underline;
		text-decoration-thickness: 3px;
		text-underline-offset: 8px;
	}

	.sub {
		font-size: 17px;
		line-height: 1.55;
		color: var(--app-muted);
		max-width: 44ch;
		margin: 0 0 32px;
		text-wrap: pretty;
	}
	.sub-caution {
		color: var(--c-fg-muted);
		font-size: 0.92em;
	}

	.dl-meta {
		margin-top: 14px;
		font-size: 12px;
		color: var(--c-fg-muted);
		display: flex;
		align-items: center;
		gap: 12px;
		flex-wrap: wrap;
	}
	.dl-meta .sep {
		color: hsl(215 28% 25%);
	}
	.dl-meta a {
		text-decoration: underline;
		text-underline-offset: 4px;
		text-decoration-color: hsl(215 28% 25%);
	}
	.dl-meta a:hover {
		text-decoration-color: var(--c-fg-muted);
	}

	/* ---------- HERO VISUAL ---------- */
	.hero-visual-wrap {
		position: relative;
	}
	.hero-visual {
		position: relative;
		border-radius: var(--radius-lg);
		background: transparent;
		border: 0;
		overflow: hidden;
		box-shadow: none;
	}
	.hero-visual img {
		width: 100%;
		height: auto;
		display: block;
	}
	.hero-visual::after {
		content: '';
		position: absolute;
		inset: 0px;
		border: 1px solid rgb(0 0 0 / 0.85);
		border-radius: calc(var(--radius-lg) - 1px);
		pointer-events: none;
	}
	.caption-float {
		margin: 12px auto 0;
		padding: 10px 14px;
		width: min(100%, 340px);
		background: rgba(0, 0, 0, 0.72);
		border-radius: var(--radius-xl);
		font-size: 13px;
		font-weight: 500;
		color: white;
		letter-spacing: 0;
		line-height: 1.35;
		text-align: center;
		backdrop-filter: blur(8px);
		border: 1px solid hsl(0 0% 100% / 0.06);
		box-shadow: 0 20px 40px -12px rgb(0 0 0 / 0.8);
	}
	.caption-float .cursor {
		display: inline-block;
		width: 1px;
		height: 15px;
		background: white;
		margin-left: 2px;
		transform: translateY(2px);
		animation: caret-blink 1.25s ease-out infinite;
	}
	@keyframes caret-blink {
		0%,
		70%,
		100% {
			opacity: 1;
		}
		20%,
		50% {
			opacity: 0;
		}
	}

	/* ---------- FEATURES ---------- */
	.section-label {
		display: flex;
		align-items: center;
		gap: 12px;
		font-family: var(--font-mono);
		font-size: 12px;
		color: var(--c-fg-muted);
		text-transform: uppercase;
		letter-spacing: 0;
		margin-bottom: 28px;
	}
			.section-label::after {
				content: '';
				flex: 1;
				height: 1px;
				background: var(--app-border);
			}
				.section-label-stacked {
					border-top: 1px solid var(--app-border);
					padding-top: 0;
				}
			.how-label {
				grid-column: 1 / -1;
			margin-bottom: 0;
		}

			.features,
		.planned-grid {
			margin-top: 28px;
			display: grid;
			grid-template-columns: 1fr;
			gap: 1px;
			background: var(--app-border);
			border: 1px solid var(--app-border);
			border-radius: var(--radius-lg);
			overflow: hidden;
			box-shadow: none;
		}
		@media (min-width: 720px) {
			.features,
			.planned-grid {
				grid-template-columns: 1fr 1fr;
			}
		}
		@media (min-width: 1000px) {
			.features,
			.planned-grid {
				grid-template-columns: repeat(4, 1fr);
			}
		}

	.feat {
		background: var(--app-panel);
		padding: 26px 22px 30px;
		display: flex;
		flex-direction: column;
		gap: 12px;
		min-height: 190px;
		position: relative;
	}
	.feat::before {
		content: none;
	}
	.feat-heading {
		display: inline-flex;
		align-items: center;
		gap: 12px;
	}
	.feat .ico {
		width: 34px;
		height: 34px;
		border-radius: var(--radius-md);
		background: var(--app-shell);
		border: 1px solid var(--app-border);
		color: hsl(17 75% 70%);
		display: grid;
		place-items: center;
		flex: 0 0 auto;
	}
	.feat .ico :global(svg) {
		width: 18px;
		height: 18px;
	}
	.feat h3 {
		font-size: 15px;
		font-weight: 600;
		margin: 0;
		color: var(--c-fg);
		letter-spacing: 0;
	}
	.feat p {
		font-size: 13.5px;
		line-height: 1.55;
		color: var(--c-fg-muted);
		margin: 0;
		text-wrap: pretty;
	}

		.inline-code {
			font-family: var(--font-mono);
			font-size: 12.5px;
			color: hsl(17 75% 72%);
		}

		/* ---------- PLANNED FEATURES ---------- */
		.planned {
			margin-top: 72px;
		}
		.planned-head {
			max-width: 620px;
		}
		.planned-head h2 {
			font-size: 28px;
			font-weight: 600;
			letter-spacing: 0;
			margin: 0 0 14px;
			line-height: 1.15;
		}
		.planned-head p {
			font-size: 14.5px;
			line-height: 1.6;
			color: var(--c-fg-muted);
			margin: 0;
			text-wrap: pretty;
		}

		/* ---------- WHISPER EXPLAINER ---------- */
	.whisper {
		margin-top: 64px;
		padding: 26px 22px;
		border: 1px solid var(--app-border);
		border-radius: var(--radius-lg);
		background: var(--app-panel);
		display: grid;
		grid-template-columns: 1fr;
		gap: 28px;
		box-shadow: none;
	}
	@media (min-width: 880px) {
		.whisper {
			grid-template-columns: 1fr 1.1fr;
			gap: 48px;
			padding: 44px 44px;
			align-items: center;
		}
	}
	.whisper-head {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.whisper-tag {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		align-self: flex-start;
		font-family: var(--font-mono);
		font-size: 11px;
		letter-spacing: 0;
		color: hsl(17 75% 72%);
		padding: 4px 10px;
		border: 1px solid var(--app-border);
		border-radius: var(--radius-md);
		background: var(--app-shell);
		text-transform: uppercase;
	}
	.whisper-tag .dot {
		width: 5px;
		height: 5px;
		border-radius: 1px;
		background: hsl(17 75% 70%);
	}
	.whisper h2 {
		font-size: 24px;
		font-weight: 600;
		letter-spacing: 0;
		margin: 0;
		line-height: 1.2;
	}
	.whisper h2 .mono {
		font-family: var(--font-mono);
		font-weight: 600;
	}
	.whisper-body {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.whisper-body p {
		font-size: 14px;
		line-height: 1.6;
		color: var(--c-fg-muted);
		margin: 0;
		text-wrap: pretty;
		max-width: 54ch;
	}
	.whisper-body a {
		text-decoration: underline;
		text-underline-offset: 3px;
		text-decoration-color: hsl(215 28% 25%);
	}
	.whisper-body a:hover {
		text-decoration-color: var(--c-fg-muted);
	}
	.whisper-link {
		font-size: 12.5px;
	}
	.whisper-stats {
		display: grid;
		grid-template-columns: 1fr;
		gap: 12px;
		margin-top: 8px;
	}
	.wstat {
		padding: 14px 14px;
		border: 1px solid var(--app-border);
		border-radius: var(--radius-md);
		background: var(--app-shell);
	}
	.wstat .wstat-val {
		font-family: var(--font-mono);
		font-size: 18px;
		font-weight: 600;
		color: var(--c-fg);
		letter-spacing: 0;
		line-height: 1.1;
	}
	.wstat .wstat-lbl {
		font-size: 11px;
		color: var(--c-fg-muted);
		margin-top: 4px;
		line-height: 1.2;
	}

	/* ---------- HOW IT WORKS ---------- */
	.how {
		margin-top: 72px;
		display: grid;
		grid-template-columns: 1fr;
		gap: 28px;
	}
	@media (min-width: 880px) {
		.how {
			grid-template-columns: 0.9fr 1.1fr;
			gap: 64px;
			align-items: center;
		}
	}
	.how-copy h2 {
		font-size: 28px;
		font-weight: 600;
		letter-spacing: 0;
		margin: 0 0 14px;
		line-height: 1.15;
	}
	.how-copy p {
		font-size: 14.5px;
		line-height: 1.6;
		color: var(--c-fg-muted);
		margin: 0 0 8px;
		max-width: 46ch;
	}

	.how-steps {
		display: flex;
		flex-direction: column;
		gap: 0;
		border: 1px solid var(--app-border);
		border-radius: var(--radius-lg);
		overflow: hidden;
		background: var(--app-panel);
		list-style: none;
		padding: 0;
		margin: 0;
		box-shadow: none;
	}
	.step {
		display: grid;
		grid-template-columns: 28px minmax(0, 1fr);
		align-items: center;
		gap: 12px;
		padding: 14px 18px;
		border-bottom: 1px solid var(--app-border);
		font-size: 14px;
	}
	.step:last-child {
		border-bottom: none;
	}
	.step-n {
		width: 24px;
		height: 24px;
		border-radius: var(--radius-sm);
		background: var(--app-shell);
		border: 1px solid var(--app-border);
		color: hsl(17 75% 72%);
		font-size: 12px;
		font-weight: 600;
		display: grid;
		place-items: center;
		font-family: var(--font-mono);
	}
	.step-label {
		color: var(--c-fg);
		min-width: 0;
	}
	.step-label code {
		font-family: var(--font-mono);
		font-size: 12.5px;
		padding: 2px 6px;
		background: var(--app-shell);
		border: 1px solid var(--app-border);
		border-radius: 3px;
		color: hsl(17 75% 72%);
	}
	.step-tag {
		font-size: 11px;
		color: var(--c-fg-muted);
		font-family: var(--font-mono);
		grid-column: 2;
		overflow-wrap: anywhere;
	}

	/* ---------- FOOTER ---------- */
	.foot {
		margin-top: 72px;
		padding-top: 28px;
		border-top: 1px solid var(--app-border);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		font-size: 12.5px;
		color: var(--c-fg-muted);
		flex-wrap: wrap;
	}
	.foot-inline {
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.foot-links {
		display: flex;
		gap: 20px;
	}
	.foot-links a:hover {
		color: var(--c-fg);
	}

	@media (max-width: 719px) {
		.nav {
			align-items: flex-start;
			flex-direction: column;
			padding-top: 0;
		}
		.brand img {
			width: 44px;
			height: 44px;
		}
		.nav-links {
			width: 100%;
			gap: 18px;
			overflow-x: auto;
			padding-bottom: 6px;
			scrollbar-width: none;
		}
		.nav-links::-webkit-scrollbar {
			display: none;
		}
		.nav-links a,
		.nav-links :global(.ls) {
			flex: 0 0 auto;
		}
		.nav-links .gh span {
			display: none;
		}
		.eyebrow {
			max-width: 100%;
			white-space: normal;
		}
		.dl-meta {
			gap: 8px 10px;
		}
		.section-label {
			margin-bottom: 22px;
		}
		.feat {
			min-height: 0;
			padding: 24px 20px 26px;
		}
			.whisper h2,
			.planned-head h2,
			.how-copy h2 {
				font-size: 24px;
			}
		.step {
			padding: 14px 14px;
		}
		.step-label code {
			overflow-wrap: anywhere;
			word-break: break-word;
		}
		.foot {
			align-items: flex-start;
			flex-direction: column;
		}
		.foot-links {
			flex-wrap: wrap;
			gap: 12px 18px;
		}
	}

	@media (min-width: 720px) {
		.page {
			padding-bottom: 96px;
		}
		.caption-float {
			position: absolute;
			bottom: -22px;
			left: 50%;
			transform: translateX(-50%);
			margin: 0;
			padding: 12px 20px;
			width: auto;
			font-size: 15px;
			white-space: nowrap;
		}
		.whisper-stats {
			grid-template-columns: repeat(3, 1fr);
		}
		.step {
			grid-template-columns: 32px 1fr auto;
			gap: 16px;
		}
		.step-tag {
			grid-column: auto;
		}
	}
</style>
