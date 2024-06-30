module.exports = {
	roots: ['<rootDir>/src'],
	transform: {
		'^.+\\.[t|j]sx?$': 'babel-jest',
	},
	testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	collectCoverage: true,
	coverageReporters: ['json', 'lcov', 'text', 'clover'],
	moduleNameMapper: {
		'\\.(css|less|scss|sass)$': '<rootDir>/styleMock.js',
	},
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
};