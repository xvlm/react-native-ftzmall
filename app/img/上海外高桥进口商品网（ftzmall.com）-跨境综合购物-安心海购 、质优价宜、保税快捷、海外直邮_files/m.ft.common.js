$(function () {
    var itemPartNumber = [];
    var tmpArr = [];
    $('li[data-partNumber]').each(function () {
        var partNumber = $(this).attr('data-partNumber');
        if (-1 === tmpArr.indexOf(partNumber)) {
            tmpArr.push(partNumber);
            itemPartNumber.push({itemPartNumber: partNumber, itemOrg: 'ftzmall'});
        }
    });
    if (itemPartNumber.length) {
        getInventorys( itemPartNumber, inventoryposturl);
    }

    function getInventorys(itemPartNumber, tmp_url)
    {
        var inventory = ({//获取库存
//            "_csrf": _csrf,
            "itemPartNumber": itemPartNumber,
            "itemOrg": "ftzmall",
            "shop": "ftzmall",
            "country": "CN",
            "stateCode": '',
            //"queryItemType" : "Product", //
        });
        $.ajax({
            type: 'post',
            url: tmp_url,
            data: inventory,
            success: function (res) {
                //$('#inventory').html(res);
                for (item in res) {
                    if (0 == res[item] && false !== res[item]) {
                        $('li[data-partNumber=' + item + ']').append('<span class="search-none" style="display: block;"></span>');
                    }
                }

            },
            error: function () {},
        });

    }
});
