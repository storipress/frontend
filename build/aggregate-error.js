// p-* utilities depend on aggregate-error which require Node.js os support
// Thus, we create a shim for aggregate-error.js
export default globalThis.AggregateError
