App = Ember.Application.create();

App.Router.map(function() {
  this.route("tracks", { path: "/" });
});

App.Track = Ember.Object.extend({
  artist: function() {
    artists = this.get('artists');
    names = artists.map(function(artist) {
      return artist.name;
    });
    return names.join(", ");
  }.property('artists')
});

App.TrackView = Ember.View.extend({
  classNames: ['track'],
  tagName: 'div',
  templateName: 'track'
})

App.TracksController = Ember.ArrayController.extend({
  current: null,
  paused: true,

  getCurrent: function() {
    var self = this;

    Ember.$.getJSON("/current").then(function(data) {
      self.set('current', data);
      status = data.status.trim();
      paused = status != "playing";
      self.set('paused', paused);
    });
  }.on('init').observes('paused'),

  actions: {
    search: function() {
      var self = this;

      newContent = [];
      query = self.get('query');

      Ember.$.getJSON('http://ws.spotify.com/search/1/track?q=' + query).then(function(data) {

        data.tracks.forEach(function(track) {
          object = App.Track.create(track);
          newContent.pushObject(object)
        });

        self.set('content', newContent);
      });
    },

    play: function(track) {
      Ember.$.post("play/" + track.href);
      this.set('current', { "artist": track.artist, "album": track.album, "track": track.name });
    },

    resume: function() {
      this.set('paused', false);
      Ember.$.post("resume");
    },

    pause: function() {
      this.set('paused', true);
      Ember.$.post("pause");
    },
  }
});

