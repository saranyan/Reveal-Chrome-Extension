var mouseX = 0;
var mouseY = 0;
var popupWidth = 400;
var popupCache = new Object();
var debugMode = false;

function getSelectedText() {
    var text = "";
    if (typeof window.getSelection != "undefined") {
        text = window.getSelection().toString();
    } else if (typeof document.selection != "undefined" && document.selection.type == "Text") {
        text = document.selection.createRange().text;
    }
    return text;
}

function doSomethingWithSelectedText() {
    var selectedText = getSelectedText();
    if (selectedText) {
        alert("Got selected text " + selectedText);

    }
}



$(document).ready(function()
{
    if(window.Event)
        window.captureEvents(Event.MOUSEMOVE | Event.DBLCLICK | Event.MOUSEUP);

    document.onmousemove = function(e)
    {
        mouseX = (window.Event) ? e.pageX : event.clientX + document.body.scrollLeft;
        mouseY = (window.Event) ? e.pageY : event.clientY + document.body.scrollTop;
	    $('#wikipop-definition-popup').fadeOut();
    };
    //document.onmouseup = doSomethingWithSelectedText;
    document.onmouseup = function(e)
    {
        
        var t = getSelectedText();
        
        if(t.length > 0){
            //alert(t);
            $.getJSON("http://api.crunchbase.com/v/1/company/"+t+".js?api_key=ed9vfgjwhkugexmum2xwvjd3", function(data){
                if(data.description.length > 0){
                    showCBdata(data);
                }
                else {
                   $.getJSON("https://api.angel.co/1/search?query="+t+"&type=Startup", function(response){ 
                     $.getJSON("https://api.angel.co/1/startups/"+response[0].id, function(res){ 
                        if(res.product_desc != "undefined" && res.product_desc != null){
                            showAngelData(res);
                        }
                        else {
                            showTextData("Not found",t);
                        }
                     });
                   });
                }
            })
            .error(function(){
                $.getJSON("https://api.angel.co/1/search?query="+t+"&type=Startup", function(response){ 
                     $.getJSON("https://api.angel.co/1/startups/"+response[0].id, function(res){ 
                        if(res.product_desc != "undefined" && res.product_desc != null){
                            showAngelData(res);
                        }
                        else {
                            showTextData("Not found",res.name);
                        }
                     });
                })
                .error(function(){
                    showTextData("Not found",t);
                });

            });
            
        }
    }
	var hiddenData = 
	    '    <div id="wikipop-definition-popup" style="background-color:#FFFDCF;padding:10px;box-shadow: 4px 2px 20px rgba(0, 0, 0, 0.22);width:' + popupWidth + 'px;border-radius:10px;border:1px solid #000000;position:absolute;display:none;text-alignLleft;">' + 
	    '        <div id="wikipop-definition-popup-title" style="font-weight:bold;">' +
        '        </div>' +
	    '        <div id="wikipop-definition-popup-body">' +
        '        </div>' +
	    '    </div>';
	    
	$('body').append(hiddenData);
    $(this).css('border-bottom', '1px dotted #6E9DBF');

    
});
 
function successfulLookup(definitionData)
{
    var popupHeader = '';
    var debugFooter = '';
	
    popupHeader = definitionData.LinkTitle;

    if(debugMode)
    {
        debugFooter += '<br />DEBUG:';
        debugFooter += '<br /><b>OriginalUrl</b>: '         + definitionData.OriginalUrl;
        debugFooter += '<br /><b>FormattedSearchTerm</b>: ' + definitionData.FormattedSearchTerm;
        debugFooter += '<br /><b>LinkTitle</b>: '           + definitionData.LinkTitle;
    }
	
    $('#wikipop-definition-popup').css('left', (mouseX - popupWidth / 2) + 'px');
    $('#wikipop-definition-popup').css('top',  (mouseY + 24) + 'px');
    $('#wikipop-definition-popup-title').html(popupHeader);
    $('#wikipop-definition-popup-body').html(definitionData.Definition + debugFooter);
    $('#wikipop-definition-popup').fadeIn();
}

function showCBdata(crunchbase)
{
    var popupHeader = '';
    var debugFooter = '';
    
    popupHeader = crunchbase.name;

    if(debugMode)
    {
        // debugFooter += '<br />DEBUG:';
        // debugFooter += '<br /><b>OriginalUrl</b>: '         + definitionData.OriginalUrl;
        // debugFooter += '<br /><b>FormattedSearchTerm</b>: ' + definitionData.FormattedSearchTerm;
        // debugFooter += '<br /><b>LinkTitle</b>: '           + definitionData.LinkTitle;
    }
    
    $('#wikipop-definition-popup').css('left', (mouseX - popupWidth / 2) + 'px');
    $('#wikipop-definition-popup').css('top',  (mouseY + 24) + 'px');
    $('#wikipop-definition-popup-title').html(popupHeader);
    $('#wikipop-definition-popup-body').html(crunchbase.description + debugFooter);
    $('#wikipop-definition-popup').fadeIn();
}

function showAngelData(ang)
{
    var popupHeader = '';
    var debugFooter = '';
    
    popupHeader = ang.name;

    if(debugMode)
    {
        // debugFooter += '<br />DEBUG:';
        // debugFooter += '<br /><b>OriginalUrl</b>: '         + definitionData.OriginalUrl;
        // debugFooter += '<br /><b>FormattedSearchTerm</b>: ' + definitionData.FormattedSearchTerm;
        // debugFooter += '<br /><b>LinkTitle</b>: '           + definitionData.LinkTitle;
    }
    
    $('#wikipop-definition-popup').css('left', (mouseX - popupWidth / 2) + 'px');
    $('#wikipop-definition-popup').css('top',  (mouseY + 24) + 'px');
    $('#wikipop-definition-popup-title').html(popupHeader);
    $('#wikipop-definition-popup-body').html(ang.product_desc + debugFooter);
    $('#wikipop-definition-popup').fadeIn();
}

function showTextData(txt,name)
{
    var popupHeader = '';
    var debugFooter = '';
    
    popupHeader = name;

    if(debugMode)
    {
        // debugFooter += '<br />DEBUG:';
        // debugFooter += '<br /><b>OriginalUrl</b>: '         + definitionData.OriginalUrl;
        // debugFooter += '<br /><b>FormattedSearchTerm</b>: ' + definitionData.FormattedSearchTerm;
        // debugFooter += '<br /><b>LinkTitle</b>: '           + definitionData.LinkTitle;
    }
    
    $('#wikipop-definition-popup').css('left', (mouseX - popupWidth / 2) + 'px');
    $('#wikipop-definition-popup').css('top',  (mouseY + 24) + 'px');
    $('#wikipop-definition-popup-title').html(popupHeader);
    $('#wikipop-definition-popup-body').html(txt + debugFooter);
    $('#wikipop-definition-popup').fadeIn();
}