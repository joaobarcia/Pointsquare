# Pointsquare - alpha 2 #

**This read-me is under construction**

- - - -

## Alpha 2 Milestone ##
**Deadline** - Early September

**Goals**

* Users can register, login, 

* Browse/search through existing concepts and lessons with a soundcloud/rdio/airbnb inspired search UI

* Visualize/execute lessons and the database will propagate and record their knowledge

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
	|   ├── ...
	|   └── ...
	|
	├── server/				> code runs ONLY on server-side 
	|   ├── ...
	|   ├── ...
	|   ├── ...
	|   └── ...
	|
	├── mup.json
	├── README.MD
	├── settings.example.json
	└── settings.json

- - - -

## Main packages ##