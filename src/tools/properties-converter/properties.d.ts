declare module "properties" {
	export interface ParseOptions {
		/**
		 * By default `parse()` reads a String.
		 * If you want to read a file, set this option to true.
		 * If this option is used, the callback is mandatory.
		 * It gets 2 parameters, a possible error and the object with all the properties.
		 */
		path?: boolean;

		/**
		 * Allows you to add additional comment tokens.
		 * The token must be a single printable non-whitespae ascii character.
		 * If the `strict` option is not set, the tokens `#` and `!` are parsed as comment tokens.
		 *
		 * @example
		 * comments: ";"
		 * @example
		 * comments: [";", "&#064;"]
		 */
		comments?: string | string[];

		/**
		 * Allows you to add additional separator tokens.
		 * The token must be a single printable non-whitespae ascii character.
		 * If the `strict` option is not set, the tokens `=` and `:` are parsed as comment tokens.
		 *
		 * @example
		 * separators: "-"
		 * @example
		 * separators: ["-", ">"]
		 */
		separators?: string | string[];

		/**
		 * This option can be used with the `comments` and `separators` options.
		 * If true, **only** the tokens specified in these options are used to parse comments and separators.
		 */
		strict?: boolean;

		/**
		 * Parses INI sections.
		 * Read the INI section for further details.
		 *
		 * @link https://www.npmjs.com/package/properties#ini
		 */
		sections?: boolean;

		/**
		 * Parses dot separated keys as JavaScript objects.
		 *
		 * Look at the namespaces section for further details.
		 * @link https://www.npmjs.com/package/properties#namespaces
		 */
		namespaces?: boolean;

		/**
		 * Allows you to read the value of a key while the file is being parsed.
		 *
		 * Look at the variables section for further details.
		 * @link https://www.npmjs.com/package/properties#variables
		 */
		variables?: boolean;

		/**
		 * External variables can be passed to the file if the variables option is enabled.
		 *
		 * Look at the variables section for further details.
		 * @link https://www.npmjs.com/package/properties#variables
		 */
		vars?: boolean;

		/**
		 * Files can be linked and imported with the include key.
		 * If this option is used, the callback is mandatory.
		 *
		 * Look at the include section for further details.
		 * @link https://www.npmjs.com/package/properties#include
		 */
		include?: boolean;

		/**
		 * Each property or section can be removed or modified from the final object.
		 * It's similar to the reviver of the `JSON.parse()` function.
		 *
		 * The reviver it's exactly the same as the replacer from `stringify()`.
		 * The same function can be reused.
		 *
		 * The callback gets 3 parameters: key, value and section.
		 *
		 * A property has a key and a value and can belong to a section.
		 * If it's a global property, the section is set to null.
		 * If **undefined** is returned, the property will be removed from the final object, otherwise the returned value will be used as the property value.
		 *
		 * If the key and the value are set to null, then it's a section line.
		 * If it returns a falsy value, it won't be added to the final object, the entire section _including all the properties_ will be discarded.
		 * If it returns a truthy value, the section is parsed.
		 *
		 * For your convenience, to know whether the line is a property or section you can access to `this.isProperty` and `this.isSection` from inside the replacer function.
		 * Also, `this.assert()` can be used to return the default value, the unmodified value that will be used to parse the line.
		 *
		 * Look at the reviver example for further details.
		 * @link https://github.com/gagle/node-properties/blob/master/examples/reviver/reviver.js
		 */
		reviver?: (this: Context, key: any, value: any) => any;
	}

	export interface Context {
		assert(): any;
	}

	/**
	 * Parses a .properties string.
	 *
	 * @param data
	 * @param options
	 */
	export function parse(data: string, options?: ParseOptions): object;

	/**
	 * Parses a .properties string.
	 *
	 * If a callback is given, the result is returned as the second parameter. Some options will require a callback.
	 *
	 * @param data
	 * @param options
	 * @param cb
	 */
	export function parse(data: string, options: ParseOptions | undefined, cb: (err: any, result: { [key: string]: unknown } | undefined) => void): void;

	export interface StringifyOptions {
		/**
		 * By default `stringify()` returns a string.
		 * If you want to write it to a file, use this option and pass the path of a file.
		 * If this option is used, the callback is mandatory.
		 * It gets two parameters, a possible error and the string.
		 */
		path?: string;

		/**
		 * The token to use to write comments.
		 * It must be a single printable non-whitespace ascii character.
		 * @default `#`
		 */
		comment?: string;

		/**
		 * The token to use to separate keys from values.
		 * It must be a single printable non-whitespace ascii character.
		 * @default `=`
		 */
		separator?: string;

		/**
		 * The .properties specification uses iso 8859-1 (latin-1) as a default encoding.
		 * In the other hand, Node.js has a utf8 default encoding.
		 * This means that if you want a full compatibility with Java, that is, you are generating a .properties file that is going to be read by a Java program, then set this option to true.
		 * This will encode all ascii extended and multibyte characters to their unicode string representation (`\uXXXX`).
		 *
		 * Non-printable control codes (control sets 0 and 1) are always encoded as unicode strings except `\t`, `\n`, `\f` and `\r`.
		 *
		 * If you are in a platform that can handle utf8 strings, e.g. Node.js, you don't need to use this option.
		 */
		unicode?: boolean;

		/**
		 * Each property or section can be removed or modified from the final string.
		 * It's similar to the replacer of the `JSON.stringify()` function.
		 *
		 * The replacer it's exatcly the same as the reviver from `parse()`.
		 * The same function can be reused.
		 *
		 * The callback gets three parameters: key, value and section.
		 *
		 * A property has a key and a value and can belong to a section.
		 * If it's a global property, the section is set to null.
		 * If **undefined** is returned, the property won't be stringified, otherwise the returned value will be used as the property value.
		 *
		 * If the key and the value are set to null, then it's a section line.
		 * If it returns a falsy value, it won't be added to the final string, the entire section _including all the properties_ will be discarded.
		 * If it returns a truthy value, the section is stringified.
		 *
		 * For your convenience, to know whether the line is a property or section you can access to `this.isProperty` and `this.isSection` from inside the replacer function.
		 * Also, `this.assert()` can be used to return the default value, the unmodified value that will be used to stringify the line.
		 *
		 * Look at the replacer example for further details.
		 * @link https://github.com/gagle/node-properties/blob/master/examples/replacer.js
		 */
		replacer?: (this: Context, key: string, value: any) => any;
	}

	/**
	 * Stringifies an `object` or a `Stringifier`.
	 *
	 * If you don't need to add sections or comments simply pass an object, otherwise use a `Stringifier`.
	 *
	 * @param obj
	 * @param options
	 */
	export function stringify(obj: object, options?: StringifyOptions): string;

	/**
	 * Stringifies an `object` or a `Stringifier`.
	 *
	 * If you don't need to add sections or comments simply pass an object, otherwise use a `Stringifier`.
	 *
	 * The callback is only necessary when the `path` option is used.
	 *
	 * @param obj
	 * @param options
	 * @param cb
	 */
	export function stringify(obj: object, options: StringifyOptions | undefined, cb: (err: any, result: string) => void): void;

	/**
	 * This class is used when you want to add sections or comments to the final string.
	 *
	 * To create a Stringifier use the `createStringifier()` function.
	 *
	 * Look at the stringify-ini example for further details.
	 * @link https://github.com/gagle/node-properties/blob/master/examples/ini/stringify-ini.js
	 */
	export interface Stringifier {
		/**
		 * Writes a header comment.
		 * It will be written to the top of the final string.
		 * Returns the Stringifier being used.
		 */
		header(comment: string): this;

		/**
		 * Writes a property line.
		 * It takes an object with three options: `key`, `value` and comment.
		 * Both the key and the value are converted into a string automatically.
		 * Returns the Stringifier being used.
		 */
		property(obj: { key?: any; value?: any; comment?: string }): this;

		/**
		 * Writes a section line.
		 * It gets an object with two options: `name` and `comment`.
		 * The name is converted into a string.
		 * If you don't need to write a comment, you can pass the name instead of an object.
		 * Returns the stringifier being used.
		 */
		section(obj: string | { name: string; comment?: string }): this;
	}

	/**
	 * Returns a new `Stringifier` instance.
	 */
	export function createStringifier(): Stringifier;
}