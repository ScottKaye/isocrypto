# Isocrypto

Currently this library webpacks/browserifies to ~700 kilobytes, due to the reliance of the `crypto` package from node-rsa.  I highly recommend against using this in production.

# In Development

This is still **heavily in development** - asymmetric encryption is still synchronous.  I am working on a more generalized asynchronous wrapper to be used.  I also hope to eventually remove the dependency on node-rsa - it's a great library, but much too powerful and large for the basic parts Isocrypto uses.
