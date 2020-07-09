var chance;
var favorites;
var storage;

$(document).ready(function() {
  chance = new Chance(); // Just for random hash generation
  if (window.Storage != undefined) {
    storage = window.localStorage;
    if (storage.favorites == undefined) {
      favorites = [];
    } else {
      favorites = JSON.parse(storage.favorites);
    }
    updateList();

    $('#fav').click(function() {
      addFavorite(window.location);
      updateList();
    });

    $('#list').on('click', 'li a', function() {
      deleteFavorite($(this).data('id'));
      updateList();
    });
  } else {
    // No support for local storage
    // Fall back to cookies or session based storage
  }
});

function addFavorite(url) {
  favorites.push({
    id: chance.hash({
      length: 15
    }),
    url: url
  });
  storage.setItem('favorites', JSON.stringify(favorites));
}

function deleteFavorite(id) {
  for (var i in favorites) {
    if (favorites[i].id == id) {
      favorites.splice(i, 1);
    }
  }
  storage.setItem('favorites', JSON.stringify(favorites));
}

function updateList() {
  $('#list').empty();
  if (typeof favorites !== 'undefined' && favorites.length > 0) {
    for (var i in favorites) {
      $('#list').append('<li>' +
        favorites[i].url.href +
        '&nbsp;&nbsp;&nbsp;&nbsp;' +
        '<a class="delete" href="#" data-id="' + favorites[i].id + '">delete</a>' +
        '</li>');
    }
  } else {
    $('#list').append('<li>Nothing stored!</li>');
  }
}

/*
Add these once you're done:

<script src="https://cdnjs.cloudflare.com/ajax/libs/chance/1.0.3/chance.min.js"></script>
(maybe not this one)<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>

*/