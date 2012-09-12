$(function(){

    $.ajax({
        url: "README.symlink.md",
        dataType: 'text',
        cache: false,
        success: function(data){
            $('#notes .loading').remove();
            $('#notes').append('<pre>' + data + '</pre>');
        }, error: function(jqXHR, textStatus, errorThrown){
            $('#notes .loading').remove();
            $('<div>').addClass('alert').html('<i class="icon-exclamation-sign"></i> Your Data Scientist&rsquo;s notes could not be loaded &ndash; Sorry!').css('color', '#333').appendTo('#notes');
        }
    });

    $.ajax({
        url: "scraperwiki.symlink.json",
        dataType: 'json',
        cache: false,
        success: function(data){
            console.log(data);
            $('#info h1').html(data['project-name'] + ' <small>' + data['customer-name'] + '</small>');
            $('#info .lead').html('<b>Latest status:</b> ' + data['project-status']);
        }, error: function(jqXHR, textStatus, errorThrown){
            console.log('scraperwiki.json could not be loaded');
        }
    });

    var data = [
        {id: 0, date: '2011-01-01', x: 1, y: 2, z: 3, country: 'DE', geo: {lat:52.56, lon:13.40} },
        {id: 1, date: '2011-02-02', x: 2, y: 4, z: 24, country: 'UK', geo: {lat:54.97, lon:-1.60}},
        {id: 2, date: '2011-03-03', x: 3, y: 6, z: 9, country: 'US', geo: {lat:40.00, lon:-75.5}},
        {id: 3, date: '2011-04-04', x: 4, y: 8, z: 6, country: 'UK', geo: {lat:57.27, lon:-6.20}},
        {id: 4, date: '2011-05-04', x: 5, y: 10, z: 15, country: 'UK', geo: {lat:51.58, lon:0}},
        {id: 5, date: '2011-06-02', x: 6, y: 12, z: 18, country: 'DE', geo: {lat:51.04, lon:7.9}}
    ];
    var dataset = new recline.Model.Dataset({
        records: data
    });
    var $el = $('#datagrid');
    var grid = new recline.View.SlickGrid({
        model: dataset,
        el: $el
    });
    grid.visible = true;
    grid.render();

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
