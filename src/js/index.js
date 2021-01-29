$('.city').draggable();
$('.country').droppable({
    drop: function() {
        alert('Hi!')
    }
})