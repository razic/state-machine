build: components index.js
	@component build --dev

components: component.json
	@component install --dev

lint: index.js test
	@jshint index.js test

clean:
	rm -fr build components template.js

.PHONY: clean
