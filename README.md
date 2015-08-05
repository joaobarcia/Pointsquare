# Pointsquare - alpha 2 branch #

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
	├── client/				> code runs ONLY on client-side 
	|   ├── accounts/			> config files for the accounts package (manages users, logins, pwds, etc.) 
	|   ├── collections/		> instantiates MongoDB collections and connects them to the easy search package 
	|   ├── controllers/		> not really sure :P have to look into it. traces from the boilerplate 
	|   └── router/				> code runs ONLY on client-side 
	├── public/				> files which can be publicly accessed
	|   ├── ...
	|   └── ...
	├── server/				> code runs ONLY on server-side 
	|   ├── ...
	|   ├── ...
	|   ├── ...
	|   └── ...
	├── mup.json
	├── README.MD
	├── settings.example.json
	└── settings.json

- - - -

## Main packages ##