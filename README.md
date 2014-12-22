installation:
=============
1. Clone this repo:
    - for bitbucket:
    git clone https://bitbucket.com/shikari/testtask
    - for github:
    git clone https://github.com/ruddy22/sometest
1. Install some stuff (gulp and etc):
    - for mac os x:
    sudo npm install
    - for linux:
    npm install
1. Install some libs (angular and etc):
    - for mac and linux:
    ./prepare.sh

usage:
======
1. run:
    - for mac os: gulp
    - for linux: ./gulp

tests:
======
after build project
{} - optional params
1. run:
    - for mac os: karma start {karma.conf.js}
    - for linux: ./karma start {karma.conf.js}
