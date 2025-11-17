(async function loadModules() {
	try {
		// Load both kantine/main.js and ur-vejr/main.js
		const results = await Promise.allSettled([
			import('./kantine/main.js'),
			import('./ur-vejr/main.js')
		]);

		// Log result for each module
		results.forEach((r, i) => {
			const name = i === 0 ? 'kantine/main.js' : 'ur-vejr/main.js';
			if (r.status === 'fulfilled') console.log(`${name} loaded`);
			else console.error(`Kunne ikke loade modulet ${name}`, r.reason);
		});
	} catch (err) {
		console.error('Fejl ved loading af moduler', err);
	}
})();