<script lang="ts">
	import { onMount } from 'svelte';
	import { Cpu, Mic, Projector, SlidersHorizontal } from '@lucide/svelte';
	import DownloadButton from '$lib/components/DownloadButton.svelte';
	import { fetchLatestRelease } from '$lib/releases';
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

<div class="page">
	<!-- NAV -->
	<nav class="nav">
		<a href="/" class="brand">
			<img src="/scrybe-logo.png" alt="" />
			<span>scrybe</span>
		</a>
		<div class="nav-links">
			<a href="#features">Features</a>
			<a href="#how">Setup</a>
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
				<span>GitHub</span>
			</a>
		</div>
	</nav>

	<!-- HERO -->
	<section class="hero">
		<div>
			<span class="eyebrow">
				<span class="dot"></span>
				<span>v{shortVersion} · early development</span>
			</span>

			<h1 class="headline">
				Local subtitles for<br />
				your own <span class="grad">broadcasts</span>.
			</h1>

			<p class="sub">
				Scrybe runs whisper.cpp on your machine and pipes live captions straight
				into OBS as a browser source. No cloud, no API keys, no per-minute
				billing. <em>Still in early development — use with caution.</em>
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
					rel="noopener">All releases</a
				>
			</div>
		</div>

		<div class="hero-visual-wrap">
			<div class="hero-visual">
				<img src="/scrybe-demo.png" alt="Scrybe overlay editor" />
			</div>
			<div class="caption-float">
				and this is what it looks like on stream<span class="cursor"></span>
			</div>
		</div>
	</section>

	<!-- FEATURES -->
	<section id="features">
		<div class="section-label">
			<span>What it does</span>
		</div>
		<div class="features">
			<div class="feat">
				<div class="ico"><Cpu size={18} /></div>
				<h3>Runs locally</h3>
				<p>
					All processing happens on your machine. Your audio never leaves the box —
					no API keys, no cloud latency, no subscription.
				</p>
			</div>
			<div class="feat">
				<div class="ico"><Mic size={18} /></div>
				<h3>Mic or desktop audio</h3>
				<p>
					Select any audio device. Caption your own voice, game audio, a
					VoD you're reacting to - even virtual audio cables.
				</p>
			</div>
			<div class="feat">
				<div class="ico"><Projector size={18} /></div>
				<h3>OBS browser source</h3>
				<p>
					Drop <span class="inline-code">localhost:3030</span> into OBS and the
					subtitles appear. Tune align, background and transparency live.
				</p>
			</div>
			<div class="feat">
				<div class="ico"><SlidersHorizontal size={18} /></div>
				<h3>Advanced Settings</h3>
				<p>
					Swap models, toggle translate, trim silence, etc.
					Great out of the box, but allows you to customize your experience.
				</p>
			</div>
		</div>
	</section>

	<!-- HOW IT WORKS -->
	<section id="how" class="how">
		<div class="how-copy">
			<div class="section-label section-label-tight"><span>Setup</span></div>
			<h2>Four steps from install to on-stream.</h2>
			<p>
				Scrybe is a Tauri app — install it like any native binary. First-run
				grabs your selected model, then it serves the overlay on localhost for OBS
				to pick up.
			</p>
		</div>
		<ol class="how-steps">
			<li class="step">
				<span class="step-n">1</span>
				<span class="step-label">Install and launch Scrybe</span>
				<span class="step-tag"></span>
			</li>
			<li class="step">
				<span class="step-n">2</span>
				<span class="step-label">Pick an input and a model</span>
				<span class="step-tag">large-v3-turbo</span>
			</li>
			<li class="step">
				<span class="step-n">3</span>
				<span class="step-label"
					>Add <code>http://localhost:3030/app/v1/overlay</code> to OBS</span
				>
				<span class="step-tag">960 × 240</span>
			</li>
			<li class="step">
				<span class="step-n">4</span>
				<span class="step-label"
					>Press <code>Start</code>. Speak. Captions appear.</span
				>
				<span class="step-tag">go live</span>
			</li>
		</ol>
	</section>

	<!-- WHISPER EXPLAINER -->
	<section id="whisper" class="whisper">
		<div class="whisper-head">
			<span class="whisper-tag">
				<span class="dot"></span>
				<span>under the hood</span>
			</span>
			<h2>Powered by <span class="mono">whisper.cpp</span>.</h2>
			<div class="whisper-stats">
				<div class="wstat">
					<div class="wstat-val">C/C++</div>
					<div class="wstat-lbl">no runtime, no Python</div>
				</div>
				<div class="wstat">
					<div class="wstat-val">CPU + GPU</div>
					<div class="wstat-lbl">Metal (Apple), CUDA (Nvidia), Vulkan (cross-platform)</div>
				</div>
				<div class="wstat">
					<div class="wstat-val">$0</div>
					<div class="wstat-lbl">no API bills, no account creation</div>
				</div>
			</div>
		</div>
		<div class="whisper-body">
			<p>
				<strong>whisper.cpp</strong> is Georgi Gerganov's port of OpenAI's
				Whisper speech-recognition model to plain C/C++. Same models, same
				weights — just stripped of the Python stack and compiled down to
				something small enough to ship inside a desktop app.
			</p>
			<p>
				Scrybe embeds it directly. Audio goes in, text comes out, nothing
				round-trips to a server. You pick the model size —
				<span class="inline-code">tiny</span> for a low-end laptop,
				<span class="inline-code">large-v3-turbo</span> when you want real
				accuracy — and tune the flags yourself.
			</p>
			<p class="whisper-link">
				More at <a
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
			Built by
			<a
				href="https://github.com/synthlabs"
				target="_blank"
				rel="noopener"
				class="foot-inline">synthlabs</a
			>. Open source —
			<a
				href="https://github.com/synthlabs/scrybe"
				target="_blank"
				rel="noopener"
				class="foot-inline">repository</a
			>.
		</div>
		<div class="foot-links">
			<a href="https://github.com/synthlabs/scrybe/issues" target="_blank" rel="noopener"
				>Issues</a
			>
			<a href="https://github.com/synthlabs/scrybe/releases" target="_blank" rel="noopener"
				>Releases</a
			>
			<a href="https://github.com/synthlabs/pepo" target="_blank" rel="noopener">Pepo</a>
		</div>
	</footer>
</div>

<style>
	.page {
		max-width: 1120px;
		margin: 0 auto;
		padding: 20px 32px 96px;
	}

	/* ---------- HEADER ---------- */
	.nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 8px 0 0;
		height: 56px;
	}
	.brand {
		display: flex;
		align-items: center;
		gap: 10px;
		font-weight: 600;
		font-size: 15px;
		letter-spacing: -0.01em;
	}
	.brand img {
		width: 50px;
		height: 50px;
		display: block;
	}
	.nav-links {
		display: flex;
		align-items: center;
		gap: 28px;
		font-size: 14px;
		color: var(--c-fg-muted);
	}
	.nav-links a:hover {
		color: var(--c-fg);
	}
	.nav-links .gh {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}

	/* ---------- HERO ---------- */
	.hero {
		padding: 48px 0 72px;
		display: grid;
		grid-template-columns: 1fr;
		gap: 40px;
		align-items: center;
	}
	@media (min-width: 880px) {
		.hero {
			grid-template-columns: 1.05fr 0.95fr;
			gap: 64px;
			padding: 64px 0 96px;
		}
	}

	.eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-size: 12px;
		color: var(--c-fg-muted);
		padding: 6px 10px;
		border: 1px solid var(--c-border);
		border-radius: var(--radius-full);
		margin-bottom: 24px;
	}
	.eyebrow .dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--c-scrybe-hex);
		box-shadow: 0 0 0 3px hsl(17 75% 65% / 0.18);
	}

	h1.headline {
		font-size: clamp(36px, 5.4vw, 56px);
		line-height: 1.05;
		letter-spacing: -0.025em;
		font-weight: 600;
		margin: 0 0 20px;
		text-wrap: balance;
	}
	h1.headline .grad {
		background: var(--c-scrybe-gradient);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}

	.sub {
		font-size: 17px;
		line-height: 1.55;
		color: hsl(240 5% 78%);
		max-width: 44ch;
		margin: 0 0 32px;
		text-wrap: pretty;
	}
	.sub em {
		font-style: normal;
		color: var(--c-fg-muted);
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
		aspect-ratio: 16 / 10;
		border-radius: var(--radius-xl);
		background: hsl(221 40% 8%);
		border: 1px solid var(--c-border);
		overflow: hidden;
		box-shadow:
			0 30px 60px -20px rgb(0 0 0 / 0.6),
			0 0 0 1px hsl(17 75% 65% / 0.06);
	}
	.hero-visual img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: top left;
		display: block;
	}
	.hero-visual::after {
		content: '';
		position: absolute;
		inset: 0;
		background:
			radial-gradient(
				120% 80% at 80% 0%,
				hsl(17 75% 65% / 0.08),
				transparent 60%
			),
			radial-gradient(
				120% 80% at 0% 100%,
				hsl(330 81% 65% / 0.06),
				transparent 60%
			);
		pointer-events: none;
	}

	.caption-float {
		position: absolute;
		bottom: -22px;
		left: 50%;
		transform: translateX(-50%);
		padding: 12px 20px;
		background: rgba(0, 0, 0, 0.72);
		border-radius: var(--radius-xl);
		font-size: 15px;
		font-weight: 500;
		color: white;
		letter-spacing: 0.01em;
		white-space: nowrap;
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
		font-size: 12px;
		color: var(--c-fg-muted);
		text-transform: uppercase;
		letter-spacing: 0.14em;
		margin-bottom: 28px;
	}
	.section-label-tight {
		margin-bottom: 16px;
	}
	.section-label::after {
		content: '';
		flex: 1;
		height: 1px;
		background: var(--c-border);
	}

	.features {
		margin-top: 40px;
		display: grid;
		grid-template-columns: 1fr;
		gap: 1px;
		background: var(--c-border);
		border: 1px solid var(--c-border);
		border-radius: var(--radius-xl);
		overflow: hidden;
	}
	@media (min-width: 720px) {
		.features {
			grid-template-columns: 1fr 1fr;
		}
	}
	@media (min-width: 1000px) {
		.features {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	.feat {
		background: hsl(221 50% 6.5%);
		padding: 28px 24px 32px;
		display: flex;
		flex-direction: column;
		gap: 12px;
		min-height: 200px;
	}
	.feat .ico {
		width: 34px;
		height: 34px;
		border-radius: var(--radius-md);
		background: hsl(17 75% 65% / 0.12);
		color: hsl(17 75% 70%);
		display: grid;
		place-items: center;
		margin-bottom: 6px;
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
		letter-spacing: -0.005em;
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

	/* ---------- WHISPER EXPLAINER ---------- */
	.whisper {
		margin-top: 88px;
		padding: 36px 32px;
		border: 1px solid var(--c-border);
		border-radius: var(--radius-xl);
		background:
			linear-gradient(
				135deg,
				hsl(17 75% 65% / 0.04),
				hsl(330 81% 65% / 0.03) 60%,
				transparent
			),
			hsl(221 50% 6.5%);
		display: grid;
		grid-template-columns: 1fr;
		gap: 28px;
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
		letter-spacing: 0.04em;
		color: hsl(17 75% 72%);
		padding: 4px 10px;
		border: 1px solid hsl(17 75% 65% / 0.3);
		border-radius: var(--radius-full);
		background: hsl(17 75% 65% / 0.08);
	}
	.whisper-tag .dot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: hsl(17 75% 70%);
	}
	.whisper h2 {
		font-size: 24px;
		font-weight: 600;
		letter-spacing: -0.015em;
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
	.whisper-body p strong {
		color: var(--c-fg);
		font-weight: 500;
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
		grid-template-columns: repeat(3, 1fr);
		gap: 12px;
		margin-top: 8px;
	}
	.wstat {
		padding: 14px 14px;
		border: 1px solid var(--c-border);
		border-radius: var(--radius-lg);
		background: hsl(221 60% 5%);
	}
	.wstat .wstat-val {
		font-family: var(--font-mono);
		font-size: 18px;
		font-weight: 600;
		color: var(--c-fg);
		letter-spacing: -0.01em;
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
		margin-top: 88px;
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
		letter-spacing: -0.02em;
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
		border: 1px solid var(--c-border);
		border-radius: var(--radius-lg);
		overflow: hidden;
		background: hsl(221 50% 6.5%);
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.step {
		display: grid;
		grid-template-columns: 32px 1fr auto;
		align-items: center;
		gap: 16px;
		padding: 14px 18px;
		border-bottom: 1px solid var(--c-border);
		font-size: 14px;
	}
	.step:last-child {
		border-bottom: none;
	}
	.step-n {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: hsl(var(--secondary));
		color: var(--c-fg-muted);
		font-size: 12px;
		font-weight: 600;
		display: grid;
		place-items: center;
		font-family: var(--font-mono);
	}
	.step-label {
		color: var(--c-fg);
	}
	.step-label code {
		font-family: var(--font-mono);
		font-size: 12.5px;
		padding: 2px 6px;
		background: hsl(var(--secondary));
		border-radius: 3px;
		color: hsl(17 75% 72%);
	}
	.step-tag {
		font-size: 11px;
		color: var(--c-fg-muted);
		font-family: var(--font-mono);
	}

	/* ---------- FOOTER ---------- */
	.foot {
		margin-top: 96px;
		padding-top: 28px;
		border-top: 1px solid var(--c-border);
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
</style>
