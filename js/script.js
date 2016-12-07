$(document).ready(function() {

  $('.reset').on('click', function() {
    $('.search').val('');
    $('.results').empty();
    $('ul').empty();
  });

  function searchWiki(value) {
    if(!$('ul').empty()) {
      $('ul').empty();
    }

    $.ajax({
      url: 'https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srsearch=' + value + '&srnamespace=0&srinfo=suggestion&srprop=snippet&srlimit=10&callback=?',
      dataType: 'jsonp',
      type: 'get',
      headers: {'Api-User-Agent': 'Example/1.0'},
    }).done(function(data) {
      $('.results').empty();
      let resultsArr = data.query.search;
      resultsArr.forEach(function(item) {
        title = item.title;
        summary = item.snippet;
        link = 'https://en.wikipedia.org/wiki/' + encodeURIComponent(title);

        let resultItem = '<a href="' + link + '" target="_blank"><div class="result-item"><h3>' + title + '</h3><p">' + summary + '</p></div></a>';
        $('.results').append(resultItem);
        $('.search').blur();
      })
    });
  }

  let count = 0;

  $('.search').on('keyup', function(event) {
    $('.results').empty();
    let value = $('.search').val();
    count++;

    if(event.keyCode !== 13) {
      $('.results').empty();
    }

    if (value.length === 0) {
      $('.results').empty();
      $('ul').empty();
    }

    if (event.keyCode == 13 && value.length !== 0) {
      searchWiki(value);
      $('ul').empty();
    } else {
      if (count > 1 && count % 2 === 0 && value.length > 0) {
        $.ajax({
          url: "http://en.wikipedia.org/w/api.php",
          dataType: "jsonp",
          data: {
            'action': "opensearch",
            'format': "json",
            'search': value
          },
          success: function(result) {
            $('ul').empty();
            result[1].forEach(function(suggest) {
              var option = '<li tabindex="0">' + suggest + '</li>';
              $('ul').append(option);
            });

            $('li').on('click', function() {
              var liValue = $(this).text();
              $('.search').val(liValue).focus();
              searchWiki($('.search').val());
            });

            $('li').on('keyup', function(ev) {
              if (event.keyCode == 13) {
                var liValue = $(this).text();
                $('.search').val(liValue).focus();
                searchWiki($('.search').val());
              }
            });
          }
        });
      }
    }
  });
});