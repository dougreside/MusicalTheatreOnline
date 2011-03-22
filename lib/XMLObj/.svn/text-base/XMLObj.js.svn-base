XMLObj = function(){
	this.obj = null;
	this.xsl = null;

	
}
XMLObj.prototype = {
	setObj: function(obj){
		this.obj = obj;
	},
	getObj: function(obj){
		return this.obj;
	},
	getTagByXMLID: function(tagName,id){

		tags = this.obj.getElementsByTagName(tagName);
		if (tags) {
		
			for (n=0;n<tags.length;n++) {
				curId = tags[n].getAttribute("xml:id");
				if (curId == id) {
					return tags[n]
				}
				
			}
		}
		return null;
		
	},
    loadXMLFromFile: function(fname){
		
        var xmlDoc;
        // code for IE
        if (window.ActiveXObject) {
			
			xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		  xmlDoc.async = false;
		
        xmlDoc.load(fname);
		}
		// code for Mozilla, Firefox, Opera, etc.
		else {
		
			/*if (document.implementation &&
			document.implementation.createDocument) {
				xmlDoc = document.implementation.createDocument("", "", null);
			}
			else {
				alert('Your browser cannot handle this script');
			}
			*/
			var xmlhttp = new window.XMLHttpRequest();
xmlhttp.open("GET",fname,false);
xmlhttp.send(null);
var xmlDoc = xmlhttp.responseXML.documentElement;
		}
			
      
		
     
		return xmlDoc;
        
    },
    loadXMLFromString: function(str){
		// TO DO: Parse string to XML
   
    },
    transform: function(xsl){
		
        if (xsl.substring(xsl.length - 4) == ".xsl") {
	
			this.xsl = this.loadXMLFromFile(xsl);
		}
		else {
		// load xsl from string
		}
			
        	if (window.ActiveXObject) {
				ex = this.obj.transformNode(this.xsl);
				return ex;
			}
			// code for Mozilla, Firefox, Opera, etc.
			else 
				if (document.implementation &&
				document.implementation.createDocument) {
					xsltProcessor = new XSLTProcessor();
					xsltProcessor.importStylesheet(this.xsl);
					resultDocument = xsltProcessor.transformToFragment(this.obj, document);
					
					return resultDocument;
				}
		return null;
    },

    GetXmlHttpObject: function(){
        var xmlHttp = null;
        try {
            // Firefox, Opera 8.0+, Safari
            xmlHttp = new XMLHttpRequest();
        } 
        catch (e) {
            // Internet Explorer
            try {
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
            } 
            catch (e) {
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
        }
        return xmlHttp;
    }
    
    
}
