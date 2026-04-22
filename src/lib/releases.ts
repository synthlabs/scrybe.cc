export type PlatformKey = 'mac' | 'win' | 'linux-deb' | 'linux-rpm';

export type ReleaseInfo = {
	version: string;
	assets: Record<PlatformKey, string>;
	filenames: Record<PlatformKey, string>;
};

const BASE = 'https://github.com/synthlabs/scrybe/releases/latest/download';
const FALLBACK_V = '0.2.8';

export const FALLBACK: ReleaseInfo = {
	version: `v${FALLBACK_V}`,
	assets: {
		mac: `${BASE}/Scrybe_${FALLBACK_V}_universal.dmg`,
		win: `${BASE}/Scrybe_${FALLBACK_V}_x64-setup.exe`,
		'linux-deb': `${BASE}/Scrybe_${FALLBACK_V}_amd64.deb`,
		'linux-rpm': `${BASE}/Scrybe-${FALLBACK_V}-1.x86_64.rpm`
	},
	filenames: {
		mac: `Scrybe_${FALLBACK_V}_universal.dmg`,
		win: `Scrybe_${FALLBACK_V}_x64-setup.exe`,
		'linux-deb': `Scrybe_${FALLBACK_V}_amd64.deb`,
		'linux-rpm': `Scrybe-${FALLBACK_V}-1.x86_64.rpm`
	}
};

export const GITHUB_API = 'https://api.github.com/repos/synthlabs/scrybe/releases/latest';

export function classify(name: string): PlatformKey | null {
	if (name.endsWith('universal.dmg')) return 'mac';
	if (name.endsWith('x64-setup.exe')) return 'win';
	if (name.endsWith('.deb')) return 'linux-deb';
	if (name.endsWith('.rpm')) return 'linux-rpm';
	return null;
}

// Normalize monorepo-style tags (e.g. `app-0.2.8-276857f`) to `v0.2.8`. Leaves
// clean tags like `v0.2.8` or `0.2.8-rc1` alone apart from ensuring a leading `v`.
export function normalizeVersion(tag: string): string {
	let t = tag.replace(/^[a-z]+-/i, ''); // strip "app-" style prefix
	t = t.replace(/-[0-9a-f]{7,}$/i, ''); // strip trailing "-<commit hash>"
	return t.startsWith('v') ? t : `v${t}`;
}

type GithubAsset = { name: string; browser_download_url: string };
type GithubRelease = { tag_name?: string; assets?: GithubAsset[] };

export async function fetchLatestRelease(
	fetchFn: typeof fetch = fetch
): Promise<ReleaseInfo> {
	try {
		const res = await fetchFn(GITHUB_API, {
			headers: { Accept: 'application/vnd.github+json' }
		});
		if (!res.ok) return FALLBACK;
		const data = (await res.json()) as GithubRelease;
		const assets = { ...FALLBACK.assets };
		const filenames = { ...FALLBACK.filenames };
		for (const a of data.assets ?? []) {
			const key = classify(a.name);
			if (key) {
				assets[key] = a.browser_download_url;
				filenames[key] = a.name;
			}
		}
		const version = data.tag_name ? normalizeVersion(data.tag_name) : FALLBACK.version;
		return { version, assets, filenames };
	} catch {
		return FALLBACK;
	}
}
