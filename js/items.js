const Listings_URL = 'https://api.noroff.dev/api/v1/auction/listings?_seller=true&_bids=true';


// Function to display item listings
async function displayItemListings() {
  const itemListingSection = document.querySelector('.item-listings');
  itemListingSection.innerHTML = '';
  try {
    const response = await fetch(`${Listings_URL}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    data.forEach(item => {
      const bids = item._count.bids;
      const bidsArray = item.bids;
      const hightestBid = bidsArray[bidsArray.length -1];
      const formattedDate = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZone: 'UTC'
      }).format(new Date(item.endsAt));
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('item');
      itemDiv.innerHTML = `
        <img style="width: 200px; aspect-ratio: 1/1;" src="${item.media[0]}" alt="${item.title}">
        <h2>${item.title}</h2>
        <section class="item_description">
        <p class="p_item">${item.description}</p>
        <p class="p_item">Total Bids: ${bids !== undefined ? bids : 0}</p>
        <p class="p_item">Current Bider: ${hightestBid !== undefined ? hightestBid.bidderName : 'No Bider'}</p>
        <p class="p_item">Current Bid: $ ${hightestBid !== undefined ? hightestBid.amount : 0}</p>
        <p class="p_item">Deadline: ${formattedDate}</p>
        <p class="p_item">Seller: ${item.seller.name}</p>
        </section>
${isLoggedIn ? `<button class='btn btn-outline-secondary'style="font-size: 22px;" onclick="placeBid(this,'${item.id}',${hightestBid !== undefined ? hightestBid.amount + 1 : 1})">Place Bid for $${hightestBid !== undefined ? hightestBid.amount + 1 : 1}</button>` : '<button onclick="ShowLogin()" class="btn btn-outline-primary btn-block">Login to Bid</button>'}      `;
      itemListingSection.appendChild(itemDiv);
    });


  } catch (error) {
    console.error('error:', error);
  }



}

// Function to place a bid on an item
async function placeBid(buttonElement,itemId,BidAmount) {
  buttonElement.textContent = "Please Wait Bidding";
  try {
    const token = localStorage.getItem('token'); // can be Replace with diffrent authentication token logic

    const response = await fetch(`https://api.noroff.dev/api/v1/auction/listings/${itemId}/bids`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        amount: BidAmount
      })
    });

    const data = await response.json();
    if (response.ok) {
      buttonElement.textContent = "Bid placed successfully";
      // Handle successful bid response here
    } else {
      // Handle error cases here
      buttonElement.textContent = `${data.errors[0].message}`;
    }
  } catch (error) {
    console.error('Request error:', error);
    // Handle error cases here
  }
  setTimeout(() => {
    displayItemListings();
    updateUserDashboard();
  }, 2000);

}

// Call the function to display item listings
if (localStorage.getItem('token') == null) {
  displayItemListings();
}