# PathSage

An advanced library for manipulating and accessing nested objects and arrays using path notations.
With features like path tokenization, caching, optional configuration and more,
**PathSage** makes working with nested objects more performant and easy-to-use.

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

- **Comprehensive API:** Set, get, has, remove, list and create.
- **Path Tokenization:** Efficiently tokenizes and caches paths for repeated use.
- **Fast & Compact:** Being extremely performant and efficient ([Performance](#performance)) while being very small with only 5.7Kb ([Size](#size)).
- **Configuration:** Optionally configure things but ONLY WHEN NESESSARY. You can limit cache size, allow special keys and more. See [Configuration](#configuration).
- **No Dependencies:** No extra Dependencies!
- **Minimum Version:** Supports Node v6 out of the box!
- **Types/Docs:** Integrated Types and JSDoc comments for better useability.
- **Testing:** Tests for all components. (over 46 Tests with nearly 100% coverage. See [Testing](#testing)).

## Installation

Install [the library](https://www.npmjs.com/package/path-sage) with [npm](https://www.npmjs.com):

```bash
npm install path-sage
```

and import it!

```javascript
//require
const PathSage = require("path-sage");
```

## Usage

The library exposes the following static methods:

- **set()**: Sets a value at the specified path.
- **get()**: Retrieves a value from the specified path.
- **has()**: Checks if a property exists at the given path.
- **remove()**: Removes a property from the specified path.
- **create**: Creates a path in an object.
- **keys() / getPaths()**: Lists all paths within an object.
- **configure()**: Configures settings.
- **clearCache()**: Clears the entire cache.

All methods accept an Object-Like argument, which means it could be a plain `Object`, an `Array` or a `Class`. It can't be `null` or `undefined`.

If any special keys or the function syntax is used, you can to enable/disable it (See [Configuration](#configuration))!

---

### set(object: ObjectLike, path: String, value: any)

Set the property at a given path to a given value.

#### Example:

```javascript
var obj = { user: { profile: { name: "Alice" } } };

// Set a value
PathSage.set(obj, "user.profile.age", 30);
console.log(obj); // Output: { user: { profile: { name: "Alice", age: 30 } } };
```

### get(object: ObjectLike, path: String)

Get the value of the property in an object at a given path.

#### Example:

```javascript
const age = PathSage.get(obj, "user.profile.age");
console.log(age); // Output: 30
```

### has(object: ObjectLike, path: String, ?detailed: boolean)

Check whether a property exists in an object at a given path.
If detailed report is enabled, it will return a ´HasResult´ Object, when a key doesn't exist.

#### HasResult

#### Example:

```javascript
const exists = PathSage.has(obj, "user.profile.age");
console.log(exists); // Output: true

// Detailed
const exists = PathSage.has(obj, "user.profile.age", true);
console.log(exists); // Output: {...}
```

### remove(object: ObjectLike, path: String)

Remove a property at a given path.

#### Example:

```javascript
PathSage.remove(obj, "user.profile.age");
console.log(PathSage.has(obj, "user.profile.age"));
// Output: false
```

### create(object: ObjectLike, path: String)

Create a path in an object.

#### Example:

```javascript
var emptyObj = {};

PathSage.create(emptyObj, "user.profile.age");

console.log(emptyObj);
// Output: { user: { profile: { age: {}}}}
```

### keys(object: ObjectLike)

Returns an array including every available path. Non-empty objects and arrays are iterated and not included themselves.

#### Alias: getPaths()

#### Example:

```javascript
const paths1 = PathSage.keys(obj);
console.log(paths1); // Output: ['user.profile.name']

const paths2 = PathSage.getPaths(obj);
console.log(paths2); // Output: ['user.profile.name']
```

### clearCache()

clears the entire cache.

#### Example:

```javascript
PathSage.clearCache();
```

### configure(options?: Object)

Configures the cache and tokenizer.

#### Example:

```javascript
PathSage.configure({
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
**CacheSize:** Limits the cache size by clearing it when needed. Use -1 to disable the limit.

## Performance

The Performance Benchmarks will come in the next version (coming soon)! As of writin these, `PathSage` massively outperforms many of popular similar packages!

## Size

It is extremely small with only 7.3Kb (minified + gzipped) and 21.3Kb! With all of the **0 Dependencies** accounted for! And that even with support for Node v6!

## Contributing

Contributions are alway welcome! Just open an issue or submit a request

Let me know if you would like to refine or add features to something!

## Testing

The Tests achieve a near 100% coverage (in lines, branches, functions) with 56 Tests and 494 Assertions as of now, with more to come!
I couldn't test some error-catching stuff because I haven't found a case where these branches are being executed. These don't affect performance, size nor test coverage!

To run tests, first clone repo and then run the following command:

```bash
npm run test
```

## License

This project is licensed under the MIT License. See the [License](LICENSE) for details.

# Authors

Developed and maintained by [@BruderJulian](https://www.github.com/BruderJulian).

Some internal parts are based from [path-value](https://github.com/vitaly-t/path-value) by Vitaly Tomilov.
