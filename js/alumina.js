$(function(){

    $.ajax({
        url: "README.symlink.md",
        dataType: 'text',
        cache: false,
        success: function(text){
            $('#notes h2 small').remove();
            var converter = new Showdown.converter();
            var html = converter.makeHtml(text);
            $('#notes').append('<div class="well">' + html + '</div>');
        }, error: function(jqXHR, textStatus, errorThrown){
            $('#notes h2 small').remove();
            $('<div>').addClass('alert').html('<button type="button" class="close" data-dismiss="alert">×</button> <strong>Sorry!</strong> We couldn&rsquo;t find your project&rsquo;s README.md file. Are you sure it exists?').appendTo('#notes');
        }
    });

    $.ajax({
        url: "scraperwiki.symlink.json",
        dataType: 'json',
        cache: false,
        success: function(data){
            if('project_name' in data){
                $('#info h1 strong').text(data['project_name']);
                $('title').text(data['project_name'] + ' | powered by ScraperWiki');
            }
            if('customer_name' in data){
                $('#info h1 small').text(data['customer_name']);
            } else {
                $('#info h1 small').hide();
            }
            if('status_message' in data){
                $('#info .lead').html('<b>Latest status:</b> ' + data['status_message']);
            } else {
                $('#info .lead').hide();
            }
        }, error: function(jqXHR, textStatus, errorThrown){
            $('<div>').addClass('alert').html('<button type="button" class="close" data-dismiss="alert">×</button> <strong>Something went wrong!</strong> We couldn&rsquo;t find your project&rsquo;s scraperwiki.json file. Are you sure it exists?').prependTo('#info');
            $('#info .lead').hide();
            $('#info h1 small').hide();
        }
    });

    $.ajax({
        url: "../../sqlite",
        data: {
            q: "SELECT name FROM sqlite_master WHERE type='table'"
        },
        dataType: 'json',
        cache: false,
        success: function(data){
            $.each(data, function(i,table){
                if(table.name.indexOf('_') != 0){
                    // create slick grids in here
                }
            });
        }, error: function(jqXHR, textStatus, errorThrown){
            $('<div>').addClass('alert').html('<button type="button" class="close" data-dismiss="alert">×</button> <strong>Something went wrong!</strong> We couldn&rsquo;t select data from your project&rsquo;s SQLite API.').appendTo('#data');
            $('#datagrid').hide();
            $('#data h2 small').remove();
        }
    });

    var $hds = $('<span>').addClass('drop-shadow').appendTo('.page-header');
    $(window).scroll(function(){
        var st = $(window).scrollTop();
        var op = 0;
        if(st > 0){
            op = Math.min(1, st/30);
        }
        $hds.css('opacity', op);
    });

});
