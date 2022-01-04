# Authentication With JSON Web Tokens: Server & client

_As part of Vasco Cavalheiro's course [Angular Security Masterclass - Practical Guide to Angular Security - Add Authentication / Authorization (from scratch) to an Angular / Node App](https://www.udemy.com/course/angular-security/) on Udemy._

## What are JSON Web Tokens

They're a representation of a claim. The claim can e.g. be "I am x", in which case the JWT acts as a credential for granting access to resources.

An example JWT:

eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.NHVaYe26MbtOYhSKkoKYdFVomg4i8ZJd8\_-RU8VNbftc4TSMb4bXP3l3YlNWACwyXPGffz5aXHc6lty1Y2t4SWRqGteragsVdZufDn5BlnJl9pdR_kdVFUsra2rWKEofkZeIC4yWytE58sMIihvo9H1ScmmVwBcQP6XETqYd0aSHp1gOa9RdUPDvoXQ5oqygTqVtxaDr6wUFKrKItgBMzWIdNZ6y7O9E0DhEPTbE9rfBo6KTFsHAZnMg4k68CDp2woYIaXbmYTWcvbzIuHO7_37GT79XdIwkm95QJ7hYC9RiwrV7mesbY4PAahERJawntho0my942XheVLmGwLMBkQ

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

    npm install
    npm run server
    npm start

During a user signup, the server creates the relevant database entries and then a JWT token with the new users' id. An expiration date for the JWT is also set. A login will also create a new token. The token is strapped onto a cookie and sent back to the client along with the user object. At this point, the server has completely forgotten about the JWT.

The client will, for any request to the server, attach the cookie containing the JWT token if it exists.

On the server there are two Express middle-wares:

1. The first middle-ware will check for the existence of a JWT. If one is found, the user ID is extracted and attached to the request. If none is found it proceeds without doing anything. This is done for ALL incoming requests.

2. The second middle-ware is selectively placed on certain end-points to ensure that a user is logged in, by looking for the user ID (attached by the first middle-ware). This makes it possible to block anonymous users from viewing specific content.

Upon expiry of the JWT a new login will have to be made. A logout immediately expires the JWT.

## CSRF

CSRF vulnerability is handled using a XSRF token, or the double submit cookie defence.

In short, a CSRF attack occurs when an attacker e.g. gets a victim to click a link which redirects to the attacker's domain. From that site, an HTML form fires off a request to your server, possibly performing an un-authorized action. The browser will allow the request to go through, and even straps on any authentication cookies to it as well. From the servers point of view, it looks as though it's the victim performing these actions.

Some things to note:

- Victim is already authenticated on your server

- HTML forms are only able to fire off GET and POST requests. Afterwards, the attacker is not able to read the response, hence why a CSRF attack is considered a blind attack.

- Provided that no GET requests are mutating any data, simply reading, we are mainly concerned with POST requests.

- Since the attack is originating from a form, it is not possible to write any JSON to the POST request body. Arguments would have to be in the URL as query parameters.

- It is also not possible to modify any headers from the form.

A XSRF token is commonly used to safeguard against CSRF attacks. What we want to achieve is for the server to know that the request is being made from the right client. The server can specify a random value and tell the client to send together with any request via a cookie.

At first hand, it looks like this solution would be vulnerable to the exact same problem - the browser will strap on this cookie in an CSRF attack, and we just introduced more validation work for the server as it would have to remember what the tokens are to verify they're correct.

Once the cookie is received in the client, it has to copy it over into a custom HTTP header, often denoted x-xsrf-token. Since forms can't manipulate headers, we can be sure it came from our client. Furthermore, if the value in the header matches the value in the cookie, then we consider it valid, so no sessions are needed on the server side for remembering which XSRF tokens are valid.

## Delegating Server Side Authentication to 3rd Party

In many scenarios it is common to delegate authentication to a 3rd party service. A centralized authentication service can then handle authentication for multiple servers/APIs in a micro-service architecture without each service having to implement the same logic.

This authentication service can be managed within your domain/company or in the case for this demo, [Auth0](https://auth0.com/docs).

The Auth0 implementation is found under the auth0 branch. On this branch, all the previous JWT server side authentication endpoints are removed and delegated to Auth0. Only the lessons endpoint remains. The server is still responsible for maintaining a database of all existing users. For this purpose, a userinfo endpoint is added for fetching user information from Auth0. The integration will be using JWTs with public key cryptography and key rotations.

On the client side, the signup and login is no longer contacting our server but interfaces with Auth0 directly. We specify a return URL for Auth0 who will include a hash (#) in the URL. The hash contains, amongst others, a JWT. The client saves the JWT and its expiration time in the browsers local storage. The client makes sure to check for any request if there is a JWT token, and if so appends it in the request header.

On the server side a middleware verifies that the JWT is valid using the corresponding public key, fetched from Auth0. If no token, no lessons. Included in the JWT we also extract some userinfo (email) just for demonstration purposes.
