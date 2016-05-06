const crypto = require("crypto");
const helpers = require("./helpers.js");

// Private static methods
class _Symmetric {
	// Returns a CryptoKey from raw bytes
	static importKey(raw) {
		if (helpers.isClient) {
			// Convert string to typed array
			let arr = new Uint8Array(raw.split(","));
			return window.crypto.subtle.importKey("raw", arr, { name: "AES-CTR" }, false, ["encrypt", "decrypt"]);
		}
	};

	static stringify(data, encrypted) {

		// Add ArrayBuffer views
		if (data instanceof ArrayBuffer) data = new Uint8Array(data);
		if (encrypted instanceof ArrayBuffer) encrypted = new Uint8Array(encrypted);

		let sData = helpers.CollectionToString(data);
		let sEnc = helpers.CollectionToString(encrypted);

		// Include IV at beginning of encrypted string, separate by a few control characters
		return helpers.encode(`${ sData }\x03\0\x02${ sEnc }`);
	};

	static unstringify(str) {
		let raw = helpers.decode(str);

		// Split by delim characters
		let parts = raw.split('\x03\0\x02');

		if (parts.length !== 2) throw Error("Incomplete input string for unstringify.");

		let data = helpers.StringToCollection(parts[0]);
		let encrypted = helpers.StringToCollection(parts[1]);

		return { data, encrypted };
	};
};

class Symmetric {
	static generateKey() {
		return new Promise((resolve, reject) => {
			// Generate a pseudo-random 256-bit key
			if (helpers.isClient) {
				let key = window.crypto.getRandomValues(new Uint8Array(16)).join();
				resolve(key);
			}
			else {
				let key = crypto.randomBytes(16).join();
				resolve(key);
			}
		});
	};

	static encrypt(key, cleartext) {
		return new Promise((resolve, reject) => {
			if (helpers.isClient) {
				_Symmetric.importKey(key).then(key => {
					let algo = {
						name: "AES-CTR",
						counter: window.crypto.getRandomValues(new Uint8Array(16)),
						length: 128
					};

					window.crypto.subtle.encrypt(algo, key, helpers.StringToCollection(cleartext))
						.then(encrypted => {
							resolve(_Symmetric.stringify(algo.counter, encrypted));
						}).catch(reject);
				});
			}
			else {
				key = new Buffer(key.split(",").map(Number));
				// TODO child process
				let counter = crypto.randomBytes(16);
				let cipher = crypto.createCipheriv("aes-128-ctr", key, counter);
				let encrypted = cipher.update(cleartext, "utf8");

				resolve(_Symmetric.stringify(counter, encrypted));
			}
		});
	};

	static decrypt(key, raw) {
		return new Promise((resolve, reject) => {
			let { data, encrypted } = _Symmetric.unstringify(raw);

			if (helpers.isClient) {
				_Symmetric.importKey(key).then(key => {
					let algo = {
						name: "AES-CTR",
						counter: data,
						length: 128
					};

					window.crypto.subtle.decrypt(algo, key, encrypted)
						.then(decrypted => {
							resolve(helpers.CollectionToString(new Uint8Array(decrypted)));
						}).catch(reject);
				});
			}
			else {
				// TODO child process
				key = new Buffer(key.split(",").map(Number));
				let decipher = crypto.createDecipheriv("aes-128-ctr", key, data);
				let decrypted = decipher.update(encrypted);

				decrypted = helpers.CollectionToString(decrypted);
				
				resolve(decrypted);
			}
		});
	};
};

module.exports = Symmetric;