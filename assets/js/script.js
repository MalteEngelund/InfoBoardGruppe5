(async function loadModules() {
	try {
		// Load both modules in parallel
		await Promise.all([
			import('./ur-vejr/main.js'),
			import('./nyheder/main.js')
		]);
		console.log('ur-vejr/main.js and nyheder/main.js loaded');
	} catch (err) {
		console.error('Kunne ikke loade et eller flere moduler', err);
	}
})();