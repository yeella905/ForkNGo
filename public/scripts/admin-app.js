const statusChanges = {
  "received" : "in progress",
  "in progress" : "ready for pick-up",
  "ready for pick-up" : "picked up"
};

const statusText = {
  "received" : "Mark as in progress",
  "in progress" : "Mark as ready for pick-up",
  "ready for pick-up": "Mark as picked up",
  "picked up" : "Picked up"
};

$(document).ready(function() {
  $(".btn-update-status").on('click', function() {
    const btn = $(this);
    const orderId = btn.data('order-id');
    const orderStatus = btn.data('order-status');
    const newOrderStatus = statusChanges[orderStatus] || "";

    $.ajax({
      url: `/api/orders/${orderId}`,
      type: 'PUT',
      data: JSON.stringify({status : newOrderStatus }),
      contentType: "application/json"
    }).done(res => {
      btn.prop('disabled', newOrderStatus == 'picked up')
      btn.text(statusText[newOrderStatus] || unknown);
      btn.data('order-status', newOrderStatus);
    }).fail(err => {
      console.log(err);
      alert("Failed to update status");
    });
    });
});
