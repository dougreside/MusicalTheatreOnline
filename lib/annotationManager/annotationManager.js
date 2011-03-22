annotationManager = function(obj, te, pa){

    this.annoObj = obj;
    this.sel = new Selection(obj);
    this.pageAnnos = pa;
    this.annoInfo = null;
    this.te = te;
    
}
annotationManager.prototype = {
    getSel: function(){
    
        this.sel.init(this.annoObj);
    },
	saveAnnoEdit: function(noteText){
		var num = parseInt(this.te.mode);
		this.te.mode="write";
		noteText = noteText.replace(/"/g, "&quot;");
		noteText = noteText.replace(/'/g, "&apos;");
		
		this.pageAnnos[workspace.curTab][num][3]=noteText;
		var star = this.pageAnnos[workspace.curTab][num][4];
		star.setAttribute('onclick', 'showNote(this.id,"' + noteText + '")');
		var dsb = document.getElementById('dynamicSidebox');
		dsb.innerHTML=workspace.titleIcon;
	},
	showAnnos: function(obj){
		stars = YAHOO.util.Dom.getElementsByClassName('fnstar'); 
		for (var n=0;n<stars.length;n++){
			stars[n].style.display="inline-block";
		}
	},
	hideAnnos: function(obj){
		
		stars = YAHOO.util.Dom.getElementsByClassName('fnstar'); 
		for (var n=0;n<stars.length;n++){
			stars[n].style.display="none";
		}
	},
    popUpEditor: function(){
        this.getSel();
        this.annoInfo = this.sel.getRangeValue(this.sel);
        
        if (this.annoInfo.text.toString().length > 0) {
        
            this.te.show();
            
        }
    },
    saveAnno: function(noteText){
  			
			var end = this.annoInfo.endNode;
			
			var par = this.annoInfo.endNode.parentNode;
			
			var off = this.annoInfo.endValue;
			
			var childNo = this.annoInfo.childNo;
			noteText = noteText.replace(/"/g, "&quot;");
			noteText = noteText.replace(/'/g, "&apos;");
			var star = this.markText(par.id, childNo, off, noteText);
			
			
			this.recordAnno(par.id, childNo, off, noteText, star);
		  
    },
    markText: function(parId, childNo, offset, noteText){
		noteText = noteText.replace(/"/g,"&quot;");
		noteText = noteText.replace(/'/g,"&apos;");
       	var offset = parseInt(offset);
	    var childNo = parseInt(childNo);
		  
        var par = document.getElementById(parId);
        var kid = par.childNodes.item(parseInt(childNo));
        var star = document.createElement("span");
        star.id="fn";
        star.className = "fnstar";
		
        star.setAttribute('onclick', 'showNote(this.id,"' + noteText + '")');
        star.appendChild(document.createTextNode(" "));
  		
		
        if ((kid.nodeName == "#text")) {
      
            var begin = kid.nodeValue.substring(0, offset);
            
            var beginN = document.createTextNode(begin);
            var last = kid.nodeValue.substring(offset);
            var lastN = document.createTextNode(last);
            par.replaceChild(lastN, kid);
            par.insertBefore(star, lastN);
            par.insertBefore(beginN, star);
        }
		else{
			
		}
		return star;
        
    },
    applyAnnos: function(docId){
        i = this.pageAnnos[docId];
        if (i) {
            
            for (var j=0;j<this.pageAnnos[docId].length;j++) {  
			
				 var star = this.markText(i[j][0],i[j][1],i[j][2],i[j][3]);
           		  star.id = star.id+"_"+j; 	
							
						}
                
                    
            }
			/*while(toBeMarked.length>0){
				var mark = toBeMarked.pop();
				
				var star = this.markText(mark[0],mark[1],mark[2],mark[3]);
				
			} */ 
            
    },
    recordAnno: function(parId, childNo, childOff, noteText, star){
    
	
		
		var co = parseInt(childOff);
        if (this.pageAnnos[workspace.curTab] == null) {
            this.pageAnnos[workspace.curTab] = [];
        }
  
		var anno = [parId,childNo,co,noteText,star];
		star.id=star.id+"_"+this.pageAnnos[workspace.curTab].length;
		this.pageAnnos[workspace.curTab].push(anno);
		
        return;
    },
    downloadAnno: function(){
    
        var json = "{";
        for (var i in this.pageAnnos) {
	
	 json = json  + i + ":[";
	 for (j in this.pageAnnos[i]){
	 	noteText = this.pageAnnos[i][j][3];
				noteText = noteText.replace(/"/g,"&quot;");
		noteText = noteText.replace(/'/g,"&apos;");
	 	json = json+"['"+this.pageAnnos[i][j][0]+"',"+this.pageAnnos[i][j][1]+","+this.pageAnnos[i][j][2]+",'"+noteText+"'],"
	 }
	 json = json.substring(0, json.length - 1)+"],";
		}
			 json = json.substring(0, json.length - 1)+"}";
		
        document.getElementById("annoData").value = json;
        document.annos.submit();
        return;
        
    },
    annotate: function(){
        this.getSel();
        this.annoInfo = this.sel.getRangeValue(this.sel);
        star = document.createElement("span");
        YAHOO.util.Dom.generateId(star, "fn");
        star.className = "fnstar";
        star.setAttribute('onclick', 'showNote(this.id)');
        star.appendChild(document.createTextNode("*"));
        end = this.annoInfo.endNode;
        txt = this.annoInfo.text + "";
        
        //getChildNumber(end);
        if ((end.nodeName == "#text") && (end.nodeValue.length > 0)) {
            off = this.annoInfo.endValue;
            begin = end.nodeValue.substring(0, off);
            beginN = document.createTextNode(begin);
            last = end.nodeValue.substring(off);
            lastN = document.createTextNode(last);
            par = end.parentNode;
            par.replaceChild(lastN, end);
            par.insertBefore(star, lastN);
            par.insertBefore(beginN, star);
            
        }
        
        
        
    }
}

Selection = function(htmlObj){
    this.htmlObj = htmlObj;
    this.userSelection = null; //for Mozilla, opera
    this.userRange = null; //for IE
    this.selectionTouched = new YAHOO.util.CustomEvent("selectionTouched");
    this.valueCall = new YAHOO.util.CustomEvent("valueCall");
}
Selection.prototype.getRangeObject = function(selectionObject){
    // From http://www.quirksmode.org/dom/range_intro.html
	if (selectionObject.anchorNode) {
		return selectionObject
	}
	else {
		if (selectionObject.getRangeAt) 
			return selectionObject.getRangeAt(0);
		else { // Safari!
		
			var range = document.selection.createRange();
		/*	if (range.setStart()) {
				range.setStart(selectionObject.anchorNode, selectionObject.anchorOffset);
				range.setEnd(selectionObject.focusNode, selectionObject.focusOffset);
			}*/
			return range;
		}
	}
}
function getChildNumber(obj){
    if (obj.parentNode) {
        par = obj.parentNode;
        var x = 0;
        for (var i in par) {
            if (par[i].isSameNode(obj)) {
                return x;
            }
            x++;
        }
        
    }
    return null;
}

/***
 * Initializes the range/selection
 * depending on the browser
 *
 *
 * @param {Object} obj (Selection Object)
 *
 */
Selection.prototype.init = function(){

    if (window.getSelection) {
	
        this.userSelection = window.getSelection();
    }
    else 
        if (document.selection) { // should come last; Opera!
        	
            this.userSelection = document.selection.createRange();
			
        }
    
    //create range object
    this.userRange = this.getRangeObject(this.userSelection);
    
}

/***
 * Returns an array with information
 * on range values and range nodes
 *
 * Params:
 * Selection Object 'obj'
 */
Selection.prototype.getRangeOffsetIE=function(r){
	//from http://stackoverflow.com/questions/164147/character-offset-in-an-internet-explorer-textrange
  r.collapse(false);
  var end = Math.abs( r.duplicate().moveEnd('character', -1000000) );
  // find the anchor element's offset
  var range = r.duplicate();
  r.collapse( false );
  var parentElm = range.parentElement();
  
  var children = parentElm.getElementsByTagName('*');
   //var children = parentElm.childNodes;
  
  for (var i = children.length - 1; i >= 0; i--) {
  	
    range.moveToElementText( children[i] );
    if ( range.inRange(r) ) {
      parentElm = children[i];
      break;
    }
  }
  range.moveToElementText( parentElm );
  var offsetInParent = end - Math.abs( range.moveStart('character', -1000000) );
  // The above is the offset in the parentElem.  Now to get the offset in the textnode
  if (children.length == 0) {
  	return [offsetInParent,0,parentElm.firstChild];
  }
  else {
  	children = parentElm.childNodes;
  	var counter = 0;
	var textNode = null;
  	for (i = 0; i < children.length; i++) {
  		var txt;
  		if (children[i].nodeType == 3) {
  			txt = children[i].nodeValue;
			counter = counter + txt.length;
  		}
  		else {
  		
			counter=counter+3;
  		}
  	
  		if (counter >= offsetInParent) {
			textNode = children[i];
	
			childNo = i;
		
			counter = counter-textNode.nodeValue.length;	
			break;
			
			
			
  	
  		}
  	}
	
	var off = offsetInParent - counter;
	return [off,childNo,textNode];
	
  
  }
  
  
  
}
Selection.prototype.getChildAtOffset=function(offset,parNode){
	var children = parNode.childNodes;
	var counter=0;
	for (i=0;i<children.length;i++){
		
		if (children.item(i).innerText) {
			
			
			counter = counter + children.item(i).innerText.length;
			}
		else if(children.item(i).nodeValue.length){
			counter = counter + children.item(i).nodeValue.length;
		
		}
		
		if (counter>=offset){
			return [children.item(i),i];
		}
	}
	return null;	
}

Selection.prototype.getRangeValue = function(obj){
    var startNode, endNode, startValue, endValue, text,childNo;
    
    if (obj.userSelection.anchorNode) {
    
        startNode = obj.userSelection.anchorNode;
        endNode = obj.userSelection.focusNode;
	
        startValue = obj.userSelection.anchorOffset;
        endValue = obj.userSelection.focusOffset;
		text = obj.userSelection;
		
		 childNo = 0;
		var parNode = endNode.parentNode;
			for (var i = 0; i < parNode.childNodes.length; i++) {
			
				if (parNode.childNodes[i].isSameNode(endNode)) {
				
					break;
				}
			}
			childNo = i;
    }
    else {
    	
	
        startNode = null;
      
		//alert(endNode.nodeName);
		
        startValue = 0;
       // endValue = obj.userSelection.endOffset;
		 text = obj.userSelection.text;
		 	obj.userSelection.collapse(false);
		var vals =  this.getRangeOffsetIE(obj.userSelection);
	endValue = vals[0];
	childNo = vals[1];
	endNode = vals[2];

    }
    
    
   
    
    
    return {
    
        startNode: startNode,
        endNode: endNode,
        startValue: startValue,
        endValue: endValue,
        childNo: childNo,
        text: text
    };
}





