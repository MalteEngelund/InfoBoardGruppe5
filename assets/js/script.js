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
				await import(p);
				console.log(`${p} loaded`);
			} catch (err) {
				console.error(`Kunne ikke loade modulet ${p}`, err);
			}
		}
	} catch (err) {
		console.error('Fejl ved loading af moduler', err);
	}
})();