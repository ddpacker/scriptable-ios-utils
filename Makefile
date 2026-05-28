DIST_DIR = dist
SRC_DIRS = src

deploy:
	rm -rf $(DIST_DIR)
	mkdir -p $(DIST_DIR)
	find $(SRC_DIRS) -name "*.js" -exec cp {} $(DIST_DIR) \;