function sqlite(args){
    var options = {
        columns: "*",
        table: "sqlite_master WHERE (type='table' OR type='view') AND name NOT LIKE '#_%'  ESCAPE '#'",
        limit: 50,
        offset: 0,
        orderby: null
    }
    $.extend(true, options, args);
    return $.ajax({
        url: "../../sqlite",
        dataType: 'json',
        cache: false,
        data: {
            q: 'SELECT ' + options.columns + ' FROM ' + options.table + ( options.orderby ? ' ORDER BY ' + options.orderby : '' ) + ' LIMIT ' + options.limit + ' OFFSET ' + options.offset
        }
    });
}

function showSlickGrid(table_name){
    sqlite({
        table: table_name
    }).done(function(data){
        var grid;
        var options = {
            enableColumnReorder: true,
            enableTextSelectionOnCells: true
        }
        // create column definitions from first row of data
        var columns = [];
        for(var key in data[0]){
            columns.push({
                id: key,
                name: key,
                field: key,
                sortable: true
            });
        }

        // create the table
        grid = new Slick.Grid("#datagrid", data, columns, options);
        var ordercolumn = null;
        var orderdirection = null;

        // handle sorting of data
        grid.onSort.subscribe(function(e, args){
            $('#data h2 small').show();
            grid.scrollRowIntoView(0);
            ordercolumn = args.sortCol.field;
            orderdirection = args.sortAsc;
            sqlite({
                table: table_name,
                orderby: ordercolumn + ' ' + (orderdirection ? 'asc' : 'desc')
            }).done(function(newdata){
                data = newdata;
                grid.setData(data);
                grid.updateRowCount();
                grid.render();
                $('#data h2 small').hide();
            });
        });

        // infinite scrolling
        var loading = false;
        var allDataLoaded = false;
        var rowsToGet = 100;
        grid.onViewportChanged.subscribe(function (e, args) {
            if(!loading && !allDataLoaded && grid.getViewport().bottom + 20 > grid.getDataLength()){
                $('#data h2 small').show();
                loading = true;
                var sqlite_options = {
                    table: table_name,
                    limit: rowsToGet,
                    offset: grid.getDataLength()
                }
                if(ordercolumn && orderdirection){
                    sqlite_options['orderby'] = ordercolumn + ' ' + (orderdirection ? 'asc' : 'desc');
                }
                sqlite(sqlite_options).done(function(newdata){
                    $.each(newdata, function(i,row){
                        data.push(row);
                    });
                    grid.updateRowCount();
                    grid.render();
                    loading = false;
                    $('#data h2 small').hide();
                    if(newdata.length < rowsToGet){
                        allDataLoaded = true;
                    }
                });
            }
        });

        function saveColumnInfo(e, args){
            var cols = [];
            $.each(args.grid.getColumns(), function(i, col){
                var c = {};
                c[col.name] = col.width;
                cols.push(c);
            });
            console.log(cols);
        }

        grid.onColumnsReordered.subscribe(saveColumnInfo);
        grid.onColumnsResized.subscribe(saveColumnInfo);

    });
}

$(function(){

    $.ajax({
        url: "README.symlink.md",
        dataType: 'text',
        cache: false,
        success: function(text){
            $('#notes h2 small').hide();
            var converter = new Showdown.converter();
            var html = converter.makeHtml(text);
            $('#notes').append('<div class="well">' + html + '</div>');
        }, error: function(jqXHR, textStatus, errorThrown){
            $('#notes h2 small').hide();
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

    sqlite().done(function(tables){
        if(tables.length == 0){
            // no tables
            $('#data').hide();
        } else {
            if(tables.length > 1){
                var $ul = $('<ul>').addClass('nav nav-tabs');
                $.each(tables, function(i, table){
                    $('<li' + ( i==0 ? ' class="active"' : '' ) + '>').append('<a href="#">' + table['name'] + '</a>').bind('click', function(){
                        $(this).addClass('active').siblings('.active').removeClass('active');
                        showSlickGrid($(this).text());
                    }).appendTo($ul);
                });
                $ul.appendTo('#data');
            }
            $('<div id="datagrid">').appendTo('#data');
            showSlickGrid(tables[0]['name']);
        }
        $('#data h2 small').hide();
    }).fail(function(jqXHR, textStatus, errorThrown){
        $('<div>').addClass('alert').html('<button type="button" class="close" data-dismiss="alert">×</button> <strong>Something went wrong!</strong> We couldn&rsquo;t select data from your project&rsquo;s SQLite API.').appendTo('#data');
        $('#datagrid').hide();
        $('#data h2 small').hide();
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
