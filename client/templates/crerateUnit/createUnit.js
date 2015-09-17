Template.createUnit.rendered = function() {
    $('#input-tags').selectize({
        delimiter: ',',
        persist: false,
        create: function(input) {
            return {
                value: input,
                text: input
            }
        }
    });

    $('.sortable').sortable();

    var tempSubContent = [{
            "type": "youtube",
            "youtubeVidID": "e_SpXIw_Qts"
        }, {
            "type": "text",
            "text": "The test command in Unix evaluates the expression parameter. In some shells such as FreeBSD sh(1) it is a shell builtin, even though the external version still exists. In the second form of the command, the [ ] (brackets) must be surrounded by blank spaces. This is because [ is a program and POSIX compatible shells require a space between the program name and its arguments. One must test explicitly for file names in the C shell. File-name substitution (globbing) causes the shell script to exit."
        }, {
            "type": "image",
            "imgURL": "explanation.png"
        }, {
            "type": "remoteImage",
            "remoteImgURL": "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQFDk8krsUGDCxkWy9maInhpvy3P9iKwHCWTBhRRnMglt4BezoBE42EC6E"
        }, {
            "type": "youtube",
            "youtubeVidID": "fOXo4p4WDKM"
        }

    ];
    Session.set('tempSubContent', tempSubContent);
}
