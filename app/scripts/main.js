import Handlebars from 'handlebars';
import ludum from './data/ludum.json';
import { jams, misc, snippets } from './data/games.json';

const renderEntries = () => {
  const entryTemplate = Handlebars.compile($('#entries-template').html());
  $('#entries-ctn').empty().append(entryTemplate({ author: transform(ludum) }));
}

const renderJams = () => {
  const jamsTemplate = Handlebars.compile($('#gamejams-template').html());
  $('#jams-ctn').empty().append(jamsTemplate({ entries: jams }));
}

const renderMisc = () => {
  const miscTemplate = Handlebars.compile($('#misc-template').html());
  $('#misc-ctn').empty().append(miscTemplate({ games: misc }));
}

const transform = author => {
  let uid = author.ldUserId;
  author.link = `http://ludumdare.com/compo/author/${author.ldUser}`;

  author.entries.forEach( entry => {
    let ld = entry.ludum;

    if (!entry.noScores){
      entry.categories = [];

      Object.keys(entry.scores).forEach( key => {
        let score = entry.scores[key];
        let isLast = (key === 'average' ? true : false);

        entry.categories.push({
          name: key,
          score: score,
          rank: isLast ? entry.ranking.total : entry.ranking[key],
          percent: entry.percents[key],
          last: isLast
        });
      });

      entry.categories.sort(function(a, b){
        return a.rank > b.rank;
      });
    }

    entry.entryURL = `http://ludumdare.com/compo/ludum-dare-${ld}/?action=preview&uid=${uid}`;
    entry.play = `https://psychonull.github.io/${(entry.play ? entry.play : 'ld'+ld)}`;
    entry.source = `https://github.com/psychonull/ld${ld}`;
    entry.image = `/images/entries/ld${ld}.png`;
    entry.thumb = `/images/entries/ld${ld}_thumb.jpg`;
  });

  return author;
}

$(document).ready(function(){

  renderEntries();
  renderJams();
  renderMisc();

});
