document.addEventListener('DOMContentLoaded', () => {
    const seatGrid = document.getElementById('seats-grid');
    const selectedSeatsDisplay = document.getElementById('selected-seats');
    const totalPriceDisplay = document.getElementById('total-price');
    const confirmationMessage = document.getElementById('confirmation-message');
    const bookBtn = document.getElementById('book-btn');
    const seatPrice = 200;

    const rows = 26;
    const columns = 8; // Increase column count to 10 to account for two aisles

    let selectedSeats = [];

    // Function to convert row number to alphabet (A, B, C, ...)
    function rowToAlphabet(row) {
        return String.fromCharCode(65 + row); // 65 is the ASCII value for 'A'
    }

    // Generate seats dynamically
    function createSeats() {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                // Leave columns 3 and 4 empty for the aisles (j === 3 and j === 4 represent the 4th and 5th columns due to 0-indexing)
                if (j === 3 || j === 4) {
                    const aisle = document.createElement('div');
                    aisle.classList.add('aisle');  // Optional: you can style this in CSS
                    seatGrid.appendChild(aisle);
                    continue;
                }

                const seat = document.createElement('div');
                seat.classList.add('seat');
                
                // Adjust the seat number for seats after the aisles (after j >= 4, we need to skip over columns 3 and 4)
                const seatNumber = `${rowToAlphabet(i)}-${j >= 4 ? j - 1 : j + 1}`;
                seat.dataset.position = seatNumber;

                // Create seat name text
                const seatName = document.createTextNode(seatNumber);
                seat.appendChild(seatName);
                
                // Simulate some seats as occupied
                if (Math.random() > 0.8) {
                    seat.classList.add('occupied');
                }
                
                seat.addEventListener('click', () => selectSeat(seat, i, j));
                seatGrid.appendChild(seat);
            }
        }
    }

    // Function to select or deselect seats
    function selectSeat(seat, row, column) {
        if (seat.classList.contains('occupied') || seat.classList.contains('booked')) return;

        const seatPosition = `${rowToAlphabet(row)}-${column >= 4 ? column - 1 : column + 1}`;

        if (seat.classList.contains('selected')) {
            seat.classList.remove('selected');
            selectedSeats = selectedSeats.filter(s => s !== seatPosition);
        } else {
            seat.classList.add('selected');
            selectedSeats.push(seatPosition);
        }

        updateSelectedSeats();
    }

    // Update selected seat info and total price
    function updateSelectedSeats() {
        selectedSeatsDisplay.textContent = selectedSeats.join(', ');
        totalPriceDisplay.textContent = selectedSeats.length * seatPrice;

        // Enable or disable the Book button based on seat selection
        bookBtn.disabled = selectedSeats.length === 0;
    }

    // Book button functionality
    bookBtn.addEventListener('click', () => {
        if (selectedSeats.length > 0) {
            confirmationMessage.innerHTML = `You have booked the following seats: ${selectedSeats.join(', ')}.<br>Total Price: ₹${selectedSeats.length * seatPrice}`;
            
            // Mark selected seats as booked
            selectedSeats.forEach(seatPosition => {
                const seat = [...document.querySelectorAll('.seat')].find(s => {
                    return s.dataset.position === seatPosition;
                });
                if (seat) {
                    seat.classList.add('booked'); // Mark as booked
                    seat.classList.remove('selected'); // Ensure it's not selected anymore
                }
            });

            // Clear the selections
            selectedSeats = [];
            updateSelectedSeats();
        }
    });

    // Initialize seats
    createSeats();
});
