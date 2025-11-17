(async function loadModules() {
	try {
		// Load kantine/main.js, ur-vejr/main.js, bustider/script.js og skema/script.js
		const modulePaths = [
			'./kantine/main.js',
			'./ur-vejr/main.js',
			'./bustider/script.js',
			'./skema/script.js'
		];
		const results = await Promise.allSettled(modulePaths.map(p => import(p)));

		// Log result for each module
		results.forEach((r, i) => {
			const name = modulePaths[i] || `module[${i}]`;
			if (r.status === 'fulfilled') console.log(`${name} loaded`);
			else console.error(`Kunne ikke loade modulet ${name}`, r.reason);
		});
	} catch (err) {
		console.error('Fejl ved loading af moduler', err);
	}
})();