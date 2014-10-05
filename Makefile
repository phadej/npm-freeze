all : test

.PHONY : all test jshint mocha istanbul david npm-freeze dist

BINDIR=node_modules/.bin

MOCHA=$(BINDIR)/_mocha
ISTANBUL=$(BINDIR)/istanbul
JSHINT=$(BINDIR)/jshint
JSCS=$(BINDIR)/jscs
DAVID=$(BINDIR)/david
NPMFREEZE=node bin/npm-freeze.js

SRC=bin/npm-freeze.js lib/npm-freeze.js test/npm-freeze.js

test : jshint jscs mocha istanbul david npm-freeze

jshint :
	$(JSHINT) $(SRC)

jscs :
	$(JSCS) $(SRC)

mocha : 
	$(MOCHA) --reporter=spec test

istanbul :
	$(ISTANBUL) cover $(MOCHA) test
	$(ISTANBUL) check-coverage --statements 100 --branches 100 --functions 100 --lines 100

david :
	$(DAVID)

npm-freeze:
	$(NPMFREEZE) check || true

dist : test
	git clean -fdx -e node_modules
