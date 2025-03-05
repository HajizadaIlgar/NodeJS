let postingPrompt = ""; // Ai a Gedecek Olan Promt
let selectedColor = ""; 
const generatePrompt = document.getElementById('generatePrompt');
function generatePromt() {
    if(selectedColor){
        postingPrompt = `i want to make a combine for tomorrow, based on this color ${selectedColor}.`;
    }else{
        postingPrompt = "i want to make a combine for tomorrow";
    }
}

document.querySelectorAll('input[name="clothColor"]').forEach(radio => {
    radio.addEventListener('change', () => {
        selectedColor=radio.value;
    });
});

generatePrompt.addEventListener('click', () => {
    generatePromt();
    generatedPrompt.innerHTML = postingPrompt;
});

document
        .getElementById("visionForm")
        .addEventListener("submit", async function (event) {
          event.preventDefault(); // Prevent the form from reloading the page

          const promptText =postingPrompt;
          const fileInput = document.getElementById("file");
          const file = fileInput.files[0];
          if (!file) {
            alert("Please select a file!");
            return;
          }
      
          const formData = new FormData();
          formData.append("image", file);
  
          const options = {
            method: "POST",
            headers: {
              "x-rapidapi-key":
                "fba9e8b3d6msh97741eec14dcba1p115c59jsnb6b4555ece5a",
              "x-rapidapi-host": "chatgpt-vision1.p.rapidapi.com",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messages: [
                {
                  role: "user",
                  content: [
                    { type: "text", text: promptText },
                    { type: "image",formData },
                  ],
                },
              ],
              web_access: false,
            }),
          };

          try {
            const response = await fetch(url, options);
            if (!response.ok) {
              throw new Error(
                `Network response was not ok: ${response.status}`
              );
            }
            const result = await response.json();
            console.log(result);

            // Format and display the response
            const resultText = result.result || "No result returned.";
            document.getElementById(
              "aiResponse"
            ).innerHTML = `<strong>Response:</strong> <p>${resultText}</p>`;
          } catch (error) {
            console.error(error);
            document.getElementById(
              "aiResponse"
            ).innerHTML = `<strong>Error:</strong> ${error.message}`;
          }
        });
// postingPrompt BUNU AI YA GONDERMEK LAZIM