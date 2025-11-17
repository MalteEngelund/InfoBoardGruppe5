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