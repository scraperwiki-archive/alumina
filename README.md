# scraperwiki / alumina #

Alumina: What you add to Cobalt to make the lustrous "Cobalt Blue".

Alumina: A simple dashboard to show off your Cobalt data projects.

## How to use ##

This library is intended to be cloned into ScraperWiki Data Services projects, as a client-facing data interface. Like so:

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

    https://box.scraperwiki.com/scraperwiki/my-data-project/0PT10N4L-AP1-K3Y/http/overview/ 

Note: For Alumnia to work, you *must* create symlinks for `README.md` and `scraperwiki.json` in the `http/` directory. Since this means these two files will now be accessible via the http web endpoint, we suggest you assign a `publishing-token` to restrict access to the endpoint.

To keep the library up to date:

    $ cd /my-data-project/http/overview/
    $ git pull -u