TextEditor = function(){
	
	
	try {
		// create the <div> to hold the popout box details
		this.DOM = document.createElement("div");
		this.DOM.className = "TextEditor";
		YAHOO.util.Dom.generateId(this.DOM, "te");
		this.saveNote = new YAHOO.util.CustomEvent("saveNote");
		this.saveEdit = new YAHOO.util.CustomEvent("saveEdit");
		// grab the popout box *.xml file, with the popout template
		// and attach to the popupEnclose
		var cwd = document.location.toString();
		cwd = cwd.substring(0, cwd.lastIndexOf("/"));
		path = cwd + "/lib/TextEditor/TextEditor.xml";
		path = path.replace(/\s+/g, "");
		
		this.DOM.innerHTML = loadContent(path);
		this.myEditor = null;
		this.ta = this.DOM.getElementsByTagName("textarea").item(0);
		
		YAHOO.util.Dom.generateId(this.ta, "noteTA");
		this.mode = "write";
	}
	catch(e){
		alert(e);
	}

    
    
}
TextEditor.prototype = {
    init: function(annoText){
   	
 /*   title = "Annotate: "+annoText;
	if (title.length>20){
		title = title.substring(0,200)+"...";
	}   
*/
try {
	tb = {
	
		titlebar: "Annotate",
		collapse: true,
		buttons: [{
			group: 'textstyle',
			label: 'Font Style',
			buttons: [{
				type: 'push',
				label: 'Bold',
				value: 'bold'
			}, {
				type: 'push',
				label: 'Italic',
				value: 'italic'
			}, {
				type: 'push',
				label: 'Underline',
				value: 'underline'
			}, {
				type: 'separator'
			}, {
				type: 'separator'
			}, {
				type: 'select',
				label: 'Arial',
				value: 'fontname',
				disabled: true,
				menu: [{
					text: 'Arial',
					checked: true
				}, {
					text: 'Arial Black'
				}, {
					text: 'Comic Sans MS'
				}, {
					text: 'Courier New'
				}, {
					text: 'Lucida Console'
				}, {
					text: 'Tahoma'
				}, {
					text: 'Times New Roman'
				}, {
					text: 'Trebuchet MS'
				}, {
					text: 'Verdana'
				}]
			}, {
				type: 'separator'
			}, {
				type: 'spin',
				label: '13',
				value: 'fontsize',
				range: [9, 75],
				disabled: true
			}, {
				type: 'separator'
			}, {
				type: 'separator'
			}, {
				type: 'color',
				label: 'Font Color',
				value: 'forecolor',
				disabled: true
			}, {
				type: 'color',
				label: 'Background Color',
				value: 'backcolor',
				disabled: true
			}, {
				type: 'separator'
			}, {
				type: 'push',
				label: 'Save',
				value: 'save'
			}, {
				type: 'push',
				label: 'Cancel',
				value: 'cancel'
			}]
		}]
	}
	
	var myConfig = {
		height: '300px',
		width: '600px',
		dompath: true,
		focusAtStart: true,
		drag: true,
		toolbar: tb
	
	};
	this.closeButton = document.createElement("span");
	this.closeButton.className = "closeButton";
	this.closeButton.setAttribute('title', "Cancel annotation without saving");
	this.closeButton.appendChild(document.createTextNode("c"));
	YAHOO.util.Event.addListener(this.closeButton,"click",function(ev,ed){
			
			ed.mode="write";
			ed.close();
	},this);
	this.myEditor = new YAHOO.widget.Editor(this.ta.id, myConfig);
	this.myEditor.on('toolbarLoaded', function(e, obj){
	
	
	
	
		obj.myEditor.toolbar._titlebar.appendChild(obj.closeButton);
		YAHOO.util.Event.addListener(obj.closeButton, 'click', function(e, obj){
				ed.mode="write";
			obj.close();
			
		}, obj);
		obj.myEditor.toolbar.on('cancelClick', function(ev, ed){
			ed.mode="write";
			ed.close();
		}, obj);
		obj.myEditor.toolbar.on('saveClick', function(ev, ed){
		   	noteval = ed.myEditor.getEditorHTML();
		    if (ed.mode=="write"){
		
			
			ed.saveNote.fire(noteval);
			ed.myEditor.clearEditorDoc();
			ed.close();
			}
			else{
			
				ed.saveEdit.fire(noteval);
				ed.myEditor.clearEditorDoc();
				ed.close();
			}

		}, obj);
	}, this);
	
	
	this.myEditor.render();
	
}
catch(e){
	alert(e);
}
},
close:function(){

	YAHOO.util.Dom.setStyle(this.DOM,"display","none");
	//this.DOM.parentNode.removeChild(this.DOM);
},
show:function(){
	YAHOO.util.Dom.setStyle(this.DOM,"display","block");
}
}