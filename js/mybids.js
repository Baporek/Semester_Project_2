const username = localStorage.getItem('name');
const Listings_URL = `https://api.noroff.dev/api/v1/auction/profiles/${username}/bids?_listings=true`;


// Function to display item listings
async function displayItemListings() {
  const bidTable = document.getElementById('item-data');
  bidTable.innerHTML = '';
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${Listings_URL}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
         'Authorization': 'Bearer ' + token
      }
    });

    const data = await response.json();
    console.log(data)
    data.forEach(item => {
      const formattedDate_bid = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZone: 'UTC'
      }).format(new Date(item.created));
       const formattedDate_end = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZone: 'UTC'
      }).format(new Date(item.listing.endsAt));
      bidTable.innerHTML += `
        <tr>
        <td>${item.listing.title}</td>
        <td>${item.amount}</td>
        <td>${formattedDate_bid}</td>
        <td>${formattedDate_end}</td>
        </tr>
      `;
    });


  } catch (error) {
    console.error('error:', error);
  }



}


// Call the function to display item listings
//displayItemListings();