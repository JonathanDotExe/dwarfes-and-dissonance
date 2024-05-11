
const button = document.getElementById('startbutton');
button.addEventListener('click', function() {
    const el = document.getElementById("titlescreen");
    el.parentNode.removeChild(el);
});