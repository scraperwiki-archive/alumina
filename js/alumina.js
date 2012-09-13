$(function(){

    $.ajax({
        url: "README.symlink.md",
        dataType: 'text',
        cache: false,
        success: function(text){
            $('#notes .loading').remove();
            var converter = new Showdown.converter();
            var html = converter.makeHtml(text);
            $('#notes').append('<div class="well">' + html + '</div>');
        }, error: function(jqXHR, textStatus, errorThrown){
            $('#notes .loading').remove();
            $('<div>').addClass('alert').html('<button type="button" class="close" data-dismiss="alert">×</button> <strong>Sorry!</strong> We couldn&rsquo;t find your project&rsquo;s README.md file. Are you sure it exists?').appendTo('#notes');
        }
    });

    $.ajax({
        url: "scraperwiki.symlink.json",
        dataType: 'json',
        cache: false,
        success: function(data){
            console.log(data);
            if('project-name' in data && 'customer-name' in data){
                $('#info h1').html(data['project-name'] + ' <small>' + data['customer-name'] + '</small>');
            }
            if('status-message' in data){
                $('#info .lead').html('<b>Latest status:</b> ' + data['status-message']);
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
            var $ul = $('<ul>').addClass('nav nav-tabs');
            var $tables = $('<div>').addClass('tables');
            $.each(data, function(i,table){
                $.ajax({
                    url: "../../sqlite",
                    data: {
                        q: "SELECT * FROM `" + table['name'] + "` LIMIT 500"
                    },
                    dataType: 'json',
                    cache: false,
                    success: function(data){
                        var $li = $('<li>').bind('click', function(){
                            $(this).addClass('active').siblings('.active').removeClass('active');
                            $('.tables .table').eq($(this).prevAll().length).show().siblings('.table').hide();
                        });
                        $('<a href="#">' + table['name'] + '</a>').appendTo($li);
                        var $table = $('<div>').addClass('table').css('height', 300);
                        
                        var grid = new recline.View.SlickGrid({
                            model: new recline.Model.Dataset({ records: data }),
                            el: $table
                        });
                        grid.visible = true;
                        grid.render();
                        
                        if(i==0){ 
                            $li.addClass('active');
                        } else {
                            $table.hide();
                        }
                        $li.appendTo($ul);
                        $table.appendTo($tables);
                    }
                });
            });
            $ul.appendTo('#data');
            $tables.appendTo('#data');
        }, error: function(jqXHR, textStatus, errorThrown){
            $('<div>').addClass('alert').html('<button type="button" class="close" data-dismiss="alert">×</button> <strong>Something went wrong!</strong> We couldn&rsquo;t select data from your project&rsquo;s SQLite API.').appendTo('#data');
            $('#datagrid').hide();
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
