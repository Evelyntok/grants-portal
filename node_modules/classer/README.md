# classer

## Install
```sh
$ npm i classer
```

## Use

### my-class.js:

```js
/**
* private static:
**/
const H_LOOKUP = {
	a: 'arnold',
	b: 'batman',	
};

/**
* class:
**/
const local = classer('MyClass', (h_config) => {
	
	/**
	* private fields:
	**/
	let {
		name: s_name,
		limit: n_limit,
	} = h_config;

	/**
	* private methods:
	**/
	const run_task = () => {
		n_limit += 1;
	};

	/**
	* public:
	**/
	return classer.operator(function() {
		return 'hi! I am '+s_name;
	}, {
		org: 2,

		getName() {
			return s_name;
		},

		change() {
			run_task();
		},
	};
},
	/**
	* public static:
	**/
	{
	
	help: () => {
		return 'help yourself';
	},
});

// exports
export default local;
```

### index.js:
```js
import MyClass from './my-class.js';

let instance = MyClass({name: 'cartman', limit: 5});
instance(); // 'hi! I am cartman'
instance.getName(); // 'cartman'
MyClass.help(); // 'help yourself'
```