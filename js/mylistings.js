const username = localStorage.getItem('name');
const Listings_URL = `https://api.noroff.dev/api/v1/auction/profiles/${username}/listings?_seller=true&_bids=true`;


// Function to display item listings
async function displayItemListings() {
  const itemListingSection = document.querySelector('.item-listings');
  itemListingSection.innerHTML = '';
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
        <p>${item.description}</p>
        <p>Total Bids: ${bids !== undefined ? bids : 0}</p>
        <p>Current Bider: ${hightestBid !== undefined ? hightestBid.bidderName : 'No Bider'}</p>
        <p>Current Bid: $ ${hightestBid !== undefined ? hightestBid.amount : 0}</p>
        <p>Deadline: ${formattedDate}</p>
        <p>Seller: ${item.seller.name}</p>`;
      itemListingSection.appendChild(itemDiv);
    });


  } catch (error) {
    console.error('error:', error);
  }



}


// Call the function to display item listings
//displayItemListings();