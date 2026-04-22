<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<div class="ambient" aria-hidden="true"></div>

{@render children()}

<style>
	.ambient {
		position: fixed;
		pointer-events: none;
		z-index: -1;
		inset: 0;
		background:
			radial-gradient(600px 400px at 85% 5%, hsl(17 75% 65% / 0.06), transparent 60%),
			radial-gradient(500px 500px at 10% 40%, hsl(263 70% 50% / 0.07), transparent 60%);
	}
</style>
