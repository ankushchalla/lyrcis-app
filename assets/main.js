var apiKey = "5fdfd8b8b33408cad71de26acf2b6c9f";

function translate(lyrics) {
  // Default translation is Spanish.
  var inputLang = $("#search-lang option:selected").text();
  if (inputLang === "Italian") {
    var lang = "it";
  } else if (inputLang === "Spanish") {
    var lang = "es";
  } else if (inputLang === "French") {
    var lang = "fr";
  }
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://google-translate1.p.rapidapi.com/language/translate/v2",
    "method": "POST",
    "headers": {
      "x-rapidapi-host": "google-translate1.p.rapidapi.com",
      "x-rapidapi-key": "3d49dbd209msh5e2bcaf5544db64p181262jsn89c70bd689e7",
      "content-type": "application/x-www-form-urlencoded"
    },
    "data": {
      "source": "en",
      "q": lyrics,
      "target": lang,
      "content-encoding": "gzip",
    }
  }
  $.ajax(settings).done(function (response) {
    console.log(response.data.translations[0]);
  });
}

// Using MyMemory API.
function translate1(lyrics) {
  var de = "ankushchalla@gmail.com"
  var inputLang = $("#search-lang option:selected").text();
  if (inputLang === "Italian") {
    var lang = "it";
  }
  else if (inputLang === "Spanish") {
    var lang = "es";
  }
  else if (inputLang === "French") {
    var lang = "fr";
  }
  else {
    return;
  }
  var url = `https://api.mymemory.translated.net/get?q=${lyrics}&langpair=en|${lang}&de=${de}`
  $.ajax({
    url: url,
    method: "GET"
  }).then(function (response) {
    var translation = response.responseData.translatedText;
    console.log("Translation:", translation);
  })
}

// Gets track ID for song + artist inputted by user and uses that 
// ID to find lyrics.
function getLyrics() {
  var songName = $("#search-song").val();
  var artist = $("#search-artist").val();
  var method = "track.search?";
  var q = `q_track=${songName}&q_artist=${artist}`;
  var songURL = `https://cors-anywhere.herokuapp.com/api.musixmatch.com/ws/1.1/${method}&${q}&apikey=${apiKey}`;

  $.ajax({
    url: songURL,
    type: "GET"
  }).then(function (response) {
    // Call can return an empty error, check for that. 
    try {
      var trackID = JSON.parse(response).message.body.track_list[0].track.track_id;
      var artistID = JSON.parse(response).message.body.track_list[0].track.artist_id;
    }
    catch (error) {
      if (error instanceof TypeError) {
        alert("This song does not exist in our database, please try another :)");
        location.reload();
      }
      else {
        throw error;
      }
    }

    method = "track.lyrics.get?";
    q = `track_id=${trackID}`;
    songURL = `https://cors-anywhere.herokuapp.com/api.musixmatch.com/ws/1.1/${method}&${q}&apikey=${apiKey}`;

    // Translate lyrics.
    $.ajax({
      url: songURL,
      type: "GET"
    }).then(function (response) {
      var fullLyrics = JSON.parse(response).message.body.lyrics.lyrics_body;
      // putting text in HTML
      var textBox = document.querySelector(".example3");
      textBox.textContent = fullLyrics
      console.log("Lyrics:", fullLyrics);
      var lyrics = fullLyrics.substring(0, 300);
      translate(lyrics);
    })

    // Get related artists using artist ID. 
    // method = "artist.related.get?";
    // q = `artist_id=${artistID}`;
    // songURL = `https://cors-anywhere.herokuapp.com/api.musixmatch.com/ws/1.1/${method}&${q}&apikey=${apiKey}`;
    // $.ajax({
    //   url: songURL,
    //   method: "GET"
    // }).then(function (response) {
    //   var artists = JSON.parse(response).message.body.artist_list;
    //   var artistNames = [];
    //   for (var i = 0; i < artists.length; i++) {
    //     artistNames[i] = artists[i].artist.artist_name;
    //   }
    //   console.log("Related artists:", artistNames);
    //   var textBox = document.querySelector(".example2")
    //   textBox.textContent = artistNames
    // })
  })
}

// When you click on one of these buttons the information will pop out. Album Cover, Related Artist, Lyrics, and Langauage Translator.
function openPage(pageName, elmnt, color) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = "";
  }
  // document.getElementById(pageName).style.display = "block";
  // elmnt.style.backgroundColor = color;
}

$("#searchBtn").on("click", function (event) {
  event.preventDefault();
  getLyrics();
});