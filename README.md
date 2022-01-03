# Authentication With JSON Web Tokens: Server & client

_As part of Vasco Cavalheiro's course [Angular Security Masterclass - Practical Guide to Angular Security - Add Authentication / Authorization (from scratch) to an Angular / Node App](https://www.udemy.com/course/angular-security/) on Udemy._

## What are JSON Web Tokens

They're a representation of a claim. The claim can e.g. be "I am x", in which case the JWT acts as a credential for granting access to resources.

An example JWT:

    eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.NHVaYe26MbtOYhSKkoKYdFVomg4i8ZJd8_-RU8VNbftc4TSMb4bXP3l3YlNWACwyXPGffz5aXHc6lty1Y2t4SWRqGteragsVdZufDn5BlnJl9pdR_kdVFUsra2rWKEofkZeIC4yWytE58sMIihvo9H1ScmmVwBcQP6XETqYd0aSHp1gOa9RdUPDvoXQ5oqygTqVtxaDr6wUFKrKItgBMzWIdNZ6y7O9E0DhEPTbE9rfBo6KTFsHAZnMg4k68CDp2woYIaXbmYTWcvbzIuHO7_37GT79XdIwkm95QJ7hYC9RiwrV7mesbY4PAahERJawntho0my942XheVLmGwLMBkQ

It is a base64 encoded string which consists of three dot separated parts: a header, the payload, and a digital signature.

- The header specifies the token type and digital signature algorithm. Algorithm used in this example repository is RS256; an asymmetric encryption algorithm. All information from here assumes the RS256 is being used.
- The payload is whatever you want to send. E.g. information about a user and their claims.
- The signature is what ensures authenticity of the token. When signed by the creator the private key is used together with the header and payload to create the signature.
  - If any alterations are made to e.g. the original payload, the token is no longer valid.
  - A receiver can easily verify that the token was created by a known sender, by using the corresponding public key of the key pair.

A benefit of using RS256 compared to HS256 (a symmetric key algorithm), is that in order for the symmetric scheme to work all services that wish to verify a token must possess the pre-shared secret. This provides a larger attack surface.

These tokens are usually transmitted over the web via cookies. As such, they have the same issues that a stateful session management system has, i.e. access to the cookie via JavaScript & sniffing of information during transit. The same security measures can be deployed here for a JWT as for a session ID - `httpOnly: true` and `secure: true`.

## Implementation

The example implementation has a simple REST API server with a database (wipes between restarts) and a client. JWT tokens are utilized together with cookies to achieve a stateless authentication system.

**Start server:**

    npm run server

**Start client:**

    npm start

During a user signup, the server creates the relevant database entries and then a JWT token with the new users' id. An expiration date for the JWT is also set. A login will also create a new token. The token is strapped onto a cookie and sent back to the client along with the user object. At this point, the server has completely forgotten about the JWT.

The client will, for any request to the server, attach the cookie containing the JWT token if it exists.

On the server there are two Express middle-wares:

1.  The first middle-ware will check for the existence of a JWT. If one is found, the user ID is extracted and attached to the request. If none is found it proceeds without doing anything. This is done for ALL incoming requests.
2.  The second middle-ware is selectively placed on certain end-points to ensure that a user is logged in, by looking for the user ID (attached by the first middle-ware). This makes it possible to block anonymous users from viewing specific content.

Upon expiry of the JWT a new login will have to be made. A logout immediately expires the JWT.
