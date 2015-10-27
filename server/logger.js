logger = {
	info: function(o) {
		console.log("\033[34m[INFO] \033[0m"+o.toString());
	},
	warning: function(o) {
		console.log("\033[35m[WARNING] \033[0m"+o.toString());
	},
	error: function(o) {
		console.log("\033[31m[ERROR] \033[0m"+o.toString());
	},
	debug: function(o) {
		console.log("\033[36m[DEBUG] \033[0m"+o.toString());
	}
};