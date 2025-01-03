# PathSage

An advanced library for manipulating and accessing nested objects and arrays using path notations.
With features like path tokenization, simple caching, configuration and more,
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

- **Comprehensive API:** Set, get, modify, has, remove and create methods are available.
- **Path Tokenization:** Efficiently tokenizes and caches paths for repeated use.
- **Fast & Compact:** Being extremely performant and efficient ([Performance](#performance)) while being very small with only 5.7Kb ([Size](#size)).
- **Configuration Options:** Limit cache size, allow Special keys and more. See [Configuration](#configuration).
- **No Dependencies:** No extra Dependencies are required!
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
const { PathSage } = require("path-sage");
```

## Usage

The library exposes the following static methods:

- **setProperty()**: Sets a value at the specified path.
- **getProperty()**: Retrieves a value from the specified path.
- **hasProperty()**: Checks if a property exists at the given path.
- **removeProperty() / deleteProperty()**: Removes a property from the specified path.
- **create**: Creates a path in an object.
- **keys() / getPaths()**: Lists all paths within an object.
- **configure()**: Configures settings.
- **clearCache()**: Clears the entire cache.

All methods accept an Object-Like argument, which means it could be a plain `Object`, an `Array` or a `Class`. It can't be `null` or `undefined`.

If any special keys or the function syntax is used, you can to enable/disable it (See [Configuration](#configuration))!

---

### setProperty(object: ObjectLike, path: String, value: any)

Set the property at a given path to a given value.

#### Example:

```javascript
var obj = { user: { profile: { name: "Alice" } } };

// Set a value
PathSage.setProperty(obj, "user.profile.age", 30);
console.log(obj); // Output: { user: { profile: { name: "Alice", age: 30 } } };
```

### getProperty(object: ObjectLike, path: String)

Get the value of the property in an object at a given path.

#### Example:

```javascript
const age = PathSage.getProperty(obj, "user.profile.age");
console.log(age); // Output: 30
```

### hasProperty(object: ObjectLike, path: String, ?detailed: boolean)

Check whether a property exists in an object at a given path.
If detailed report is enabled, it will return a ´HasResult´ Object, when a key doesn't exist.

#### HasResult

#### Example:

```javascript
const exists = PathSage.hasProperty(obj, "user.profile.age");
console.log(exists); // Output: true

// Detailed
const exists = PathSage.hasProperty(obj, "user.profile.age", true);
console.log(exists); // Output: {...}
```

### removeProperty(object: ObjectLike, path: String)

Remove a property at a given path.

#### Alias: deleteProperty()

#### Example:

```javascript
PathSage.removeProperty(obj, "user.profile.age");
console.log(PathSage.hasProperty(obj, "user.profile.age"));
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

Performance Benchmarks will come in the next version (coming soon)!

## Size

It is extremely small with only 5.7Kb (minified + gzipped) and 16Kb (minified)! With all of the **0 Dependencies** accounted for! And that even with support for Node v6!

## Contributing

Contributions are alway welcome! Just open an issue or submit a request

Let me know if you would like to refine or add features to something!

## Testing

All components, functions or branches are being tested with over 45 Tests and 415 Assertions!
The Tests achieve a near 100% coverage in all stats (lines, branches, functions)!
I couldn't test some error-catching branches (only 2) because I haven't found a case where these branches are being executed.

To run tests, first clone repo and then run the following command:

```bash
npm run test
```

## License

This project is licensed under the MIT License. See the [License](LICENSE) for details.

# Authors

Developed and maintained by [@BruderJulian](https://www.github.com/BruderJulian).

Some internal parts are based from [path-value](https://github.com/vitaly-t/path-value) by Vitaly Tomilov.
