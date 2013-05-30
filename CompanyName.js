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


$(document).ready(function()
{
    if(window.Event)
        window.captureEvents(Event.MOUSEMOVE | Event.DBLCLICK | Event.MOUSEUP);

    document.onmousemove = function(e)
    {
        mouseX = (window.Event) ? e.pageX : event.clientX + document.body.scrollLeft;
        mouseY = (window.Event) ? e.pageY : event.clientY + document.body.scrollTop;
        $('#companyname-definition-popup').fadeOut();
    };
    //document.onmouseup = doSomethingWithSelectedText;
    document.onmouseup = function(e)
    {
        
        var t = getSelectedText();
        
        if(t.length > 0){

            $.getJSON("https://api.angel.co/1/search?query="+t+"&type=Startup", function(response){
                if(response.length > 0) {

                
                 $.getJSON("https://api.angel.co/1/startups/"+response[0].id, function(res){ 
                    if(res.product_desc != "undefined" && res.product_desc != null){
                        showAngelData(res);
                    }
                    else {
                        $.getJSON("http://api.crunchbase.com/v/1/company/"+t+".js?api_key=ed9vfgjwhkugexmum2xwvjd3", function(data){
                            if(data.description.length > 0){
                                showCBdata(data);
                            }
                            else {
                                showTextData("Not found",t);
                            }
                        });
                    }
                 });
                }
                else {
                    $.getJSON("http://api.crunchbase.com/v/1/company/"+t+".js?api_key=ed9vfgjwhkugexmum2xwvjd3", function(data){
                        if(data.description.length > 0){
                            showCBdata(data);
                        }
                        else {
                            showTextData("Not found",t);
                        }
                    });
                }
               });


            
        }
    }
    var hiddenData = 
        '    <div id="companyname-definition-popup" style="background-color:#f8fcff;padding:10px;box-shadow: 4px 2px 20px rgba(0, 0, 0, 0.22);width:' + popupWidth + 'px;border-radius:10px;border:1px solid #0f0f0f;position:absolute;display:none;text-alignLleft;">' + 
        '        <div id="companyname-definition-popup-title" style="font-weight:bold;"><br/>' +
        '        </div>' +
        '        <div id="companyname-definition-popup-body">' +
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

    
    $('#companyname-definition-popup').css('left', (mouseX - popupWidth / 2) + 'px');
    $('#companyname-definition-popup').css('top',  (mouseY + 24) + 'px');
    $('#companyname-definition-popup-title').html(popupHeader);
    $('#companyname-definition-popup-body').html(definitionData.Definition + debugFooter);
    $('#companyname-definition-popup').fadeIn();
}

function showCBdata(crunchbase)
{
    var popupHeader = '';
    var debugFooter = '';
    
    popupHeader = crunchbase.name;

    
    $('#companyname-definition-popup').css('left', (mouseX - popupWidth / 2) + 'px');
    $('#companyname-definition-popup').css('top',  (mouseY + 24) + 'px');
    $('#companyname-definition-popup-title').html(popupHeader);
    $('#companyname-definition-popup-body').html(crunchbase.description + debugFooter);
    $('#companyname-definition-popup').fadeIn();
}

function showAngelData(ang)
{
    var popupHeader = '';
    var debugFooter = '';
    
    popupHeader = ang.name;
    
    $('#companyname-definition-popup').css('left', (mouseX - popupWidth / 2) + 'px');
    $('#companyname-definition-popup').css('top',  (mouseY + 24) + 'px');
    $('#companyname-definition-popup-title').html(popupHeader);
    $('#companyname-definition-popup-body').html(ang.product_desc + debugFooter);
    $('#companyname-definition-popup').fadeIn();
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
    
    $('#companyname-definition-popup').css('left', (mouseX - popupWidth / 2) + 'px');
    $('#companyname-definition-popup').css('top',  (mouseY + 24) + 'px');
    $('#companyname-definition-popup-title').html(popupHeader);
    $('#companyname-definition-popup-body').html(txt + debugFooter);
    $('#companyname-definition-popup').fadeIn();
}