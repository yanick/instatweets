var dancer_url = "http://byakko:3000";

$(function(){

$('<div/>')
    .attr( 'id', 'twit' )
    .css({
        position: "absolute",
        top: "0px",
        right: "5px"
    })
    .appendTo('body');

$('<img/>')
    .attr({ 'src': dancer_url + '/twitter_logo.png', id: "twitter_logo" })
    .click(function(){ $('#twitter_term').slideToggle() })
    .appendTo('#twit');




$.get( dancer_url + '/authenticated')
    .success(function(){ alert("yay") })
    .error(function(){ alert("boo") })
    ;

$('body').append( '<div id="twitter_term" style="padding: 5px; z-index: 20000; display: none; background-color: lightgrey; position: absolute; top: 0px; right: 120px;";>'
+ '<form method="POST" id="tweet_form">'
+ '    <textarea id="twitter_status" cols="70" rows="3" name="status"></textarea>'
+ '    <input type="button" value="tweet" onclick="submitTweet()" />'
+ '</form>'
+ '<p>characters: <span id="twitter_counter"></span></p>'
+ '<div id="sending_tweet" style="display: none">sending...</div>'
+ ''
+ '<div id="twitter_warnings">'
+ '</div>'
+ ''
+ '<p align="right"><a href="#hide" onclick="$(\'#twitter_term\').slideToggle();return false;">hide</a></p>'
+ '</div>');

$('body').append( '<script>'
+ 'function readCookie(name) {'
+ '	var nameEQ = name + "=";'
+ '	var ca = document.cookie.split(\';\');'
+ '	for(var i=0;i < ca.length;i++) {'
+ '		var c = ca[i];'
+ '		while (c.charAt(0)==\' \') c = c.substring(1,c.length);'
+ '		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);'
+ '	}'
+ '	return null;'
+ '}'
+ '</script>' );

$('#twitter_warnings').prepend( "you must <a href='" + dancer_url + "/authenticate?origin=" + document.location +"'>"
+ "authenticate</a> yourself " + "on Twitter before you can tweet" 
);

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

    if ( ! readCookie('ST_twitter_access_token') || 
         ! readCookie('ST_twitter_access_token_secret') ) {
      $('#twitter_warnings').prepend( "you must <a href='http:///twitter_authorize'>"
        + "authenticate</a> yourself " + "on Twitter before you can tweet" 
        );
    }

$('body').append(
 '<script>'
+ 'function submitTweet () {'
+ '    $("#sending_tweet").show();'
+ '    $.getJSON('
+ '        "http://localhost:3000/tweet?callback=?", '
+ '        {'
+ '            "status": $(\'#twitter_status\').get(0).value,'
+ '            "access_token" : readCookie( "ST_twitter_access_token" ),'
+ '            "access_token_secret" : readCookie( "ST_twitter_access_token_secret" ),'
+ '        },'
+ '        function ( data, textStatus ) {'
+ '            $("#sending_tweet").hide(); $("#twitter_status").get(0).value = "@pythian";'
+ '        }'
+ '    );'
+ '};'
+ 'function update_counter () {'
+ '        var l = $(\'#twitter_status\').get(0).value.length;'
+ '        '
+ '        $(\'#twitter_counter\').html(l);'
+ ''
+ '        $(\'#twitter_counter\').css(\'color\', l > 140 ? \'red\' : \'black\' );'
+ '}'
+ ''
+ '$(function(){'
+ '    $(\'#twitter_status\').keyup( update_counter );'
+ '    update_counter();'
+ ''
+ '    $(\'#twitter_status\').keyup(function(){'
+ '        if( !$(\'#twitter_status\').get(0).value.match(/@pythian/) ) {'
+ '            $(\'#twitter_warn_pythian\').show();'
+ '        }'
+ '        else {'
+ '            $(\'#twitter_warn_pythian\').hide();'
+ '        }'
+ '    });'
+ '});'
+ ''
+ ''
+ '</script>'
);
});

