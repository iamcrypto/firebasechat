

$(window).on('load', function () {
    setTimeout(() => {
        $('#preloader').fadeOut(0);
    }, 100);
})

 
$('.back-to-tops').click(function() {
    $('html, body').animate({
      scrollTop: 0
    }, 800);
    return false;
});

const isNumber = (params) => {
    let pattern = /^[0-9]*\d$/;
    return pattern.test(params);
}

function formatMoney(money) {
    return String(money).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}


function cownDownTimer() {
    var countDownDate = new Date("2030-07-16T23:59:59.9999999+01:00").getTime();
    setInterval(function () {
        let checkID = $('html').attr('data-change');
        var now = new Date().getTime();
        var distance = countDownDate - now;
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var minute = Math.ceil(minutes % Number(checkID));
        var seconds1 = Math.floor((distance % (1000 * 60)) / 10000);
        var seconds2 = Math.floor(((distance % (1000 * 60)) / 1000) % 10);
        if(checkID != 1) {
            $(".time .time-sub:eq(1)").text(minute);
        }
        else{
            $(".time .time-sub:eq(1)").text(0);
        }
        $(".time .time-sub:eq(2)").text(seconds1);
        $(".time .time-sub:eq(3)").text(seconds2);
    }, 0);
}

cownDownTimer();

function showListOrder(datas) {
    let html = '';
    datas.map((data) => {
        let list_kq = '';
        let total = 0;
        data.result.split('').forEach((e) => {
            total += Number(e);
            list_kq += `<span data-v-a9660e98="" class="red box-xs"> ${e} </span>`;
        });
        html += 
        `
        <div data-v-a9660e98="" class="c-tc item van-row">
            <div data-v-a9660e98="" class="van-col van-col--8">
                <div data-v-a9660e98="" class="c-tc goItem" >${data.period}</div>
            </div>
            <div data-v-a9660e98="" class="van-col van-col--5" >
                <div data-v-a9660e98="" class="c-tc goItem" style="display: flex;justify-content: center;">
                    <!---->
                   &emsp; ${list_kq}
                    <span data-v-a9660e98="" class="red box-xs" > = </span>
                    <span data-v-a9660e98="" class="red box-xs" style="font-size: 14px"> ${total} </span>
                </div>
            </div>
            <div data-v-a9660e98="" class="van-col van-col--5">
                <div data-v-a9660e98="" class="c-tc goItem">
                    <span data-v-a9660e98=""> ${(total < 23) ? "&emsp;Small" : "&emsp;Big"} </span>
                </div>
            </div>
            <div data-v-a9660e98="" class="van-col van-col--5">
                <div data-v-a9660e98="" class="c-tc goItem">
                    <span data-v-a9660e98=""> ${(total % 2 == 0) ? "Even" : "Odd"} </span>
                </div>
            </div>
        </div>
        `;
    });
    $('#list-orders').html(html);
}

function messNewJoin2(datas) {
    let result = '';
    var overall_bet = 0 ;
    let d_money = 0;
    datas.map((data) => {
        let list_join = data.bet.split(''); // là người dùng Join đặt cược
        let list_join2 = data.bet; // là người dùng Join đặt cược
        let x = data.amount; // là người dùng Join đặt cược
        //let total_money = (Number(data.money) * Number(x)) * list_join.length;
        
        d_money = Number(data.money);
        if(list_join.length > 1)
        {
            d_money = Number(data.money) / list_join.length;
        }
        let total_money = (Number(d_money)) ;
        let money = formatMoney(total_money, ',');
        result += `
        <div class="direct-chat-infos clearfix mt-2">
            <span class="direct-chat-name float-left"></span>
        </div>
        <img class="direct-chat-img" src="/images/myimg.png" alt="message user image">
        <div class="direct-chat-text" style="background-color: #1eb93d"> Join ${(isNumber(list_join2)) ? "( " + list_join2 + " )" : (list_join2 == 'b') ? 'Big' : (list_join2 == 's') ? 'Small' : (list_join2 == 'c') ? 'Even' : 'Odd'} ${Number(data.money)} </div>
        `; 
    });
    
    $('.direct-chat-msg').html(result);
    $(".direct-chat-warning .direct-chat-messages").animate({
        scrollTop: $(".direct-chat-msg").prop("scrollHeight")
    }, 750);
}

function messNewJoin3(datas) {
    //var prev_total = parseInt($("#total_bet").text().trim());
    let arr = ['b', 's', 'c', 'l', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    var overall_bet = 0 ;
    for (let i = 0; i < arr.length; i++) {
        $(`#${arr[i]}`).attr('totalMoney', 0);
        $(`#${arr[i]}`).text(0);
    }
    
    datas.map((data) => {
        let bet = data.bet.split(''); // là người dùng Join đặt cược
        let x = data.x;
        if(x == null)
        {
            x = 1;
        }
        for (let i = 0; i < bet.length; i++) {
            
            let d_money = Number(data.money);
            if(bet.length > 1)
            {
                d_money = Number(data.money) / bet.length;
            }

            let money =  (Number(data.money) * Number(x));
            let totalM = Number($(`#${bet[i]}`).attr('totalMoney'));
            $(`#${bet[i]}`).attr('totalMoney', totalM + d_money);
            $(`#${bet[i]}`).text(totalM + d_money);
            overall_bet = parseInt(parseInt(overall_bet) + d_money);
            $("#total_bet").text(parseInt(overall_bet).toString());
        }
    });
    if(datas.length == 0)
    {
        $("#total_bet").text('0');
    }
}

function messNewJoin(data) {
    var internalb= $("#manage_2").find('.sub-menu-color').attr('data').trim();
    if(internalb == data.join.trim())
    {
    let game = $('html').attr('data-change');
    if (data.change == 1) return;
    if (data.game != game) return;

    let bet = data.join; // Join game ví dụ a b c d e tổng
    let list_join = data.list_join.split(''); // là người dùng Join đặt cược
    let list_join2 = data.list_join; // là người dùng Join đặt cược
    let x = data.x; // là người dùng Join đặt cược

    let total_money = (Number(data.money) * Number(x)) * list_join.length;
    let money = formatMoney(total_money, ',');
    let result = '';
    result += `
        <div class="direct-chat-infos clearfix mt-2">
        <span class="direct-chat-name float-left"></span>
        </div>
        <img class="direct-chat-img" src="/images/myimg.png" alt="message user image">
        <div class="direct-chat-text" style="background-color: #1eb93d">
        Join ${(isNumber(list_join2)) ? "( " + list_join2 + " )" : (list_join2 == 'b') ? 'Big' : (list_join2 == 's') ? 'Small' : (list_join2 == 'c') ? 'Even' : 'Odd'} ${money}
        </div>
        `;
    $('.direct-chat-msg').append(result);
    $(".direct-chat-warning .direct-chat-messages").animate({
        scrollTop: $(".direct-chat-msg").prop("scrollHeight")
    }, 750);
}
}
function messNewJoin5(data) {

    var internalb= $("#manage_2").find('.sub-menu-color').attr('data').trim();
    if(internalb == data.join.trim())
    {
    let game = $('html').attr('data-change');
    if (data.chane == 1) return;
    if (data.game != game) return;
    var prev_total = parseInt($("#total_bet").text().trim());
    var overall_bet = 0 + prev_total;
    let bet = data.list_join.split(''); // là người dùng Join đặt cược
    let x = data.x;
    for (let i = 0; i < bet.length; i++) {
        let money =  (Number(data.money) * Number(x));
        let totalM = Number($(`#${bet[i]}`).attr('totalMoney'));
        $(`#${bet[i]}`).attr('totalMoney', totalM + money);
        $(`#${bet[i]}`).text(totalM + money);
        overall_bet = parseInt(parseInt(overall_bet) + money);
        $("#total_bet").text(parseInt(overall_bet).toString());
    }
}
}

fetch("/api/sandbox_val")
  .then((response) => response.json())
    .then((data) => {
        if(data.sandbox_val.toString().trim() == 'false')
            {
              u_sandbox_val = false;
            }
            else{
              u_sandbox_val = true;
            }
        const Pi = window.Pi;
        Pi.init({ version: "2.0", sandbox:u_sandbox_val});
async function auth() {
  try {
      
      const scopes = ['username', 'payments', 'wallet_address'];
      function onIncompletePaymentFound(payment) {
          console.log("incomplete Transaction");
      }; 

      Pi.authenticate(scopes, onIncompletePaymentFound).then(function(auth) {
          var username = auth.user.username;
          var password = auth.user.uid;
          var auth_token = auth.accessToken;
          const socket = io();
          $('.admin_name').text(username);
          $(document).ready(function () {
            $(`a[href="${window.location.pathname}"]`).addClass('active');
            $(`a[href="${window.location.pathname}"]`).css('pointerEvents', 'none');
            $('#manage .col-12:eq(0)').click();
        });

          $('#manage .col-12').click(function(e) {
            var hasClass = $(this).attr('class');
            if(hasClass.indexOf('active-game') != -1){
                $(this).removeClass('active-game');
                var clicked_m = $(this).find('.info-box-icon').text().match(/\d+/g).join(", ");
                $('#manage .col-12').removeClass('display_none');
                $("#manage_2").find('.col-sm').removeClass('sub-menu-color');
            }
            else{
                $('#manage .col-12').removeClass('active-game');
                $(this).addClass('active-game');
                let game = $(this).attr('data');
                var clicked_m = $(this).find('.info-box-icon').text().match(/\d+/g).join(", ");
                $('#manage .col-12').addClass('display_none');
                $(this).removeClass('display_none');
                $('html').attr('data-change', game);
                $('#manage_2 .col-sm:eq(0)').click();
            }
          });

          $('#manage_2 .col-sm').click(function(e) {
            $("#manage_2").find('.col-sm').removeClass('sub-menu-color');
            $(this).addClass('sub-menu-color');
            callListOrder();
          });
function callListOrder(e) {
    let game = $('html').attr('data-change');
    var internalb= $("#manage_2").find('.sub-menu-color').attr('data').trim();
    $.ajax({
        type: "POST",
        url: "/api/webapi/admin/5d/listOrders",
        data: {
            gameJoin: game,
            join_al:internalb,
            authtoken:auth_token,
        },
        dataType: "json",
        success: function (response) {
            showListOrder(response.data.gameslist); // display wholesum data
            messNewJoin2(response.bet); //stat value display
            messNewJoin3(response.bet); //boxes value display
            let settings = response.settings[0];
            if(game == 1) $('#Result').text('Next Result: ' + `${(settings.k5d == '-1') ? 'Random' : settings.k5d}`);
            if(game == 3) $('#Result').text('Next Result: ' + `${(settings.k5d3 == '-1') ? 'Random' : settings.k5d3}`);
            if(game == 5) $('#Result').text('Next Result: ' + `${(settings.k5d5 == '-1') ? 'Random' : settings.k5d5}`);
            if(game == 10) $('#Result').text('Next Result: ' + `${(settings.k5d10 == '-1') ? 'Random' : settings.k5d10}`);
            $(".reservation-chunk-sub-num").text(response.period);
            $('#preloader').fadeOut(0);
        }
    });
}
//callListOrder();

$(".start-order").click(function (e) { 
    e.preventDefault();
    let game = $('html').attr('data-change');
    let value = $('#editResult').val().trim();
    let arr = value.split('|');
    for (let i = 0; i < arr.length; i++) {
        let check = isNumber(arr[i]);
        if (arr[i] == "" || arr[i].length != 5 || !check) {
            alert("Please enter the correct format (eg: 53278|67368|46826)");
            return false;
        }
    }
    $.ajax({
      type: "POST",
      url: "/api/webapi/admin/5d/editResult",
      data: {
        game: game,
        list: value,
        authtoken:auth_token,
      },
      dataType: "json",
      success: function (response) {
        alert(
            'Good job!',
            `${response.message}`,
            'success'
        );
        $('#ketQua').text(`next result: ${value}`);
      }
    });
  });

  socket.on("data-server-5d", function (msg) {
    if (msg) {

        callListOrder();
        $('.direct-chat-msg').html('');
    }
});

socket.on("data-server-5", function (msg) {
    messNewJoin(msg);
    messNewJoin5(msg);
});
  
		});
    }
catch (err) {
    alert(err);
}
}
    
auth();

});

