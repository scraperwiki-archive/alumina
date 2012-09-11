# scraperwiki / alumina #

Alumina: What you add to Cobalt to make the lustrous "Cobalt Blue".

Alumina: A simple dashboard to show off your Cobalt data projects.

## How to use ##

This library is intended to be cloned into ScraperWiki Data Services projects, as a client-facing data interface. To do this, follow these simple steps:

    $ cd /my-data-project/http/
    $ git clone git@github.com:scraperwiki/alumina.git
    $ mv alumina overview
    $ ln -s ../README.md README.md
    $ ln -s ../scraperwiki.json scraperwiki.json

Alumina pulls in your data via the SQLite API, and your README.txt via the symbolic link you just created in your http/ directory.

It also looks in scraperwiki.json for the following keys, and if it finds them, it inserts them into the interface:

    {
        "project-name" : "The Name Of Your Project",
        "customer-name" : "A. Client",
        "status-message" : "Human-readable project status line"
    }

Your overview page will be accessible at a URL like:

    https://box.scraperwiki.com/scraperwiki/project-name/optional-api-key/http/overview/ 

To keep the library up to date:

    $ cd /my-data-project/http/overview/
    $ git pull -u