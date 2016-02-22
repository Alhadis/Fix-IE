# I/O, respectively
SRC  := src
DEST := dist/ie.lteIE9.js


.SILENT: $(DEST)
.ONESHELL:

all: truncate $(DEST)

# Delete the stuff we made
clean:
	@rm -f $(DEST)

# Truncate the target file. Useful to maintain hard-links.
truncate:
	@printf '' > $(DEST)


.PHONY: clean truncate $(DEST)


#===============================================================================

# Compress a JavaScript resource and write the result to DEST
define minify
	$(foreach js,$(1),uglifyjs -c --mangle < $(SRC)/$(js) >> $(DEST);)
endef


# Add a file to the compiled result, preceded by a heading
define add
	$(if $(1),echo "" >> $(DEST); echo '/** $(1) */' >> $(DEST);)
	$(call minify,$(2))
endef


# Concatenate each source file with a preceding heading.
#
# They're connected this way to allow unwanted pieces to be removed in the final file.
# version-flags.js is also included uncompressed to aide extension/modification, if need be.
#
# Yes, this is done in a strange, arbitrary manner. But I've worked with this file for years,
# and have kinda grown too attached to the way it's ordered and formatted. Sorry. :(
#
$(DEST):
	# HTML5 shiv
	xargs -0 < src/html5-shiv.js printf %s > $@; echo "" >> $@;
	exit;
	
	$(call add,add/removeEventListener,IE8-addEventListener.js)
	
	# DOMTokenList
	$(call add,DOMTokenList,token-list.js)
	
	# getComputedStyle
	$(call add,getComputedStyle,IE8-getComputedStyle.js)
	
	# Various methods too trivial to warrant their own files
	echo "" >> $@
	$(call add,ECMAScript5,es5-forEach.js es5-filter.js)
	cat $(SRC)/es5-methods.js >> $@
	
	# Version flagging
	echo "\n" >> $@
	cat $(SRC)/version-flags.js >> $@
	
	# IE8PP
	echo "" >> $@
	$(call add,Object.defineProperty patch,IE8-defineProperty.js)
	
	# Various element-related properties
	echo "" >> $@
	$(call add,$(EL_PROPS),IE8-child-elements.js)
	$(call add,$(OFFSETS),IE8-offsets.js)
	
	# ChildNode.remove
	$(call add,ChildNode.remove,remove.js)
	
	# Node.textContent
	$(call add,Node.textContent,text-content.js)


# Headings with commas, which would be interpreted by Make as argument delimiters
# See also: http://www.gnu.org/software/make/manual/make.html#Function-Call-Syntax
EL_PROPS := childElementCount, firstElementChild, lastElementChild, nextElementSibling, previousElementSibling
OFFSETS  := window{ pageXOffset, pageYOffset, innerWidth, innerHeight }, event{ pageX, pageY }
