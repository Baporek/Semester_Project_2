const API_BASE_URL = "https://api.noroff.dev/api/v1/auction";
const Registerform = document.getElementById('registerForm');
const LoginForm = document.getElementById('loginForm');
const listingForm = document.getElementById('listingForm');
const updateMediaForm = document.getElementById('updateMediaForm');
// Select the login and logout elements
const loginButton = document.getElementById('login');
const logoutButton = document.getElementById('logout');
const registerLink = document.getElementById('registerLink');
const addItemLink = document.getElementById('addItemLink');
const index_listings = document.getElementById('index-listings');


// Assume the user is initially logged out
let isLoggedIn = false;


// Function search in header
function searchItems() {
  const input = document.getElementById('searchInput');
  const filter = input.value.toUpperCase();
  const listings = document.querySelectorAll('.item');

  listings.forEach(listing => {
    const title = listing.querySelector('h2').textContent;
    if (title.toUpperCase().indexOf(filter) > -1) {
      listing.style.display = '';
    } else {
      listing.style.display = 'none';
    }
  });
}

// Snippet registration form
document.getElementById("registerLink").addEventListener("click", function () {
  $("#registrationModal").modal("show");
});


// Function to update the user dashboard information
async function updateUserDashboard() {
  const userDashboard = document.querySelector('.user-dashboard');
  userDashboard.innerHTML= "";
  // Add logic to display user-specific information such as credit balance, avatar, etc.
  if (localStorage.getItem('token') != null) {
    try {
      const token = localStorage.getItem('token');
      const name = localStorage.getItem('name');
      const response = await fetch(`${API_BASE_URL}/profiles/${name}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": 'Bearer ' + token
        }
      });

      const data = await response.json();

        
        userDashboard.innerHTML = ` <div class="row">
            <div class="col-12 d-flex justify-content-center p-2">
              <img class="rounded-circle"
                src="${data.avatar}"
                alt="" srcset="">
            </div>
            <div class="col-12 d-flex justify-content-center p-2">
              <h3>${data.name}</h3>
            </div>
            <div class="col-12 d-flex justify-content-center p-2">
              <button type="button" data-toggle="modal" data-target="#AvatarUpdateModal"
                class="btn btn-lg btn-block btn-outline-warning">Update Avatar <i class="fa fa-pen"></i></button>
            </div>
            <div class="col-12 d-flex justify-content-center p-2">
              <a href="my-listings.html" class="btn btn-lg btn-block btn-outline-primary">My Listings <span class="badge badge-primary">${data._count.listings}</span></a>
            </div>
            <div class="col-12 d-flex justify-content-center p-2">
              <a href="my-bids.html" class="btn btn-lg btn-block btn-outline-primary">My Bids</a>
            </div>
            <div class="col-12 d-flex justify-content-center p-2">
              <button class="btn btn-lg btn-block btn-outline-info">Credits <span class="badge badge-info">${data.credits}</span></button>
            </div>
          </div>`;

    } catch (error) {
      console.error('Registration error:', error);
    }
  }

}

// Call the functions to update the user dashboard
updateUserDashboard();


// JavaScript code to handle the hamburger menu functionality
const hamburgerMenu = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburgerMenu.addEventListener('click', () => {
  navLinks.classList.toggle('show');
  hamburgerMenu.classList.toggle('active');
});

// Add click event listeners to the menu items within the hamburger menu
const menuItems = document.querySelectorAll('.nav-links li a');
menuItems.forEach(item => {
  item.addEventListener('click', () => {
    navLinks.classList.remove('show');
    hamburgerMenu.classList.remove('active');
  });
});



// Function to toggle the login and logout states
function toggleAuthState() {
  isLoggedIn = !isLoggedIn;
  updateAuthUI();
}

// Function to update the user interface based on the login state
function updateAuthUI() {
  if (isLoggedIn) {
    loginButton.style.display = 'none';
    registerLink.style.display = 'none';
    logoutButton.style.display = 'block';
    addItemLink.style.display = 'block';
  } else {
    loginButton.style.display = 'block';
    registerLink.style.display = 'block';
    logoutButton.style.display = 'none';
    addItemLink.style.display = 'none';
  }
}

// // Add event listeners for login and logout
// loginButton.addEventListener('click', toggleAuthState);
logoutButton.addEventListener('click', logout);

$(document).ready(function () {
  $("#login").click(function () {
    $("#loginModal").modal("show");
  });
});

function ShowLogin(){
  $("#loginModal").modal("show");
}


// Call the function to set initial UI state
updateAuthUI();

function toggleFavorite(icon) {
  icon.classList.toggle("favorite");
}


if (listingForm) {
  listingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const responseDiv = document.getElementById("response");
    const formData = new FormData(listingForm);
    const formDataObject = {

    };
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });



    const tagsInput = formDataObject["tags"];
    if (tagsInput.includes(" ")) {
      responseDiv.innerHTML = '<div class="alert alert-danger">Tags should not contain spaces</div>';
      return;
    }
    const MediaInput = formDataObject["media"];
    if (MediaInput.includes(" ")) {
      responseDiv.innerHTML = '<div class="alert alert-danger">Media URL should not contain spaces</div>';
      return;
    }
    formDataObject["media"] = [MediaInput];
    formDataObject["tags"] = [tagsInput];


    try {
      const token = localStorage.getItem("token");
      if (!token) {
        responseDiv.innerHTML = '<div class="alert alert-danger">No authorization token available</div>';
        return;
      }
      const response = await fetch(`${API_BASE_URL}/listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": 'Bearer ' + token,
        },
        body: JSON.stringify(formDataObject),
      });

      responseDiv.innerHTML = "";
      const responseData = await response.json();
      if (response.ok) {
        responseDiv.innerHTML = '<div class="alert alert-success">Listing created successfully</div>';
      } else if (response.status === 400) {
        responseData.errors.forEach(err => {
          responseDiv.innerHTML += `<div class="alert alert-danger">${err.message} </div>`;
        });
      } else {
        responseData.errors.forEach(err => {
          responseDiv.innerHTML += `<div class="alert alert-danger">${err.path[0]} : ${err.message} </div>`;
        });
      }
    } catch (error) {
      responseDiv.innerHTML = '<div class="alert alert-danger">An error occurred</div>';
    }
  });
}


if (Registerform) {
  Registerform.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Validation logic
    let isValid = true;
    const firstName = document.getElementById('registerName');
    const lastName = document.getElementById('registerlastName');
    const email = document.getElementById('registeremail');
    const password = document.getElementById('registerpassword');
    const confirmPassword = document.getElementById('registerconfirmPassword');
    const avatar = document.getElementById('registeravatar');


    // Reset errors
    const errorFields = [firstName, lastName, email, password, confirmPassword];
    errorFields.forEach(field => {
      const errorId = field.id + 'Error';
      const errorElement = document.getElementById(errorId);
      errorElement.textContent = '';

    });

    // Validate first name
    if (firstName.value.trim() === '') {
      isValid = false;
      document.getElementById('registerNameError').textContent = 'First name is required.';
    }

    // Validate last name
    if (lastName.value.trim() === '') {
      isValid = false;
      document.getElementById('registerlastNameError').textContent = 'Last name is required.';
    }

    // Validate email
    if (!/^\S+@\S+\.\S+$/.test(email.value)) {
      isValid = false;
      document.getElementById('registeremailError').textContent = 'Invalid email format.';
    } else if (!email.value.endsWith('@stud.noroff.no') && !email.value.endsWith('@noroff.no')) {
      isValid = false;
      document.getElementById('registeremailError').textContent = 'Email must be a valid stud.noroff.no or noroff.no email address.';
    }

    // Validate password
    if (password.value.length < 8) {
      isValid = false;
      document.getElementById('registerpasswordError').textContent = 'Password must be at least 8 characters.';
    }

    // Validate confirm password
    if (password.value !== confirmPassword.value) {
      isValid = false;
      document.getElementById('registerconfirmPasswordError').textContent = 'Passwords do not match.';
    }

    if (!isValid) {
      return; // Exit if there are validation errors
    }

    // Registration logic
    const registerData = {
      name: firstName.value,
      email: email.value,
      password: password.value,
      avatar: avatar.value
    };

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerData)
      });

      const data = await response.json();
      document.getElementById('RegisterErrors').textContent = "";
      if (data.statusCode === 400) {
        data.errors.forEach(error => {
          document.getElementById('RegisterErrors').textContent += `${error.message}  `
        });
      } else if (data.statusCode === 401) {
        data.errors.forEach(error => {
          document.getElementById('RegisterErrors').textContent += `${error.message}  `
        });
      } else {
        document.getElementById('Message').innerHTML = `<div class="alert alert-success" role="alert">you are now Registered now you can login!</div>`
         $("#registrationModal").modal("hide");
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  });
}


if (LoginForm) {
  LoginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    // Validation logic
    let isValid = true;
    const email = document.getElementById('loginEmail');
    const password = document.getElementById('loginPassword');

    // Reset errors
    const errorFields = [email, password];
    errorFields.forEach(field => {
      const errorId = field.id + 'Error';
      const errorElement = document.getElementById(errorId);
      errorElement.textContent = '';

    });

    // Validate email
    if (!/^\S+@\S+\.\S+$/.test(email.value)) {
      isValid = false;
      document.getElementById('loginEmailError').textContent = 'Invalid email format.';
    } else if (!email.value.endsWith('@stud.noroff.no') && !email.value.endsWith('@noroff.no')) {
      isValid = false;
      document.getElementById('loginEmailError').textContent = 'Email must be a valid stud.noroff.no or noroff.no email address.';
    }

    // Validate password
    if (password.value.length < 8) {
      isValid = false;
      document.getElementById('loginPasswordError').textContent = 'Password must be at least 8 characters.';
    }


    if (!isValid) {
      return; // Exit if there are validation errors
    }
    const loginData = {
      email: email.value,
      password: password.value
    };

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();
      // Use data.accessToken for subsequent requests
      document.getElementById('LoginErrors').textContent = "";
      if (data.statusCode === 401) {
        data.errors.forEach(error => {
          document.getElementById('LoginErrors').textContent += `${error.message}  `
        });
      } else if (data.statusCode === 400) {
        data.errors.forEach(error => {
          document.getElementById('LoginErrors').textContent += `${error.message}  `
        });
      } else {
        $("#loginModal").modal("hide");

        localStorage.setItem("name", data.name);
        localStorage.setItem("avatar", data.avatar);
        localStorage.setItem("credits", data.credits);
        localStorage.setItem("email", data.email);
        localStorage.setItem("lastemail", data.email);
        localStorage.setItem("token", data.accessToken);
        toggleAuthState()
        checklogin();
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  });
}

if (updateMediaForm) {
  updateMediaForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');

    const avatarUrlInput = document.getElementById('avatarUrl');
    const newAvatarUrl = avatarUrlInput.value;
    document.getElementById('avatarUpdateErrors').innerHTML = "";
    try {
      const response = await fetch(`${API_BASE_URL}/profiles/${name}/media`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          avatar: newAvatarUrl
        })
      });

      if (response.ok) {
        // Handle success message or further actions here
        document.getElementById('avatarUpdateErrors').innerHTML = `<div class="alert alert-success" role="alert">
  Avatar updated successfully
</div>`
        updateUserDashboard();
      } else {
        console.error('Media update error:', response.status);
        // Handle error cases here
        document.getElementById('avatarUpdateErrors').innerHTML = `<div class="alert alert-danger" role="alert">
  Invalid Image path Make sure Image is Accessable
</div>`
      }
    } catch (error) {
      console.error('Request error:', error);
      // Handle error cases here
    }

  });
}


async function make_index_listings() {
    try {
    const response = await fetch(`${API_BASE_URL}/listings?_seller=true&_bids=true&limit=4`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    data.forEach(item => {
      const bidsArray = item.bids;
      const hightestBid = bidsArray[bidsArray.length -1];
      index_listings.innerHTML += ` <div class="col-md-3 col-12 mb-4">
                    <div class="item">
                        <img style="width: 15vw; aspect-ratio: 1/1;" src="${item.media[0]}" alt="Item 1">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                        <span class="price">$ ${hightestBid !== undefined ? hightestBid.amount : 0}</span>
                        <span class="heart-icon" onclick="toggleFavorite(this)">&#10084;</span>
                        <br>
                        <span>
                        ${isLoggedIn ? `<button class='btn btn-outline-secondary' onclick="placeBid(this,'${item.id}',${hightestBid !== undefined ? hightestBid.amount + 1 : 1})">Place Bid for $${hightestBid !== undefined ? hightestBid.amount + 1 : 1}</button>` : '<button onclick="ShowLogin()" class="btn btn-outline-primary btn-block">Login to Bid</button>'}
                        <span>
                        </div>
                </div>`;
    });


  } catch (error) {
    console.error('error:', error);
  }
}


function checklogin() {
  if (localStorage.getItem('token') != null) {
    isLoggedIn = true;
    updateAuthUI();
     setTimeout(() => {
    displayItemListings();
    updateUserDashboard();
  }, 1000);
  }
}

function logout() {
 let LastEmail = localStorage.getItem("lastemail");
  
  localStorage.clear();
  localStorage.setItem("lastemail", LastEmail);
  toggleAuthState();
  setTimeout(() => {
    displayItemListings();
    updateUserDashboard();
  }, 1000);
}

checklogin();

if(index_listings){
make_index_listings();
}
if(localStorage.getItem("lastemail") != null){
  document.getElementById('loginEmail').value = localStorage.getItem("lastemail");
}