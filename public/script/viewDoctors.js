async function confirmDelete(doctorId) {
        if (confirm("Are you sure you want to delete this doctor?")) {
            try {
                const result = await fetch(`/admin/doctors/delete/${doctorId}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const data = await result.json();
                if (result.ok) {
                    alert(data.message || "Doctor deleted successfully.");
                    // Reload the page to reflect changes
                    window.location.reload();
                } else {
                    alert(data.message || "Failed to delete doctor. Please try again.");
                }
            } catch (error) {
                console.error("Error deleting doctor:", error);
                alert("An error occurred while deleting the doctor. Please try again.");
            }
        }
    }
    //search doctor by name and status
    function searchDoctor() {
        const searchInput = document.getElementById('doctorSearch').value.toLowerCase().trim();
        const statusValue = document.getElementById('statusFilter').value.toLowerCase().trim();
        const columns = document.querySelectorAll('.col');
        columns.forEach(col => {
            const doctorName = col.querySelector('.card-title').textContent.toLowerCase().trim();
            const doctorStatus = col.querySelector('.badge').textContent.toLowerCase().trim();

            //if name contain search val
            const name = doctorName.includes(searchInput);
            //if status is active or inactive
            const status = statusValue === 'all' || doctorStatus === statusValue;
            if (name && status) {
                col.style.display = 'block';
            } else {
                col.style.display = 'none';
            }
        });

    }