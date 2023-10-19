module.exports = {
	root: true,
	parser: '@babel/eslint-parser',
	parserOptions: {
		requireConfigFile: false
	},
	extends: ['eslint:recommended', 'plugin:prettier/recommended'],
	plugins: ['prettier', 'import'],
	rules: {
		'prettier/prettier': 'error',
		'no-console': 'warn', // Disallow the use of console.log and console.error
		'no-unused-vars': 'error', // Warn about unused variables
		'no-undef': 'off',
		'no-trailing-spaces': 'error', // Disallow trailing whitespace at the end of lines
		'arrow-spacing': 'error', // Enforce consistent spacing before and after arrow functions
		'object-curly-spacing': ['error', 'always'], // Enforce consistent spacing inside braces of object literals
		'array-bracket-spacing': ['error', 'never'], // Disallow spacing inside array brackets
		'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }], // Disallow multiple empty lines
		'no-var': 'error', // Require using let or const instead of var
		'prefer-const': 'error', // Require using const for variables that are not reassigned
		'no-extra-semi': 'error', // Disallow unnecessary semicolons
		'no-extra-parens': 'error', // Disallow unnecessary parentheses
		'no-multi-spaces': 'error', // Disallow multiple spaces
		'import/no-extraneous-dependencies': 'off',
		'max-len': 'off',
		'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
		'no-underscore-dangle': 'off',
		'import/no-relative-parent-imports': 'error'
	}
};
