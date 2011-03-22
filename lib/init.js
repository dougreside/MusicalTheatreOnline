


YAHOO.util.Event.onDOMReady(init);
function init(){

first = new EBP.panel();

//first.setContent(document.createTextNode("hello"));
body = document.getElementsByTagName("BODY")[0];
body.appendChild(first.HTML);

}
