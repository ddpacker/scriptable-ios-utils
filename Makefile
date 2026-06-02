DIST_DIR = dist
SRC_DIRS = src

deploy:
	rm -rf $(DIST_DIR)
	mkdir -p $(DIST_DIR)
	find $(SRC_DIRS) -name "*.js" ! -path "*/lib/types/*" | while read f; do \
		sed '/^\s*\/\*/d; /^\s*\*/d' "$$f" > "$(DIST_DIR)/$$(basename $$f)"; \
	done