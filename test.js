const https = require("https");
const fs = require("fs");
const Isocrypto = require("./isocrypto");

const options = {
	key: fs.readFileSync("X:/Scott/Misc/LocalCertificates/localhost.key"),
	cert: fs.readFileSync("X:/Scott/Misc/LocalCertificates/localhost.cert"),
	requestCert: false,
	rejectUnauthorized: false
};

https.createServer(options, (req, res) => {
	res.writeHead(200, {"Content-Type": "text/html"});
	res.write(`
	<script>
		${ fs.readFileSync("browser.js") }
	</script>`);
	res.end();
}).listen(3000);