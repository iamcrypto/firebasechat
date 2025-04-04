const issetVolume = localStorage.getItem('volume');
if (issetVolume == null) {
    localStorage.setItem('volume', 'on');
}

if (issetVolume == 'on') {
    $('.item-volume').attr('src', '/images/volume-up-line.webp');
} else if (issetVolume == 'off') {
    $('.item-volume').attr('src', '/images/volume-off-outline.webp');
} else {
    localStorage.setItem('volume', 'on');
}

function show_statistics(list_orders, x) {
    if (list_orders.length != 0) {
      const counts = {};
      const csq_counts = {};
      const miss_counts = {};
      for (const num of list_orders) {
        counts[num.amount] = counts[num.amount] ? counts[num.amount] + 1 : 1;
      }
      var fq0= counts[0] ? counts[0] : 0; var fq1= counts[1] ? counts[1] : 0; var fq2= counts[2] ? counts[2] : 0; var fq3= counts[3] ? counts[3] : 0; var fq4= counts[4] ? counts[4] : 0; var fq5= counts[5] ? counts[5] : 0;var fq6= counts[6] ? counts[6] : 0;var fq7= counts[7] ? counts[7] : 0;var fq8= counts[8] ? counts[8] : 0;var fq9= counts[9] ? counts[9] : 0;
      var a_m_indx = {};
      for(var i= 0; i< 10; i++)
      { 
        var c = 0, max = 0; 
        list_orders.forEach(function(e,index) {
          parseInt(e.amount) == i ? c++ : c = 0; 
          if (c > max) max = c;
        });
        csq_counts[i] = max;
      }
  
      for(var k= 0; k< 10; k++)
        { 
          index_val = ''; 
          list_orders.forEach(function(e,index) {
            if(parseInt(e.amount) == k)
              {
                index_val =  index_val + ","+ index;
              } 
          });
          a_m_indx[k] = index_val;
        }
        sumCount = {}
        for(var m= 0; m< 10; m++)
        { 
          var indexs = a_m_indx[m].split(',');
          min_num = '';
          max_num = '';
          sumvalue = 0;
          indexs.forEach(function(e1,index) {
            if(e1.length != 0)
            {
              if(indexs[index +1] != null)
              {
                min_num = indexs[index];
                max_num = indexs[index +1];
                no_reach = 0;
                for(var n= min_num; n< max_num-1; n++)
                {
                  no_reach ++;
                }
                sumvalue = sumvalue +  no_reach;
              }
            }
          });
          var average_number = sumvalue / (indexs.length - 1);
          sumCount[m] = parseInt(average_number);
        }
        var ams0= sumCount[0] ? sumCount[0] : 0; var ams1= sumCount[1] ? sumCount[1] : 0; var ams2= sumCount[2] ? sumCount[2] : 0; var ams3= sumCount[3] ? sumCount[3] : 0; var ams4= sumCount[4] ? sumCount[4] : 0; var ams5= sumCount[5] ? sumCount[5] : 0;var ams6= sumCount[6] ? sumCount[6] : 0;var ams7= sumCount[7] ? sumCount[7] : 0;var ams8= sumCount[8] ? sumCount[8] : 0;var ams9= sumCount[9] ? sumCount[9] : 0;
        var csq0= csq_counts[0] ? csq_counts[0] : 0; var csq1= csq_counts[1] ? csq_counts[1] : 0; var csq2= csq_counts[2] ? csq_counts[2] : 0; var csq3= csq_counts[3] ? csq_counts[3] : 0; var csq4= csq_counts[4] ? csq_counts[4] : 0; var csq5= csq_counts[5] ? csq_counts[5] : 0;var csq6= csq_counts[6] ? csq_counts[6] : 0;var csq7= csq_counts[7] ? csq_counts[7] : 0;var csq8= csq_counts[8] ? csq_counts[8] : 0;var csq9= csq_counts[9] ? csq_counts[9] : 0;
      for(var o= 0; o< 10; o++)
      { 
        let index = list_orders.findIndex(obj => parseInt(obj.amount) === o);
        miss_counts[o] = index;
      }
      var ms0= miss_counts[0] ? miss_counts[0] : 0 ; var ms1= miss_counts[1] ? miss_counts[1] : 0; var ms2= miss_counts[2] ? miss_counts[2] : 0; var ms3= miss_counts[3] ? miss_counts[3] : 0; var ms4= miss_counts[4] ? miss_counts[4] : 0; var ms5= miss_counts[5] ? miss_counts[5] : 0;var ms6= miss_counts[6] ? miss_counts[6] : 0;var ms7= miss_counts[7] ? miss_counts[7] : 0;var ms8= miss_counts[8] ? miss_counts[8] : 0;var ms9= miss_counts[9] ? miss_counts[9] : 0;
      MISSING = `
              <span  class="number-cell">`+ms0+`</span>
              <span  class="number-cell">`+ms1+`</span>
              <span  class="number-cell">`+ms2+`</span>
              <span  class="number-cell">`+ms3+`</span>
              <span  class="number-cell">`+ms4+`</span>
              <span  class="number-cell">`+ms5+`</span>
              <span  class="number-cell">`+ms6+`</span>
              <span  class="number-cell">`+ms7+`</span>
              <span  class="number-cell">`+ms8+`</span>
              <span  class="number-cell">`+ms9+`</span>`;
            AVG_MISSING = `
              <span  class="number-cell">`+ams0+`</span>
              <span  class="number-cell">`+ams1+`</span>
              <span  class="number-cell">`+ams2+`</span>
              <span  class="number-cell">`+ams3+`</span>
              <span  class="number-cell">`+ams4+`</span>
              <span  class="number-cell">`+ams5+`</span>
              <span  class="number-cell">`+ams6+`</span>
              <span  class="number-cell">`+ams7+`</span>
              <span  class="number-cell">`+ams8+`</span>
              <span  class="number-cell">`+ams9+`</span>`;
            FREQUENCY = `
              <span  class="number-cell">`+fq0+`</span>
              <span  class="number-cell">`+fq1+`</span>
              <span  class="number-cell">`+fq2+`</span>
              <span  class="number-cell">`+fq3+`</span>
              <span  class="number-cell">`+fq4+`</span>
              <span  class="number-cell">`+fq5+`</span>
              <span  class="number-cell">`+fq6+`</span>
              <span  class="number-cell">`+fq7+`</span>
              <span  class="number-cell">`+fq8+`</span>
              <span  class="number-cell">`+fq9+`</span>`;
              
            MAX_CONSECUTIVE = `
              <span  class="number-cell">`+csq0+`</span>
              <span  class="number-cell">`+csq1+`</span>
              <span  class="number-cell">`+csq2+`</span>
              <span  class="number-cell">`+csq3+`</span>
              <span  class="number-cell">`+csq4+`</span>
              <span  class="number-cell">`+csq5+`</span>
              <span  class="number-cell">`+csq6+`</span>
              <span  class="number-cell">`+csq7+`</span>
              <span  class="number-cell">`+csq8+`</span>
              <span  class="number-cell">`+csq9+`</span>`;
              $("#miss_num").html(MISSING);
              $("#avg_num").html(AVG_MISSING);
              $("#freq_num").html(FREQUENCY);
              $("#max_consq").html(MAX_CONSECUTIVE);
    };
  };

  function showListOrder_t(list_orders, x) {
    var sel_txt = $("#chain_numbers").find('div.active').html().toString().trim();
    if (list_orders.length == 0) {
      return $(`.game-list .con-box:eq(${x}) .hb`).html(
        `
          <div data-v-a9660e98="" class="van-empty">
            <div class="van-empty__image">
              <img src="/images/empty-image-default.png" />
            </div>
            <p class="van-empty__description">No data</p>
          </div>
        `
      );
    }
    var res_ind = 0;
    if(sel_txt == 'A')
    {
        res_ind = 0;
    }
    else if(sel_txt == 'B')
    {
        res_ind = 1;
    }
    else if(sel_txt == 'C')
    {
        res_ind = 2;
    }
    else if(sel_txt == 'D')
    {
        res_ind = 3;
    }
    else if(sel_txt == 'E')
    {
        res_ind = 4;
    }
    var updated = false;
    $(list_orders).each(function (index, el) {
        var a_result1 = el.result.toString().split("")[parseInt(res_ind)];
      $(".Trend__C-body2").find('[rowid='+(index)+']').find('.Trend__C-body2-IssueNumber').text(el.period);
      $(".Trend__C-body2").find('[rowid='+(index)+']').find('.Trend__C-body2-Num').find(".Trend__C-body2-Num-item").removeClass("action");
      $(".Trend__C-body2").find('[rowid='+(index)+']').find('.Trend__C-body2-Num').find(".Trend__C-body2-Num-item").css('background', '');
      $(".Trend__C-body2").find('[rowid='+(index)+']').find('.Trend__C-body2-Num').find(".Trend__C-body2-Num-item:contains('"+(parseInt(a_result1))+"')").addClass("action");
      if(parseInt(a_result1) > 4)
      {
        $(".Trend__C-body2").find('[rowid='+(index)+']').find('.Trend__C-body2-Num').find(".Trend__C-body2-Num-BS").text('B');
        $(".Trend__C-body2").find('[rowid='+(index)+']').find('.Trend__C-body2-Num').find(".Trend__C-body2-Num-BS").css('background', '#FEAA57');
      }
      else{
        $(".Trend__C-body2").find('[rowid='+(index)+']').find('.Trend__C-body2-Num').find(".Trend__C-body2-Num-BS").text('S');
        $(".Trend__C-body2").find('[rowid='+(index)+']').find('.Trend__C-body2-Num').find(".Trend__C-body2-Num-BS").css('background', '#6EA8F4');
      }
      if(parseInt(a_result1) % 2 === 0)
      {
        $(".Trend__C-body2").find('[rowid='+(index)+']').find('.Trend__C-body2-Num').find(".Trend__C-body2-Num-EO").text('E');
        $(".Trend__C-body2").find('[rowid='+(index)+']').find('.Trend__C-body2-Num').find(".Trend__C-body2-Num-EO").css('background', '#22275b');
        $(".Trend__C-body2").find('[rowid='+(index)+']').find('.Trend__C-body2-Num').find(".Trend__C-body2-Num-EO").css('border', '.01333rem solid #B6BCC8');
      }
      else{
        $(".Trend__C-body2").find('[rowid='+(index)+']').find('.Trend__C-body2-Num').find(".Trend__C-body2-Num-EO").text('O');
        $(".Trend__C-body2").find('[rowid='+(index)+']').find('.Trend__C-body2-Num').find(".Trend__C-body2-Num-EO").css('background', '#17B15E');
      }
      if(parseInt(a_result1) == 0 || parseInt(a_result1) == 5)
      {
        $(".Trend__C-body2").find('[rowid='+(index)+']').find('.Trend__C-body2-Num').find(".Trend__C-body2-Num-item:contains('"+(parseInt(a_result1))+"')").css('background', '#db5fd1');
      }
      else if(parseInt(a_result1) % 2 === 0)
      {
        $(".Trend__C-body2").find('[rowid='+(index)+']').find('.Trend__C-body2-Num').find(".Trend__C-body2-Num-item:contains('"+(parseInt(a_result1))+"')").css('background', '#fb4e4e');
      }
      else 
      {
        $(".Trend__C-body2").find('[rowid='+(index)+']').find('.Trend__C-body2-Num').find(".Trend__C-body2-Num-item:contains('"+(parseInt(a_result1))+"')").css('background', '#5cba47');
      }
      updated = true;
    });
    if(updated == true)
    {
      for(var i = 0; i < 10; i++)
      {
        var b3 = $(".Trend__C-body2").find('[rowid='+(i)+']').find('.Trend__C-body2-Num').find(".Trend__C-body2-Num-item")[0].getBoundingClientRect();
        var b1 = $(".Trend__C-body2").find('[rowid='+(i)+']').find('.Trend__C-body2-Num').find(".action")[0].getBoundingClientRect();
        var left_val = parseInt(b1.left) - parseInt(b3.left);
        if( $(".Trend__C-body2").find('[rowid='+(i+1)+']').find('.Trend__C-body2-Num').find(".action")[0] != null)
        { 
          var b2 = $(".Trend__C-body2").find('[rowid='+(i+1)+']').find('.Trend__C-body2-Num').find(".action")[0].getBoundingClientRect();
          $(".Trend__C-body2").find('[rowid='+(i)+']').find('.Trend__C-body2-Num') .find("#myCanvas"+(i)).css('left',(parseInt(left_val)+'px'));
          var dx = (b1.left+(b1.right-b1.left)/2) - (b2.left+(b2.right-b2.left)/2);
          var dy = (b1.top+(b1.bottom-b1.top)/2) - (b2.top+(b2.bottom-b2.top)/2);
          var dist = Math.sqrt(dx * dx + dy * dy);
          var dx1 = b2.x - b1.x 
          var dy1 = b2.y - b1.y
          var angle = Math.atan2(dx1, dy1) * 180 / Math.PI;
          var angle1 = Math.atan2(b2.y - b1.y, b2.x - b1.x) * 180 / Math.PI;
          $(".Trend__C-body2").find('[rowid='+(i)+']').find('.Trend__C-body2-Num') .find("#myCanvas"+(i)).css('width',(parseInt(dist)+'px'));
          $(".Trend__C-body2").find('[rowid='+(i)+']').find('.Trend__C-body2-Num') .find("#myCanvas"+(i)).css('transform',('rotate('+parseInt(angle1) + 'deg)'));
        }
		
	    else{
          $(".Trend__C-body2").find('[rowid='+(i)+']').find('.Trend__C-body2-Num') .find("#myCanvas"+(i)).css('left',(left_val+'px'));
          $(".Trend__C-body2").find('[rowid='+(i)+']').find('.Trend__C-body2-Num') .find("#myCanvas"+(i)).css('width',('2px'));
        }
      } 
    }
    }

    function animationNewPar(data) {
        let arr = String(data).split('');
        $('.transform0, .transform1, .transform2, .transform3, .transform4, .transform5').addClass('slot-scroll');
        setTimeout(() => {
            for (let i = 0; i < 5; i++) {
                let random = Math.floor(Math.random() * 10);
                $(`.transform${i} .slot-num:eq(0)`).text(random);
                random = Math.floor(Math.random() * 10);
                $(`.transform${i} .slot-num:eq(1)`).text(random);
                $(`.transform${i} .slot-num:eq(2)`).text(arr[i]);
            }
            $('.transform0').removeClass('slot-scroll');
            setTimeout(() => {
                $('.transform1, .transform2, .transform3, .transform4, .transform5').removeClass('slot-scroll');
                showResultNow(data);
            }, 100);
        }, 2500);
    }

    
function alertMess(text, sic) {
    $('body').append(
        `
        <div data-v-1dcba851="" class="msg">
            <div data-v-1dcba851="" class="msg-content v-enter-active v-enter-to" style=""> ${text} </div>
        </div>
        `
    );
    setTimeout(() => {
        $('.msg .msg-content').removeClass('v-enter-active v-enter-to');
        $('.msg .msg-content').addClass('v-leave-active v-leave-to');
        setTimeout(() => {
            $('.msg').remove();
        }, 100);
    }, 1000);
}



function ShowListOrder(list_orders) {
    if (list_orders.length == 0) {
        return $(`#list_order`).html(
            `
            <div data-v-a9660e98="" class="van-empty">
                <div class="van-empty__image">
                    <img src="/images/empty-image-default.png" />
                </div>
                <p class="van-empty__description">No Data</p>
            </div>
            `
        );
    }
    let htmls = "";
    let result = list_orders.map((list_orders) => {
        let arr = list_orders.result.split('');
        let resultData = ``;
        let total = 0;

        for (let i = 0; i < arr.length; i++) {
            total += Number(arr[i]);
            resultData += `
          <div data-v-42f27458="" class="li circle-black c-row c-row-middle-center c-tc">
              <div data-v-42f27458="">${arr[i]}</div>
          </div>
        `;
        }

        return (htmls += `
        <div data-v-42f27458="" class="c-tc item van-row">
          <div data-v-42f27458="" class="van-col van-col--8">
            <div data-v-42f27458="" class="c-tc goItem">${list_orders.period}</div>
          </div>
          <div data-v-42f27458="" class="van-col van-col--12">
            <div data-v-42f27458="" class="c-row">
              <div data-v-42f27458="" class="c-row qiu c-row-middle-center">
                ${resultData}
              </div>
            </div>
          </div>
          <div data-v-42f27458="" class="van-col van-col--4">
            <div data-v-42f27458="" class="c-row c-row-middle-center"><span data-v-42f27458=""
                class="li action c-row c-row-middle-center c-tc">${total}</span></div>
          </div>
        </div>
      `);
    });
    $(`#list_order`).html(htmls);
}


function showResultNow(data) {
    let arr = String(data).split('');
    let total = 0;
    for (let i = 0; i < arr.length; i++) {
        total += Number(arr[i]);
        $(`.round-num:eq(${i}) .fade-item`).text(arr[i]);
        let random = Math.floor(Math.random() * 10);
        $(`.transform${i} .slot-num:eq(0)`).text(random);
        random = Math.floor(Math.random() * 10);
        $(`.transform${i} .slot-num:eq(1)`).text(random);
        $(`.transform${i} .slot-num:eq(2)`).text(arr[i]);
    }
    $(".round-num #total_r").text(total);
}

$('.van-notice-bar__wrap .van-notice-bar__content').css({
    'transition-duration': '48.34s',
    'transform': 'translateX(-3417px)',
});

setInterval(() => {
    $('.van-notice-bar__wrap .van-notice-bar__content').css({
        'transition-duration': '0s',
        'transform': 'translateX(0)',
    });
    setTimeout(() => {
        $('.van-notice-bar__wrap .van-notice-bar__content').css({
            'transition-duration': '48.34s',
            'transform': 'translateX(-3417px)',
        });
    }, 100);
}, 48000);

function downAndHidden() {
    $('.van-overlay').fadeOut();
    $('#box-join').css('transform', 'translateY(1000px)');
    $('body').removeClass('van-overflow-hidden');
    $('.0-9 .bet-num-line .bet-box-num').removeClass('active');
    $('.small-big .bet-type-btn').attr('class', 'bet-type-btn flex-row-between');
    $('#result').attr('list-join', '');
    $('#result').attr('value', '1');
    $('#plus-minus .minus').removeClass('action');
    $('#value-join').val(1);
    $('.amount-box .li').removeClass('action');
    $('.amount-box .li:eq(0)').addClass('action');
    $('.multiple-box .li').removeClass('action');
    $('.multiple-box .li:eq(0)').addClass('action');
    $('.supportss').fadeOut();
}

var audio1 = new Audio("/audio/di1.da40b233.mp3");
var audio2 = new Audio("/audio/di2.317de251.mp3");

var clicked = false;

function openAudio() {
    audio1.muted = true;
    audio1.play();
    audio2.muted = true;
    audio2.play();
}

$("body").click(function (e) {
    e.preventDefault();
    if (clicked) return;
    openAudio();
    clicked = true;
});

function playAudio1() {
    audio1.muted = false;
    audio1.play();
}

function playAudio2() {
    audio2.muted = false;
    audio2.play();
}

function cownDownTimer() {
    let countDownDate = new Date("2030-07-16T23:59:59.9999999+01:00").getTime();
    setInterval(function () {
        let now = new Date().getTime();
        let distance = countDownDate - now;
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        let checkData = Number($('html').attr('data-dpr'));
        let minute = Math.ceil(minutes % checkData);
        let seconds1 = Math.floor((distance % (1000 * 60)) / 10000);
        let seconds2 = Math.floor(((distance % (1000 * 60)) / 1000) % 10);
        $(".flex-row-end .li-item:eq(1)").text(minute);
        $(".flex-row-end .li-item:eq(2)").text(seconds1);
        $(".flex-row-end .li-item:eq(3)").text(seconds2);

        if (minute == 0 && seconds1 == 0 && seconds2 <= 5) {
            $('.minH .mark-box').show();
            $('.minH .mark-box .item:eq(1)').text(seconds2);

            downAndHidden();
        }
        if (minute >= 0 && seconds1 >= 1 && seconds2 <= 9) {
            $('.minH .mark-box').hide();
        }
    }, 0);
    setInterval(function () {
        let now = new Date().getTime();
        let distance = countDownDate - now;
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let checkData = Number($('html').attr('data-dpr'));
        let minute = Math.ceil(minutes % checkData);
        let seconds1 = Math.floor((distance % (1000 * 60)) / 10000);
        let seconds2 = Math.floor(((distance % (1000 * 60)) / 1000) % 10);
        const check_volume = localStorage.getItem('volume');

        if (minute == 0 && seconds1 == 0 && seconds2 <= 5) {
            if (clicked) {
                if (check_volume == 'on') {
                    playAudio1();
                }
            }
        }
        
        if (minute == (checkData - 1) && seconds1 == 5 && seconds2 >= 9) {
            if (clicked) {
                if (check_volume == 'on') {
                    playAudio2();
                }
            }
        }
    }, 1000);
}

cownDownTimer();

$('.item-volume').click(function (e) { 
    e.preventDefault();
    const check_volume = localStorage.getItem('volume');
    if (check_volume == 'on') {
        $(this).attr('src', '/images/volume-off-outline.webp');
        localStorage.setItem('volume', 'off');
    } else {
        $(this).attr('src', '/images/volume-up-line.webp');
        localStorage.setItem('volume', 'on');
    }
});

function result() {
    let join = $('#result').attr('list-join').split('');
    let value = $('#result').attr('value');
    let amount = $('#value-join').val();

    let result = join.length * Number(value) * Number(amount);
    if (result <= 0) {
        result = 1000;
    }
    $("#total").html(result + '.00');
}

$('.van-overlay, .canned-alert').click(function (e) {
    e.preventDefault();
    downAndHidden();
});
$('.0-9 .bet-num-line').click(function (e) {
    e.preventDefault();
    let info = $(this).attr('txt');
    let list = $('#result').attr('list-join');
    let checkClass = $(this).find('.bet-box-num').hasClass('active');

    let checkList = Number(list);
    if (isNaN(checkList)) {
        $('#result').attr('list-join', '');
        list = $('#result').attr('list-join');
    }

    if (checkClass) {
        let newList = list.replace(info, '');
        $('#result').attr('list-join', newList);
        result();
        return $(`.0-9 .bet-num-line[txt=${info}] .bet-box-num`).removeClass('active');
    }
    $(`.0-9 .bet-num-line[txt=${info}] .bet-box-num`).addClass('active');
    $('.small-big .bet-type-btn').attr('class', 'bet-type-btn flex-row-between');

    $('#result').attr('list-join', list += info);
    result();
});

$('.select-number-0-9').click(function (e) {
    e.preventDefault();
    $('.van-overlay').fadeIn();
    $('#box-join').css('transform', 'translateY(0px)');
    $('body').addClass('van-overflow-hidden');
});

$('.small-big .bet-type-btn').click(function (e) {

    e.preventDefault();
    let info = $(this).attr('data-join');
    $('.van-overlay').fadeIn();
    $('#box-join').css('transform', 'translateY(0px)');
    $('body').addClass('van-overflow-hidden');
    $(`.small-big .bet-type-btn`).attr('class', 'bet-type-btn flex-row-between');
    $(`.small-big .bet-type-btn[data-join=${info}]`).addClass(info);
    $('.0-9 .bet-num-line .bet-box-num').removeClass('active');

    let join = $(this).attr('join');
    $('#result').attr('list-join', join);
    result();
});

$('.a-b-c-d-e .d5-bet-type').click(function (e) {
    e.preventDefault();
    let info = $(this).attr('data-join');
    $(`.a-b-c-d-e .d5-bet-type`).removeClass('active');
    $(`.a-b-c-d-e .d5-bet-type[data-join=${info}]`).addClass('active');
    $('#result').attr('join', info);
    if (info == 'total') {
        $('.0-9').hide();
        let check = Number($('#result').attr('list-join'));
        if (!isNaN(check)) {
            $('#result').attr('list-join', '');
            $('.0-9 .bet-num-line .bet-box-num').removeClass('active');
        }
    } else {
        $('.0-9').show();
    }
});

$('.amount-box .li').click(function (e) {

    e.preventDefault();
    let value = $(this).attr('value');
    $('#result').attr('value', value);
    $('.amount-box .li').removeClass('action');
    $(this).addClass('action');
    result();
});

$('.multiple-box .li').click(function (e) {

    e.preventDefault();
    let value = $(this).attr('amount');
    $('#value-join').val(value);
    $('.multiple-box .li').removeClass('action');
    $(this).addClass('action');
    $('#plus-minus .minus').addClass('action');
    result();
});

$('#plus-minus .minus').click(function (e) {

    e.preventDefault();
    let value = Number($('#value-join').val());
    if (value <= 1) {
        $('.multiple-box .li:eq(0)').addClass('action');
        $('#plus-minus .minus').removeClass('action');
        result();
        return false;
    };
    $('#value-join').val(value -= 1);
    value = Number($('#value-join').val());
    if (value <= 1) {
        $('.multiple-box .li:eq(0)').addClass('action');
        $('#plus-minus .minus').removeClass('action');
        result();
        return false;
    };
    value = Number($('#value-join').val());
    if (value <= 1) {
        $('#plus-minus .minus').removeClass('action');
        return false;
    };
    $(`.multiple-box .li`).removeClass('action');
    $(`.multiple-box .li[amount=${value}]`).addClass('action');
    result();
});
$('#plus-minus .plus').click(function (e) {

    e.preventDefault();
    let value = Number($('#value-join').val());
    $('#value-join').val(value += 1);
    $(`.multiple-box .li`).removeClass('action');
    $(`.multiple-box .li[amount=${value}]`).addClass('action');

    $('#plus-minus .minus').addClass('action');
    result();
});
$('#value-join').on("input", function () {
    let value = Number($(this).val());
    if (value > 1) {
        $('#plus-minus .minus').addClass('action');
    } else {
        $('#plus-minus .minus').removeClass('action');
    }
    $(`.multiple-box .li`).removeClass('action');
    $(`.multiple-box .li[amount=${value}]`).addClass('action');
    result();
});


function formateT(params) {
    let result = (params < 10) ? "0" + params : params;
    return result;
    }
    
function timerJoin(params = '', addHours = 0) {
        let date = '';
        if (params) {
            date = new Date(Number(params));
        } else {
            date = new Date();
        }
    
        date.setHours(date.getHours() + addHours);
    
        let years = formateT(date.getFullYear());
        let months = formateT(date.getMonth() + 1);
        let days = formateT(date.getDate());
    
        let hours = date.getHours() % 12;
        hours = hours === 0 ? 12 : hours;
        let ampm = date.getHours() < 12 ? "AM" : "PM";
    
        let minutes = formateT(date.getMinutes());
        let seconds = formateT(date.getSeconds());
    
        return years + '-' + months + '-' + days + ' ' + hours + ':' + minutes + ':' + seconds + ' ' + ampm;
    }


function isNumber(params) {
    let pattern = /^[0-9]*\d$/;
    return pattern.test(params);
}
function GetMyEmerdList(datas) {
    if (datas.length == 0) {
        return $(`#showJoinMe`).html(
            `
        <div data-v-a9660e98="" class="van-empty">
            <div class="van-empty__image">
                <img src="/images/empty-image-default.png" />
            </div>
            <p class="van-empty__description">No Data</p>
        </div>
        `
        );
    }
    let htmls = "";
    let result = datas.map((data) => {
        let arr = data.result.split('');
        let resultData = ``;
        let total = 0;

        for (let i = 0; i < arr.length; i++) {
            total += Number(arr[i]);
            resultData += `
          <div data-v-42f27458="" class="li circle-black">${arr[i]}</div>
        `;
        }

        let join = '';
        let arr2 = data.bet.split('');
        for (let i = 0; i < arr2.length; i++) {
            let check = isNumber(data.bet);
            if (check) {
                join += `
          <div data-v-42f27458="">
              <span data-v-42f27458="" style="color: rgb(0, 0, 0);">
                <span data-v-42f27458="" class="li circle-black" style="color: rgb(0, 0, 0);">${arr2[i]}</span>  
              </span>
          </div>`;
            } else {
                join += `
          <div data-v-42f27458="">
            <span data-v-42f27458="" style="color: rgb(0, 0, 0);">${(arr2[i] == 'c') ? "Even" : (arr2[i] == 'l') ? 'Odd' : (arr2[i] == 'b') ? 'Big' : 'Small'}</span>
          </div>
          `;
            }
        }

        return (htmls += `
      <div data-v-42f27458="" issuenumber="${data.id_product}" addtime="${timerJoin(data.time)}" rowid="1" class="hb">
          <div data-v-42f27458="" class="item c-row">
              <div data-v-42f27458="" class="c-row c-row-between info">
                  <div data-v-42f27458="">
                      <div data-v-42f27458="" class="issueName">
                        ${data.stage} 
                        <span data-v-42f27458="" class="state ${(data.status == 1) ? 'green' : 'red'}"" 
                        style="display: ${(data.status == 0) ? 'none' : ''};">${(data.status == 1) ? 'Success' : 'Fail'}</span>
                          <!---->
                      </div>
                      <div data-v-42f27458="" class="tiem">${timerJoin(data.time)}</div>
                  </div>
                  <div data-v-42f27458="" class="money" style="display: ${(data.status == 0) ? 'none' : ''}">
                      <span data-v-42f27458="" class="${(data.status == 1) ? 'success' : 'fail'}"> ${(data.status == 1) ? '+' : '-'} ${(data.status == 1) ? data.get : data.price}.00 </span>
                      <!---->
                  </div>
              </div>
          </div>
          <div data-v-42f27458="" class="details display-none">
              <div data-v-42f27458="" class="tit">Details</div>
              <div data-v-42f27458="" class="detailLi c-row c-row-between c-row-middle">
                  <div data-v-42f27458="">Order Number</div>
                  <div data-v-42f27458="" class="tag-read c-row c-row-between c-row-middle">
                      ${data.id_product}
                      <img data-v-42f27458="" data-clipboard-text="${data.id_product}" width="18px" height="15px" src="/images/copy.png" class="m-l-5 copy-to-img" />
                  </div>
              </div>
              <div data-v-42f27458="" class="detailLi c-row c-row-between c-row-middle">
                  <div data-v-42f27458="">Periods</div>
                  <div data-v-42f27458="">${data.stage}</div>
              </div>
              <div data-v-42f27458="" class="detailLi c-row c-row-between c-row-middle">
                  <div data-v-42f27458="">Spent Amount</div>
                  <div data-v-42f27458="">${data.money}.00</div>
              </div>
              <div data-v-42f27458="" class="detailLi c-row c-row-between c-row-middle">
                  <div data-v-42f27458="">Quantity Purchased</div>
                  <div data-v-42f27458="">${data.amount}</div>
              </div>
              <div data-v-42f27458="" class="detailLi c-row c-row-between c-row-middle">
                  <div data-v-42f27458="">After Tax Amount</div>
                  <div data-v-42f27458="" class="red">${data.price}.00</div>
              </div>
              <div data-v-42f27458="" class="detailLi c-row c-row-between c-row-middle">
                  <div data-v-42f27458="">Tax</div>
                  <div data-v-42f27458="">${data.fee}.00</div>
              </div>
              <div data-v-42f27458="" class="detailLi c-row c-row-between c-row-middle">
                  <div data-v-42f27458="">Opening Price</div>
                  <div data-v-42f27458="" style="display: ${(data.status == 0) ? 'none' : ''};">${data.result}</div>
              </div>
              <div data-v-42f27458="" class="detailLi c-row c-row-between c-row-middle">
                  <div data-v-42f27458="">Results</div>
                  <div data-v-42f27458="" class="c-row" style="display: ${(data.status == 0) ? 'none' : ''};">
                    ${resultData}
                  </div>
              </div>
              <div data-v-42f27458="" class="detailLi c-row c-row-between c-row-middle">
                  <div data-v-42f27458="">Choose</div>
                  <div data-v-42f27458="" class="c-row c-row-middle">
                      <div data-v-42f27458="" class="c-row m-r-5">
                          <div data-v-42f27458="">${(data.join_bet == 'total') ? "SUM" : data.join_bet.toUpperCase()}</div>
                      </div>
                      ${join}
                  </div>
              </div>
              <div data-v-42f27458="" class="detailLi c-row c-row-between c-row-middle">
                  <div data-v-42f27458="">Status</div>
                  <div data-v-42f27458="" class="${(data.status == 1) ? 'green' : 'red'}" style="display: ${(data.status == 0) ? 'none' : ''};">${(data.status == 1) ? 'Success' : 'Fail'}</div>
                  <!---->
              </div>
              <div data-v-42f27458="" class="detailLi c-row c-row-between c-row-middle">
                  <div data-v-42f27458="">Win Or Loss</div>
                  <div data-v-42f27458="" class="${(data.status == 1) ? 'green' : 'red'}" style="display: ${(data.status == 0) ? 'none' : ''};">${(data.status == 1) ? '+' : '-'} ${(data.status == 1) ? data.get : data.price}.00</div>
                  <!---->
              </div>
              <div data-v-42f27458="" class="detailLi c-row c-row-between c-row-middle">
                  <div data-v-42f27458="">Purchase Time</div>
                  <div data-v-42f27458="">${timerJoin(data.time)}</div>
              </div>
          </div>
      </div>
      `);
    });
    $(`#showJoinMe`).html(htmls);
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
        let socket = io();
var pageno = 0;
var limit = 10;
var page = 1;
var firstGame = null;
var socket_call = "";
          var username = auth.user.username;
          var password = auth.user.uid;
          var auth_token = auth.accessToken;
          $.ajax({
            type: "POST",
            url: "/api/webapi/check_login",
            data: {
                authtoken:auth_token,
                username:username,
                pwd:password
            },
            dataType: "json",
            success: function (response) {
                if(response.data == "register")
                {
                    window.location.href = '/register';
                }
                else if(response.data == "login")
                {
                    window.location.href = '/login';
                }
                else{
          $(".Loading").fadeIn(0);
          $(document).ready(function(){
            callAjaxMeJoin();
          });
                    

          async function showMeJoin() {
            await callAjaxMeJoin();
            setTimeout(() => {
                $('#showJoinMe .hb').click(function (e) {
                    e.preventDefault();
                    $(this).find('.details').toggleClass("display-none");
                });
        
                $('.copy-to-img').click(function (e) {
                    e.preventDefault();
                    var copyText = $(this).attr('data-clipboard-text');
                    navigator.clipboard.writeText(copyText);
                    alertMess('Copy successful');
                });
            }, 500);
        }


        $('.foot .right').click(function (e) {
            e.preventDefault();
            let join = $('#result').attr('join'); // loại ? vd: abcde total
            let list_join = $('#result').attr('list-join'); // bet to
            let value = $('#result').attr('value'); // money
            let x = $('#value-join').val().trim(); // x
            let game = $('html').attr('data-dpr');
        
            $('.Loading').fadeIn(0);
            $('.foot .right').addClass('block-click');
            $.ajax({
                type: "POST",
                url: "/api/webapi/action/5d/join",
                data: {
                    join: join,
                    list_join: list_join,
                    money: value,
                    x: x,
                    game: game,
                    authtoken:auth_token,
                },
                dataType: "json",
                success: function (response) {
                    $('.Loading').fadeOut(0);
                    let chane = response.change;
                    socket.emit('data-server-5', { chane, join, list_join, money: value, x, game });
                    alertMess(response.message);
                    setTimeout(() => {
                        downAndHidden();
                        $('.foot .right').removeClass('block-click');
                    }, 500);
                    if (response.status == true) {
                        $('#money_show').text("₹ " + response.money + '.00');
                        showMeJoin();
                    }
                }
            });
        });
        
        
        
        
        
        var pageno = 0;
        var limit = 10;
        var page = 1;
        $('#GetMyEmerdList').click(function (e) {
            e.preventDefault();
            pageno = 0;
            limit = 10;
            page = 1;
            $('.Loading').fadeIn(0);
            $('#GetNoaverageEmerdList').removeClass('block-click');
            $('#GetNoaverageEmerdList').find('.txt').removeClass('action');
            $('#GetMyTrends').removeClass('block-click');
            $('#GetMyTrends').find('.txt').removeClass('action');
            $(this).addClass('block-click');
            $(this).find('.txt').addClass('action');
            $("#all").fadeOut(0);
            $("#me").fadeIn(0);
            $('#number_result').attr('data-select', 'me');
            showMeJoin();
            $("#previous").addClass("block-click");
            $("#previous").removeClass("action");
            $("#previous .van-icon-arrow").css("color", "#7f7f7f");
            $("#next").removeClass("block-click");
            $("#next").addClass("action");
            $("#next .van-icon-arrow").css("color", "#fff");
            $("#trend_list").css("display","none");
            $(`#general_nav`).css("display","flex");
            $(`#tren_nav`).css("display","none");
        });
        
        
        var pageno = 0;
        var limit = 10;
        var page = 1;
        $("#next").click(function (e) {
            e.preventDefault();
            let check = $('#number_result').attr('data-select');
            $('.Loading').fadeIn(0);
            $("#previous").removeClass("block-click");
            $("#previous").addClass("action");
            $("#previous .van-icon-arrow-left").css("color", "#fff");
            pageno += 10;
            let pageto = limit;
            let url = '';
            if (check == 'all') {
                url = "/api/webapi/5d/GetNoaverageEmerdList";
            } else {
                url = "/api/webapi/5d/GetMyEmerdList";
            }
            $.ajax({
                type: "POST",
                url: url,
                data: {
                    gameJoin: $('html').attr('data-dpr'),
                    pageno: pageno,
                    pageto: pageto,
                    authtoken:auth_token,
                },
                dataType: "json",
                success: async function (response) {
                    $('.Loading').fadeOut(0);
                    if (response.status === false) {
                        pageno -= 10;
                        $("#next").addClass("block-click");
                        $("#next").removeClass("action");
                        $("#next .van-icon-arrow").css("color", "#7f7f7f");
                        alertMess(response.msg);
                        return false;
                    }
                    let list_orders = response.data.gameslist;
                    $("#period").text(response.period);
                    $("#number_result").text(++page + "/" + response.page);
                    if (check == 'all') {
                        ShowListOrder(list_orders);
                    } else {
                        await GetMyEmerdList(list_orders);
                        setTimeout(() => {
                            $('#showJoinMe .hb').click(function (e) {
                                e.preventDefault();
                                $(this).find('.details').toggleClass("display-none");
                            });
                    
                            $('.copy-to-img').click(function (e) {
                                e.preventDefault();
                                var copyText = $(this).attr('data-clipboard-text');
                                navigator.clipboard.writeText(copyText);
                                alertMess('Copy successful');
                            });
                        }, 500);
                    }
                },
            });
        });
        $("#previous").click(function (e) {
            e.preventDefault();
            let check = $('#number_result').attr('data-select');
            $('.Loading').fadeIn(0);
            $("#next").removeClass("block-click");
            $("#next").addClass("action");
            $("#next .van-icon-arrow").css("color", "#fff");
            pageno -= 10;
            let pageto = limit;
            let url = '';
            if (check == 'all') {
                url = "/api/webapi/5d/GetNoaverageEmerdList";
            } else {
                url = "/api/webapi/5d/GetMyEmerdList";
            }
            $.ajax({
                type: "POST",
                url: url,
                data: {
                    gameJoin: $('html').attr('data-dpr'),
                    pageno: pageno,
                    pageto: pageto,
                    authtoken:auth_token,
                },
                dataType: "json",
                success: async function (response) {
                    $('.Loading').fadeOut(0);
                    if (page - 1 < 2) {
                        $("#previous").addClass("block-click");
                        $("#previous").removeClass("action");
                        $("#previous .van-icon-arrow-left").css("color", "#7f7f7f");
                    }
                    if (response.status === false) {
                        pageno = 0;
                        $("#previous .arr:eq(0)").addClass("block-click");
                        $("#previous .arr:eq(0)").removeClass("action");
                        $("#previous .van-icon-arrow-left").css("color", "#7f7f7f");
                        alertMess(response.msg);
                        return false;
                    }
                    let list_orders = response.data.gameslist;
                    $("#period").text(response.period);
                    $("#number_result").text(--page + "/" + response.page);
                    if (check == 'all') {
                        ShowListOrder(list_orders);
                    } else {
                        await GetMyEmerdList(list_orders);
                        setTimeout(() => {
                            $('#showJoinMe .hb').click(function (e) {
                                e.preventDefault();
                                $(this).find('.details').toggleClass("display-none");
                            });
                    
                            $('.copy-to-img').click(function (e) {
                                e.preventDefault();
                                var copyText = $(this).attr('data-clipboard-text');
                                navigator.clipboard.writeText(copyText);
                                alertMess('Copy Successfull');
                            });
                        }, 500);
                    }
                },
            });
        });
        
        $('.circular, #quytacs').click(function (e) { 
            e.preventDefault();
            $('.supportss').fadeIn();
            $('.van-overlay').fadeIn();
            $('body').addClass('van-overflow-hidden');
        });
        
        $('.submit-support').click(function (e) { 
            e.preventDefault();
            downAndHidden();
        });
        
        $('#game-join .item').click(async function (e) { 
            e.preventDefault();
            let game = $(this).attr('game');
            $('html').attr('data-dpr', game);
            $('.Loading').fadeIn(0);
            await callListOrder();
            await showMeJoin();
        
            $('.minH .mark-box').hide();
            $('#GetNoaverageEmerdList').click();
        
            let actionOld = $('#game-join').find('.action');
            actionOld.find('.img .van-image:eq(0)').fadeOut(0);
            actionOld.find('.img .van-image:eq(1)').fadeIn(0);
            actionOld.removeClass('action block-click');
        
            $(this).addClass('action block-click');
            $(this).find('.img .van-image:eq(0)').fadeIn(0);
            $(this).find('.img .van-image:eq(1)').fadeOut(0);
        });
        $('#GetMyTrends').click(function (e) {
            e.preventDefault();
            pageno = 0;
            limit = 10;
            page = 1;
            $('.Loading').fadeIn(0);
            $('#GetMyEmerdList').removeClass('block-click');
            $('#GetMyEmerdList').find('.txt').removeClass('action');
            $('#GetNoaverageEmerdList').removeClass('block-click');
            $('#GetNoaverageEmerdList').find('.txt').removeClass('action');
            $(this).addClass('block-click');
            $(this).find('.txt').addClass('action');
            $("#trend_previous").addClass("block-click");
            $("#trend_previous").removeClass("action");
            $("#trend_previous .van-icon-arrow").css("color", "#7f7f7f");
            $("#trend_next").removeClass("block-click");
            $("#trend_next").addClass("action");
            $("#trend_next .van-icon-arrow").css("color", "#fff");
            $(`#me`).css("display","none");
            $.ajax({
                type: "POST",
                url: "/api/webapi/5d/GetNoaverageEmerdList",
                data: {
                    gameJoin: $('html').attr('data-dpr'),
                    pageno: "0",
                    pageto: "10",
                    authtoken:auth_token,
                },
                dataType: "json",
                success: function (response) {
                    let list_orders = response.data.gameslist;
                    $("#trend_number_result").text("1/" + response.page);
                    $("#chain_numbers").find(".li:eq(0)").click();
                }
            });
            $(`#all`).css("display","none");
            $(`#all`).css("display","none");
            $(`#general_nav`).css("display","none");
            $(`#tren_nav`).css("display","flex");
            $("#trend_list").css("display","block");
            $('.Loading').fadeOut(0);
        });     
        var pageno = 0;
          var limit = 10;
          var page = 1;
          $('#trend_next').click(function (e) {
            e.preventDefault();
            pageno += 10;
            let pageto = limit;
            $.ajax({
              type: "POST",
              url: "/api/webapi/5d/GetNoaverageEmerdList",
              data: {
                gameJoin: $('html').attr('data-dpr'),
                pageno: pageno,
                pageto: pageto,
                authtoken:auth_token,
              },
              dataType: "json",
              success: function (response) {
                if (response.status === false) {
                  pageno -= 10;
                  $("#trend_next").addClass("block-click");
                  $("#trend_next").removeClass("action");
                  $("#trend_nav .van-icon-arrow").css("color", "#7f7f7f");
                  alertMessJoin(response.msg);
                  return false;
                }
                $("#trend_previous").removeClass("block-click");
                $("trend_previous").addClass("action");
                $("#trend_nav .van-icon-arrow-left").css("color","#fff");
                page += 1;
                $("#trend_number_result").text(
                  page + "/" + response.page
                );
                let list_orders = response.data.gameslist;
                $(".time-box .info .number").text(response.period);
                showListOrder_t(list_orders, 2);
              },
            });
          });
          $('#trend_previous').click(function (e) {
            e.preventDefault();
            pageno -= 10;
            let pageto = limit;
            $("#trend_next").removeClass("block-click");
            $("#trend_next").addClass("action");
            $("#trend_nav .van-icon-arrow").css("color", "#fff");
            $.ajax({
              type: "POST",
              url: "/api/webapi/5d/GetNoaverageEmerdList",
              data: {
                gameJoin: $('html').attr('data-dpr'),
                pageno: pageno,
                pageto: pageto,
                authtoken:auth_token,
              },
              dataType: "json",
              success: function (response) {
                if (page - 1 <= 1) {
                    $("#trend_previous").removeClass("block-click");
                    $("trend_previous").addClass("action");
                    $("#trend_nav .van-icon-arrow-left").css("color","#7f7f7f");
                }
                if (response.status === false) {
                  pageno = 0;
                  $("#trend_previous").addClass("block-click");
                  $("#trend_previous").removeClass("action");
                  $("#trend_nav .van-icon-arrow-left").css("color", "#7f7f7f");
                  alertMessJoin(response.msg);
                  return false;
                }
                page -= 1;
                $("#trend_number_result").text(
                  page + "/" + response.page
                );
                let list_orders = response.data.gameslist;
                $(".time-box .info .number").text(response.period);
                showListOrder_t(list_orders, 2);
              },
            });
          });

          $('.Trend__C-nav .li').click(function (e) {
            e.preventDefault();
            var choose_var = $(this).text();
            $.ajax({
                type: "POST",
                url: "/api/webapi/5d/GetNoaverageEmerdList_Statistics",
                data: {
                    gameJoin: $('html').attr('data-dpr'),
                    pageno: "0",
                    pageto: "100",
                    language: "vi",
                    authtoken:auth_token,
                },
                dataType: "json",
                success: function(response1) {
                    $.ajax({
                        type: "POST",
                        url: "/api/webapi/5d/GetNoaverageEmerdList",
                        data: {
                            gameJoin: $('html').attr('data-dpr'),
                            pageno: "0",
                            pageto: "10",
                            authtoken:auth_token,
                        },
                        dataType: "json",
                        success: function (response) {
                            let sta_list_orders = response1.data.gameslist;
                            var actual_list = '';
                            var box = {}; // my object
                            var boxes =  []; 
                            if(choose_var == "A")
                                {
                                    sta_list_orders.forEach(function(e,index) {
                                        inside_array = e.result.split('');
                                        box = {
                                            amount: inside_array[0]
                                        }
                                        boxes.push(box);
                                    });
                                }
                                else if(choose_var == "B")
                                {
                                    sta_list_orders.forEach(function(e,index) {
                                        inside_array = e.result.split('');
                                        box = {
                                            amount: inside_array[1]
                                        }
                                        boxes.push(box);
                                    });
                                }
                                else if(choose_var == "C")
                                {
                                    sta_list_orders.forEach(function(e,index) {
                                        inside_array = e.result.split('');
                                        box = {
                                            amount: inside_array[2]
                                        }
                                        boxes.push(box);
                                    });
                                }
                                else if(choose_var == "D")
                                {
                                    sta_list_orders.forEach(function(e,index) {
                                        inside_array = e.result.split('');
                                        box = {
                                            amount: inside_array[3]
                                        }
                                        boxes.push(box);
                                    });
                                }
                                else if(choose_var == "E")
                                {
                                    sta_list_orders.forEach(function(e,index) {
                                        inside_array = e.result.split('');
                                        box = {
                                            amount: inside_array[4]
                                        }
                                        boxes.push(box);
                                    });
                                }
                            show_statistics(boxes,2);   
                            $("#chain_numbers").find('div').removeClass('active');
                            $("#chain_numbers").find('div:contains("'+choose_var+'")').addClass('active');
                            let list_orders = response.data.gameslist;
                            showListOrder_t(list_orders, 2);
                        }
                    });
                }
            });
			});
        function callListOrder() {
            $.ajax({
                type: "POST",
                url: "/api/webapi/5d/GetNoaverageEmerdList",
                data: {
                    gameJoin: $('html').attr('data-dpr'),
                    pageno: "0",
                    pageto: "10",
                    authtoken:auth_token,
                },
                dataType: "json",
                success: function (response) {
                    let list_orders = response.data.gameslist;
                    $("#period").text(response.period);
                    $("#number_result").text("1/" + response.page);
                    ShowListOrder(list_orders);
                    if (list_orders.length != 0) {
                        showResultNow(list_orders[0].result);
                    }
                    if (firstGame && firstGame.stage === list_orders[0].period) {
                        if(socket_call == "called"){
                        var modal = document.getElementById("myModal_5d");
                        modal.style.display = "block";
                        var myModalheader = document.getElementById("myModal_header");
                        var myModal_result = document.getElementById("myModal_result");
                        var lottery_result = document.getElementById("lottery_result");
                        var myModal_result_Period = document.getElementById("myModal_result_Period");
                        if (firstGame.get == 0) {
                            myModalheader.innerHTML = "Try Again";
                            myModal_result.innerHTML = "LOSS :" + firstGame.money;
                        } else {
                            myModalheader.innerHTML = "congratulations";
                            myModal_result.innerHTML = "WIN :" + firstGame.get;
                        }
                        myModal_result_Period.innerHTML = "Period :5D "+$('html').attr('data-dpr')+"min "  + firstGame.stage;
                        var count1=0;
                        var a_result1 = list_orders[0].result.toString().split("");
                        for (var i=a_result1.length; i--;) {
                          count1+= parseInt(a_result1[i]);
                          $("#lottery_results_box").find(".r_num:eq("+i+")").html(parseInt(a_result1[i]));
                        }
                        $("#sum_num").html(count1);
                    }
                    }
                    $('.Loading').fadeOut(0);
                },
            });
        }
        callListOrder();
        $('#GetNoaverageEmerdList').click(function (e) {
            e.preventDefault();
            pageno = 0;
            limit = 10;
            page = 1;
            $('.Loading').fadeIn(0);
            $('#GetMyEmerdList').removeClass('block-click');
            $('#GetMyEmerdList').find('.txt').removeClass('action');
            $('#GetMyTrends').removeClass('block-click');
            $('#GetMyTrends').find('.txt').removeClass('action');
            $(this).addClass('block-click');
            $(this).find('.txt').addClass('action');
            $("#all").fadeIn(0);
            $('#number_result').attr('data-select', 'all');
            $("#me").fadeOut(0);
            callListOrder();
            $("#previous").addClass("block-click");
            $("#previous").removeClass("action");
            $("#previous .van-icon-arrow").css("color", "#7f7f7f");
            $("#next").removeClass("block-click");
            $("#next").addClass("action");
            $("#next .van-icon-arrow").css("color", "#fff");
            $("#trend_list").css("display","none");
            $(`#general_nav`).css("display","flex");
            $(`#tren_nav`).css("display","none");
        });                
function callAjaxMeJoin() {
    $.ajax({
        type: "POST",
        url: "/api/webapi/5d/GetMyEmerdList",
        data: {
            gameJoin: $('html').attr('data-dpr'),
            pageno: "0",
            pageto: "10",
            authtoken:auth_token,
        },
        dataType: "json",
        success: function (response) {
            let data = response.data.gameslist;
            $("#number_result").text("1/" + response.page);
            var modal = document.getElementById("myModal_5d");
            modal.style.display = "none";
            // Set the value of firstGame to the first game in the gameslist
            firstGame = data[0];
            console.log(firstGame);
            GetMyEmerdList(data);
            $('.Loading').fadeOut(0);
        },
    });
}
function reload_money() {
    $.ajax({
        type: "POST",
        url: "/api/webapi/GetUserInfo",
        data: {
          authtoken:auth_token,
        },
        dataType: "json",
        success: function (response) {
          $(".Loading").fadeOut(0);
          if (response.status === false) {
          return false;
          }
          $(".num span").text(`₹ ${response.data.money_user}.00 `);
        }
      });
}
reload_money();

$('#reload_money').click( function (e) {
    e.preventDefault();
    $('.Loading').fadeIn(0);
    $(this).addClass('block-click action');
     reload_money();
    setTimeout(() => {
        $('#reload_money').removeClass('block-click action');
    }, 2500);
});

socket.on("data-server-5d", function (msg) {
    console.log(msg.chane);
    if (msg) {
        let checkData = $('html').attr('data-dpr');
        if (checkData == msg.game) {
            pageno = 0;
            limit = 10;
            page = 1;
            let notResult = msg.data[0];
            let Result = msg.data[1];
            socket_call = "called";
            let check = $('#number_result').attr('data-select');
            callAjaxMeJoin();
            if (check == 'all') {
                reload_money();
                callListOrder();
                animationNewPar(Result.result);
            } else {
                reload_money();
                showMeJoin();
                animationNewPar(Result.result);
            }
            $('#period').text(notResult.period);
            $("#previous").addClass("block-click");
            $("#previous").removeClass("action");
            $("#previous .van-icon-arrow").css("color", "#7f7f7f");
            $("#next").removeClass("block-click");
            $("#next").addClass("action");
            $("#next .van-icon-arrow").css("color", "#fff");
        }
    }
    });

          $(".Loading").fadeOut(0);
        }
    },});
        });
      }
      catch (err) {
        alert(err);
      }
    }

  auth();

});