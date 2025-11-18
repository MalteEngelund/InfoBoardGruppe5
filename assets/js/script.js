// Sæt CSS-variablen --vh så vi kan bruge calc(var(--vh) * 100) i stedet for 100vh
function setVhAndBaseFont() {
	try {
		// --vh (1vh fallback opdateres ved resize)
		document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
		// Basis font-size (skalér med viewport width, hold inden for rimelige grænser)
		const base = Math.max(16, Math.min(36, Math.round(window.innerWidth / 100)));
		document.documentElement.style.setProperty('--base-font-size', `${base}px`);
	} catch (e) { /* fail silently */ }
}
// Initial sætning og opdater ved resize/orientationchange
setVhAndBaseFont();
window.addEventListener('resize', setVhAndBaseFont, { passive: true });
window.addEventListener('orientationchange', setVhAndBaseFont, { passive: true });

(async function loadModules() {
	try {
		// Load moduler sekventielt for at sikre deterministic append-ordre i DOM
		const modulePaths = [
			'./kantine/main.js',
			'./ur-vejr/main.js',
			'./bustider/script.js',
			'./skema/script.js',
			'./nyheder/main.js'
		];

		for (const p of modulePaths) {
			try {
				const mod = await import(p);
				console.log(`${p} loaded`);
				// Hvis modulet eksporterer en "ready" promise, vent på den før vi går videre.
				if (mod && mod.ready && typeof mod.ready.then === 'function') {
					try {
						await mod.ready;
						console.log(`${p} ready`);
					} catch (errReady) {
						console.warn(`${p} ready rejected`, errReady);
					}
				}
			} catch (err) {
				console.error(`Kunne ikke loade modulet ${p}`, err);
			}
		}
	} catch (err) {
		console.error('Fejl ved loading af moduler', err);
	}
})();