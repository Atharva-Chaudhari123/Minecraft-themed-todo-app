
var user = "" ;
var pass = "" ;
const add = document.getElementById("addBtn");
const task = document.getElementById("tasks");
const input = document.getElementById("task-input");
const loginFail = document.getElementById("login-fail")
const clickSound = new Audio('../resources/minecraft_click.mp3') ;
const addToTask = new Audio('../resources/check&uncheck2.mp3') ;
let taskCount = 0;


function addTask(prevUser) {
  let taskString = "" ;
  if(prevUser == undefined ){
    
    taskString = input.value.trim();
    console.log(taskString) ;
    if (taskString === "") return;
    addToDatabase(taskString) ;
  }
  else{
    taskString = prevUser ;  
    console.log(taskString) ;
  }



  //API requests 
  
  //create sound
  clickSound.currentTime = 0 ;
  clickSound.play() ;
  
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
  checkBox.setAttribute("id" , `checkbox-${taskCount}`) ;
  checkBox.addEventListener('click' , ()=>{
    addToTask.currentTime= 0 ;
    addToTask.play() ;
  }) ;


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

 function addToDatabase(taskString) {
  console.log(user) ;

  const data =  fetch(`http://localhost:8000/task/${user}`, {
    method : 'POST',
    headers : {
      'Content-Type': 'application/json'
    },
    body : JSON.stringify({
      task : taskString ,
      status : false ,
      username : user,
      password : pass,

    } )

  }) 
  .then((response)=> console.log(response)) 
  .then((data) => console.log("success" , data))
  .catch((err) => console.log("Error encountered :( "+ err)) ;
  
}

async function searchUser(username , pass){
  const response =  fetch("http://localhost:8000/search", {
    method : 'POST',
    body : JSON.stringify( {
      username  : username ,
      password : pass,
    }),
    headers : {
      'Content-Type': 'application/json'
    }
  }) ;

  return (await response).text() ;
}
function createUser (username, pass){
  fetch("http://localhost:8000/newuser", {
    method: 'POST', 
    body : JSON.stringify({
      username : username ,
      password : pass ,
    }),
    headers : {
      "Content-Type" : "application/json",
    }
  }).then((response)=>console.log(response))
    .then((res)=>"Success " )
    .catch((err)=>console.log("Encountered error while creating new user"+err))
}
async function fetchTasks(username, password) {
  try {
    const response = await fetch(`http://localhost:8000/fetchtasks/${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', // Fix typo here: 'Content-Tpye' -> 'Content-Type'
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const allTasks = await response.json(); // Wait for the JSON parsing
    return allTasks; // Return the fetched tasks
  } catch (err) {
    console.error("Error fetching all tasks:", err);
    return []; // Return an empty array if there is an error
  }
}

function addToUi(item, index, tasks){
  addTask(tasks[index].task) ;

}


// Add event listener for the add button
add.addEventListener("click", () => addTask());


// Add this to your JavaScript file
document.addEventListener('DOMContentLoaded', () => {
  const loginOverlay = document.getElementById('login-overlay');
  const loginButton = document.getElementById('login-button');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  
  // Prevent closing the overlay by clicking outside
  loginOverlay.addEventListener('click', (e) => {
      if (e.target === loginOverlay) {
          e.stopPropagation();
      }
  });

  // Handle login
  loginButton.addEventListener('click', async() => {
      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();
      const userRegexp = /[A-Za-z0-9_#@&!]+$/ ;
      const passRegexp = /^.{4,}$/ ;

      if (!username || !password) {
          alert('Please enter both username and password!');
          return;
      }
      if(userRegexp.test(username)&& passRegexp.test(password)){
        console.log("login successs")
        
        result = await searchUser(username, password) ;
        result = result === 'true' ;
        console.log("is user exist ", result);
        if(result ) {
          //  fetch previous tasks of the respective user
          console.log("user exist", result) ;
          
          const allTasks = await fetchTasks(username, password) ;
           
          console.log(allTasks); 

          allTasks.forEach(addToUi) ;

        }
        else {
          console.log("user does not exist") ;
          //create a user
          createUser(username, password) ;
        }

        user = username ;
        pass = password ;
        loginOverlay.style.display = 'none';
      }
      else{
        console.log("login fail") ;
        loginFail.setAttribute("class" , "login-fail") ;
        
      }
      

  });
});

// Optional: Add keyboard support for better accessibility
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && document.getElementById('login-overlay').style.display !== 'none') {
      document.getElementById('login-button').click();
  }
});


