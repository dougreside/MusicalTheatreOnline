OrderedImageViewer = function(){

	this.DOM = document.createElement("div");
	this.DOM.innerHTML = loadContent("./lib/OrderedImageViewer/OrderedImageViewer.xml");
	var divs = this.DOM.getElementsByTagName("div");
    this.DOM = divs.item(0);
	var DOMDivs = this.DOM.getElementsByTagName("DIV");
	this.controls = DOMDivs[0];
	var cSpans = this.controls.getElementsByTagName("span");
	this.content = DOMDivs[1];
	this.curImage = 0;
	this.images = [];
	this.manifest = new XMLObj();
}
 
OrderedImageViewer.prototype = {
	loadImages: function(manifest){
		var xml = this.manifest.loadXMLFromFile(manifest);
        this.images = xml.getElementsByTagName("url");
	},
	showImage: function(){
		curSrc = this.images[this.curImage].firstChild.nodeValue;
		this.DOM = document.getElementById(this.DOM.id);
		var allDivs = this.DOM.getElementsByTagName("div"); 
		var content = allDivs[1];
		allDivs[0].getElementsByTagName("span")[1].innerHTML=this.curImage+1;
		allDivs[2].getElementsByTagName("span")[1].innerHTML=this.curImage+1;
		content.innerHTML="<img width=765 class='OIV_image' src='"+curSrc+"'/>";		
	},
	next: function(){

		
		if (this.curImage < this.images.length) {
			this.curImage++;
			this.showImage();
		}		
	},
	prev: function(){
			if (this.curImage > 0) {
			this.curImage--;
			this.showImage();
		}		
	}
}
