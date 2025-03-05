
var sub = document.querySelector('#ProfileForm');

sub.addEventListener('submit', async function(event) {
  event.preventDefault(); // Corrected: now calling the function
  var text = document.querySelector('#pron').value;
  
  if (text == '') {
    alert(text);
  } else {
    const url = `https://porn-image1.p.rapidapi.com/?type=${text}`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': 'be7f90d2f1mshff487f236fcba32p1a78e5jsn9eb69153a7cc',
        'x-rapidapi-host': 'porn-image1.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
    console.log(result.url);
      document.querySelector('#img').src = result.url;
    } catch (error) {
      console.error("Error: " + error);
    }
  }
});
