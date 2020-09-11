function goToPage(e) {
    var url = e.getAttribute('data-url');
    var page = document.querySelector('.pageNo').value;

    window.location.href = url + "?page=" + page;
}