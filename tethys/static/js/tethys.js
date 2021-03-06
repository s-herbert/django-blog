

$(function() {

	//refresh container info
	$('.refresh-btn').click(function(event){

		event.preventDefault();
		console.log("refresh clicked!")  // sanity check
		
		var collection = (this).id.slice(8)
		console.log(collection);
		refresh_collection(collection);

	});
	
	//convert newlines to br's
	function nl2br (str, is_xhtml) {   
		var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';    
		return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
	}
	
	
	
	// AJAX for refresh
	function refresh_collection(collection) {
		console.log("refresh is working!") // sanity check
		var thisUrl = $(location).attr('href');
		$.ajax({
			url : thisUrl+"/refresh_container/", // the endpoint
			type : "GET", // http method
			data : { the_collection : collection }, // data sent with the post request

			// handle a successful response
			success : function(json) {
				//$('#post-text').val(''); // remove the value from the input
				console.log(json); // log the returned json to the console
				var count_id = "#count-" +collection
				var updated_id = "#updated-"+collection
				var docs_id = "#docs-"+collection //unorderd list
				$(count_id).text(" "+json.count)
				$(updated_id).text("updated: "+json.updated)
				var doc_list = json.docs.split(" ")
				$(docs_id).empty(); //clear out the list
				for (var i=0;i<doc_list.length;i++){
					$(docs_id).append("<li id=\""+collection+"-"+doc_list[i]+"\">"
										+"<a href=\"/tethys-admin/"+collection+"/load_document/"+doc_list[i]+"/\" target=\"frame-"+collection+"\">"
										+doc_list[i]
										+"</a>"
										+"</li>")
				}
				//$(docs_id).html(nl2br(json.docs,false))
				console.log("success"); // another sanity check
			},

			// handle a non-successful response
			error : function(xhr,errmsg,err) {
				$('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
					" <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
				console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
			}
		});
	};
	
	
    // This function gets cookie with a given name
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');

    /*
    The functions below will create a header with csrftoken
    */

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    function sameOrigin(url) {
        // test that a given url is a same-origin URL
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                // Send the token to same-origin, relative URLs only.
                // Send the token only if the method warrants CSRF protection
                // Using the CSRFToken value acquired earlier
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

});