test:
	npm test

install:
	npm install

lint:
	npx eslint .

test-coverage:
	npm test -- --coverage --coverageProvider=v8
	
publish:
	npm publish --dry-run