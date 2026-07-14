fetch('https://mpd26wc44.blogspot.com/p/matchday01.html?m=1').then(r=>r.text()).then(t => { 
  console.log('Total characters:', t.length);
  // Find anything containing .mpd
  const mpdMatch = t.match(/[\w\-\.\/:]+\.mpd/gi);
  if(mpdMatch) console.log('MPDs found:', mpdMatch);
  
  // Find clear keys (hex strings, JSON, etc)
  const keyMatch = t.match(/keyId|keyVal|clearKeys/gi);
  if(keyMatch) console.log('Keys mentioned:', keyMatch);
  
  // Look for any scripts
  const scripts = t.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
  if (scripts) {
    scripts.forEach(s => {
      if (s.includes('shaka') || s.includes('mpd') || s.includes('player') || s.includes('atob')) {
        console.log('Found interesting script:', s.substring(0, 300));
      }
    });
  }
}).catch(console.error);
