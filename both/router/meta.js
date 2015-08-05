if (Meteor.isClient) {
    Meta.config({
        options: {
            // Meteor.settings[Meteor.settings.environment].public.meta.title
            title: 'Diskorse',
            suffix: 'Suffix'
        }
    });
}