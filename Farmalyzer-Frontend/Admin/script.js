$(document).ready(function() {
    // Toggle active class for tabs
    $('.course-box ul li').click(function() {
        $('.course-box ul li').removeClass('active');
        $(this).addClass('active');

        // Toggle display for corresponding section
        var index = $(this).index();
        $('.course-box').removeClass('active');
        $('.course-box').eq(index).addClass('active');
    });
});
