modules["Alignment"] = (function(){

    var id1 = null, id2 = null;
    var mark_id1 = null, mark_id2 = null;

    var twin = $("#book-info").attr('data-bookid'); //(/\/([0-9]+)/g).exec(href)[1];

    var highlight = "rgb(160, 222, 238)";

    var pre = function () {
        window.bindings = jQuery.parseJSON($("#alignments").text());
        draw_table(window.bindings);
        rebind();

        $(document).mousedown(function (e) {
            if (e.which == 3) {
                $("#sent-" + id1).css("background", "");
                id1 = null;
            }
        });
    };

    pre.call();

    function draw_table(marks) {

        $("#align-table").html("");

        var lc = 0;
        var l_sents = $("#rawtext .left-twin .sentence");
        while (l_sents[lc].id != marks[0].BookmarkId1) lc++;

        var rc = 0;
        var r_sents = $("#rawtext .right-twin .sentence");
        while (r_sents[rc].id != marks[0].BookmarkId2) rc++;

        for (var i = 0; i < marks.length - 1; i++) {
            var l_html = "";
            for (; l_sents[lc].id != marks[i + 1].BookmarkId1; lc++) {
                l_html += stringSentenceSpan(l_sents[lc]);
            }
            var r_html = "";
            for (; r_sents[rc].id != marks[i + 1].BookmarkId2; rc++) {
                r_html += stringSentenceSpan(r_sents[rc]);
            }
            $("#align-table").append(stringTableRaw(marks[i], l_html, r_html));
        }
        var l_html = "";
        for (; lc < l_sents.length; lc++) {
            l_html += stringSentenceSpan(l_sents[lc]);
        }
        var r_html = "";
        for (; rc < r_sents.length; rc++) {
            r_html += stringSentenceSpan(r_sents[rc]);
        }
        $("#align-table").append(stringTableRaw(marks[marks.length - 1], l_html, r_html));
    }

    function rebind() {

        $(".table-sent").click(function () {

            if (id1 == null) {
                id1 = (/sent-(.+)/g).exec(this.id)[1];
                $(this).css("background", highlight);
            } else {
                id2 = (/sent-(.+)/g).exec(this.id)[1];
                $(this).css("background", highlight);

                // if same language
                if ($("#sent-" + id1).parents('.left-cell').length == 0 ||
                    $("#sent-" + id2).parents('.right-cell').length == 0) {

                    $("#sent-" + id1).css("background", "");
                    $(this).css("background", highlight);
                    id1 = id2;
                    return;
                }

                // if right then left
                if ($("#sent-" + id1).parents('.left-cell').length == 0) {
                    var c = id2; id2 = id1; id1 = c;
                }

                previewRealign(id1, id2);
                addBookmarkBinding(id1, id2);

                id1 = null
            }
            return false;
        });

        var _bind_actions = function () {
            $(".change-left").on("click", function () {
                var _id = $(this).attr("data-to");

                _finder = "#left-" + _id;

                window.action(0, _finder);
                return false;
            });
            $(".change-right").on("click", function () {
                var _id = $(this).attr("data-to");

                _finder = "#right-" + _id;

                window.action(1, _finder);
                return false;
            });
            $(".change-twin").on("click", function () {
                var _id = $(this).attr("data-to");

                _finder = "#twin-" + _id;
                window.action(3, _finder);
                return false;
            });
        }

        _bind_actions.call();
    }

    function addBookmarkBinding(id1, id2) {
        WinJS.xhr({
            url: "http://localhost:1600/Alignment/CreateBookmark/" + twin + "/" + id1 + "/" + id2,
            contentType: "application/json; charset=utf-8",
            responseType: "json"
        }).done(
        function completed(request) {
            
            var data = JSON.parse(request.response);
            window.bindings = data;
            draw_table(window.bindings);
            rebind();
            newMarkHighlight(id1);
            window.bindings_changed = true;
            // handle completed download.
        },
        function error(request) {
            console.log('Some kind of error');
            $(".twin-links").removeClass('loading')
                .css("visibility", "");

            $("#sent-" + id1).css("background", "");
            $("#sent-" + id2).css("background", "");

            id1 = null;
        },
        function progress(request) {
            // report on progress of download.
        });
        /*
        $.ajax({
            url: "http://localhost:1600/Alignment/CreateBookmark/" + twin + "/" + id1 + "/" + id2,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false,
            success: function (data) {
                window.bindings = data;
                draw_table(window.bindings);
                rebind();
                newMarkHighlight(id1);
                window.bindings_changed = true;
            },
            error: function (error) {
                console.log('Some kind of error');
                $(".twin-links").removeClass('loading')
                    .css("visibility", "");

                $("#sent-" + id1).css("background", "");
                $("#sent-" + id2).css("background", "");

                id1 = null;
            },
            complete: function () {
            }
        });
        */
    }

    function previewRealign(id1, id2) {

        var mark_id1 = (/mark-(.+)/g).exec(
            $("#sent-" + id1).parents(".mark").attr('id'))[1];
        var mark_id2 = (/mark-(.+)/g).exec(
            $("#sent-" + id2).parents(".mark").attr('id'))[1];

        var ll = 0;
        while (window.bindings[ll].Id != mark_id1) ll++;
        var rr = 0;
        while (window.bindings[rr].Id != mark_id2) rr++;

        var j = (ll < rr ? ll : rr);
        var min_j = j;
        var max_j = (ll > rr ? ll : rr);

        for (; j <= max_j; j++) {
            $("#mark-" + window.bindings[j].Id + " .twin-links").addClass("loading");
            //$("#mark-" + window.bindings[j].Id + " .twin-links").css("background-color", "red");
        }
    }

    function newMarkHighlight(id1) {
        // mark hightlight
        var mark = $.grep(window.bindings, function (el, i) { return el.BookmarkId1 == id1 })[0];

        $("#mark-" + mark.Id + " .twins")
            .animate({ backgroundColor: "rgb(73, 202, 73)" }, 200)
            .animate({ backgroundColor: "rgb(255, 255, 255)" }, 1200);
    }

    function stringTableRaw(mark, left, right) {
        return '<tr id="mark-' + mark.Id + '" class="mark">' +
            '<td class="twins left-cell">' + left + "</td>" +
            '<td class="twins right-cell">' + right + "</td>" +
            '<td class="twin-links">' + 
                "<a href=# data-to=" + mark.BookmarkId1 +
                " class=change-left></a> <a href=# data-to=" + mark.BookmarkId2 +
                " class=change-right></a> <a href=# data-to="
                + mark.BookmarkId1 + " class=change-twin></a>" +
            '</td>'
        '</tr>';
    }

    function stringSentenceSpan(sent) {
        return '<span class="table-sent" id="sent-' + sent.id +
            '">' + $(sent).html() + '</span>'
    }

});

modules["Alignment-Mode-Tooltips"] = (function () {


});