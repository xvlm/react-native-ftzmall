/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function () {

    $.ajax({
        type: 'get',
        url: cartNumUrl,
        data: {},
        success: function (carttotalnum) {
            $("div.car-count").html(parseInt(carttotalnum));
        }
    });

});
