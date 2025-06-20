document.addEventListener('DOMContentLoaded', function () {
    const toast = document.getElementById('simpleToast');
    if (toast) {
        setTimeout(() => {
            toast.classList.add('fade');
            setTimeout(() => toast.remove(), 500); // give it time to fade
        }, 5000); // 3 seconds
    }
});
