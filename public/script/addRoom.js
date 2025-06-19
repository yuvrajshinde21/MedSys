const roomNoError = document.getElementById("roomNoError");
const room_no = document.getElementById("room_no");

function validateRoomNo() {
  let roomNo = room_no.value.trim();
  if (roomNo === "") {
    roomNoError.textContent = "Room number cannot be empty.";
    return false;
  }

  // Check if the room number is a valid integer
  if (!/^\d+$/.test(roomNo)) {
    roomNoError.textContent = "Room number must be a valid integer.";
    return false;
  }
  // Check if the room number is within the range of 1 to 1000
  if (roomNo < 1 || roomNo > 1000) {
    roomNoError.textContent = "Room number must be between 1 and 1000.";
    return false;
  }
  // If all checks pass, clear the error message
  roomNoError.textContent = "";
  return true;
}
