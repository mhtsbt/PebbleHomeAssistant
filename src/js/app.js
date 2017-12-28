var UI = require('ui');
var Settings = require('settings');

var card = new UI.Card({
  title: 'Hello World',
  body: 'This is your first Pebble app!',
  scrollable: true
});

var ha_url = Settings.option('url');

if (!ha_url) {
  var card = new UI.Card({
  title: 'URL NOT SET',
  titleColor: 'sunset-orange', // Named string
  subtitle: 'Please use the pebble app to configure HA first',
  subtitleColor: '#00dd00', // 6-digit Hexadecimal string
  body: 'Format',
  bodyColor: 0x9a0036 // 6-digit Hexadecimal number
});

card.show();
}

var ajax = require('ajax');

Settings.config(
  { url: 'http://users.telenet.be/mhb/ha_pebble/index.html' },
  function(e) {
    console.log('closed configurable');

    // Show the parsed response
    console.log(JSON.stringify(e.options));

    // Show the raw response if parsing failed
    if (e.failed) {
      console.log(e.response);
    }
  }
);

ajax({ url: ha_url+'/api/services', type: 'json' },
  function(data, status, req) {
    
    var scripts = data.filter(function(res) { return res.domain == "script" })[0];
        
    var menuItems = [];
    var services = Object.keys(scripts.services);
    
    for (var i=0;i<services.length;i++) {
      
      menuItems.push({title:services[i]})
      
    }
    
    
var menu = new UI.Menu({
  sections: [{
    title: 'Scripts',
    items: menuItems
  }]
});
    
menu.on('select', function(e) {
  console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
  console.log('The item is titled "' + e.item.title + '"');
  
  ajax({ url: ha_url+'/api/services/script/'+e.item.title, type: 'json',method:'post' },
  function(data) {
    console.log("done running script");
  }
);
  
});

menu.show();
    
  }
);

