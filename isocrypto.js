const Isocrypto = {
	Symmetric: require("./Symmetric.js"),
	Asymmetric: require("./Asymmetric.js")
};

module.exports = Isocrypto;

Isocrypto.Asymmetric.generateKeys().then(keys => {
	let data = "Test data";
	console.log("Asymmetric encrypting:", data)
	Isocrypto.Asymmetric.encrypt(keys.public, data).then(encrypted => {
		console.log("Asymmetric Encrypted:", encrypted.length, "bytes");
		Isocrypto.Asymmetric.decrypt(keys.private, encrypted).then(decrypted => {
			console.log("Asymmetric Decrypted:", decrypted);
		}).catch(e => console.log(e));
	});
});