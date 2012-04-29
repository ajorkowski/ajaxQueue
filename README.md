# ajaxQueue

A jQuery plugin designed as a queue for Ajax calls. The idea is that you have a state-changing action that occurs in 
your page, and you respond to it immediately in javascript. After that you would want to then send the corresponding 
action that will be sent to the server in a queue. If a failure occues the queue stops.

### Usage

There is three versions available, a coffeescipt, javascript, and minified javascript. Copy the file of your choice.
Intended usage as below:

```
var options = {
  onError: function() {
    alert("An error occured, refresh your page please");
  }
};

$.ajaxQueue(options);

// An item got clicked
$('.deleteButton').on('click', function() {
  // Do reaction stuff... Remove the item from the list
  
  // Add the corresponding server action
  $.ajaxQueue('add', function() {
    return $.get('/deleteItem/' + itemNum)
  });
});

// We are ready to continue
$('.continueButton').on('click', function() {
  // We need to make sure all the deletes are saved first
  
  // Show loading icon
  
  $.ajaxQueue('flush', function() {
    // All the deletes have finished
    window.location.href = '/continue';
  });
});
```