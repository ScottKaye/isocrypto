// const NodeRSA = require("./node-rsa-opt");
const NodeRSA = require("node-rsa");

class Asymmetric {
	static generateKeys() {
		return new Promise((resolve, reject) => {
			let key = new NodeRSA({ b: 256 });
			key.generateKeyPair();

			let pub = key.exportKey("pkcs8-public-der").toString("base64");
 			let priv = key.exportKey("pkcs8-private-der").toString("base64");

			resolve({
				public: pub,
				private: priv
			});
		});
	};

	static encrypt(pub, cleartext) {
		return new Promise((resolve, reject) => {
			pub = `-----BEGIN PUBLIC KEY-----${ pub }-----END PUBLIC KEY-----`;

			let key = new NodeRSA();
			key.importKey(pub, "pkcs8-public-pem");
			let encrypted = key.encrypt(cleartext, "base64");

			resolve(encrypted);
		});
	};

	static decrypt(priv, encrypted) {
		return new Promise((resolve, reject) => {
			priv = `-----BEGIN PRIVATE KEY-----${ priv }-----END PRIVATE KEY-----`;

			let key = new NodeRSA();
			key.importKey(priv, "pkcs8-private-pem");
			let decrypted = key.decrypt(encrypted, "utf8");

			resolve(decrypted);
		});
	};
};

module.exports = Asymmetric;