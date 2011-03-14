// ==UserScript==
// @name           instatweets
// @namespace      http://babyl.ca/instatweets
// @include        http://search.cpan.org/*
// @require        http://localhost:3000/javascripts/jquery.js
// @require        http://localhost:3000/javascripts/jquery.form.js
// @require        http://localhost:3000/javascripts/jquery.cookies.js
// @require        http://localhost:3000/javascripts/autoresize.jquery.min.js
// ==/UserScript==

gm_xhr_bridge();

var insta_root = 'http://localhost:3000';

function submitTweet () {
    $("#sending_tweet").show();
    $.post(
        insta_root + '/tweet', 
        {
            'update': $('#twitter_status').get(0).value,
        },
        function ( data, textStatus ) {
            $("#sending_tweet").hide(); 
            $("#twitter_status").get(0).value = "";
            update_counter();
            $('#twitter_term').slideToggle();
        }
    );
};

function update_counter () {
    var l = $('#twitter_status').get(0).value.length;
    $('#twitter_counter')
        .html(l)
        .css('color', l > 140 ? 'red' : 'black' );
}

$(function(){
    $("<div id='twit' />" )
        .css({
            position:   "absolute",
            top:        "0px",
            right:      "5px"
        })
        .appendTo('body');

    $( '<img id="twitter_logo" src="' + insta_root + '/twitter_logo.png" />' )
        .appendTo( '#twit' )
        .click( function(){
                $('#twitter_term').slideToggle();
            });

$('body').append( '<div id="twitter_term" style="padding: 5px; z-index: 20000; display: none; background-color: lightgrey; position: absolute; top: 0px; right: 120px;";>'
+ '<form method="POST" id="tweet_form">'
+ '    <textarea id="twitter_status" name="status" style="width: 50em"></textarea>'
+ '    <input id="submit_tweet" type="button" value="tweet" />'
+ '</form>'
+ '<p>characters: <span id="twitter_counter"></span></p>'
+ '<div id="sending_tweet" style="display: none">sending...</div>'
+ ''
+ '<div id="twitter_warnings">'
+ '</div>'
+ ''
+ '<p align="right"><a href="#hide" onclick="$(\'#twitter_term\').slideToggle();return false;">hide</a></p>'
+ '</div>');

    $('#twitter_status').autoResize();

    $('<span/>').attr('class','not_auth').html( 
        "you must <a href='" + insta_root + "/authenticate?origin=" + document.location +"'>"
        + "authenticate</a> yourself " + "on Twitter before you can tweet" 
    ).prependTo('#twitter_warnings');

    $.get( insta_root + '/authenticated', 
        function(data) { $('.not_auth').hide(); } );

    $('#submit_tweet').click(submitTweet);

    $('#twitter_status').keyup(update_counter);
    update_counter();

});

/* ---------------------------------------------------------- */

// Wrapper function
function GM_XHR() {
    this.type = null;
    this.url = null;
    this.async = null;
    this.username = null;
    this.password = null;
    this.status = null;
    this.headers = {};
    this.readyState = null;
    
    this.open = function(type, url, async, username, password) {
        this.type = type ? type : null;
        this.url = url ? url : null;
        this.async = async ? async : null;
        this.username = username ? username : null;
        this.password = password ? password : null;
        this.readyState = 1;
    };
    
    this.setRequestHeader = function(name, value) {
        this.headers[name] = value;
    };
        
    this.abort = function() {
        this.readyState = 0;
    };
    
    this.getResponseHeader = function(name) {
        return this.headers[name];
    };
    
    this.send = function(data) {
        this.data = data;
        var that = this;
        GM_xmlhttpRequest({
            method: this.type,
            url: this.url,
            headers: this.headers,
            data: this.data,
            onload: function(rsp) {
                // Populate wrapper object with all data returned from GM_XMLHttpRequest
                for (k in rsp) {
                    that[k] = rsp[k];
                }
            },
            onerror: function(rsp) {
                for (k in rsp) {
                    that[k] = rsp[k];
                }
            },
            onreadystatechange: function(rsp) {
                for (k in rsp) {
                    that[k] = rsp[k];
                }
            }
        });
    };
};
function gm_xhr_bridge() {
// Author: Ryan Greenberg (ryan@ischool.berkeley.edu)
// Date: September 3, 2009
// Version: $Id: gm_jq_xhr.js 240 2009-11-03 17:38:40Z ryan $

// This allows jQuery to make cross-domain XHR by providing
// a wrapper for GM_xmlhttpRequest. The difference between
// XMLHttpRequest and GM_xmlhttpRequest is that the Greasemonkey
// version fires immediately when passed options, whereas the standard
// XHR does not run until .send() is called. In order to allow jQuery
// to use the Greasemonkey version, we create a wrapper object, GM_XHR,
// that stores any parameters jQuery passes it and then creates GM_xmlhttprequest
// when jQuery calls GM_XHR.send().

// Tell jQuery to use the GM_XHR object instead of the standard browser XHR
$.ajaxSetup({
    xhr: function(){return new GM_XHR;}
});
}
