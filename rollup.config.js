import typescript from 'rollup-plugin-typescript2'
import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'

export default [
	// ES Modules
	{
		input: 'src/index.ts',
		output: {
			file: 'es/index.js',
			format: 'es',
		},
		plugins: [
			typescript(),
			babel({babelHelpers: "bundled", extensions: ['.ts']}),
		],
	},

	// UMD
	{
		input: 'src/index.ts',
		output: {
			file: 'dist/index.js',
			format: 'umd',
			name: 'Countdown',
			indent: false,
		},
		plugins: [
			typescript(),
			babel({babelHelpers: "bundled", extensions: ['.ts'], exclude: 'node_modules/**'}),
			terser(),
		],
	},
]
