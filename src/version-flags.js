/** Store "constants" on the window object to flag specific versions of Explorer. */
(function(){
	var i      = 6,
	WIN        = window,
	DOC        = document,
	IE_VERSION = "IE_VERSION";
	
	function is(v){
		var div = DOC.createElement("div");
		div.innerHTML = "<!--[if " + v + "]><i></i><![endif]-->";
		return div.getElementsByTagName("i").length;
	}
	
	for(; i < 10; ++i) if(is("IE " + i))
		WIN["IS_IE" + i ] = true,
		WIN[ IE_VERSION ] = i;

	is("IEMobile") && (WIN.IS_IEMobile = true);
	
	/** Might as well flag the root element with CSS classes while we're here. */
	DOC.documentElement.classList.add("ie", "ie"+WIN[ IE_VERSION ]);
}());
