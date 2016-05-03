const crypto = require("crypto");
const helpers = require("./helpers.js");
const NodeRSA = require("node-rsa");

// Private static methods
class _Asymmetric {
	// Returns a CryptoKey from a raw key
	static importPublicKey(pub) {
		if (helpers.isClient) {
			pub = helpers.StringToUint8Array(window.atob(pub));

			// Convert string to typed array
			return window.crypto.subtle.importKey("spki", pub, {
				name: "RSA-OAEP",
				hash: { name: "SHA-256" }
			}, false, ["encrypt"]);
		}
	};

	static importPrivateKey(priv) {
		if (helpers.isClient) {
			priv = helpers.StringToUint8Array(window.atob(priv));

			// Convert string to typed array
			return window.crypto.subtle.importKey("pkcs8", priv, {
				name: "RSA-OAEP",
				hash: { name: "SHA-256" }
			}, false, ["decrypt"]);
		}
	};
};

class Asymmetric {
	static generateKeys() {
		return new Promise((resolve, reject) => {
			// Generate a pseudo-random 256-bit key
			if (helpers.isClient) {
				let algo = {
					name: "RSA-OAEP",
					modulusLength: 2048,
					publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
					hash: { name: "SHA-256" },
			    };

			    window.crypto.subtle.generateKey(algo, true, ["encrypt", "decrypt"])
					.then(keys => {
						let pPublic = window.crypto.subtle.exportKey("spki", keys.publicKey);
						let pPrivate = window.crypto.subtle.exportKey("pkcs8", keys.privateKey);

						Promise.all([pPublic, pPrivate]).then(raw => {
							resolve({
								public: window.btoa(helpers.Uint8ArrayToString(new Uint8Array(raw[0]))),
								private: window.btoa(helpers.Uint8ArrayToString(new Uint8Array(raw[1]))),
							});
						}).catch(reject);
					}).catch(reject);
			}
			else {
				let key = new NodeRSA({ b: 512 });
				key.generateKeyPair();
				resolve({
					public: key.exportKey("pkcs8-public-der").toString("base64"),
					private: key.exportKey("pkcs8-private-der").toString("base64")
				});
			}
		});
	};

	static encrypt(pub, cleartext) {
		return new Promise((resolve, reject) => {
			if (helpers.isClient) {
				_Asymmetric.importPublicKey(pub).then(key => {
					let algo = {
						name: "RSA-OAEP"
					};

					window.crypto.subtle.encrypt(algo, key, helpers.StringToUint8Array(cleartext))
						.then(encrypted => {
							let binary = helpers.Uint8ArrayToString(new Uint8Array(encrypted));
							resolve(binary);
						}).catch(reject);
				});
			}
			else {
				let key = new NodeRSA();
				key.importKey(new Buffer(pub, "base64"), "pkcs8-public-der");
				let encrypted = key.encrypt(new Buffer(cleartext));
				encrypted = helpers.Uint8ArrayToString(encrypted);
				resolve(encrypted);
			}
		});
	};

	static decrypt(priv, encrypted) {
		return new Promise((resolve, reject) => {
			if (helpers.isClient) {
				_Asymmetric.importPrivateKey(priv).then(key => {
					let algo = {
						name: "RSA-OAEP"
					};

					window.crypto.subtle.decrypt(algo, key, helpers.StringToUint8Array(encrypted))
						.then(decrypted => {
							resolve(helpers.Uint8ArrayToString(new Uint8Array(decrypted)));
						}).catch(reject);
				});
			}
			else {
				let key = new NodeRSA();
				key.importKey(new Buffer(priv, "base64"), "pkcs8-private-der");
				let decrypted = key.decrypt(helpers.StringToUint8Array(encrypted));
				decrypted = decrypted.toString("utf8");
				resolve(decrypted);
			}
		});
	};
};

module.exports = Asymmetric;