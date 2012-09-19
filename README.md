# scraperwiki / alumina #

Alumina: What you add to Cobalt to make the lustrous pigment "Cobalt Blue".

Alumina: What you add to Cobalt data projects to make them look awesome.

## Live example ##

http://box.scraperwiki.com/scraperwiki/alumina-example/http/overview/

## How to install ##

This library is intended to be cloned into ScraperWiki Data Services projects, as a client-facing data interface. Like so:

    $ cd /my-data-project/http/
    $ git clone git://github.com/scraperwiki/alumina.git
    $ mv alumina overview

Note: Alumnia contains two symlinks in its base directory, one pointing to the `README.md` file two levels up, and one the `scraperwiki.json` file two levels up. Since this means these two files will now be accessible via the http web endpoint, we suggest you assign a `publish_token` to restrict access to the endpoint.

## How to use ##

Alumina pulls in your data via the SQLite API, and your `README.md` via the symbolic link in its root directory.

It also looks in `scraperwiki.json` for the following keys, and if it finds them, it inserts them into the interface:

    {
        "project_name" : "The Name Of Your Project",
        "customer_name" : "A. Client",
        "status_message" : "Human-readable project status line"
    }

Your overview page will be accessible at a URL like:

    https://box.scraperwiki.com/scraperwiki/my-data-project/0pt10n4lT0k3n/http/overview/ 

## How to update ##

To keep the library up to date:

    $ cd /my-data-project/http/overview/
    $ git pull -u