  
    
  window.onload = function() {
    function cownDownTimer() {
      var countDownDate = new Date("2030-07-16T23:59:59.9999999+01:00").getTime();
      setInterval(function() {
        var now = new Date().getTime();
        var distance = countDownDate - now;
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var minute = Math.ceil(minutes % 5);
        var seconds1 = Math.floor((distance % (1000 * 60)) / 10000);
        var seconds2 = Math.floor(((distance % (1000 * 60)) / 1000) % 10);
        // $(".number .item:eq(0)").text(seconds1);
        $(".number .item:eq(1)").text(minute);

        $(".number .item:eq(3)").text(seconds1);
        $(".number .item:eq(4)").text(seconds2);
      }, 100);
      setInterval(() => {
        var now = new Date().getTime();
        var distance = countDownDate - now;
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var minute = Math.ceil(minutes % 5);
        var seconds1 = Math.floor((distance % (1000 * 60)) / 10000);
        var seconds2 = Math.floor(((distance % (1000 * 60)) / 1000) % 10);
        if (minute == 0 && seconds1 == 0 && seconds2 <= 5) {
          if (clicked) {
            playAudio1();
          }
        }
        if (minute == 0 && seconds1 == 5 && seconds2 == 9) {
          if (clicked) {
            playAudio2();
          }
        }
      }, 1000);
      setInterval(function() {
        var now = new Date().getTime();
        var distance = countDownDate - now;
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var minute = Math.ceil(minutes % 5);
        var seconds1 = Math.floor((distance % (1000 * 60)) / 10000);
        var seconds2 = Math.floor(((distance % (1000 * 60)) / 1000) % 10);
        if (minute == 0 && seconds1 == 0 && seconds2 <= 5) {
          $(".van-overlay").fadeOut();
          $(".popup-join").css("transform", "translateY(600px)");
          $(".betting-mark .amount-box .li, .multiple-box .li").css({
            "background-color": "rgb(240, 240, 240)",
            color: "rgb(0, 0, 0)",
          });
          $(".betting-mark .amount-box .li:eq(0), .multiple-box .li:eq(0)").css({
            "background-color": "rgb(240, 240, 240)",
            color: "rgb(255, 255, 255)",
          });
          $(".stepper-box .digit-box input").val(1);
          $(".amount-box").attr("data-money", "1");
          $(".foot .right span:eq(1)").text(1000 + "");
  
          $(".box .mark-box ").css("display", "flex");
          $(".box .mark-box .item:eq(0)").text(seconds1);
          $(".box .mark-box .item:eq(1)").text(seconds2);
        } else {
          $(".box .mark-box ").css("display", "none");
        }
      }, 0);

      $('.container1').click();
    }
  
    cownDownTimer();
    setTimeout(() => {
      let check = true;
      $("#history-order .item").click(function(e) {
        e.preventDefault();
        let parent = $(this).parent();
        // let show = parent.children();
        let myVar = parent.find(".details");
        if (check) {
          check = false;
          myVar.fadeIn(0);
        } else {
          check = true;
          myVar.fadeOut(0);
        }
      });
    }, 1000);
  };

  $('.van-notice-bar__wrap .van-notice-bar__content').css({
    'transition-duration': '48.9715s',
    'transform': 'translateX(-2448.57px)',
  });
  setInterval(() => {
    $('.van-notice-bar__wrap .van-notice-bar__content').css({
      'transition-duration': '0s',
      'transform': 'translateX(0)',
    });
    setTimeout(() => {
      $('.van-notice-bar__wrap .van-notice-bar__content').css({
      'transition-duration': '48.9715s',
        'transform': 'translateX(-2448.57px)',
      });
    }, 100);
  }, 48000);
  
  $('.van-button--default').click(function (e) { 
    e.preventDefault();
    $('.van-popup-vf, .van-overlay').fadeOut(100);
  });
  
  $('.circular').click(function (e) { 
    e.preventDefault();
    $('.van-popup-vf, .van-overlay').fadeIn(100);
  });

  let selectPageTime = Number($('html').attr("data-dpr"));
  console.log(selectPageTime - 1);
  $(`.game-betting .box .item:eq(${selectPageTime - 1})`).addClass('action');
  $(`.game-betting .box .item:eq(${selectPageTime - 1}) .img`).addClass('block-click');
  $(`.game-betting .box .item .img .van-image img`).attr('src', '/images/icon_clock-gerrn.svg');
  $(`.game-betting .box .item:eq(${selectPageTime - 1}) .img .van-image img`).attr('src', '/images/icon_clock-red.svg');

  function tdOnclick(e) {
    if($(e).find('input[type=checkbox]').is(':checked') == false)
    {
     $(e).find('input[type=checkbox]').prop('checked', true);
     $(e).find('.checkmark1').html('&#10004;');
     $('#wd_submit').removeClass('windisablesub-button');
     $('#wd_submit').removeClass('confirm');
     $('#win_submit').removeClass('winspan_db');
    }
    else{
     $(e).find('input[type=checkbox]').prop('checked', false);
     $(e).find('.checkmark1').html('');
     $('#wd_submit').addClass('windisablesub-button');
     $('#wd_submit').addClass('confirm');
     $('#win_submit').addClass('winspan_db');
    }
  }
  function showListOrder3(list_orders, x) {
    if (list_orders.length == 0) {
      return $(`.game-list .con-box:eq(${x}) .hb`).html(
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
      return (htmls += `
                      <div data-v-a9660e98="" class="c-tc item van-row">
                          <div data-v-a9660e98="" class="van-col van-col--8">
                              <div data-v-a9660e98="" class="c-tc goItem">${
                                list_orders.period
                              }</div>
                          </div>
                          <div data-v-a9660e98="" class="van-col van-col--5">
                              <div data-v-a9660e98="" class="c-tc goItem">
                                  <!---->
                                  <span data-v-a9660e98="" class="${
                                    list_orders.amount % 2 == 0 ? "red" : "green"
                                  }"> ${list_orders.amount} </span>
                              </div>
                          </div>
                          <div data-v-a9660e98="" class="van-col van-col--5">
                              <div data-v-a9660e98="" class="c-tc goItem">
                                  <span data-v-a9660e98=""> ${
                                    list_orders.amount < 5 ? "Small" : "Big"
                                  } </span>
                                  <!---->
                              </div>
                          </div>
                          <div data-v-a9660e98="" class="van-col van-col--6">
                              <div data-v-a9660e98="" class="goItem c-row c-tc c-row-center">
                                  <div data-v-a9660e98="" class="c-tc c-row box c-row-center">
                                      <span data-v-a9660e98="" class="li ${
                                        list_orders.amount % 2 == 0
                                          ? "red"
                                          : "green"
                                      }"></span>
                                      ${
                                        list_orders.amount == 0 ||
                                        list_orders.amount == 5
                                          ? '<span data-v-a9660e98="" class="li violet"></span>'
                                          : ""
                                      }
                                  </div>
                              </div>
                          </div>
                      </div>
                      `);
    });
    $(`.game-list .con-box:eq(${x}) .hb`).prepend(htmls);
    $(`.game-list .con-box:eq(${x}) .hb .c-tc`).last().remove();
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
  $(".foot .left").click(function (e) {
    e.preventDefault();
    //$(".van-overlay").fadeOut();
    $('.van-popup-vf').fadeOut(100);
    $(".popup-join").css("transform", "translateY(600px)");
    $(".betting-mark .amount-box .li, .multiple-box .li").css({
      "background-color": "rgb(240, 240, 240)",
      color: "rgb(0, 0, 0)",
    });
    $(".betting-mark .amount-box .li:eq(0), .multiple-box .li:eq(0)").css({
      "background-color": "rgb(240, 240, 240)",
      color: "rgb(255, 255, 255)",
    });
    $(".stepper-box .digit-box input").val(1);
    $(".amount-box").attr("data-money", "1");
    $(".foot .right span:eq(1)").text(1000 + "");
  });
  
  $('.van-overlay').click(function (e) {
    e.preventDefault();
    $(".van-overlay, .pop-qt, .pop-quytac-buy, .popup-qt").fadeOut(300);
  });
  
  function xlad(x, color) {
    $(".multiple-box .li").css({
      "background-color": "rgb(240, 240, 240)",
      color: "rgb(0, 0, 0)",
    });
    $(`.multiple-box .li:eq(${x})`).css({
      "background-color": `${color}`,
      color: "rgb(255, 255, 255)",
    });
  }
  
  function selectX(x, color) {
    switch (String(x)) {
      case "1":
        xlad(0, color);
        break;
      case "5":
        xlad(1, color);
        break;
      case "10":
        xlad(2, color);
        break;
      case "20":
        xlad(3, color);
        break;
      case "50":
        xlad(4, color);
        break;
      case "100":
        xlad(5, color);
        break;
      default:
        $(".multiple-box .li").css({
          "background-color": "rgb(240, 240, 240)",
          color: "rgb(0, 0, 0)",
        });
        break;
    }
  }
  
  $(".stepper-box .plus").click(function (e) {
    e.preventDefault();
    let color = $(".foot .right").attr("style").split(":");
    color = color[1].split(";")[0].trim();
    let value = $(".stepper-box .digit-box input").val().trim();
    value = Number(value) + 1;
    selectX(value, color);
    if (value > 1) {
      $(".stepper-box .minus").css({
        "background-color": `${color}`,
        color: "#fff",
      });
    } else {
      $(".stepper-box .minus").css({
        "background-color": "rgb(240, 240, 240)",
        color: "rgb(200, 201, 204)",
      });
    }
    $(".stepper-box .digit-box input").val(value);
    totalMoney();
  });
  
  $(".stepper-box .digit-box input").on("input", function () {
    let value = $(this).val();
    let color = $(".foot .right").attr("style").split(":");
    color = color[1].split(";")[0].trim();
    // if (!value)  $(this).val(1);
    value = $(this).val();
    if (value <= 1) {
      $(".stepper-box .minus").css({
        "background-color": "rgb(240, 240, 240)",
        color: "rgb(200, 201, 204)",
      });
    } else if (value) {
      $(".stepper-box .minus").css({
        "background-color": `${color}`,
        color: "rgb(200, 201, 204)",
      });
    }
    selectX(value, color);
    totalMoney();
  });
  
  $(".stepper-box .minus").click(function (e) {
    e.preventDefault();
    let color = $(".foot .right").attr("style").split(":");
    color = color[1].split(";")[0].trim();
    let value = $(".stepper-box .digit-box input").val().trim();
    value = Number(value) - 1;
    if (value <= 0) return;
    selectX(value, color);
    if (value == 1) {
      $(".stepper-box .minus").css({
        "background-color": "rgb(240, 240, 240)",
        color: "rgb(200, 201, 204)",
      });
    }
    $(".stepper-box .digit-box input").val(value);
    totalMoney();
  });
  
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  
  function selectCss(color, bg, text) {
    $(".betting-mark").attr("class", "betting-mark");
    $(".color").css("color", bg);
    $(".color .p-l-10").text(text);
    $(".betting-mark").addClass(color);
    $(".amount-box .li:eq(0)").css("background-color", bg);
    $(".plus").css("background-color", bg);
    $(".multiple-box .li:eq(0)").css("background-color", bg);
    $(".foot .right").css("background-color", bg);
  }
  
  function totalMoney() {
    let value = $(".stepper-box .digit-box input").val().trim();
    let money = $(".amount-box").attr("data-money");
    let total = value * money;
    $(".foot .right span:eq(1)").text(total + "");
  }
  
  function alertBox(join, addText) {
    $(".foot .right").attr("data-join", join);
    switch (join) {
      case "x":
        selectCss("colorgreen", "rgb(92, 186, 71)", addText);
        break;
      case "t":
        selectCss("colorviolet", "rgb(152, 49, 233)", addText);
        break;
      case "d":
        selectCss("colorred", "rgb(251, 78, 78)", addText);
        break;
      case "l":
        selectCss("colorbig", "rgb(255, 168, 46)", addText);
        break;
      case "n":
        selectCss("colorsmall", "rgb(109, 167, 244)", addText);
        break;
      default:
        if (join % 2 == 0) {
          selectCss(`color${join}`, "rgb(251, 78, 78)", addText);
        } else {
          selectCss(`color${join}`, "rgb(92, 186, 71)", addText);
        }
        break;
    }
    $(".van-overlay").fadeIn();
    $(".popup-join").fadeIn();
    $(".stepper-box .minus").css({
      "background-color": "rgb(240, 240, 240)",
      color: "rgb(200, 201, 204)",
    });
    $(".popup-join").css("transform", "translateY(1px)");
    let active = $(".random-box .c-row .active").attr("data-x");
    let color = $(".foot .right").attr("style").split(":");
    color = color[1].split(";")[0].trim();
    $(".stepper-box input").val(active);
    totalMoney();
    selectX(active, color);
    if (active <= 1) {
      $(".stepper-box .minus").css({
        "background-color": "rgb(240, 240, 240)",
        color: "rgb(200, 201, 204)",
      });
    } else {
      $(".stepper-box .minus").css({
        "background-color": `${color}`,
        color: "rgb(255, 255, 255)",
      });
    }
  }
  
  $(".popup-join .info .txt").click(function (e) {
    e.preventDefault();
    $(".popup-qt").fadeIn();
  });
  
  $(".betting-mark .amount-box .li").click(function (e) {
    e.preventDefault();
    let color = $(".foot .right").attr("style").split(":");
    color = color[1].split(";")[0].trim();
    $(".betting-mark .amount-box .li").css({
      "background-color": "rgb(240, 240, 240)",
      color: "rgb(0, 0, 0)",
    });
  
    $(this).css({
      "background-color": `${color}`,
      color: "rgb(255, 255, 255)",
    });
    let thisValue = $(this).attr("data-x");
    $(".amount-box").attr("data-money", thisValue);
    totalMoney();
  });
  $(".multiple-box .li").click(function (e) {
    e.preventDefault();
    let color = $(".foot .right").attr("style").split(":");
    color = color[1].split(";")[0].trim();
    $(".multiple-box .li").css({
      "background-color": "rgb(240, 240, 240)",
      color: "rgb(0, 0, 0)",
    });
    $(this).css({
      "background-color": `${color}`,
      color: "rgb(255, 255, 255)",
    });
    let x = $(this).attr("data-x");
    if (x > 1) {
      $(".stepper-box .minus").css({
        "background-color": `${color}`,
        color: "#fff",
      });
    } else {
      $(".stepper-box .minus").css({
        "background-color": "rgb(240, 240, 240)",
        color: "rgb(200, 201, 204)",
      });
    }
    $(".stepper-box .digit-box input").val(x);
    totalMoney();
  });
  
  $(".popup-qt .van-button").click(function (e) {
    e.preventDefault();
    $(".popup-qt").fadeOut();
  });
  
  $(".con-box button").click(function (e) {
    e.preventDefault();
    let addTop = $(this).attr("data-join"); // Green - do - tim (x - d - t)
    let addText = $(this).text(); // Green - do - tim
    alertBox(addTop, addText);
  });
  $(".number-box button").click(function (e) {
    e.preventDefault();
    let addTop = $(this).text().trim(); // Green - do - tim (x - d - t)
    let addText = $(this).text();
    $('.container1').click();
     // Green - do - tim
    alertBox(addTop, addText);
  });
  $(".btn-box button").click(function (e) {
    e.preventDefault();
    let addTop = $(this).attr("data-join"); // Green - do - tim (x - d - t)
    let addText = $(this).text(); // Green - do - tim
    alertBox(addTop, addText);
  });
  
  $(".random-box .c-row .item").click(function (e) {
    e.preventDefault();
    $(".random-box .c-row .item").css({
      "background-color": "rgb(240, 240, 240)",
      color: "rgb(0, 0, 0)",
    });
  
    $(this).css({
      "background-color": "rgb(92, 186, 71)",
      color: "rgb(255, 255, 255)",
    });
    $(".random-box .c-row .item").removeClass("active");
    $(this).addClass("active");
  });
  
  $(".random").click(async function (e) {
    e.preventDefault();
    let random = 0;
    for (let i = 0; i < 55; i++) {
      random = Math.floor(Math.random() * 10);
      $(".number-box button").removeClass("action");
      $(`.number-box button:eq(${random})`).addClass("action");
      await sleep(50);
    }
    $(".van-overlay").fadeIn();
    $(".popup-join").fadeIn();
    $(".popup-join").css("transform", "translateY(1px)");
    alertBox(random, random);
  });

  function alertMessJoin(msg) {
    $("body").append(
      `
                  <div data-v-1dcba851="" class="msg">
                      <div data-v-1dcba851="" class="msg-content v-enter-active v-enter-to" style=""> ${msg} </div>
                  </div>
                  `
    );
    setTimeout(() => {
      $(".msg .msg-content").removeClass("v-enter-active v-enter-to");
      $(".msg .msg-content").addClass("v-leave-active v-leave-to");
      setTimeout(() => {
        $("body .msg").remove();
      }, 500);
    }, 1000);
  }

  function showListOrder(list_orders, x) {
    if (list_orders.length == 0) {
      return $(`.game-list .con-box:eq(${x}) .hb`).html(
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
      return (htmls += `
                      <div data-v-a9660e98="" class="c-tc item van-row">
                          <div data-v-a9660e98="" class="van-col van-col--8">
                              <div data-v-a9660e98="" class="c-tc goItem">${
                                list_orders.period
                              }</div>
                          </div>
                          <div data-v-a9660e98="" class="van-col van-col--5">
                              <div data-v-a9660e98="" class="c-tc goItem">
                                  <!---->
                                  <span data-v-a9660e98="" class="${
                                    list_orders.amount % 2 == 0 ? "red" : "green"
                                  }"> ${list_orders.amount} </span>
                              </div>
                          </div>
                          <div data-v-a9660e98="" class="van-col van-col--5">
                              <div data-v-a9660e98="" class="c-tc goItem">
                                  <span data-v-a9660e98=""> ${
                                    list_orders.amount < 5 ? "Small" : "Big"
                                  } </span>
                                  <!---->
                              </div>
                          </div>
                          <div data-v-a9660e98="" class="van-col van-col--6">
                              <div data-v-a9660e98="" class="goItem c-row c-tc c-row-center">
                                  <div data-v-a9660e98="" class="c-tc c-row box c-row-center">
                                      <span data-v-a9660e98="" class="li ${
                                        list_orders.amount % 2 == 0
                                          ? "red"
                                          : "green"
                                      }"></span>
                                      ${
                                        list_orders.amount == 0 ||
                                        list_orders.amount == 5
                                          ? '<span data-v-a9660e98="" class="li violet"></span>'
                                          : ""
                                      }
                                  </div>
                              </div>
                          </div>
                      </div>
                      `);
    });
    $(`.game-list .con-box:eq(${x}) .hb`).html(htmls);
  }
  function show_statistics(list_orders, x) {
    if (list_orders.length != 0) {
      const counts = {};
      const csq_counts = {};
      const miss_counts = {};
      for (const num of list_orders) {
        counts[num.amount] = counts[num.amount] ? counts[num.amount] + 1 : 1;
      }
      var fq0= counts[0]; var fq1= counts[1]; var fq2= counts[2]; var fq3= counts[3]; var fq4= counts[4]; var fq5= counts[5];var fq6= counts[6];var fq7= counts[7];var fq8= counts[8];var fq9= counts[9];
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
        var ams0= sumCount[0]; var ams1= sumCount[1]; var ams2= sumCount[2]; var ams3= sumCount[3]; var ams4= sumCount[4]; var ams5= sumCount[5];var ams6= sumCount[6];var ams7= sumCount[7];var ams8= sumCount[8];var ams9= sumCount[9];
      var csq0= csq_counts[0]; var csq1= csq_counts[1]; var csq2= csq_counts[2]; var csq3= csq_counts[3]; var csq4= csq_counts[4]; var csq5= csq_counts[5];var csq6= csq_counts[6];var csq7= csq_counts[7];var csq8= csq_counts[8];var csq9= csq_counts[9];
      for(var j= 0; j< 10; j++)
      { 
        let index = list_orders.findIndex(obj => obj.amount === j);
        miss_counts[j] = index;
      }
      var ms0= miss_counts[0]; var ms1= miss_counts[1]; var ms2= miss_counts[2]; var ms3= miss_counts[3]; var ms4= miss_counts[4]; var ms5= miss_counts[5];var ms6= miss_counts[6];var ms7= miss_counts[7];var ms8= miss_counts[8];var ms9= miss_counts[9];
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
              $(".td_m").html(MISSING);
              $(".td_am").html(AVG_MISSING);
              $(".td_frq").html(FREQUENCY);
              $(".td_csq").html(MAX_CONSECUTIVE);
    };
  };
  


  function showListOrder_t(list_orders, x) {
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
    var updated = false;
    $(list_orders).each(function (index, el) {
      $(".Trend__C-body2").find('[rowid='+(index)+']').find('.Trend__C-body2-IssueNumber').text(el.period);
      $(".Trend__C-body2").find('[rowid='+(index)+']').find('.Trend__C-body2-Num').find(".Trend__C-body2-Num-item").removeClass("action");
      $(".Trend__C-body2").find('[rowid='+(index)+']').find('.Trend__C-body2-Num').find(".Trend__C-body2-Num-item").css('background', '');
      $(".Trend__C-body2").find('[rowid='+(index)+']').find('.Trend__C-body2-Num').find(".Trend__C-body2-Num-item:contains('"+(parseInt(el.amount))+"')").addClass("action");
      if(parseInt(el.amount) > 4)
      {
        $(".Trend__C-body2").find('[rowid='+(index)+']').find('.Trend__C-body2-Num').find(".Trend__C-body2-Num-BS").text('B');
        $(".Trend__C-body2").find('[rowid='+(index)+']').find('.Trend__C-body2-Num').find(".Trend__C-body2-Num-BS").css('background', '#FEAA57');
      }
      else{
        $(".Trend__C-body2").find('[rowid='+(index)+']').find('.Trend__C-body2-Num').find(".Trend__C-body2-Num-BS").text('S');
        $(".Trend__C-body2").find('[rowid='+(index)+']').find('.Trend__C-body2-Num').find(".Trend__C-body2-Num-BS").css('background', '#6EA8F4');
      }
      if(parseInt(el.amount) == 0 || parseInt(el.amount) == 5)
      {
        $(".Trend__C-body2").find('[rowid='+(index)+']').find('.Trend__C-body2-Num').find(".Trend__C-body2-Num-item:contains('"+(parseInt(el.amount))+"')").css('background', '#db5fd1');
      }
      else if(parseInt(el.amount) % 2 === 0)
      {
        $(".Trend__C-body2").find('[rowid='+(index)+']').find('.Trend__C-body2-Num').find(".Trend__C-body2-Num-item:contains('"+(parseInt(el.amount))+"')").css('background', '#fb4e4e');
      }
      else 
      {
        $(".Trend__C-body2").find('[rowid='+(index)+']').find('.Trend__C-body2-Num').find(".Trend__C-body2-Num-item:contains('"+(parseInt(el.amount))+"')").css('background', '#5cba47');
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
  const isNumber = (params) => {
    let pattern = /^[0-9]*\d$/;
    return pattern.test(params);
  };
  
  function showListOrder2(list_orders, x) {
    if (list_orders.length == 0) {
      return $(`.game-list .con-box:eq(${x}) #history-order`).html(
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
    let i = -1;
    let result = list_orders.map((list_orders) => {
      i++;
      let join = list_orders.bet;
      let color = "";
      let selected = "";
      if (join == "l") {
        color = "big";
        selected = "Big";
      } else if (join == "n") {
        color = "small";
        selected = "Small";
      } else if (join == "t") {
        selected = "Violet";
        color = "violet";
      } else if (join == "d") {
        color = "red";
        selected = "Red";
      } else if (join == "x") {
        color = "green";
        selected = "Green";
      } else if (join == "0") {
        color = "red-violet";
        selected = "0";
      } else if (join == "5") {
        color = "green-violet";
        selected = "5";
      } else if (Number(join) % 2 == 0) {
        color = "red";
        selected = Number(join);
      } else if (Number(join) % 2 != 0) {
        color = "green";
        selected = Number(join);
      }
      if ((!isNumber(join) && join == "l") || join == "n") {
        checkJoin = `
                      <div data-v-a9660e98="" class="van-image" style="width: 30px; height: 30px;">
                          <img src="/images/${
                            join == "n" ? "small" : "big"
                          }.png" class="van-image__img">
                      </div>
                      `;
      } else {
        checkJoin = `
                      <span data-v-a9660e98="">${
                        isNumber(join) ? join : ""
                      }</span>
                      `;
      }
  
      return (htmls += `
                      <div data-v-a9660e98="" issuenumber="${
                        list_orders.stage
                      }" addtime="${timerJoin(
        list_orders.time
      )}" colour="red" number="6" rowid="${i}" class="hb">
                          <div data-v-a9660e98="" class="item c-row">
                              <div data-v-a9660e98="" class="result">
                                  <div data-v-a9660e98="" class="select select-${color}">
                                      ${checkJoin}    
                                  </div>
                              </div>
                              <div data-v-a9660e98="" class="c-row c-row-between info">
                                  <div data-v-a9660e98="">
                                      <div data-v-a9660e98="" class="issueName">
                                          ${list_orders.stage} 
                                          ${
                                            list_orders.status == 1
                                              ? '<span data-v-a9660e98="" class="state green">Success</span>'
                                              : list_orders.status == 2
                                              ? '<span data-v-a9660e98="" class="state red">Fail</span>'
                                              : ""
                                          }
                                      </div>
                                      <div data-v-a9660e98="" class="tiem">${timerJoin(
                                        list_orders.time
                                      )}</div>
                                  </div>
                                  <div data-v-a9660e98="" class="money">
                                          ${
                                            list_orders.status==1 && list_orders.bet ==0 
                                              ? '<span data-v-a9660e98="" class="success"> + ' +
                                                list_orders.money * 4.5 +
                                                " </span>"
                                              :list_orders.status==1 && list_orders.bet ==5
                                              ? '<span data-v-a9660e98="" class="success"> + ' +
                                              list_orders.money * 4.5 +
                                              " </span>"
                                              : list_orders.status==1 && list_orders.result == 0 && list_orders.bet == 'd'
                                              ? '<span data-v-a9660e98="" class="success"> + ' +
                                              list_orders.money * 1.5 +
                                              " </span>"
                                              : list_orders.status==1 && list_orders.bet == 'd'
                                              ? '<span data-v-a9660e98="" class="success"> + ' +
                                              list_orders.money * 2 +
                                              " </span>"
                                              : list_orders.status==1 && list_orders.bet == 't'
                                              ? '<span data-v-a9660e98="" class="success"> + ' +
                                              list_orders.money * 4.5 +
                                              " </span>"
                                              : list_orders.status==1 && list_orders.result == 5 && list_orders.bet == 'x'
                                              ? '<span data-v-a9660e98="" class="success"> + ' +
                                              list_orders.money * 1.5 +
                                              " </span>"
                                              : list_orders.status==1 && list_orders.bet == 'x'
                                              ? '<span data-v-a9660e98="" class="success"> + ' +
                                              list_orders.money * 2 +
                                              " </span>"
                                              : list_orders.status==1 && list_orders.bet == 'l'
                                              ? '<span data-v-a9660e98="" class="success"> + ' +
                                              list_orders.money * 2 +
                                              " </span>"
                                              : list_orders.status==1 && list_orders.bet == 'n'
                                              ? '<span data-v-a9660e98="" class="success"> + ' +
                                              list_orders.money * 2 +
                                              " </span>"
                                              : list_orders.status==1
                                              ?'<span data-v-a9660e98="" class="success"> + ' +
                                              list_orders.money * 9 +
                                              " </span>"
                                              : list_orders.status == 2
                                              ? '<span data-v-a9660e98="" class="fail"> - ' +
                                                list_orders.money +
                                                "</span>"
                                              : ""
                                          }
                                  </div>
                              </div>
                          </div>
  
                          <div data-v-a9660e98="" class="details" style="display: none" >
                              <div data-v-a9660e98="" class="tit">Details</div>
                              <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle">
                                  <div data-v-a9660e98="">Order ID</div>
                                  <div data-v-a9660e98="" data-clipboard-text="${
                                    list_orders.id_product
                                  }" class="tag-read c-row c-row-between c-row-middle">
                                      ${list_orders.id_product}
                                      <img data-v-a9660e98="" width="18px" height="15px" src="/images/copy.png" class="m-l-5">
                                  </div>
                                  </div>
                                  <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle">
                                      <div data-v-a9660e98="">Periods</div>
                                          <div data-v-a9660e98="">${
                                            list_orders.stage
                                          }</div>
                                      </div>
                                      <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle">
                                          <div data-v-a9660e98="">Amount Spent</div>
                                          <div data-v-a9660e98="">${
                                            list_orders.money + list_orders.fee
                                          }.00</div>
                                      </div>
                                      <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle">
                                          <div data-v-a9660e98="">Quantity</div>
                                          <div data-v-a9660e98="">${
                                            list_orders.amount
                                          }</div>
                                      </div>
                                      <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle">
                                          <div data-v-a9660e98="">Net Amount</div>
                                          <div data-v-a9660e98="" class="red">${
                                            list_orders.money
                                          }.00</div>
                                      </div>
                                      <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle">
                                          <div data-v-a9660e98="">Tax</div>
                                          <div data-v-a9660e98="">${
                                            list_orders.fee
                                          }.00</div>
                                      </div>
                                      <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle">
                                          <div data-v-a9660e98="">Opening Price</div>
                                          <div data-v-a9660e98="">${
                                            list_orders.result
                                          }</div>
                                      </div>
                                      <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle">
                                          <div data-v-a9660e98="">Result</div>
                                      <div data-v-a9660e98="">
                                          <div data-v-a9660e98="" style="display: inline-block; margin-left: 8px;">${
                                            list_orders.result
                                          }</div>
                                          <div data-v-a9660e98="" style="display: inline-block; margin-left: 8px;">${
                                            list_orders.result == 0
                                              ? "Purple"
                                              : list_orders.result == 5
                                              ? "Indigo"
                                              : list_orders.result % 2 == 0
                                              ? "Red"
                                              : "Green"
                                          }</div>
                                          <div data-v-a9660e98="" style="display: inline-block; margin-left: 8px;">${
                                            list_orders.amount < 5 ? "Small" : "Big"
                                          }</div>
                                      </div>
                                  </div>
                                  <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle ">
                                      <div data-v-a9660e98="">Select</div>
                                      <div data-v-a9660e98="">
                                          <div data-v-a9660e98="">${selected}</div>
                                      </div>
                                  </div>
                                  <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle">
                                      <div data-v-a9660e98="">Status</div>
                                      <div data-v-a9660e98="" class="${
                                        list_orders.status == 1
                                          ? "green"
                                          : list_orders.status == 2
                                          ? "red"
                                          : ""
                                      }">${
        list_orders.status == 1
          ? "Success"
          : list_orders.status == 2
          ? "Failure"
          : ""
      }</div>
                                  </div>
                                  <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle">
                                      <div data-v-a9660e98="">Win Or Loss</div>
                                      <div data-v-a9660e98="" class="${
                                        list_orders.status == 1
                                          ? "green"
                                          : list_orders.status == 2
                                          ? "red"
                                          : ""
                                      }"> ${
        list_orders.status == 1 ? "+" : list_orders.status == 2 ? "-" : ""
      } ${
        list_orders.status == 0
          ? ""
          :list_orders.status ==1 && list_orders.bet == 0
          ? list_orders.money * 4.5
          :list_orders.status ==1 && list_orders.bet ==5
          ? list_orders.money * 1.5
          : list_orders.status == 1 && list_orders.bet == 't'
          ? list_orders.money * 4.5
          :list_orders.status == 1 && list_orders.result ==0 && list_orders.bet == 'd'
          ? list_orders.money * 1.5
          :list_orders.status == 1 && list_orders.bet == 'd'
          ? list_orders.money * 2
          :list_orders.status == 1 && list_orders.bet == 'x'
          ? list_orders.money * 2
          :list_orders.status == 1 && list_orders.result ==5 && list_orders.bet == 'x'
          ? list_orders.money * 1.5
          :list_orders.status == 1 && list_orders.bet == 'l'
          ? list_orders.money * 2
          :list_orders.status == 1 && list_orders.bet == 'n'
          ? list_orders.money * 2
          : list_orders.status == 1
          ? list_orders.money * 9
          : list_orders.money
      }
      </div>
                                  </div>
                                  <div data-v-a9660e98="" class="li c-row c-row-between c-row-middle">
                                      <div data-v-a9660e98="">Time</div>
                                      <div data-v-a9660e98="">${timerJoin(
                                        list_orders.time
                                      )}</div>
                                  </div>
                              </div>
                      </div>
                      `);
    });
    $(`.game-list .con-box:eq(${x}) .list #history-order`).html(htmls);
    
  }

  function formateT(params) {
    let result = params < 10 ? "0" + params : params;
    return result;
  }
  
function timerJoin(params = '', addHours = 0) {
  let date = "";
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
  return (
    years +
    "-" +
    months +
    "-" +
    days +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds +
    ":" +
    ampm
  );
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
          $(".reload_money").click(function (e) {
            e.preventDefault();
            $(this).addClass("action block-click");
            setTimeout(() => {
              $(this).removeClass("action block-click");
            }, 3000);
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
          }); 
          $(".game-list .tab .li:eq(0)").click(function (e) {
            e.preventDefault();
            $(".game-list .con-box").css("display", "none");
            $(".game-list .li .txt").removeClass("action");
            $(".game-list .li .txt:eq(0)").addClass("action");
            $(".game-list .li").removeClass("block-click");
            $(this).addClass("block-click");
            $(".game-list .con-box:eq(0)").css("display", "block");
            $.ajax({
              type: "POST",
              url: "/api/webapi/GetNoaverageEmerdList",
              data: {
                typeid: "5",
                pageno: "0",
                pageto: "10",
                language: "vi",
                authtoken:auth_token,
              },
              dataType: "json",
              success: function (response) {
                let list_orders = response.data.gameslist;
                $(".time-box .info .number").text(response.period);
                $(".page-nav .number").text("1/" + response.page);
                $(".game-list .con-box:eq(0) .page-nav .number").text(
                  "1/" + response.page
                );
                showListOrder(list_orders, 0);
              },
            });
          });
          $(".game-list .tab .li:eq(1)").click(function (e) {
            e.preventDefault();
            $(".game-list .con-box").css("display", "none");
            $(".game-list .li .txt").removeClass("action");
            $(".game-list .li .txt:eq(1)").addClass("action");
            $(".game-list .li").removeClass("block-click");
            $(this).addClass("block-click");
            $(".game-list .con-box:eq(1)").css("display", "block");
            $.ajax({
              type: "POST",
              url: "/api/webapi/GetMyEmerdList",
              data: {
                typeid: "5",
                pageno: "0",
                pageto: "10",
                language: "vi",
                authtoken:auth_token,
              },
              dataType: "json",
              success: function (response) {
                let data = response.data.gameslist;
                $(".game-list .con-box:eq(1) .page-nav .number").text(
                  "1/" + `${(response.page) ? response.page : '1'}`
                );
                showListOrder2(data, 1);
              },
            });
            setTimeout(() => {
              let check = true;
              $("#history-order .item").click(function(e) {
                e.preventDefault();
                let parent = $(this).parent();
                // let show = parent.children();
                let myVar = parent.find(".details");
                if (check) {
                  check = false;
                  myVar.fadeIn(0);
                } else {
                  check = true;
                  myVar.fadeOut(0);
                }
              });
            }, 1000);
          });
          $(".game-list .tab .li:eq(2)").click(function (e) {
          e.preventDefault();
          $.ajax({
            type: "POST",
            url: "/api/webapi/GetNoaverageEmerdList_Statistics",
            data: {
                typeid: "5",
                pageno: "0",
                pageto: "100",
                language: "vi",
                authtoken:auth_token,
            },
            dataType: "json",
            success: function(response1) {
              let sta_list_orders = response1.data.gameslist;
              show_statistics(sta_list_orders,2);
          $(".game-list .con-box").css("display", "none");
          $(".game-list .li .txt").removeClass("action");
          $(".game-list .li .txt:eq(2)").addClass("action");
          $(".game-list .li").removeClass("block-click");
          $(this).addClass("block-click");
          $(".game-list .con-box:eq(2)").css("display", "block");
          $.ajax({
            type: "POST",
            url: "/api/webapi/GetNoaverageEmerdList",
            data: {
              typeid: "5",
              pageno: "0",
              pageto: "10",
              language: "vi",
              authtoken:auth_token,
            },
            dataType: "json",
            success: function (response) {
              let list_orders = response.data.gameslist;
              $(".time-box .info .number").text(response.period);
              $(".page-nav .number").text("1/" + response.page);
              $(".game-list .con-box:eq(2) .page-nav .number").text(
                "1/" + response.page
              );
              showListOrder_t(list_orders, 2);
              
            },
          });
        }
          });
        });
        $(".foot .right").click(function (e) {
          e.preventDefault();
          let join = $(this).attr("data-join");
          let x = $(".stepper-box input").val().trim();
          let money = $(".amount-box").attr("data-money");
          if (!join || !x || !money) {
            return;
          }
          $(this).addClass("block-click");
          $.ajax({
            type: "POST",
            url: "/api/webapi/action/join",
            data: {
              typeid: "5",
              join: join,
              x: x,
              money: money,
              authtoken:auth_token,
            },
            dataType: "json",
            success: function (response) {
              alertMessJoin(response.message);
              if (response.status === false) return;
              $("#history-order").prepend(response.data);
              $(".total-box .num span").text("₹ " + response.money + ".00");
              socket.emit('data-server_2', { money: x * money, join, time: Date.now(), change: response.change });
            },
          });
        
          setTimeout(() => {
            $(".van-overlay").fadeOut();
            $(".popup-join").css("transform", "translateY(600px)");
            $(".betting-mark .amount-box .li, .multiple-box .li").css({
              "background-color": "rgb(240, 240, 240)",
              color: "rgb(0, 0, 0)",
            });
            $(".betting-mark .amount-box .li:eq(0), .multiple-box .li:eq(0)").css({
              "background-color": "rgb(240, 240, 240)",
              color: "rgb(255, 255, 255)",
            });
            $(".stepper-box .digit-box input").val(1);
            $(".amount-box").attr("data-money", "1");
            $(".foot .right span:eq(1)").text(1000 + "");
            $(".foot .right").removeClass("block-click");
          }, 500);
        });
        
      
        $.ajax({
          type: "POST",
          url: "/api/webapi/GetNoaverageEmerdList",
          data: {
            typeid: "5",
            pageno: "0",
            pageto: "10",
            language: "vi",
            authtoken:auth_token,
          },
          dataType: "json",
          success: function (response) {
            let list_orders = response.data.gameslist;
            $(".time-box .info .number").text(response.period);
            $(".game-list .con-box:eq(0) .page-nav .number").text("1/" + response.page);
            showListOrder(list_orders, 0);
          },
        });
        
      
        
        $.ajax({
          type: "POST",
          url: "/api/webapi/GetMyEmerdList",
          data: {
            typeid: "5",
            pageno: "0",
            pageto: "10",
            language: "vi",
            authtoken:auth_token,
          },
          dataType: "json",
          success: function (response) {
            let data = response.data.gameslist;
            $(".game-list .con-box:eq(1) .page-nav .number").text("1/" + `${(response.page) ? response.page : '1'}`);
            showListOrder2(data, 1);
          },
        });
        
        var pageno = 0;
        var limit = 10;
        var page = 1;
        $(".game-list .con-box:eq(0) .page-nav .arr:eq(1)").click(function (e) {
          e.preventDefault();
          pageno += 10;
          let pageto = limit;
          $.ajax({
            type: "POST",
            url: "/api/webapi/GetNoaverageEmerdList",
            data: {
              typeid: "5",
              pageno: pageno,
              pageto: pageto,
              language: "vi",
              authtoken:auth_token,
            },
            dataType: "json",
            success: function (response) {
              if (response.status === false) {
                pageno -= 10;
                $(".game-list .con-box:eq(0) .page-nav .arr:eq(1)").addClass(
                  "block-click"
                );
                $(".game-list .con-box:eq(0) .page-nav .arr:eq(1)").removeClass(
                  "action"
                );
                $(".game-list .con-box:eq(0) .page-nav .van-icon-arrow-right").css(
                  "color",
                  "#7f7f7f"
                );
                alertMessJoin(response.msg);
                return false;
              }
              $(".game-list .con-box:eq(0) .page-nav .arr:eq(0)").removeClass(
                "block-click"
              );
              $(".game-list .con-box:eq(0) .page-nav .arr:eq(0)").addClass("action");
              $(".game-list .con-box:eq(0) .page-nav .van-icon-arrow-left").css(
                "color",
                "#fff"
              );
              page += 1;
              $(".game-list .con-box:eq(0) .page-nav .number").text(
                page + "/" + response.page
              );
              let list_orders = response.data.gameslist;
              $(".time-box .info .number").text(response.period);
              showListOrder(list_orders, 0);
            },
          });
        });
        $(".game-list .con-box:eq(0) .page-nav .arr:eq(0)").click(function (e) {
          e.preventDefault();
          $(".game-list .con-box:eq(0) .page-nav .arr:eq(1)").removeClass(
            "block-click"
          );
          $(".game-list .con-box:eq(0) .page-nav .arr:eq(1)").addClass("action");
          $(".game-list .con-box:eq(0) .page-nav .van-icon-arrow-right").css(
            "color",
            "#fff"
          );
          pageno -= 10;
          let pageto = limit;
          $.ajax({
            type: "POST",
            url: "/api/webapi/GetNoaverageEmerdList",
            data: {
              typeid: "5",
              pageno: pageno,
              pageto: pageto,
              language: "vi",
              authtoken:auth_token,
            },
            dataType: "json",
            success: function (response) {
              if (page - 1 <= 1) {
                $(".game-list .con-box:eq(0) .page-nav .arr:eq(0)").addClass(
                  "block-click"
                );
                $(".game-list .con-box:eq(0) .page-nav .arr:eq(0)").removeClass(
                  "action"
                );
                $(".game-list .con-box:eq(0) .page-nav .van-icon-arrow-left").css(
                  "color",
                  "#7f7f7f"
                );
              }
              if (response.status === false) {
                pageno = 0;
                $(".game-list .con-box:eq(0) .page-nav .arr:eq(0)").addClass(
                  "block-click"
                );
                $(".game-list .con-box:eq(0) .page-nav .arr:eq(0)").removeClass(
                  "action"
                );
                $(".game-list .con-box:eq(0) .page-nav .van-icon-arrow-left").css(
                  "color",
                  "#7f7f7f"
                );
                alertMessJoin(response.msg);
                return false;
              }
              page -= 1;
              $(".game-list .con-box:eq(0) .page-nav .number").text(
                page + "/" + response.page
              );
              let list_orders = response.data.gameslist;
              $(".time-box .info .number").text(response.period);
              showListOrder(list_orders, 0);
            },
          });
        });
        
        var pageno = 0;
        var limit = 10;
        var page = 1;
        $(".game-list .con-box:eq(1) .page-nav .arr:eq(1)").click(function (e) {
          e.preventDefault();
          pageno += 10;
          let pageto = limit;
          $.ajax({
            type: "POST",
            url: "/api/webapi/GetMyEmerdList",
            data: {
              typeid: "5",
              pageno: pageno,
              pageto: pageto,
              language: "vi",
              authtoken:auth_token,
            },
            dataType: "json",
            success: function (response) {
              if (response.status === false) {
                pageno -= 10;
                $(".game-list .con-box:eq(1) .page-nav .arr:eq(1)").addClass(
                  "block-click"
                );
                $(".game-list .con-box:eq(1) .page-nav .arr:eq(1)").removeClass(
                  "action"
                );
                $(".game-list .con-box:eq(1) .page-nav .van-icon-arrow-right").css(
                  "color",
                  "#7f7f7f"
                );
                alertMessJoin(response.msg);
                return false;
              }
              $(".game-list .con-box:eq(1) .page-nav .arr:eq(0)").removeClass(
                "block-click"
              );
              $(".game-list .con-box:eq(1) .page-nav .arr:eq(0)").addClass("action");
              $(".game-list .con-box:eq(1) .page-nav .van-icon-arrow-left").css(
                "color",
                "#fff"
              );
              page += 1;
              console.log(page);
              $(".game-list .con-box:eq(1) .page-nav .number").text(
                "1/" + `${(response.page) ? response.page : '1'}`
              );
              let list_orders = response.data.gameslist;
              $(".time-box .info .number").text(response.period);
              showListOrder2(list_orders, 1);
            },
          });
          setTimeout(() => {
            let check = true;
            $("#history-order .item").click(function (e) {
              e.preventDefault();
              let parent = $(this).parent();
              // let show = parent.children();
              let myVar = parent.find(".details");
              if (check) {
                check = false;
                myVar.fadeIn(0);
              } else {
                check = true;
                myVar.fadeOut(0);
              }
            });
          }, 1000);
        });
        $(".game-list .con-box:eq(1) .page-nav .arr:eq(0)").click(function (e) {
          e.preventDefault();
          $(".game-list .con-box:eq(1) .page-nav .arr:eq(1)").removeClass(
            "block-click"
          );
          $(".game-list .con-box:eq(1) .page-nav .arr:eq(1)").addClass("action");
          $(".game-list .con-box:eq(1) .page-nav .van-icon-arrow-right").css(
            "color",
            "#fff"
          );
          pageno -= 10;
          let pageto = limit;
          $.ajax({
            type: "POST",
            url: "/api/webapi/GetMyEmerdList",
            data: {
              typeid: "5",
              pageno: pageno,
              pageto: pageto,
              language: "vi",
              authtoken:auth_token,
            },
            dataType: "json",
            success: function (response) {
              if (page - 1 <= 1) {
                $(".game-list .con-box:eq(1) .page-nav .arr:eq(0)").addClass(
                  "block-click"
                );
                $(".game-list .con-box:eq(1) .page-nav .arr:eq(0)").removeClass(
                  "action"
                );
                $(".game-list .con-box:eq(1) .page-nav .van-icon-arrow-left").css(
                  "color",
                  "#7f7f7f"
                );
              }
              if (response.status === false) {
                pageno = 0;
                $(".game-list .con-box:eq(1) .page-nav .arr:eq(0)").addClass(
                  "block-click"
                );
                $(".game-list .con-box:eq(1) .page-nav .arr:eq(0)").removeClass(
                  "action"
                );
                $(".game-list .con-box:eq(1) .page-nav .van-icon-arrow-left").css(
                  "color",
                  "#7f7f7f"
                );
                alertMessJoin(response.msg);
                return false;
              }
              page -= 1;
              $(".game-list .con-box:eq(1) .page-nav .number").text(
                "1/" + `${(response.page) ? response.page : '1'}`
              );
              let list_orders = response.data.gameslist;
              $(".time-box .info .number").text(response.period);
              showListOrder2(list_orders, 1);
            },
          });
      
      
        
       
        
        var pageno = 0;
        var limit = 10;
        var page = 1;
        $(".game-list .con-box:eq(2) .page-nav .arr:eq(1)").click(function (e) {
          e.preventDefault();
          pageno += 10;
          let pageto = limit;
          $.ajax({
            type: "POST",
            url: "/api/webapi/GetNoaverageEmerdList",
            data: {
              typeid: "5",
              pageno: pageno,
              pageto: pageto,
              language: "vi",
              authtoken:auth_token,
            },
            dataType: "json",
            success: function (response) {
              if (response.status === false) {
                pageno -= 10;
                $(".game-list .con-box:eq(2) .page-nav .arr:eq(1)").addClass(
                  "block-click"
                );
                $(".game-list .con-box:eq(2) .page-nav .arr:eq(1)").removeClass(
                  "action"
                );
                $(".game-list .con-box:eq(2) .page-nav .van-icon-arrow-right").css(
                  "color",
                  "#7f7f7f"
                );
                alertMessJoin(response.msg);
                return false;
              }
              $(".game-list .con-box:eq(2) .page-nav .arr:eq(0)").removeClass(
                "block-click"
              );
              $(".game-list .con-box:eq(2) .page-nav .arr:eq(0)").addClass("action");
              $(".game-list .con-box:eq(2) .page-nav .van-icon-arrow-left").css(
                "color",
                "#fff"
              );
              page += 1;
              $(".game-list .con-box:eq(2) .page-nav .number").text(
                page + "/" + response.page
              );
              let list_orders = response.data.gameslist;
              $(".time-box .info .number").text(response.period);
              showListOrder_t(list_orders, 2);
            },
          });
        });
      });
      $(".game-list .con-box:eq(2) .page-nav .arr:eq(0)").click(function (e) {
        e.preventDefault();
        $(".game-list .con-box:eq(2) .page-nav .arr:eq(1)").removeClass(
          "block-click"
        );
        $(".game-list .con-box:eq(2) .page-nav .arr:eq(1)").addClass("action");
        $(".game-list .con-box:eq(2) .page-nav .van-icon-arrow-right").css(
          "color",
          "#fff"
        );
        pageno -= 10;
        let pageto = limit;
        $.ajax({
          type: "POST",
          url: "/api/webapi/GetNoaverageEmerdList",
          data: {
            typeid: "5",
            pageno: pageno,
            pageto: pageto,
            language: "vi",
            authtoken:auth_token,
          },
          dataType: "json",
          success: function (response) {
            if (page - 1 <= 1) {
              $(".game-list .con-box:eq(2) .page-nav .arr:eq(0)").addClass(
                "block-click"
              );
              $(".game-list .con-box:eq(2) .page-nav .arr:eq(0)").removeClass(
                "action"
              );
              $(".game-list .con-box:eq(2) .page-nav .van-icon-arrow-left").css(
                "color",
                "#7f7f7f"
              );
            }
            if (response.status === false) {
              pageno = 0;
              $(".game-list .con-box:eq(2) .page-nav .arr:eq(0)").addClass(
                "block-click"
              );
              $(".game-list .con-box:eq(2) .page-nav .arr:eq(0)").removeClass(
                "action"
              );
              $(".game-list .con-box:eq(2) .page-nav .van-icon-arrow-left").css(
                "color",
                "#7f7f7f"
              );
              alertMessJoin(response.msg);
              return false;
            }
            page -= 1;
            $(".game-list .con-box:eq(2) .page-nav .number").text(
              page + "/" + response.page
            );
            let list_orders = response.data.gameslist;
            $(".time-box .info .number").text(response.period);
            showListOrder_t(list_orders, 2);
          },
        });
      });           
      
      var socket = io();
        var pageno = 0;
        var limit = 10;
        var page = 1;
        socket.on("data-server", function (msg) {
          if(msg.data[0].game != 'wingo5') return;
    $(".Loading").fadeIn(0);
    setTimeout(() => {
      let data1 = msg.data[0]; // lấy ra cầu mới nhất
      let data2 = []; // lấy ra cầu cũ
      let data3 = data2.push(msg.data[1]);
      $(".time-box .info .number").text(data1.period);
      showListOrder3(data2, 0);
      pageno = 0;
      limit = 10;
      page = 1;
      $(".game-list .con-box:eq(0) .page-nav .arr:eq(0)").addClass("block-click");
      $(".game-list .con-box:eq(0) .page-nav .arr:eq(0)").removeClass("action");
      $(".game-list .con-box:eq(0) .page-nav .van-icon-arrow-left").css(
        "color",
        "#7f7f7f"
      );
      $(".game-list .con-box:eq(0) .page-nav .arr:eq(1)").removeClass(
        "block-click"
      );
      $(".game-list .con-box:eq(0) .page-nav .arr:eq(1)").addClass("action");
      $(".game-list .con-box:eq(0) .page-nav .van-icon-arrow-right").css(
        "color",
        "#fff"
      );
  
      $(".game-list .con-box:eq(1) .page-nav .arr:eq(0)").addClass("block-click");
      $(".game-list .con-box:eq(1) .page-nav .arr:eq(0)").removeClass("action");
      $(".game-list .con-box:eq(1) .page-nav .van-icon-arrow-left").css(
        "color",
        "#7f7f7f"
      );
      $(".game-list .con-box:eq(1) .page-nav .arr:eq(1)").removeClass(
        "block-click"
      );
      $(".game-list .con-box:eq(1) .page-nav .arr:eq(1)").addClass("action");
      $(".game-list .con-box:eq(1) .page-nav .van-icon-arrow-right").css(
        "color",
        "#fff"
      );
      var firstGame;

$.ajax({
    type: "POST",
    url: "/api/webapi/GetMyEmerdList",
    data: {
        typeid: "5",
        pageno: "0",
        pageto: "10",
        language: "vi",
        authtoken:auth_token,
    },
    dataType: "json",
    success: function(response) {
        let data = response.data.gameslist;
        $(".game-list .con-box:eq(1) .page-nav .number").text(
            "1/" + (response.page ? response.page : '1')
        );

        // Set the value of firstGame to the first game in the gameslist
        firstGame = data[0];

        var lastGame = data[data.length - 1];
        console.log(firstGame);
        $(".game-list .con-box").css("display", "none");
        $(".game-list .li .txt").removeClass("action");
        $(".game-list .li .txt:eq(0)").addClass("action");
        $(".game-list .li").removeClass("block-click");
        $(this).addClass("block-click");
        $(".game-list .con-box:eq(0)").css("display", "block");
        showListOrder2(data, 1);

        // Nested AJAX call
        $.ajax({
            type: "POST",
            url: "/api/webapi/GetNoaverageEmerdList",
            data: {
                typeid: "5",
                pageno: "0",
                pageto: "10",
                language: "vi",
                authtoken:auth_token,
            },
            dataType: "json",
            success: function(response) {
    let list_orders = response.data.gameslist;
    $(".time-box .info .number").text(response.period);
    $(".game-list .con-box:eq(0) .page-nav .number").text("1/" + response.page);

    // Assuming firstGame is defined somewhere in your code
    if (firstGame && firstGame.stage === list_orders[0].period) {
        var modal = document.getElementById("myModal");
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
        myModal_result_Period.innerHTML = "Period : 5 min " + firstGame.stage;
        
        let color;
        let type;

        if (firstGame.result >= 0 && firstGame.result <= 4) {
            type = "Small";
        } else if (firstGame.result >= 5 && firstGame.result <= 9) {
            type = "Big";
        }

        if (firstGame.result == 0) {
            color = "Red + Violet";
        } else if (firstGame.result == 5) {
            color = "Green + Violet";
        } else if (firstGame.result % 2 == 0) {
            color = "Red";
        } else {
            color = "Green";
        }

        lottery_result.innerHTML = "Lottery Result:<span class='btn-boox'>" + color + "</span><span class='btn-boox'>" + firstGame.result + "</span><span class='btn-boox'>" + type + "</span>";
    }
    showListOrder(list_orders, 0);
    showListOrder_t(list_orders, 2);
},

        });
    },
});
});
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