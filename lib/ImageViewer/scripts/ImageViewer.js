
MTO.ImageViewer = function(imageList){
	this.imageList = imageList;
	YDOM = YAHOO.util.Dom;
		// create the <div> to hold the popout box details
	this.DOM = document.createElement("div");
	this.DOM.className = "popupEnclose";

	// grab the popout box *.xml file, with the popout template
	// and attach to the popupEnclose
	this.DOM.innerHTML = loadContent("./lib/ImageViewer/ImageViewer.xml");
	// The 2nd div for popout.xml is the div we want as the panel
	// (classname for this div is "popout", first <div> child of "popoutBox",
	//  which is first <div> of this.DOM.innerHTML, the popout.xml file) 
	var divs = this.DOM.getElementsByTagName("div");
	this.bigImg = this.DOM.getElementsByTagName("img").item(0);
	YDOM.generateId(this.bigImg,"bigImg");
	this.shortCaption = this.bigImg.parentNode.nextSibling;
	YDOM.generateId(this.shortCaption,"sCaption");
	this.DOM = divs.item(0);
	YDOM.generateId(this.DOM,"imageViewer");
	this.imageRoll = this.DOM.getElementsByTagName("ul").item(0);
	YDOM.generateId(this.imageRoll,"iRoll");
	var nextprev = this.DOM.getElementsByTagName("p").item(1);
	this.nextButton = nextprev.getElementsByTagName('a').item(1);
	YDOM.generateId(this.nextButton,"next");
	this.prevButton = nextprev.getElementsByTagName('a').item(0);
	YDOM.generateId(this.prevButton,"prev");
	this.curImage =0;
	
	
}

MTO.ImageViewer.prototype = {

init: function(){
	var ir = document.getElementById(this.imageRoll.id);

	for (var i=0;i<this.imageList.length;i++){
		
		imgli = document.createElement("li");
		YAHOO.util.Dom.generateId(imgli,'img'+i+"_");
		
		img = document.createElement('img');
		img.src=this.imageList[i]["fn"];
	 	caption = this.imageList[i]["label"];
		imgli.appendChild(img);
		
		ir.appendChild(imgli);
		caption = caption.replace(/\n/g," ");
		caption = caption.replace(/\"/g,"&quot;");
		caption = caption.replace(/\'/g,"&apos;");
		imgli.setAttribute("onclick","MTO.imageSelected(\""+img.src+"\",\""+caption+"\",\""+this.shortCaption.id+"\",\""+this.bigImg.id+"\")");
		
		this.showBigImg(0);
	}
	var nb = document.getElementById(this.nextButton.id);
	YAHOO.util.Event.addListener(nb,"click",function(e,obj){
		
			obj.nextImg();
		},this);
	var pb = document.getElementById(this.prevButton.id);
	YAHOO.util.Event.addListener(pb,"click",function(e,obj){
		
			obj.prevImg();
		},this);
	//YAHOO.util.Dom.setStyle(['test', 'test2'], 'opacity', 0.5); 
},
showBigImg: function(num){
	this.curImage = num;
	var src=this.imageList[num]["fn"];
	var caption = this.imageList[num]["label"];
	var sc = document.getElementById(this.shortCaption.id);
	var bi = document.getElementById(this.bigImg.id);
	sc.innerHTML = caption; 
	bi.src = src;
},
nextImg: function(){
	this.curImage++;
	
	
	if (this.curImage>(this.imageList.length-1)){
		this.curImage=0;
	}
	this.showBigImg(this.curImage);
},
prevImg: function(){
	this.curImage--;
	
	
	if (this.curImage<0){
		
	this.curImage = this.imageList.length-1;
	
	}
	this.showBigImg(this.curImage);
}

	}
MTO.imageSelected = function(src,label,caption,bigImg){
	var c = document.getElementById(caption);
	var bi = document.getElementById(bigImg);
	c.innerHTML = label; 
	bi.src = src;
}