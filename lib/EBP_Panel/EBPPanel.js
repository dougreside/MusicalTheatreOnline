//--------------EBPPanel--------------------------------------------
//  panel.js 
//  Last modified by gdickie @ 10/15/08
//
//	Panel
//  A generic draggable Panel, composed of three parts:
//  header, content, and footer.
//	Extends Panel.js
//
//--------------------------------------------------------------


Panel = function(){

	this.constructor.superclass.constructor.call(this); 

	
	this.objects=new Array();
	
	this.desktopCall=new YAHOO.util.CustomEvent("desktopCall");
	this.ajaxFire=new YAHOO.util.CustomEvent("ajaxFire");
	this.panelClicked=new YAHOO.util.CustomEvent("panelClicked");
		YAHOO.util.Event.addListener(this.HTML,"click",this.handleClick,this);				

	
	YAHOO.util.Event.onAvailable(this.HTML.id, this.makePanelResize, this);
}
YAHOO.lang.extend(EBP.panel,Panel);

EBP.panel.prototype.recreate=function(args){
	panel=args.panel;
	
	//id=args.id;
	panel.id=args.id;
	
	panel.HTML.id=args.id;
	
	panel.curPage=panel.desktop.ajax.phpCall('./php/EBPlogin/setPage.php', '?mode=current&panel='+panel.id, 'GET');
	panel.project=args.project;
	YAHOO.util.Event.onAvailable(panel.HTML.id, panel.makePanelResize, panel);
	
	//panel.makeResize(panel);
}


EBP.panel.prototype.close = function(e,obj){
	//obj.panelClosed.fire(obj.id);
	obj.desktop.removeListenCall(obj, obj.objects, obj.desktop);
	obj.desktopCall.fire({obj: [obj.desktop], callback: ["obj.closeCurrPanel"], type: "panelClosed", data: {panel: panel}});
	obj.HTML.parentNode.removeChild(obj.HTML);
	
	
}
EBP.panel.prototype.dropMenu = function(e,panel){
	if(panel.dropdown==null) {
		panel.dropdown =  new EBP.dropdown(panel);
		
	} else if(panel.dropdown.HTML.style.display == "none"){
		panel.dropdown.HTML.style.display = "inline";
	} else {
		panel.dropdown.HTML.style.display = "none";
		//panel.dropdown.umen.cfg.setProperty("visible", false);
		
	}
}

EBP.panel.prototype.transSlider = function(e,panel){
	panel.slider.appear(panel.slider);
	    
}
EBP.panel.prototype.showText = function(e, panel){
	
	
if (panel.mode=="image") {
		/*if (panel.content.HTML.firstChild.nodeName.toLowerCase() == "img") {
			if (panel.idarray[panel.curPage]) { //*
				
				pageid = panel.idarray[panel.curPage];
			}
*/
			panel.desktopCall.fire({obj: [panel.zoom], callback: ["obj.dissappear"], type: "zoomToggle", data: panel.zoom});
			panel.image.HTML.style.display="none";
			panel.pageText.HTML.style.display="block";
			panel.mode = "text";
			
			//pageTop = getElementWithAttValue(panel.xml, "div", "class", "pb"); //*
			
			
			
			
			/*while ((nextEle.nodeName == "div") ) { //*
				if (nextEle.nodeName.toLowerCase() == "#text") { //*
				
					thistxt = nextEle.nodeValue; //*
				} else {
					thistxt = "";
				}
				txt = txt + thistxt;
				if (nextEle.firstChild) {
					nextEle = nextEle.firstChild;
				}
				else if (nextEle.nextSibling) {
						nextEle = nextEle.nextSibling;
					}
					else if(nextEle.parentNode.nextSibling){
						nextEle = nextEle.parentNode.nextSibling;
					}
					else{
						return null;
					}
				
			}*/
			//phpparam = '?file=hamw.xml&pid=' + panel.idarray[panel.curPage];
			
			//clearCoords(panel);
			//panel.zoom.removeImg(panel.zoom);
			
			
			
			/*
txtDiv = document.createElement("div");
			txtDiv.className = "txtDiv";
			txtDiv.style.height = "500px";
*/
			
			//YAHOO.util.Event.addListener(txtDiv, "mouseover", panel.scrollOn, txtDiv, true);
			//YAHOO.util.Event.addListener(txtDiv, "mouseout", panel.scrollOff, txtDiv, true);
			//YAHOO.util.Event.addListener(txtDiv, "mousedown", panel.hiLite, txtDiv, true);
//			//YAHOO.util.Event.addListener(txtDiv, "mouseup", panel.annotate, {panel: panel, obj: txtDiv}, true);
			//txtDiv.style.backgroundColor = "#645B54";
				//load new text elements - Grant D
		
			//page = (panel.curPage == 1 || panel.curPage == 0) ? 0 : (panel.curPage-1);	
			//pparams = "?page=" + panel.idarray[page];
			
			//panel.pageText.retrieveContent('GET', './php/retrieveHTML.php', pparams);
			//panel.content.HTML.appendChild(panel.pageText.HTML);
			/*
panel.ajaxFire.fire({
				file: './php/retrieveHTML.php',
				params: pparams,
				method: 'GET'
			});
*/
			//panel.ctxt = txtstrng;
				
			
			//if(!panel.ctxt) {panel.ctxt = "<div class=\"TEI\"><div class=\"pb\"></div><div class=\"pb\"></div></div>";}
			//txtDiv.innerHTML = panel.ctxt;
			
			//phpCall('./php/calls.php',phpparam,'GET');
			//alert(txtDiv.innerHTML);
			//panel.content.HTML.appendChild(txtDiv);
			
		}
		else {
		
			//panel.showPage(panel.curPage);
			panel.mode="image";
			panel.pageText.HTML.style.display="none";
			panel.image.HTML.style.display="block";
			
			//if(panel.zoom.zoomOn) {panel.zoom.attachImg(panel.zoom);}
		}
		panel.showPage(e, panel.curPage, panel);
		//panel.turnPage.fire(panel.curPage);
	}
	

EBP.panel.prototype.hiLite=function(e, obj) {
	
}
EBP.panel.prototype.annotate=function(e, args) {
	panel = args.panel;
	txtDiv = args.obj;
	dx = YAHOO.util.Event.getPageX(e) + 100;
	dy = YAHOO.util.Event.getPageY(e) + 100;
	
	obj = new EBP.textTag({panel: panel, obj: txtDiv, dx: dx, dy: dy});
}
EBP.panel.prototype.transparency = function(e, pass, args){
	
	pan = args.HTML;
	percent = pass[0].data/90;
	percent = 1-percent;

	pan.style.filter = "alpha(opacity="+percent*100+");"
	// + ((o - .1) * 100) + ")";
	pan.style.opacity = percent;
	//parseInt(o) - .1;
	
	
	
}
//-----------Zoom----------------------
EBP.panel.prototype.zoomIn = function(e, panel){
	objs=(panel.curArea) ? [panel.image, panel.curArea] : [panel.image];
	callbacks=(panel.curArea) ? ["obj.zoomIn", "obj.zoom"] : ["obj.zoomIn"];
	panel.desktopCall.fire({
		obj: objs,
		type: "zoomedIn",
		callback: callbacks,
		data: {
			scale: 2
		}
	});
	//panel.zoomedIn.fire({scale: 2});
	/*
obj = thing.content.HTML;
	if (thing.mode == 'image') {
		if (obj.firstChild) {
		
			zObj = obj.firstChild;
			newW = (parseInt(YAHOO.util.Dom.getStyle(zObj, "width")) * 2);
			
			newH = (parseInt(YAHOO.util.Dom.getStyle(zObj, "height")) * 2);
			
			YAHOO.util.Dom.setStyle(zObj, "width", newW + "px");
			YAHOO.util.Dom.setStyle(zObj, "height", newH + "px");
			
		}
		//resize box elements
		for (b in thing.image.imageRegions) {
			box = thing.image.imageRegions[b];
			bimage = document.getElementById(thing.image.id);
			bimageW = parseInt(YAHOO.util.Dom.getStyle(bimage, "width"));
			bimageWOld = bimageW / 2;
			ratio = bimageW / bimageWOld;
			
			
			bW = (parseInt(YAHOO.util.Dom.getStyle(box.HTML, "width")) * 2);
			bH = (parseInt(YAHOO.util.Dom.getStyle(box.HTML, "height")) * 2);
			YAHOO.util.Dom.setStyle(box.HTML, "width", bW + "px");
			YAHOO.util.Dom.setStyle(box.HTML, "height", bH + "px");
			bTop = YAHOO.util.Dom.getStyle(box.HTML, "top");
			bLeft = YAHOO.util.Dom.getStyle(box.HTML, "left");
			bTop = parseInt(bTop) * 2;
			bLeft = parseInt(bLeft) * 2;
			
			
			YAHOO.util.Dom.setStyle(box.HTML, "left", bLeft + "px");
			YAHOO.util.Dom.setStyle(box.HTML, "top", bTop + "px");
			arr = {ulx: box.HTML.style.left, uly: box.HTML.style.top, lrx: box.HTML.style.width, lry: box.HTML.style.height};
			if (thing.project > 0) {
				getCoords(thing.image, 'overwrite', 'poly', node.nodes);
			}
		}
		
		
		node = null;
		line = null;
		//resize nodes
		
		
for (n in thing.image.areas) {
			node = thing.image.areas[n];
			
			for (l in node.lines) {
				node.lines[l].remove();
				
			}
			lastDot = null;
			child = null;
			
			for (f in node.nodes) {
				child = node.nodes[f];
				newx = (parseInt(child.dot.HTML.style.left) * thing.image.HTML.width) / ((thing.image.HTML.width) / 2);
				
				newy = (parseInt(child.dot.HTML.style.top) * thing.image.HTML.height) / ((thing.image.HTML.height) / 2);
				
				//newx = Math.ceil((parseInt(child.dot.HTML.style.left)*2));
				//newy = Math.ceil((parseInt(child.dot.HTML.style.top)*2));
				
				
				
				child.dot.HTML.style.left = newx + "px";
				child.dot.HTML.style.top = newy + "px";
				
				child.dot.x = parseInt(YAHOO.util.Dom.getX(child.dot.HTML.id));
				child.dot.y = parseInt(YAHOO.util.Dom.getY(child.dot.HTML.id));
				if (lastDot) {
					//parseInt(lastDot.dot.x); parseInt(lastDot.dot.y); parseInt(child.dot.x); parseInt(child.dot.y);
					line = new EBP.line(thing.image, parseInt(lastDot.dot.x), parseInt(lastDot.dot.y), parseInt(child.dot.x), parseInt(child.dot.y));
					line.drawLine();
					node.lines.push(line);
				}
				lastDot = child;
				
			}
			//parseInt(node.nodes[0].dot.x); parseInt(node.nodes[0].dot.y); parseInt(node.nodes[0].dot.x); parseInt(node.nodes[0].dot.y); 
			line = new EBP.line(thing.image, parseInt(node.nodes[0].dot.x), parseInt(node.nodes[0].dot.y), parseInt(child.dot.x), parseInt(child.dot.y));
			line.drawLine();
			node.lines.push(line);
			
			if (thing.project > 0) {
				getCoords(thing.image, 'overwrite', 'poly', node.nodes);
			}
		}

	} else {
		alert(obj.firstChild.style.backgroundColor);
	}
*/
	
}
		
EBP.panel.prototype.zoomOut = function(e, panel){
	objs=(panel.curArea) ? [panel.image, panel.curArea] : [panel.image];
	callbacks=(panel.curArea) ? ["obj.zoomOut", "obj.zoom"] : ["obj.zoomOut"];
	panel.desktopCall.fire({
		obj: objs,
		type: "zoomedOut",
		callback: callbacks,
		data: {
			scale: 2
		}
	});
	//panel.zoomedOut.fire({scale: 2});
	/*
	obj = thing.content.HTML;
	
if (thing.mode == 'image') {
		if (obj.firstChild) {
			zObj = obj.firstChild;
			newW = (parseInt(YAHOO.util.Dom.getStyle(zObj, "width")) / 2);
			
			newH = (parseInt(YAHOO.util.Dom.getStyle(zObj, "height")) / 2);
			
			YAHOO.util.Dom.setStyle(zObj, "width", newW + "px");
			YAHOO.util.Dom.setStyle(zObj, "height", newH + "px");
		}
		//resize box elements
		
		for (b in thing.image.imageRegions) {
			box = thing.image.imageRegions[b];
			
			bimage = document.getElementById(thing.image.id);
			bimageW = YAHOO.util.Dom.getStyle(bimage, "width");
			bimageWOld = bimageW / 2;
			
			bW = (parseInt(YAHOO.util.Dom.getStyle(box.HTML, "width")) / 2);
			bH = (parseInt(YAHOO.util.Dom.getStyle(box.HTML, "height")) / 2);
			YAHOO.util.Dom.setStyle(box.HTML, "width", bW + "px");
			YAHOO.util.Dom.setStyle(box.HTML, "height", bH + "px");
			bTop = YAHOO.util.Dom.getStyle(box.HTML, "top");
			bLeft = YAHOO.util.Dom.getStyle(box.HTML, "left");
			bTop = parseInt(bTop) / 2;
			bLeft = parseInt(bLeft) / 2;
			
			YAHOO.util.Dom.setStyle(box.HTML, "left", bLeft + "px");
			YAHOO.util.Dom.setStyle(box.HTML, "top", bTop + "px");
			
			arr = {ulx: box.HTML.style.left, uly: box.HTML.style.top, lrx: box.HTML.style.width, lry: box.HTML.style.height};
			if (thing.project > 0) {
				getCoords(thing.image, 'overwrite', 'poly', node.nodes);
			}
		}
		
		//resize nodes
		
		node = null;
		for (n in thing.image.areas) {
			node = thing.image.areas[n];
			//node.dot.x = (node.dot.x)/2;
			//node.dot.y = (node.dot.y)/2;
			for (l in node.lines) {
				lin = node.lines[l].remove();
				
			}
			lastDot = null;
			child = null;
			
			for (f in node.nodes) {
				child = node.nodes[f];
				
				newx = (parseInt(child.dot.HTML.style.left) * thing.image.HTML.width) / ((thing.image.HTML.width) * 2);
				
				newy = (parseInt(child.dot.HTML.style.top) * thing.image.HTML.height) / ((thing.image.HTML.height) * 2);
				
				
				child.dot.HTML.style.left = newx + "px";
				child.dot.HTML.style.top = newy + "px";
				child.dot.x = parseInt(YAHOO.util.Dom.getX(child.dot.HTML.id));
				child.dot.y = parseInt(YAHOO.util.Dom.getY(child.dot.HTML.id));
				if (lastDot) {
					//parseInt(lastDot.dot.x); parseInt(lastDot.dot.y); parseInt(child.dot.x); parseInt(child.dot.y); 
					line = new EBP.line(thing.image, parseInt(lastDot.dot.x), parseInt(lastDot.dot.y), parseInt(child.dot.x), parseInt(child.dot.y));
					line.drawLine();
					node.lines.push(line);
				}
				lastDot = child;
			}
			//parseInt(node.nodes[0].dot.x); parseInt(node.nodes[0].dot.y); parseInt(child.dot.x); parseInt(child.dot.y); 
			line = new EBP.line(thing.image, parseInt(node.nodes[0].dot.x), parseInt(node.nodes[0].dot.y), parseInt(child.dot.x), parseInt(child.dot.y));
			line.drawLine();
			node.lines.push(line);
			if (thing.project > 0) {
				getCoords(thing.image, 'overwrite', 'poly', node.nodes);
			}
		}
	} else {
		
		obj.firstChild.style.fontSize = obj.firstChild.style.fontSize - 1;
		
	}
*/
}
EBP.panel.prototype.clearContents= function(){
	contentDiv = this.content.HTML;
	kids = contentDiv.childNodes;
	if (kids){}
	for (i=0;i<kids.length;i++){
		contentDiv.removeChild(kids[i]);
	}
	
}
EBP.panel.prototype.addImage = function(src, obj){
	
	obj.image = new Image();
	
	//obj.setPath.subscribe(obj.image.change, obj.image);
	//add image listeners
	//obj.zoomedIn.subscribe(obj.image.zoomIn, obj.image);
	//obj.zoomedOut.subscribe(obj.image.zoomOut, obj.image);
	//obj.setPath.fire(src);
	
	
	obj.setContent(obj.image.HTML);
	panel.desktopCall.fire({obj: [obj.image], callback: ["obj.change"], type: "setPath", data: src});
	
	//set up zoom window for image
	obj.zoom=new Zoom(obj.image.id);
	obj.content.HTML.appendChild(obj.zoom.HTML);
	
	//obj.setPath.subscribe(obj.zoom.changeImage, obj.zoom);
	
}
EBP.panel.prototype.setContent = function(contentObj){
  
	this.clearContents();
	
	this.content.HTML.appendChild(contentObj);
	
   YAHOO.util.Event.onAvailable(contentObj,this.adjustContentSize());
	
		
	
	
}
EBP.panel.prototype.adjustContentSize = function(){

	contentObj = this.content.HTML.firstChild;
	
	YAHOO.util.Dom.setStyle(contentObj,"width",YAHOO.util.Dom.getStyle(this.HTML,"width"));
	/*height = parseInt(YAHOO.util.Dom.getStyle(contentObj,"height"))+"px";

	YAHOO.util.Dom.setStyle(this.content.HTML,"height",height);*/
}
/*
EBP.panel.prototype.loadOldWindows=function() {
	
	//project = phpCall('./php/EBPlogin/getProjects.php', '/?mode=current','GET');
				if (this.project != 0) {
					wstring = phpCall('./php/EBPlogin/loadWindows.php', '', 'GET');
					if (wstring != "empty") {
						warray = wstring.split(';');
						
						//for(i=0;i<length; i++) {
						
						for (g = 0; g < warray.length; g++) {
							record = warray[g];
							temp = record.split('-');
							
							
							tempWin = new EBP.panel({
								desktop: this.desktop,
								content: "",
								loc: "workspace",
								project: this.project,
								id: temp[1]
							});
							
							tempWin.addImage('./hamletu/ham-1611-22277-bod-001.jpg', tempWin);
							n = parseInt(temp[2]);
							tempWin.showPage(n);
							EBP.panelClicked.fire({
								panel: tempWin,
								workspace: this.desktop
							});
						}
						
						
					}
						
		
				} else {
					this.loadXML();
				}
				
}
*/
EBP.panel.prototype.loadXML = function(panel){
	
			if (panel.project != 0) {
					phpparam = '?mode=new&curPage=' + panel.curPage + '&wxy=' +
					YAHOO.util.Dom.getXY(panel.id) +
					'&panel=' +
					panel.id;
					
					panel.desktop.ajax.phpCall('./php/EBPlogin/startUpWindow.php', phpparam, 'GET');
					
				}
				
				
				//n = parseInt(panel.curPage);
				
				//panel.dropdown.change(this, n);
				
				
				//Clear Previous Coordinates
				//clearCoords(panel);
				
				if (panel.project != 0) {
					panel.reloadCoords();
				}
				/*
args=new Array();
				args[0]={panel: this, num: panel.curPage};
*/
				//panel.dropdown=new DropDown(panel.idarray.length, panel.curPage);
			
				//panel.setPath.fire('./hamletu/ham-1611-22277-001.jpg');
				
				//this.showPage("click", args);
				/*
				this.showPage(this.curPage);
				
				get initial page 
				phpparam = '?page=' + this.idarray[this.curPage];
				
				xmlstring = phpCall('./php/retrieveHTML.php',phpparam,'GET');
				
				this.xml = (new DOMParser()).parseFromString(xmlstring, "text/xml");
				
				
				
				this.pages = this.xml.getElementsByTagName("pb");
				
				if(!(document.getElementById("pageSelect"))){
				pageSelect = document.createElement("select");
				pageSelect.id="pageSelect";
				for (i=0;i<pages.length;i++){
					
					opt = document.createElement("option");
					opt.value = pages[i];
					opt.appendChild(document.createTextNode(pages[i].getAttribute("start").substring(1)));
					pageSelect.appendChild(opt);
				}
				pageSelect.setAttribute("onchange","jumpToPage(this)");
				panel.HTML.firstChild.appendChild(pageSelect);
				}*/
				
}
EBP.panel.prototype.reloadCoords = function(){
	//Load Coordinates
	pparams = '?curPage=' + this.curPage;
	coordstring = this.desktop.ajax.phpCall('./php/EBPlogin/retrieveCoords.php', pparams, 'GET');
	//cArray = (coordstring.indexOf(';')) ? coordstring.split(';') : coordstring.split(',');
	cArray = coordstring.split(';');
	
	
	
	
for (i in cArray) {
		temp = cArray[i].split('-');
		if (temp[1] == 'box') { //reconstruct box
			coords = temp[2].split(',');
			left = parseInt(coords[0]) + YAHOO.util.Dom.getX(this.content.HTML);
			top = parseInt(coords[1]) + YAHOO.util.Dom.getY(this.content.HTML);
			box = new ImageRegion([left, top, coords[3], coords[2]], true);
			this.content.HTML.appendChild(box.HTML);
			//this.image.imageRegions.push(box);
			
			//box.area.isetID = parseInt(temp[0]);
		}
		else 
			if (temp[1] == "poly") {
				
				/*
id = temp[0];
				coords = temp[2].split(',');
				node = new Object();
				for (c = 0; c < coords.length; c++) {
					p0 = parseInt(coords[c]) + parseInt(YAHOO.util.Dom.getX(this.image.HTML));
					p1 = parseInt(coords[++c]) + parseInt(YAHOO.util.Dom.getY(this.image.HTML));
					
					//startNode = (this.image.curArea != null) ? false : true;
					if (this.image.curArea) {
						node = new Node(this.image, [p0, p1, 10, 10], false, true);
						node.area = this.image.curArea;
						this.image.curArea.nodes.push(node);
					}
					else {
						node = new Node(this.image, [p0, p1, 10, 10], true, true);
						node.dot.HTML.className = "firstNode";
						this.image.curArea = new Area(this.image, "poly");
						this.image.curArea.nodes.push(node);
						this.image.areas.push(this.image.curArea);
						node.area = this.image.curArea;
						this.image.curArea.isetID = id;
					}
					
				}
				//this.image.curArea.isetID = id;
				this.image.curArea.completeShape(this.image.curArea);
*/
			}
		
	}

}
EBP.panel.prototype.nextPage = function(e,obj){
				
				if (obj.curPage < (obj.idarray.length)){
					n = parseInt(obj.curPage) + 1;
					
					if (obj.project != 0) {
						//obj.reloadCoords();
					}	
					obj.showPage(e, n, obj);
					
					//obj.turnPage.fire((parseInt(panel.curPage)+1));
					/*
obj.desktopCall.fire({obj: obj, callback: "args.obj.showPage", data: (parseInt(obj.curPage)+1), type: "turnPage"});
					obj.desktopCall.fire({obj: obj.dropdown, callback: "args.obj.change", data: (parseInt(obj.curPage)), type: "turnPage"});
					
*/
					
					
					/*
if (obj.mode == "image") {
						obj.turnPage.fire((parseInt(obj.curPage)+1));
						
					} else if(obj.mode == "text"){
						obj.turnPage.fire((parseInt(obj.curPage)+1));
						//obj.curPage++;
						//pparams = "?page=" + panel.idarray[(obj.curPage-1)];
						
						//panel.pageText.retrieveContent('GET', './php/retrieveHTML.php', pparams);
					}
*/
					
				} else {
					obj.curPage;
				}
			
}
EBP.panel.prototype.prevPage = function(e,obj){
		if (obj.curPage>0){
			n = parseInt(obj.curPage) - 1;
			
			if (obj.project != 0) {
				//obj.reloadCoords();
			}	
			//obj.desktopCall.fire({obj: [obj, obj.dropdown], callback: ["obj.showPage", "obj.change"], data: (parseInt(obj.curPage)-1), type: "turnPage"});
			obj.showPage(e, n, obj);
			
			//obj.ctxt = "";
			/*
obj.desktopCall.fire({obj: obj, callback: "args.obj.showPage", data: (parseInt(obj.curPage)-1), type: "turnPage"});
			obj.desktopCall.fire({obj: obj.dropdown, callback: "args.obj.change", data: (parseInt(obj.curPage)), type: "turnPage"});
			
*/		
			/*
if (obj.mode == "image") {
				
				obj.turnPage.fire((parseInt(obj.curPage)-1));
			} else {
				obj.curPage--;
				pparams = "?page=" + panel.idarray[(obj.curPage+1)];
				panel.pageText.retrieveContent('GET', './php/retrieveHTML.php', pparams);
			}
*/
		} else {
			obj.curPage;
		}
	}
			
/*
EBP.panel.prototype.scrollOn = function(e, obj) {
	if(this) {
		
		this.style.overflow = "scroll";
	} else {
		return false;
	}
}
EBP.panel.prototype.scrollOff = function(e, obj) {
	if(this) {
		this.style.overflow = "hidden";
	} else {
		return false;
	}
}
*/
EBP.panel.prototype.displayPage = function(n) {
	if (this) {
		this.clearContents();
		
		/*
txtDiv = document.createElement("div");
		txtDiv.className = "leaf";
		txtDiv.style.height = "500px";

		txtDiv.style.backgroundColor = "#645B54";
		var txt = "";
		
		*/		
		
		
		var page = (n == 0 || n == 1) ? 1 : (n-1);
		pparams = "?page=" + this.idarray[page];
		this.pageText.retrieveContent('GET', './php/retrieveHTML.php', pparams);
		/*
this.ajaxFire.fire({
			file: './php/retrieveHTML.php',
			params: pparams,
			method: 'GET'
		});
*/
		
		//txtDiv.innerHTML = txt;
		//this.content.HTML.appendChild(txtDiv);
		
	}
}

EBP.panel.prototype.getIDS = function() {
	idstring = this.desktop.ajax.phpCall('./php/getallids.php','','GET');
	idarray = idstring.split("\n");
	return idarray;
}
EBP.panel.prototype.clearPage=function(obj){
	for(i in obj.areas){
		obj.areas[i].destroyNodes.fire();
	}
	for(i in obj.boxes){
		obj.boxes[i].destroy("click", "", obj.boxes[i]);
		
	}
	obj.areas.length=0;
	obj.boxes.length=0;
}
EBP.panel.prototype.showPage = function(e, n, panel){
	//YAHOO.util.Event.stopEvent(e);
	
	//panel=args;
	
	panel.curPage=n;
	
	//if(e=="dropEvent") {panel.turnPage.fire(panel.curPage);}
	panel.clearPage(panel);
	panel.ajaxFire.fire({
		file: './php/EBPlogin/setPage.php',
		params: '?mode=set&page=' + panel.curPage + '&panel=' + panel.id,
		method: 'GET'
	});
	
	if (panel.HTML) {
		if (!(panel.content.HTML.firstChild.nodeName.toLowerCase() == "img")) {
			
			panel.clearContents();
			//clearCoords(panel);
			
			panel.content.HTML.appendChild(panel.image.HTML);
		}
		/*
//set mode
		panel.mode="image";
*/
		
		//load current page text
		var page = (n == 0 || n==1) ? 0 : (n-1);
		jpgsrc = "";
		
		if(panel.idarray[page]) { //*
			
			tiffsrc = panel.idarray[page];
			if (tiffsrc.lastIndexOf("a") > 20) {
				jpgsrc = tiffsrc.substring(0, tiffsrc.lastIndexOf("a")) + "." + "jpg";
			} else {
				tiffsrc += ".";
				jpgsrc = tiffsrc.substring(0, tiffsrc.lastIndexOf(".") + 1) + "jpg";
			}
		}
		path = panel.imagePath + '/' + jpgsrc;
		
		panel.desktopCall.fire({obj: [panel.image, panel.zoom], callback: ["obj.change", "obj.changeImage"], type: "setPath", data: path});
		
		panel.desktopCall.fire({obj: [panel.dropdown, panel.curArea], callback: ["obj.change", "obj.destroy"], type: "turnPage", data: parseInt(panel.curPage)});
	
		//panel.setPath.fire(path);
		
		pparams = "?page=" + panel.idarray[(parseInt(panel.curPage)-1)];
		
		if (panel.mode == "text") {
			panel.desktopCall.fire({obj: [panel.pageText], callback: ["obj.retrieveContent"], data: {method: 'GET', file: './php/retrieveHTML.php', params: pparams}, type: "turnPage"});
			//panel.pageText.retrieveContent('GET', './php/retrieveHTML.php', pparams);
		}
		//panel.image.change(path);
		//change zoom box if present
		//panel.zoom.changeImage(path);
		//panel.image.HTML.src = panel.imagePath + "/" + jpgsrc;
		
	}
}
EBP.panel.prototype.setHeader=function(panel){
	
	//panel.slider = new Opacity(); 
	panel.objects[panel.objects.length]=panel.image;
	//panel.objects[panel.objects.length]=panel.slider;
	//panel.header.HTML.appendChild(panel.slider.HTML);
	//panel.dropdown=new DropDown(panel.idarray.length, panel.curPage);
	panel.objects[panel.objects.length]=panel.dropdown;
	//panel.header.HTML.appendChild(panel.dropdown.HTML);
	//panel.opacButton = new PanelButton("images/icon_opacity.png","opacity",panel.header.HTML,"this.panel.transSlider",panel);
	//panel.opacButton.HTML.appendChild(panel.slider.HTML);
	//panel.slider.changeOpac.subscribe(panel.transparency, panel);
	//panel.polyButton = new PanelButton("images/icon_polygon.png", "poly", panel.header.HTML, "this.panel.drawPoly", panel);
	//panel.rectButton = new PanelButton("images/icon_rectangle.png", "rect", panel.header.HTML, "this.panel.drawBox", panel);
	//panel.captureButton = new PanelButton("images/information.png", "capture", panel.header.HTML, "this.panel.capture", panel)
	
	panel.notesButton = new PanelButton("images/icon_page.png","max",panel.header.HTML,"this.panel.showText",panel);
	panel.zoomInButton = new PanelButton("images/icon_zoom_in.png","zoomIn",panel.header.HTML,"this.panel.zoomIn",panel);
	panel.zoomOutButton = new PanelButton("images/icon_zoom_out.png","zoomOut",panel.header.HTML,"this.panel.zoomOut",panel);
	//panel.zoomWinToggleButton = new PanelButton("images/icon_zoom.png", "zoomWin", panel.header.HTML, "this.panel.zoomToggle", panel);
	panel.backButton = new PanelButton("images/icon_page_back.png","prev",panel.header.HTML,"this.panel.prevPage",panel);
	panel.nextButton = new PanelButton("images/icon_page_next.png","next",panel.header.HTML,"this.panel.nextPage",panel);
	//panel.maxButton = new PanelButton("images/icon_maximize.png","max",panel.header.HTML,null,panel);
	panel.closeButton = new PanelButton("images/icon_close.png","close",panel.header.HTML,"this.panel.close",panel);
	
	
	//panel.desktop.setListenCall(panel, panel.objects, panel.desktop);
	/*
panel.zoomInKeyListener= new YAHOO.util.KeyListener(document, {keys: 90}, {fn: panel.zoomKeyHandler, scope: panel, correctScope: true});
	panel.zoomOutKeyListener= new YAHOO.util.KeyListener(document, {keys: 90}, {fn: panel.zoomKeyHandler, scope: panel, correctScope: true});
	panel.zoomKeyListener=new YAHOO.util.KeyListener(document, {keys: 90}, {fn: panel.zoomKeyHandler, scope: panel, correctScope: true});
	panel.zoomKeyListener.enable();
*/
}
EBP.panel.prototype.receiveExtCall=function(e, pass, args){
	//receive calls from ListenerMgr and 
	//perform appropriate function based 
	//on received type variable
	YAHOO.util.Event.stopEvent(e);
	type = pass[0].type;
	data=pass[0];
	
	switch(type){
		case 'changeOpac':
			args.transparency(e, [data], args);
			break;
		case 'dropEvent':
	
			args.showPage(e, parseInt(data.data), args);
			break;
		case 'imageClicked':
			args.createShape(e, data.data, args);
			break;
		case 'polygon':
			args.drawPoly(e, args);
			break;
		case 'box':
			args.drawBox(e, args);
			break;
		case 'magnifier':
			args.zoomToggle(e, args);
			break;
		/*
case 'previous':
			args.showPage(e, (args.curPage-1), args);
			break;
		case 'next':
			args.showPage(e, (args.curPage+1), args);
			break;
*/
	}
}
EBP.panel.prototype.zoomKeyHandler=function(e){
	this.zoomToggle(e, this);
}



EBP.panel.prototype.makePanelResize = function(panel){
	/*
if (panel.project != 0) {
		phpparam = '?mode=new&curPage=' + panel.curPage + '&wxy=' +
		YAHOO.util.Dom.getXY(panel.id) +
		'&panel=' +
		panel.id;
		//panel.ajaxFire.fire({file: './php/EBPlogin/startUpWindow.php', params: phpparam, method: 'GET'});
		//panel.desktop.ajax.phpCall('./php/EBPlogin/startUpWindow.php', phpparam, 'GET');
		
	}
*/

	
	//set up image content and zoom window
	//panel.addImage('./hameltu/ham-1611-22277-001.jpg', panel);
	
		//set up header content
		panel.setHeader(panel);
	
	//set up content
	//panel.pageText = new PageText();
	//panel.content.HTML.appendChild(panel.pageText.HTML);
	

	//n = parseInt(panel.curPage);
	//panel.panelClicked.fire({panel: panel});
	//panel.desktopCall.fire({obj: [panel.desktop], callback: ["obj.selectPanel"], type: "panelClicked", data: {panel: panel}})
	//panel.showPage("", n, panel);
	
	
	//panel.dropdown.change(this, n);
	//Clear Previous Coordinates
	//clearCoords(panel);
	
	/*
if (panel.project != 0) {
		panel.reloadCoords();
	}
*/
	/*
args=new Array();
	args[0]={panel: this, num: panel.curPage};
*/
	//panel.dropdown=new DropDown(panel.idarray.length, panel.curPage);
	/*
panel.header.HTML.appendChild(panel.dropdown.HTML);
	panel.turnPage.fire(panel.curPage);
*/

	//DropDown
	//YAHOO.util.Dom.setY(panel.dropdown.HTML, YAHOO.util.Dom.getY(panel.header.HTML));
	
	
	
	
	//panel.turnPage.subscribe(panel.dropdown.change, panel.dropdown);
	//panel.image.imageClicked.subscribe(panel.createShape, panel);
	//subscribe to dropdown listener
	//panel.dropdown.dropEvent.subscribe(panel.showPage, panel);
	//subscribe to imageclicked
	//panel.image.imageClicked.subscribe(panel.insertArea);
	//panel.turnPage.fire(panel.curPage);
	
	//this.style.overflow = "hidden";
	//this.draggable = new YAHOO.util.DD(this.id);
	//draggable = new YAHOO.util.DDProxy(panel.id);
	//draggable.setHandleElId(this.id+"_handle");
	
// Yahoo code for making a resizable panel
	panel.draggable = new YAHOO.util.DD(panel.id);
	panel.draggable.setHandleElId(panel.header.id); //can only drag by clicking on handle
	panel.draggable.on('endDragEvent', function(ev) {
		
		if(YAHOO.util.Dom.getX(panel.HTML) < 0) {
			YAHOO.util.Dom.setX(panel.HTML, 1);
		} else if(YAHOO.util.Dom.getY(panel.HTML) > 800) {
			YAHOO.util.Dom.setY(panel.HTML, 700);
		}
		if(YAHOO.util.Dom.getY(panel.HTML) < 60) {
			YAHOO.util.Dom.setY(panel.HTML, 61);
		} else if(YAHOO.util.Dom.getY(panel.HTML) > 600){
			YAHOO.util.Dom.setY(panel.HTML, 500);
		}
		//following deprecated for time being 11/4/08
		/*
pparams = '?panel='+panel.id+'&coords='+
		Math.abs(YAHOO.util.Dom.getX(panel.HTML))+','+
		Math.abs(YAHOO.util.Dom.getY(panel.HTML));
		panel.ajaxFire.fire({file: './php/EBPlogin/updateWindow.php', params: pparams, method: 'GET'});
		
*///panel.desktop.ajax.phpCall('./php/EBPlogin/updateWindow.php', pparams, 'GET');
	});
	
	
	panel.yResize = new YAHOO.util.Resize(panel.id, {
                handles: ['br'],
				proxy: true,
                autoRatio: false,
                minWidth: 800,
                minHeight: 550
               
            });

            // Setup resize handler to update the size of the Panel's body element
            // whenever the size of the 'resizablepanel' DIV changes
      panel.yResize.on('resize', function(e, panel) {
				
				
                var panelHeight = parseInt(panel.HTML.style.height);
				var panelWidth = parseInt(panel.HTML.style.width);
					     
                var headerHeight = panel.HTML.firstChild.offsetHeight;	 // Content + Padding + Border
				var headerWidth = panel.HTML.firstChild.offsetWidth;
				
				if (panel.HTML.childNodes[2]){
               		var footerHeight = panel.HTML.childNodes[2].offsetHeight; // Content + Padding + Border
					var footerWidth = panel.HTML.childNodes[2].offsetWidth;
				}
				else
				{
					footerHeight=0;
					foorterWidth=0;
				}
				//document.getElementById("debug").innerHTML=footerHeight;
				
                var bodyHeight = (panelHeight - headerHeight - footerHeight);
				var bodyWidth = (panelWidth - headerWidth - footerWidth);
				
              	//  var bodyContentHeight = (IE_QUIRKS) ? bodyHeight : bodyHeight - PANEL_BODY_PADDING;
 				var bodyContentHeight =  bodyHeight;
				if(bodyWidth < 0){
					bodyWidth*=(-1);
				}
				if(bodyHeight < 0){
					bodyHeight*=-1;
				}
				
               /*
 YAHOO.util.Dom.setStyle(panel.image.HTML, 'left', "10px")
				YAHOO.util.Dom.setStyle(panel.image.HTML, 'height', bodyHeight + 'px');
*/
				
				/* Change Slider Position */
				slider = YAHOO.util.Dom.getElementsByClassName("slideContainer")[0];
				if(slider.id) {
				sliderButton = YAHOO.util.Dom.getElementsByClassName("panelButton")[5];
					
				//slideBack = YAHOO.util.Dom.getElementsByClassName("slideBack")[0];
					
				var scoordsx = (YAHOO.util.Dom.getX(sliderButton.id) - YAHOO.util.Dom.getX(args.id)) + "px";
				var scoordsy = (YAHOO.util.Dom.getY(sliderButton.id) + 16);
				YAHOO.util.Dom.setX(slider.id, scoordsx);
				YAHOO.util.Dom.setY(slider.id, scoordsy);
				
				
			}
				
				
				
				/*
var xpos = YAHOO.util.Dom.getX(panel.firstChild.childNodes[2].id);
				var ypos = YAHOO.util.Dom.getY(this.firstChild.childNodes[2].id) + 16;
				YAHOO.util.Dom.setX(this.childNodes[4].id, xpos);
				YAHOO.util.Dom.setY(this.childNodes[4].id, ypos);
*/
				
				/* Change Image Size */
				
				//this.childNodes[1].firstChild.height = bodyHeight;
				//this.childNodes[1].firstChild.style.width = bodyWidth;
				
        }, panel, true);

		//this.yPanel.show(); 
		//panel.loadXML(panel);
			 
}

				

//EBP.panel.prototype.type = "image";


//------PanelHeader--------------
/*
EBP.panelHeader = function(panel){
	this.panel = panel;
	
	this.HTML = document.createElement("div");
	this.HTML.className = "hd";
	this.HTML.id = this.panel.id+"_handle";
	this.panel.HTML.appendChild(this.HTML);
	//YAHOO.util.Event.addListener(this.HTML, "mouseup", showX);
	//  Add panelHeader contents here
	
}

//-------PanelBody----------------
EBP.panelContent = function(panel){
	this.panel = panel;
	this.HTML = document.createElement("div");
	this.HTML.className = "bd";
	
	
	
	this.panel.HTML.appendChild(this.HTML);
	
	//YAHOO.util.Event.addListener(this.HTML, "mouseover", this.panel.scrollOn, this);
	//YAHOO.util.Event.addListener(this.HTML, "mouseout", this.panel.scrollOff, this);
} 

//--------PanelFooter----------------
EBP.panelFooter = function(panel){	
	this.panel = panel;
	this.HTML = document.createElement("div");
	this.HTML.className = "ft";

	
	this.panel.HTML.appendChild(this.HTML);
}
*/
/*
//---------Panel Button---------------
EBP.panelButton = function(img,type,loc,clickEvent,panel){
	this.id = YAHOO.util.Dom.generateId(this,"panelButton");
		
	desktop.objects[this.id] = this;
	this.image = document.createElement("img");
	this.image.src = img;
	this.image.alt = type;
	this.type=type;
	this.panel=panel;
	this.loc = loc;
	this.HTML = document.createElement("span");
	this.HTML.className = "panelButton";
	this.HTML.appendChild(this.image);
	this.HTML.style.cursor = "default";
	this.HTML.id = this.id;
	loc.appendChild(this.HTML);
	
	YAHOO.util.Event.addListener(this.HTML, "click", eval(clickEvent),this.panel);
}
*/

