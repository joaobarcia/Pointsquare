# Pointsquare - alpha 2 #

**This read-me is under construction**

** How to restore database **
- Start meteor project
- In MongoDB /bin folder (i.e. C:\MongoDB\Server\3.2\bin) run: 'mongorestore.exe -h 127.0.0.1 --port 3001 -d meteor c:\backup', where c:\backup is the directory of your backup folder


- - - -

## Alpha 2 Milestone ##
**Deadline** - Early September

**Goals**

* DONE ~~Users can register, login (tricky part is interaction of accounts package with OrientDB..)~~

* DONE ~~Browse/search through existing concepts and lessons with a soundcloud/rdio/airbnb inspired search UI~~

* DONE ~~Visualize/execute lessons and the database will propagate and record their knowledge~~

- - - -

## App structure ##

	├── both/				> code runs both on client-side and server-side
	|   ├── accounts/			> config files for the Accounts package (manages users, logins, pwds, etc.)
	|   ├── collections/		> instantiates MongoDB collections and connects them to the Easy Search package
	|   ├── controllers/		> not really sure :P have to look into it. traces from the boilerplate
	|   └── router/				> config files for Iron Router package (manages URL structure and logic)
	|
	├── client/				> code runs ONLY on client-side
	|   ├── compatibility/		> js libraries which must be loaded before any other code
	|   ├── helpers/			> Meteor Helpers, organized by template where they are needed
	|   ├── stylesheets/		> CSS files
	|   ├── subscriptions/		> Meteor Subscriptions
	|   └── templates/			> Meteor Templates, organized by folders with template name. Folders contain html and js
	|
	├── public/				> files which can be publicly accessed
	|   ├── fonts/				> fonts
	|   └── images/				> images
	|
	├── server/				> code runs ONLY on server-side
	|   ├── emails/				> configuration of Email package (sends emails to users)
	|   ├── kadira/				> configuration of Kadira package (awesome analytics)
	|   ├── methods/			> Meteor Methods (basically OrientDB interaction right now)
	|   ├── orientDB/			> the initial import of OrientDB data is here. prob will be moved
	|   ├── permissions/		> NOT IN USE (placeholder from boilerplate)
	|   ├── publications/		> Meteor Publications
	|   ├── seeds/				> NOT IN USE (placeholder from boilerplate)
	|   └── templates/			> server side Meteor Templates
	|
	├── mup.json					> config for MUP package (server deployment)
	├── README.MD					> this readme
	├── settings.example.json		> need to check later
	└── settings.json				> need to check later

- - - -

## Main packages ##
