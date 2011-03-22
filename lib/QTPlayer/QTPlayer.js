QTPlayer = function(url){
	this.DOM = document.createElement("div");
	this.DOM.className = "QTPlayer";
	this.url =url;
	this.objectHTML = document.createElement("object");
	this.objectHTML.id="audioObject";
	this.objectHTML.className = "audioObject";
	this.objectHTML.width="400";
	this.objectHTML.height="390";
	this.objectHTML.setAttribute("classid","clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B");
	this.objectHTML.setAttribute("codebase","http://www.apple.com/qtactivex/qtplugin.cab");

	this.movieParam = document.createElement("param");
	this.movieParam.name="src";
	this.movieParam.value=this.url;
	
	this.autoplayParam = document.createElement("param");
	this.autoplayParam.name="autoplay";
	this.autoplayParam.value="false";
	this.objectHTML.appendChild(this.autoplayParam);
	
	this.embedHTML = document.createElement("embed");
	this.embedHTML.name=this.objectHTML.id;
	this.embedHTML.setAttribute("autoplay","false");
	this.embedHTML.src=this.url;
	this.embedHTML.setAttribute("enablejavascript","true");
	this.embedHTML.setAttribute("plugsinspage","http://www.apple.com/quicktime/download");
	this.embedHTML.type="video/quicktime"
	this.embedHTML.width="400";
	this.embedHTML.height="20";
	
	this.objectHTML.appendChild(this.movieParam);
	this.objectHTML.appendChild(this.embedHTML);

	this.DOM.appendChild(this.objectHTML);
	
	/*
	YAHOO.util.Event.addListener(this.recordButton,"click",function(e,obj){
		if (Times){
			
			if (curTagId){
				ct = document.getElementById(curTagId);
			
			}
			else{
				ct = Times[0].parentNode.parentNode.parentNode;
				curTagId = ct.id;
			}
				ct.getElementsByTagName("input")[0].value = document[obj.objectHTML.id].GetTime();
				ct.className="visibleTag";
			curText = null;
			for (var i=0;i<Times.length;i++){
				if (Times[i].id == "time_"+curTagId){
					curText = i;
					break;
				}
		
			}
			if (curText){
				ct = Times[(curText+1)].parentNode.parentNode.parentNode;
				curTagId = ct.id;
				ct.className="currentTag";
				
			}
	
			
			
		}
	},this);*/
}