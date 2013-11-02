$(function() {
  $("form#music-search").submit(function() {
    var keywords = $(this).serialize();
    $("#tracks").empty();

    $.ajax({url: "http://ws.spotify.com/search/1/track?" + keywords, headers: {"Accept": "application/json"}})
      .done(function(responseBody) {
      responseBody.tracks.forEach(function(track) {
        var trackID = track.href.slice(14);

        $("#tracks").append("<li class='track row' value='" + track.href + "'><b><span class='col-6'>" + track.name + "</span></b><span class='col-3'><small>" + track.artists[0].name + "</span><span class='col-3'>" + track.album.name + "</small></span></li><ul class='track-detail' id='" + trackID + "'>");

        $("ul#" + trackID).empty().append("<li class='album'><em>Album:</em> " + track.album.name + "</li><ul class='album-detail'><li><em>Released:</em> " + track.album.released + "</li></ul></ul>");
      
        track.artists.forEach(function(artist) {
          $("ul#" + trackID).append("<li class='artist'><em>Artist:</em> " + artist.name + "</li>");
        });

        $("ul#" + trackID).append("<li class='song link' value='" + track.href + "'>Play Song</li><ul class='hiding'></ul>");

        $.get("http://gdata.youtube.com/feeds/api/videos?q=" + track.name + "%20" + track.artists[0].name + "&format=5&max-results=50&orderby=viewCount&v=2&alt=jsonc")
        .done(function(results) {
          for (var index = 0; index < 50 && index < results.data.items.length; index++) {
            if(results.data.items[index].accessControl.syndicate === "allowed" && results.data.items[index].restrictions == null) {
              var videoID = results.data.items[index].id;
              index = 50; // test with break;
            }
          }

          $("ul#" + trackID).append("<li class='video link' id='" + videoID + "' value='" + track.name + "'>Play Video</li>");

        }).done(function() {
          $("li.video").click(function() {
            var video = $(this).attr("id");
            var songTitle = $(this).attr("value");
            $('.modal-title').empty().append(songTitle);
            $('#music-video').modal('show');
            $('.modal-body').empty().append("<iframe width='420' height='315' src='http://www.youtube.com/v/" + video + "?version=3&f=videos&app=youtube_gdata' frameborder='0' allowfullscreen></iframe>");
          });
        });
      });

      $("li.track").click(function() {
        $(this).next("ul").slideToggle(200);
      });

      $("li.album").click(function() {
        $(this).next("ul").slideToggle(200);
      });

      $(".close").click(function() {
        $('.modal-body').empty();
      })

      $("li.song").click(function() {
        var spotifyURI = $(this).attr("value");
        $(this).next("ul").toggle();
        $(this).next("ul").empty().append("<iframe src='https://embed.spotify.com/?uri=" + spotifyURI + "' width='300' height='80' frameborder='0' allowtransparency='true'></iframe>");
      });
    });
    return false;
  });
});

/*  // WITH SPOTIFY PLAY BUTTON

$("li.track").click(function() {
  var spotifyURI = $(this).attr("value");  // value = spotify URI

  $(this).next("ul").append("<iframe src='https://embed.spotify.com/?uri=" + spotifyURI + "' width='300' height='80' frameborder='0' allowtransparency='true'></iframe>");
});

*/