# DotSage

An advanced library for manipulating and accessing nested objects and arrays using path notation. With features like path tokenization, simple caching and configuration, **DotSage** makes working with nested objects more performant and easy-to-use.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Performance](#performance)
- [Size](#size)
- [Contributing](#contributing)
- [Testing](#testing)
- [License](#license)
- [Authors](#authors)

## Features

- **Comprehensive API:** Set, get, modify, has, remove and create properties and validate and analyze Path Notations.
- **Path Tokenization:** Efficiently tokenizes and caches paths for repeated use.
- **Fast & Compact:** Being extremely fast and efficient ([Performance](#performance)) while being very small with only 5.5Kb ([Size](#size)).
- **Validation:** Validation of invalid inputs and paths.
- **Configuration Options:** Limit cache size, allow Special keys and more. See [Configuration](#configuration).
- **Types/Docs:** Integrated Types and JSDoc comments for better useability.
- **No Dependencies:** No extra Dependencies are required!
- **Testing:** Tests for all components. (over 40 Tests with nearly 100% coverage. See [Testing](#testing)).

## Installation

Install the library via [npm](https://www.npmjs.com):

```bash
npm install dot-sage
```

and import it!

```javascript
//require
const { DotSage } = require("dot-sage");
```

## Usage

The library exposes the following static methods:

- **setProperty()**: Sets a value at the specified path.
- **getProperty()**: Retrieves the value from the specified path.
- **hasProperty()**: Checks if a property exists at the given path.
- **removeProperty() / deleteProperty()**: Removes a property from the specified path.
- **keys() / getPaths()**: Lists all paths within an object.
- **clearCache()**: Clears the entire cache.
- **configure()**: Configures settings.

Most methods accept an Object-Like argument, which means it could be a plain `Object`, an `Array` or a `Class`. It can't also be `Null` or `undefined`.

If any special keys or the function Syntax is used you need to enable it (See [Configuration](#configuration))!

---

### setProperty(object: ObjectLike, path: String, value: any)

Set the property at a given path to a given value.

#### Example:

```javascript
const obj = { user: { profile: { name: "Alice" } } };

// Set a value
DotSage.setProperty(obj, "user.profile.age", 30);
```

### getProperty(object: ObjectLike, path: String)

Get the value of the property in an Object at a given path.

#### Example:

```javascript
const age = DotSage.getProperty(obj, "user.profile.age");
console.log(age); // Output: 30
```

### hasProperty(object: ObjectLike, path: String)

Check whether a property exists in an Object at a given path.

#### Example:

```javascript
const exists = DotSage.hasProperty(obj, "user.profile.age");
console.log(exists); // Output: true
```

### removeProperty(object: ObjectLike, path: String)

Remove a property from an Object at a given path.

#### Aliases: deleteProperty()

#### Example:

```javascript
DotSage.removeProperty(obj, "user.profile.age");
console.log(DotSage.hasProperty(obj, "user.profile.age"));
// Output: false
```

### keys(object: ObjectLike) / getPaths(object: ObjectLike)

Returns an array including every path. Non-empty objects or arrays are iterated and not included themselves.

#### Aliases: getPaths()

#### Example:

```javascript
const paths1 = DotSage.keys(obj);
console.log(paths1); // Output: ['user.profile.name']

const paths2 = DotSage.getPaths(obj);
console.log(paths2); // Output: ['user.profile.name']
```

### configure(options?: Object)

Configures the cache, tokenizer and validator.

#### Example:

```javascript
DotSage.configure({
  allowKeys: true,
  cacheSize: 8,
});
```

## Configuration:

List of all available Options:

| Name      | Description            | Type    | Default       |
| --------- | ---------------------- | ------- | ------------- |
| allowKeys | allows special keys    | boolean | false         |
| cacheSize | the maximum cache size | number  | -1 (disabled) |

**AllowKeys:** Allow these special keys `constructor`, `prototype`, `this` and `__proto__`.
Enabling it could potentially open security issues!!
<br>
**CacheSize:** Limits the cache size by clearing it. Use -1 to disable the limit.

## Performance

## Size

It is extremely small with only 5.5Kb(minified + gzipped) and 15.4Kb(minified)! With all of the **0 Dependencies** accounted for! And that even with support for Node v6!

## Contributing

Contributions are alway welcome! Just open an issue or submit a request

Let me know if you would like to refine or add features to something!

## Testing

All components, functions or branches are being tested. However some branches like the polyfills can't really be tests.
Overall it still exceeds 99% coverage in all stats (lines, branches, funcs)!

To run tests, first clone repo and then run the following command:

```bash
npm run test
```

## License

This project is licensed under the MIT License. See the [License](LICENSE) for details.

# Authors

Developed and maintained by [@BruderJulian](https://www.github.com/BruderJulian).

Some internal parts are based from [path-value](https://github.com/vitaly-t/path-value) by Vitaly Tomilov.
