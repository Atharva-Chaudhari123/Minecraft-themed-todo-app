

const add = document.getElementById("addBtn");
const task = document.getElementById("tasks");
const input = document.getElementById("task-input");
let taskCount = 0;


function addTask() {

  const taskString = input.value.trim();
  if (taskString === "") return;

  //API requests 
  addToDatabase(taskString) ;
  
  const row = document.createElement("div");
  row.setAttribute("class", "task-row") ;

  const div = document.createElement("div") ;
  div.setAttribute("class", "todo-tasks")
  div.textContent = taskString ;
  // Create container label
  const label = document.createElement("label");
  label.setAttribute("class", "container2");



  // Create input checkbox
  const checkBox = document.createElement("input");
  checkBox.setAttribute("type", "checkbox");
  checkBox.setAttribute("checked", "checked");
  checkBox.setAttribute("id" , `checkbox-${taskCount}`) ;


  // Create checkmark div
  const checkmark = document.createElement("div");
  checkmark.setAttribute("class", "checkmark");

  // Create torch div and its child elements
  const torch = document.createElement("div");
  torch.setAttribute("class", "torch");

  // Torch head and faces
  const head = document.createElement("div");
  head.setAttribute("class", "head");

  ["top", "left", "right"].forEach((faceType) => {
    const face = document.createElement("div");
    face.setAttribute("class", `face ${faceType}`);
    for (let i = 0; i < 4; i++) {
      const faceDiv = document.createElement("div");
      face.appendChild(faceDiv);
    }
    head.appendChild(face);
  });

  // Torch stick and sides
  const stick = document.createElement("div");
  stick.setAttribute("class", "stick");

  ["side-left", "side-right"].forEach((sideType) => {
    const side = document.createElement("div");
    side.setAttribute("class", `side ${sideType}`);
    for (let i = 0; i < 16; i++) {
      const sideDiv = document.createElement("div");
      side.appendChild(sideDiv);
    }
    stick.appendChild(side);
  });

  

  // Append head and stick to the torch
  torch.appendChild(head);
  torch.appendChild(stick);

  // Assemble everything into the label
//   label.appendChild(simpleText);
  label.appendChild(checkBox);
  label.appendChild(checkmark);
  label.appendChild(torch);

  label.insertAdjacentElement("afterend", div);

  row.appendChild(label) ;
  row.appendChild(div) ;

  task.appendChild(row) ;

  // Clear input field
  input.value = "";
}

async function addToDatabase(taskString) {
  const data = await fetch("http://localhost:8000/task/test", {
    method : 'POST',
    headers : {
      'Content-Type': 'application/json'
    },
    body : JSON.stringify({
      task : taskString ,
      status : false 
    } )

  }) 
  .then((response)=> console.log(response)) 
  .then((data) => console.log("success" , data))
  .catch((err) => console.log("Error encountered :( "+ err)) ;
  
}


// Add event listener for the add button
add.addEventListener("click", addTask);
