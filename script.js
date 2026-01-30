document.getElementById('generate-button').addEventListener('click', (e) => {
   e.preventDefault();
   const genre = document.getElementById('genre').value;
   const title = document.getElementById('title').value;
   const author = document.getElementById('author').value;
   const character = document.getElementById('character').value;
   const storyline = document.getElementById('storyline').value;
   const message = document.getElementById('message').value;
   const date = document.getElementById('date').value;

   if (!genre || !title || !author || !character || !storyline || !message || !date) {
      alert("Please fill in all fields before generating the story.");
      return;
   }

   const result = `
<h2>Generated Story</h2>
<p><strong>Genre:</strong> ${genre}</p>
<p><strong>Title:</strong> ${title}</p>
<p><strong>Author:</strong> ${author}</p>
<p><strong>Character:</strong> ${character}</p>
<p><strong>Storyline:</strong> ${storyline}</p>
<p><strong>Message:</strong> ${message}</p>
<p><strong>Date:</strong> ${date}</p>
   `;
   document.getElementById('result').innerHTML = result;
});