
function importXML(fname)
{
var xmlDoc;
// code for IE
if (window.ActiveXObject)
  {
  xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
  }
// code for Mozilla, Firefox, Opera, etc.
else if (document.implementation 
&& document.implementation.createDocument)
  {
  xmlDoc=document.implementation.createDocument("","",null);
  }
else
  {
  alert('Your browser cannot handle this script');
  }
xmlDoc.async=false;
xmlDoc.load(fname);

return(xmlDoc);
}

OffsetDOM = function(indexXML){
	this.xml = importXML(indexXML);
	this.offsetArray = this.xml.getElementsByTagName("txtNode");
				
}

OffsetDOM.prototype.getNodeForOffset = function (offset){
	lastIndex = this.offsetArray.length;

	index = parseInt(lastIndex/2);
	if (offset > 0) {
		while (index != null) {
			
			start = this.offsetArray[index].getElementsByTagName("offset")[0];
			end = start.nextSibling;
			
			start = parseInt(start.firstChild.nodeValue);
			end = parseInt(end.firstChild.nodeValue);
		
				if (index == lastIndex){
				index = null;
				return null;
			}
		
			if ((offset > start) && (offset<end))
			{
				return this.offsetArray[index];
			}
			else if (offset < start) {
		
				lastIndex = index;
				if (index == 1) {
					index = 0;
				}
				else {
					index = Math.ceil(index / 2);
					
				}
			}
			else if (offset > end){
			
				//alert("1 up "+index+" "+lastIndex);
				diff = Math.ceil(Math.abs(lastIndex-index)/2);
				
					lastIndex = index;
				index = diff+index;	
				//alert("up "+index+" "+lastIndex);
			}
		
			
		}
	}
}

function init(){
	alert("starting");
	off = new OffsetDOM("offsetIndex.xml");
	result = off.getNodeForOffset(1000);
	alert("Result: "+result.childNodes[result.childNodes.length-1].firstChild.nodeValue);
	
}
