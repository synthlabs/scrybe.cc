import { fetchLatestRelease } from '$lib/releases';
import type { PageLoad } from './$types';

export const prerender = true;

export const load: PageLoad = async ({ fetch }) => {
	return await fetchLatestRelease(fetch);
};
