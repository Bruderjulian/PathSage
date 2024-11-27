# UnPathify

A lightweight utility library for manipulating and accessing nested objects and arrays using path notation. With features like path tokenization, rudimentary caching and simple configuration, **UnPathify** makes working with nested data more efficient and easy-to-use.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Contributing](#contributing)
- [License](#license)

---

## Introduction

**UnPathify** provides a suite of static methods for handling deeply nested properties within objects and arrays. The library leverages caching to enhance performance and adaptability.

## Features

- **Path Operations:** Access, modify, check, and remove properties/elements using string paths.
- **Path Tokenization:** Efficiently tokenizes and caches paths for repeated use.
- **Validation:** Validation of invalid inputs and paths.
- **Types/Docs:** Integrated Types and JSDoc comments for interacting with it.
- **Testing:** Test for all components. (over 40 Tests with 100% coverage).
- **Configuration Options:** Customize parsing behavior, cache size, and allowed Special keys.
- **Cache Management:** Automatically manages and clears the cache in a smart but simple way.

## Installation

Install the library via npm:

```bash
npm install unpathify
```

## Usage

The library exposes the following static methods:

- **setProperty()**: Sets a value at the specified path.
- **getProperty()**: Retrieves the value from the specified path.
- **hasProperty()**: Checks if a property exists at the given path.
- **removeProperty() / deleteProperty()**: Removes a property from the specified path.
- **keys() / getPaths()**: Lists all paths within an object.
- **clearCache()**: Clears the entire cache.
- **clearCacheSmart()**: Clears the least-used paths from the cache.
- **configure()**: Configures settings.

## API

All methods (except `configure`) accept an Object-Like argument, which means it could be a plain Object, an Array or a Class.

If any special keys or the function Syntax is used you need to enable it (See [Configure](#configureoptions-object))

### setProperty(object: ObjectLike, path: String, value: any)

sets a value of a property from an

#### Example:

```javascript
//require library
const unPathify = require("unpathify");
const obj = { user: { profile: { name: "Alice" } } };

// Set a value
unPathify.setProperty(obj, "user.profile.age", 30);
```

### getProperty(object: ObjectLike, path: String)

#### Example:

```javascript
// Get a value
const age = unPathify.getProperty(obj, 'user.profile.age');
console.log(age); // Output: 30
Checking and Removing a Property
```

### hasProperty(object: ObjectLike, path: String)

#### Example:

```javascript
// Check if a property exists
const exists = unPathify.hasProperty(obj, "user.profile.age");
console.log(exists); // Output: true
```

### removeProperty(object: ObjectLike, path: String)

#### Example:

```javascript
// Remove the property
unPathify.removeProperty(obj, "user.profile.age");
console.log(unPathify.hasProperty(obj, "user.profile.age"));
// Output: false
```

### keys(object: ObjectLike) / getPaths(object: ObjectLike)

gets all Paths from an Object or Array by traversing through it. Empty Objects or Array will be skipped.

#### Aliases: getPaths()

#### Example:

```javascript
const paths1 = unPathify.keys(obj);
console.log(paths1); // Output: ['user.profile.name']

const paths2 = unPathify.getPaths(obj);
console.log(paths2); // Output: ['user.profile.name']
```

### configure(options?: Object)

configures the cache and the parser/tokenizer.

#### Options:

| Name      | Description                              | Type    | Default |
| --------- | ---------------------------------------- | ------- | ------- |
| allowKeys | allows special Keys                      | boolean | false   |
| cacheSize | An Integer representing the maximum size | number  | 16      |

**allowKeys**: Allow these special keys "constructor", "prototype", "this" and "\_\_proto\_\_".
<br>
**cacheSize**: Limits the cache size by smartly clearing it.
Use -1 for unlimited size.

#### Example:

```javascript
unPathify.configure({
  allowKeys: true,
  parseNumbers: true,
  cacheSize: 32,
});
```

---

## Contributing

Contributions are alway welcome! Just open an issue or submit a request

Let me know if you would like to refine or add features to something!

## Running Tests

To run tests, first install locally and then run the following command

```bash
  npm run test
```

## License

MIT License. See the LICENSE file for details.

Developed by [@BruderJulian](https://www.github.com/BruderJulian).
