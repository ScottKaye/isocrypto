const Symmetric = require("./Symmetric.js");
const Asymmetric = require("./Asymmetric.js");

const Isocrypto = {
	Symmetric,
	Asymmetric
}

module.exports = Isocrypto;

/*
Isocrypto.Symmetric.generateKey().then(key => {
	let data = "Test data";
	console.log("Symmetric encrypting:", data);
	Isocrypto.Symmetric.encrypt(key, data).then(encrypted => {
		console.log("Symmetric Encrypted:", encrypted);
		Isocrypto.Symmetric.decrypt(key, encrypted).then(decrypted => {
			console.log("Symmetric Decrypted:", decrypted);
		}).catch(e => console.log(e));
	});
});
//*/
/*
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
//*/