<script lang="ts">
	import { onMount } from 'svelte';
	import {
		AudioLines,
		Captions,
		Check,
		Code,
		Cpu,
		FileText,
		HardDriveDownload,
		LockKeyhole,
		Mic,
		MonitorPlay,
		Palette,
		Projector,
		RadioTower,
		Rocket,
		Settings2,
		ShieldCheck,
		SlidersHorizontal,
		Sparkles
	} from '@lucide/svelte';
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
			/* silent - keep build-time data */
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

<div class="min-h-screen bg-base-100 text-base-content" data-theme="scrybe">
	<nav class="sticky top-0 z-40 border-b border-base-300/80 bg-base-100/92 backdrop-blur-xl">
		<div class="navbar mx-auto min-h-16 max-w-352 px-4 sm:px-6 lg:px-8">
			<div class="navbar-start min-w-0">
				<a href="/" class="inline-flex min-w-0 items-center gap-3 font-semibold">
					<img class="size-10 rounded-box" src="/scrybe-logo.png" alt="" />
					<span class="text-base uppercase tracking-normal">scrybe</span>
				</a>
			</div>

			<div class="navbar-center hidden lg:flex">
				<div class="join">
					<a class="btn btn-ghost btn-sm join-item" href="#features">{msgs.workflow_section_label()}</a>
					<a class="btn btn-ghost btn-sm join-item" href="#how">{msgs.how_section_label()}</a>
					<a class="btn btn-ghost btn-sm join-item" href="#planned">{msgs.planned_section_label()}</a>
					<a class="btn btn-ghost btn-sm join-item" href="#whisper">{msgs.tech_section_label()}</a>
				</div>
			</div>

			<div class="navbar-end gap-2">
				<a
					href="https://github.com/synthlabs/scrybe"
					class="btn btn-ghost btn-sm hidden sm:inline-flex"
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
		</div>

		<div class="mx-auto flex max-w-352 gap-2 overflow-x-auto px-4 pb-3 sm:px-6 lg:hidden">
			<a class="btn btn-ghost btn-xs shrink-0" href="#features">{msgs.workflow_section_label()}</a>
			<a class="btn btn-ghost btn-xs shrink-0" href="#how">{msgs.how_section_label()}</a>
			<a class="btn btn-ghost btn-xs shrink-0" href="#planned">{msgs.planned_section_label()}</a>
			<a class="btn btn-ghost btn-xs shrink-0" href="#whisper">{msgs.tech_section_label()}</a>
			<a
				class="btn btn-ghost btn-xs shrink-0 sm:hidden"
				href="https://github.com/synthlabs/scrybe"
				target="_blank"
				rel="noopener">{msgs.nav_github()}</a
			>
		</div>
	</nav>

	<header class="relative z-10 isolate overflow-visible border-b border-base-300">
		<div class="mx-auto grid max-w-352 gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-20">
			<div class="flex flex-col justify-center">
				<div class="mb-5 flex flex-wrap gap-2">
					<span class="badge badge-primary badge-outline gap-2 py-3 font-mono text-[11px] uppercase">
						<span class="status status-success"></span>
						v{shortVersion} · {msgs.hero_status()}
					</span>
				</div>

				<h1 class="max-w-3xl text-4xl font-semibold leading-tight tracking-normal text-balance sm:text-5xl lg:text-6xl">
					{msgs.hero_headline()}
				</h1>

				<p class="mt-6 max-w-2xl text-base leading-7 text-base-content/72 sm:text-lg">
					{msgs.hero_subtitle()}
					<span class="text-base-content/52">{msgs.hero_subtitle_caution()}</span>
				</p>

				<div class="mt-8">
					<DownloadButton {assets} {filenames} />
					<div class="mt-4 flex flex-wrap items-center gap-3 text-xs text-base-content/52">
						<span>{version}</span>
						<span aria-hidden="true">/</span>
						<span>AGPL-3.0</span>
						<span aria-hidden="true">/</span>
						<a
							class="link-hover link"
							href="https://github.com/synthlabs/scrybe/releases"
							target="_blank"
							rel="noopener">{msgs.hero_meta_all_releases()}</a
						>
					</div>
				</div>

			</div>

			<div class="flex items-center">
				<div class="relative w-full">
					<div class="absolute -inset-3 rounded-box border border-primary/10 bg-base-200/50 blur-xl"></div>
					<figure class="relative overflow-hidden rounded-box border border-base-300 bg-base-200 shadow-2xl shadow-black/30">
						<img
							src="/scrybe_0j1h8WKu9n.png"
							alt="Scrybe overlay editor showing caption placement and OBS browser source settings"
							class="block w-full"
						/>
					</figure>
					<div class="mx-auto mt-3 w-fit max-w-full rounded-box border border-white/10 bg-black/76 px-4 py-3 text-center text-sm font-medium text-white shadow-xl sm:absolute sm:bottom-5 sm:left-1/2 sm:mt-0 sm:-translate-x-1/2 sm:whitespace-nowrap">
						{msgs.hero_caption_float()}<span class="ml-1 inline-block h-4 w-px translate-y-0.5 animate-pulse bg-white"></span>
					</div>
				</div>
			</div>
		</div>
	</header>

	<main>
		<section class="border-b border-base-300 bg-base-200/35">
			<div class="mx-auto grid max-w-352 gap-px overflow-hidden border-x border-base-300 bg-base-300 sm:grid-cols-3">
				<div class="bg-base-100 p-6">
					<div class="flex items-center gap-3">
						<LockKeyhole size={20} class="text-accent" />
						<h2 class="text-base font-semibold tracking-normal">{msgs.trust_free_title()}</h2>
					</div>
					<p class="mt-3 text-sm leading-6 text-base-content/62">{msgs.trust_free_body()}</p>
				</div>
				<div class="bg-base-100 p-6">
					<div class="flex items-center gap-3">
						<ShieldCheck size={20} class="text-primary" />
						<h2 class="text-base font-semibold tracking-normal">{msgs.trust_privacy_title()}</h2>
					</div>
					<p class="mt-3 text-sm leading-6 text-base-content/62">{msgs.trust_privacy_body()}</p>
				</div>
				<div class="bg-base-100 p-6">
					<div class="flex items-center gap-3">
						<Code size={20} class="text-accent" />
						<h2 class="text-base font-semibold tracking-normal">{msgs.trust_creator_title()}</h2>
					</div>
					<p class="mt-3 text-sm leading-6 text-base-content/62">{msgs.trust_creator_body()}</p>
				</div>
			</div>
		</section>

		<section id="features" class="mx-auto max-w-352 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
			<div class="mt-12 grid gap-5 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
				<div>
					<span class="badge badge-accent badge-outline mb-4">{msgs.features_section_label()}</span>
					<h2 class="text-2xl font-semibold tracking-normal sm:text-3xl">{msgs.features_heading()}</h2>
					<p class="mt-4 text-sm leading-6 text-base-content/62">{msgs.features_body()}</p>
				</div>

				<div class="grid gap-4 sm:grid-cols-2">
					<article class="card border border-base-300 bg-base-200/80">
						<div class="card-body">
							<Cpu size={22} class="text-primary" />
							<h3 class="card-title text-base tracking-normal">{msgs.feat_local_title()}</h3>
							<p class="text-sm leading-6 text-base-content/62">{msgs.feat_local_body()}</p>
						</div>
					</article>
					<article class="card border border-base-300 bg-base-200/80">
						<div class="card-body">
							<AudioLines size={22} class="text-accent" />
							<h3 class="card-title text-base tracking-normal">{msgs.feat_audio_title()}</h3>
							<p class="text-sm leading-6 text-base-content/62">{msgs.feat_audio_body()}</p>
						</div>
					</article>
					<article class="card border border-base-300 bg-base-200/80">
						<div class="card-body">
							<Captions size={22} class="text-secondary" />
							<h3 class="card-title text-base tracking-normal">{msgs.feat_style_title()}</h3>
							<p class="text-sm leading-6 text-base-content/62">{msgs.feat_style_body()}</p>
						</div>
					</article>
					<article class="card border border-base-300 bg-base-200/80">
						<div class="card-body">
							<SlidersHorizontal size={22} class="text-accent" />
							<h3 class="card-title text-base tracking-normal">{msgs.feat_settings_title()}</h3>
							<p class="text-sm leading-6 text-base-content/62">{msgs.feat_settings_body()}</p>
						</div>
					</article>
				</div>
			</div>
		</section>

		<section id="how" class="border-y border-base-300 bg-base-200/35">
			<div class="mx-auto grid max-w-352 gap-10 px-4 py-16 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
				<ol class="steps steps-vertical gap-3">
					<li class="step step-primary">
						<span class="grid gap-1 text-left">
							<span class="font-semibold">{msgs.how_step_1_title()}</span>
							<span class="text-xs leading-5 text-base-content/58">{msgs.how_step_1_body()}</span>
						</span>
					</li>
					<li class="step step-primary">
						<span class="grid gap-1 text-left">
							<span class="font-semibold">{msgs.how_step_2_title()}</span>
							<span class="text-xs leading-5 text-base-content/58">{msgs.how_step_2_body()}</span>
						</span>
					</li>
					<li class="step step-primary">
						<span class="grid gap-1 text-left">
							<span class="font-semibold">{msgs.how_step_3_title()}</span>
							<code class="max-w-[18rem] overflow-hidden text-ellipsis rounded-field border border-base-300 bg-base-100 px-2 py-1 font-mono text-[11px] text-primary mt-2">
								http://localhost:3030/app/v1/overlay
							</code>
						</span>
					</li>
					<li class="step step-primary">
						<span class="grid gap-1 text-left">
							<span class="font-semibold">{msgs.how_step_4_title()}</span>
							<span class="text-xs leading-5 text-base-content/58">{msgs.how_step_4_body()}</span>
						</span>
					</li>
				</ol>
                <div class="mt-2">
					<span class="badge badge-secondary badge-outline mb-4">{msgs.how_section_label()}</span>
					<h2 class="text-3xl font-semibold tracking-normal text-balance sm:text-4xl">{msgs.how_heading()}</h2>
					<p class="mt-4 text-base leading-7 text-base-content/68">{msgs.how_body()}</p>
				</div>
			</div>
		</section>

		<section id="planned" class="mx-auto max-w-352 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
			<div class="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] xl:gap-16">
				<div>
					<span class="badge badge-accent badge-outline mb-4">{msgs.planned_section_label()}</span>
					<h2 class="text-3xl font-semibold tracking-normal text-balance sm:text-4xl">
						{msgs.planned_heading()}
					</h2>
					<p class="mt-4 text-base leading-7 text-base-content/68">{msgs.planned_body()}</p>
				</div>

				<div class="grid gap-4 sm:grid-cols-2">
					<article class="card border border-base-300 bg-base-200">
						<div class="card-body">
							<div class="flex items-start justify-between gap-3">
								<AudioLines size={22} class="text-primary" />
								<span class="badge badge-ghost">{msgs.roadmap_badge_next()}</span>
							</div>
							<h3 class="card-title text-base tracking-normal">{msgs.planned_audio_title()}</h3>
							<p class="text-sm leading-6 text-base-content/62">{msgs.planned_audio_body()}</p>
						</div>
					</article>
					<article class="card border border-base-300 bg-base-200">
						<div class="card-body">
							<div class="flex items-start justify-between gap-3">
								<Captions size={22} class="text-secondary" />
								<span class="badge badge-ghost">{msgs.roadmap_badge_next()}</span>
							</div>
							<h3 class="card-title text-base tracking-normal">{msgs.planned_transcripts_title()}</h3>
							<p class="text-sm leading-6 text-base-content/62">{msgs.planned_transcripts_body()}</p>
						</div>
					</article>
					<article class="card border border-base-300 bg-base-200">
						<div class="card-body">
							<div class="flex items-start justify-between gap-3">
								<Projector size={22} class="text-info" />
								<span class="badge badge-ghost">{msgs.roadmap_badge_later()}</span>
							</div>
							<h3 class="card-title text-base tracking-normal">{msgs.planned_obs_title()}</h3>
							<p class="text-sm leading-6 text-base-content/62">{msgs.planned_obs_body()}</p>
						</div>
					</article>
					<article class="card border border-base-300 bg-base-200">
						<div class="card-body">
							<div class="flex items-start justify-between gap-3">
								<FileText size={22} class="text-accent" />
								<span class="badge badge-ghost">{msgs.roadmap_badge_later()}</span>
							</div>
							<h3 class="card-title text-base tracking-normal">{msgs.planned_control_title()}</h3>
							<p class="text-sm leading-6 text-base-content/62">{msgs.planned_control_body()}</p>
						</div>
					</article>
				</div>
			</div>
		</section>

		<section id="whisper" class="border-y border-base-300 bg-base-200/35">
			<div class="mx-auto max-w-352 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
				<div class="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
					<div>
						<span class="badge badge-secondary badge-outline mb-4">{msgs.tech_section_label()}</span>
						<h2 class="text-3xl font-semibold tracking-normal text-balance sm:text-4xl">{msgs.tech_heading()}</h2>
						<p class="mt-4 text-base leading-7 text-base-content/68">{msgs.tech_body()}</p>

						<div class="stats stats-vertical mt-8 w-full border border-base-300 bg-base-100 shadow-none sm:stats-horizontal">
							<div class="stat">
								<div class="stat-title">{msgs.tech_stat_runtime_label()}</div>
								<div class="stat-value text-2xl text-primary">{msgs.tech_stat_runtime_value()}</div>
							</div>
							<div class="stat">
								<div class="stat-title">{msgs.tech_stat_compute_label()}</div>
								<div class="stat-value text-2xl text-secondary">{msgs.tech_stat_compute_value()}</div>
							</div>
							<div class="stat">
								<div class="stat-title">{msgs.tech_stat_cost_label()}</div>
								<div class="stat-value text-2xl text-accent">{msgs.tech_stat_cost_value()}</div>
							</div>
						</div>
					</div>

					<div class="join join-vertical w-full">
						<details class="collapse collapse-arrow join-item border border-base-300 bg-base-100" open>
							<summary class="collapse-title flex items-center gap-3 text-base font-semibold">
								<Cpu size={20} class="text-primary" />
								{msgs.tech_whisper_title()}
							</summary>
							<div class="collapse-content text-sm leading-6 text-base-content/64">
								<p>{msgs.tech_whisper_body()}</p>
								<p class="mt-3">
									{msgs.tech_whisper_link_prefix()}
									<a
										class="link-hover link"
										href="https://github.com/ggml-org/whisper.cpp"
										target="_blank"
										rel="noopener">github.com/ggml-org/whisper.cpp</a
									>.
								</p>
							</div>
						</details>

						<details class="collapse collapse-arrow join-item border border-base-300 bg-base-100">
							<summary class="collapse-title flex items-center gap-3 text-base font-semibold">
								<RadioTower size={20} class="text-info" />
								{msgs.tech_overlay_title()}
							</summary>
							<div class="collapse-content text-sm leading-6 text-base-content/64">
								<p>{msgs.tech_overlay_body()}</p>
							</div>
						</details>

						<details class="collapse collapse-arrow join-item border border-base-300 bg-base-100">
							<summary class="collapse-title flex items-center gap-3 text-base font-semibold">
								<HardDriveDownload size={20} class="text-accent" />
								{msgs.tech_platforms_title()}
							</summary>
							<div class="collapse-content text-sm leading-6 text-base-content/64">
								<p>{msgs.tech_platforms_body()}</p>
							</div>
						</details>

						<details class="collapse collapse-arrow join-item border border-base-300 bg-base-100">
							<summary class="collapse-title flex items-center gap-3 text-base font-semibold">
								<Settings2 size={20} class="text-secondary" />
								{msgs.tech_project_title()}
							</summary>
							<div class="collapse-content text-sm leading-6 text-base-content/64">
								<p>{msgs.tech_project_body()}</p>
							</div>
						</details>
					</div>
				</div>
			</div>
		</section>
	</main>

	<footer class="mx-auto flex max-w-352 flex-col gap-5 px-4 py-10 text-sm text-base-content/58 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
		<div>
			{msgs.foot_built_by()}
			<a
				href="https://github.com/synthlabs"
				target="_blank"
				rel="noopener"
				class="link-hover link">synthlabs</a
			>. {msgs.foot_open_source_prefix()}
			<a
				href="https://github.com/synthlabs/scrybe"
				target="_blank"
				rel="noopener"
				class="link-hover link">{msgs.foot_repository()}</a
			>.
		</div>
		<div class="flex flex-wrap gap-4">
			<a class="link-hover link" href="https://github.com/synthlabs/scrybe/issues" target="_blank" rel="noopener"
				>{msgs.foot_issues()}</a
			>
			<a class="link-hover link" href="https://github.com/synthlabs/scrybe/releases" target="_blank" rel="noopener"
				>{msgs.foot_releases()}</a
			>
			<a class="link-hover link" href="https://github.com/synthlabs/pepo" target="_blank" rel="noopener">Pepo</a>
		</div>
	</footer>
</div>
