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


DiffPanel = function(id,cObj){
try {
	this.DOM = document.createElement("div");
	list = cObj.documentElement.getElementsByTagName("item");
	var cwd = document.location.toString();
	cwd = cwd.substring(0, cwd.lastIndexOf("/"));
	path = cwd + "/lib/Diff/diffFrame.xml";
	path = path.replace(/\s+/g, "");
	
	con = loadContent(path);
	
	this.DOM.innerHTML = con;
	
	contents = this.DOM.getElementsByTagName("div")[0];
	
	sel = document.createElement("select");
	
	for (var i = 0; i < list.length; i++) {
	
		var text = list.item(i);
		
		var alabel = text.getElementsByTagName("label").item(0).firstChild.nodeValue;
		
		var fn = text.getElementsByTagName("filename").item(0).firstChild.nodeValue;
		
		var anitem = document.createElement("option");
		
		anitem.appendChild(document.createTextNode(alabel));
		anitem.value = fn;
		
		sel.appendChild(anitem);
		
	}
	
	
	
	divs = contents.getElementsByTagName("div");
	
	this.left = sel.cloneNode(true);
	this.right = sel.cloneNode(true);
	
	this.left.id = "cmpLeft";
	this.right.id = "cmpRight";
	divs[0].appendChild(this.left);
	divs[1].appendChild(this.right);
}
catch(e){
	alert(e);
}
}

DiffPanel.prototype.showDiff=function(obj){

	left = obj.left;
	right = obj.right;
	
	alert(left.isSameNode(right));

	alert(left.parentNode.nodeName);
	/*alert(left.selectedIndex+' '+right.selectedIndex);
	left = left.substring(left.lastIndexOf("/")+1,left.lastIndexOf("."));
	right = right.substring(right.lastIndexOf("/")+1,right.lastIndexOf("."));
	

	diffstr = "./lib/Diff/DiffHTML/"+left+right+".html";
	
	var callback={
		success: function(o){
			
			tar = o.argument.target;
		
			de = document.createElement("div");
			de.innerHTML=o.responseText;

			dw = document.getElementById(tar.id+"_dw");
			dw.innerHTML = de.innerHTML;
	
		
		},
		failure: function(o){
			alert(o.responseText);
			
		},
		argument: {
			target: obj
		}
	};

	YAHOO.util.Connect.asyncRequest('GET', diffstr, callback);
*/
	//de = diffobj.documentElement;
	//de.className="diffTable";
	
}
DiffPanel.prototype.setHeader=function(panel){
	
	this.darker = new PanelButton("darker", "More Opaque");
	this.lighter = new PanelButton("lighter", "More Transparent");
	this.opacityControls = new ButtonGroup("Opacity", [this.darker, this.lighter], "opacityControls");
	this.header.appendChild(this.opacityControls.HTML);
	YAHOO.util.Event.addListener(this.darker.HTML, 'click', this.changeTransparency, {
		panel: this,
		more: false
	});
	YAHOO.util.Event.addListener(this.lighter.HTML, 'click', this.changeTransparency, {
		panel: this,
		more: true
	});
	
	
	
	
	this.closeButton = new PanelButton("closeButton", "Close");
	this.header.appendChild(this.closeButton.HTML);
	YAHOO.util.Event.addListener(this.closeButton.HTML, 'click', this.close, panel);
}

