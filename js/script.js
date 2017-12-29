
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;

    $greeting.text('So, you want to live at ' + address + '?');

    $body.append(
        '<img class="bgimg" src="https://maps.googleapis.com/maps/api/streetview?size=600x400&location='
        + address + '">');

    // NY Times ajax request
    $nytHeaderElem.text('New York Times Articles About ' + cityStr);

    var NYTurl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q='
        + cityStr
        + '&sort=newest&api-key=2c1d2c5eaec8466694b62e48c90afac8';

    var onNYTSuccess = function(data) {
        var items = data.response.docs;
        for (var item of items) {
            itemHtml = `
            <li class="article">
                <a href="${item.web_url}">
                    ${item.headline.main}
                </a>
                <p>
                    ${item.snippet}
                </p>
            </li>
            `
            $nytElem.append(itemHtml);
        }
    };

    var onNYTFail = function(o,statusText) {
        //console.log(statusText);
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    };

    var test = $.getJSON(NYTurl, onNYTSuccess).fail(onNYTFail);  // .fail() calls onFail when ajax call fails

    // Wikipedia ajax request
    var WPurl = 'https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srsearch='
        + cityStr;

    var checkWikipediaTimeout = setTimeout(function() {         //starts the Timeout timer
         $wikiElem.text('failed to get wikipedia resources');
    }, 8000);

    var onWPSuccess = function(data) {
        //console.log(data);
        var items = data.query.search;
        for (var item of items) {
            itemHtml = `
            <li>
                <a href="https://en.wikipedia.org/wiki/${item.title}">
                    ${item.title}
                </a>
            </li>
            `
            $wikiElem.append(itemHtml);
        }
        clearTimeout(checkWikipediaTimeout);  //onSuccess stops the Timeout timer
    };

/*
***** Cameron Pittman solution: *****
var WPurl = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&callback=wikiCallback&search='
        + cityStr;

    var onWPSuccess = function(data) {
        //console.log(data);
        var items = data[1];
        for (var item of items) {
            itemHtml = `
            <li>
                <a href="https://en.wikipedia.org/wiki/${item}">
                    ${item}
                </a>
            </li>
            `
            $wikiElem.append(itemHtml);
        }
        clearTimeout(checkWikipediaTimeout);  //onSuccess stops the Timeout timer
    };
*/
    $.ajax(WPurl, {
        dataType: "jsonp",
     // jsonp: "callback",   callback is the default name. if some servers want diferent name we have to uncomment this line

        success: onWPSuccess
    });

    return false; // if true is returned the HTML page will be reloaded
};

$('#form-container').submit(loadData);  //.submit() can only attached to <form> elements

