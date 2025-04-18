import moment from "moment";
import connection from "../config/connectDB.js";
import axios from "axios";
import _ from "lodash";
import GameRepresentationIds from "../constants/game_representation_id.js";
import { generateCommissionId,
  generatePeriod,
  yesterdayTime, } from "../helpers/games.js";
import "dotenv/config";
import md5 from "md5";

export const TRX_WINGO_GAME_STATUS_MAP = {
  PENDING: 0,
  COMPLETED: 1,
};

export const TRX_WINGO_GAME_TYPE_MAP = {
  MIN_1: "trx_wingo",
  MIN_3: "trx_wingo3",
  MIN_5: "trx_wingo5",
  MIN_10: "trx_wingo10",
};

const trxWingoBlockPage = async (req, res) => {
  var sandbox = process.env.SANDBOX_MODE;
  return res.render("bet/trx_wingo/trx_block.ejs", {sandbox});
};

const trxWingoPage = async (req, res) => {
  var sandbox = process.env.SANDBOX_MODE;
  return res.render("bet/trx_wingo/win.ejs", {sandbox});
};

const trxWingoPage3 = async (req, res) => {
  var sandbox = process.env.SANDBOX_MODE;
  return res.render("bet/trx_wingo/win3.ejs", {sandbox});
};

const trxWingoPage5 = async (req, res) => {
  var sandbox = process.env.SANDBOX_MODE;
  return res.render("bet/trx_wingo/win5.ejs", {sandbox});
};

const trxWingoPage10 = async (req, res) => {
  var sandbox = process.env.SANDBOX_MODE;
  return res.render("bet/trx_wingo/win10.ejs", {sandbox});
};

const isNumber = (params) => {
  let pattern = /^[0-9]*\d$/;
  return pattern.test(params);
};

function formateT(params) {
  let result = params < 10 ? "0" + params : params;
  return result;
}

function timerJoin(params = "", addHours = 0) {
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
    " " +
    ampm
  );
}

const rosesPlus = async (auth, money, fee) => {
  const [level] = await connection.query("SELECT * FROM level ");

  const [user] = await connection.query(
    "SELECT `phone`, `code`, `invite` FROM users WHERE token = ? AND veri = 1  LIMIT 1 ",
    [auth],
  );
  let timeNow = Date.now();
  let userInfo = user[0];
  const [f1] = await connection.query(
    "SELECT `phone`, `code`, `invite`, `rank`, `user_level` FROM users WHERE code = ? AND veri = 1  LIMIT 1 ",
    [userInfo.invite],
  );
  if (money >= 100) {
    if (f1.length > 0) {
      let infoF1 = f1[0];
        let rosesF1 = (money / 100) * level[parseInt(infoF1.user_level)].f1;
        await connection.query(
          "UPDATE users SET money = money + ?, roses_f1 = roses_f1 + ?, roses_f = roses_f + ?, roses_today = roses_today + ? WHERE phone = ? ",
          [rosesF1, rosesF1, rosesF1, rosesF1, infoF1.phone],
        );

        const sqlTF1 = `
        INSERT INTO turn_over (phone, code, invite, daily_turn_over, total_turn_over)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        daily_turn_over = daily_turn_over + VALUES(daily_turn_over),
        total_turn_over = total_turn_over + VALUES(total_turn_over)
        `;
        await connection.execute(sqlTF1, [infoF1.phone, infoF1.code, infoF1.invite, rosesF1, rosesF1]);
        const sqlF1 = `INSERT INTO roses SET phone = ?,code = ?,invite = ?,f1 = ?,f2 = ?,f3 = ?,f4 = ?,f5 = ?,f6 = ?,time = ?`;
        await connection.execute(sqlF1, [infoF1.phone,'1',userInfo.phone,rosesF1,'0','0','0','0','0',timeNow,]);
        const [f2] = await connection.query(
          "SELECT `phone`, `code`, `invite`, `rank`, `user_level` FROM users WHERE code = ? AND veri = 1  LIMIT 1 ",
          [infoF1.invite],
        );
        if (f2.length > 0) {
          let infoF2 = f2[0];
          let rosesF2 = (money / 100) * level[parseInt(infoF2.user_level)].f2;
          await connection.query(
            "UPDATE users SET money = money + ?, roses_f = roses_f + ?, roses_today = roses_today + ? WHERE phone = ? ",
            [rosesF2, rosesF2, rosesF2, infoF2.phone],
          );
          const sqlTF2 = `
          INSERT INTO turn_over (phone, code, invite, daily_turn_over, total_turn_over)
          VALUES (?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
          daily_turn_over = daily_turn_over + VALUES(daily_turn_over),
          total_turn_over = total_turn_over + VALUES(total_turn_over)
          `;
          await connection.execute(sqlTF2, [infoF2.phone, infoF2.code, infoF2.invite, rosesF2, rosesF2]);
          const sqlF2 = `INSERT INTO roses SET phone = ?,code = ?,invite = ?,f1 = ?,f2 = ?,f3 = ?,f4 = ?,f5 = ?,f6 = ?,time = ?`;
          await connection.execute(sqlF2, [infoF2.phone,'2',userInfo.phone,'0',rosesF2,'0','0','0','0',timeNow,]);  
          const [f3] = await connection.query(
            "SELECT `phone`, `code`, `invite`, `rank`, `user_level` FROM users WHERE code = ? AND veri = 1  LIMIT 1 ",
            [infoF2.invite],
          );
          if (f3.length > 0) {
            let infoF3 = f3[0];
            let rosesF3 = (money / 100) * level[parseInt(infoF3.user_level)].f3;
            await connection.query(
              "UPDATE users SET money = money + ?, roses_f = roses_f + ?, roses_today = roses_today + ? WHERE phone = ? ",
              [rosesF3, rosesF3, rosesF3, infoF3.phone],
            );
            const sqlTF3 = `
            INSERT INTO turn_over (phone, code, invite, daily_turn_over, total_turn_over)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            daily_turn_over = daily_turn_over + VALUES(daily_turn_over),
            total_turn_over = total_turn_over + VALUES(total_turn_over)
            `;
            await connection.execute(sqlTF3, [infoF3.phone, infoF3.code, infoF3.invite, rosesF3, rosesF3]);
            const sqlF3 = `INSERT INTO roses SET phone = ?,code = ?,invite = ?,f1 = ?,f2 = ?,f3 = ?,f4 = ?,f5 = ?,f6 = ?,time = ?`;
            await connection.execute(sqlF3, [infoF3.phone,'3',userInfo.phone,'0','0',rosesF3,'0','0','0',timeNow,]);
            const [f4] = await connection.query(
              "SELECT `phone`, `code`, `invite`, `rank`, `user_level` FROM users WHERE code = ? AND veri = 1  LIMIT 1 ",
              [infoF3.invite],
            );
            if (f4.length > 0) {
              let infoF4 = f4[0];
              let rosesF4 = (money / 100) * level[parseInt(infoF4.user_level)].f4;
              await connection.query(
                "UPDATE users SET money = money + ?, roses_f = roses_f + ?, roses_today = roses_today + ? WHERE phone = ? ",
                [rosesF4, rosesF4, rosesF4, infoF4.phone],
              );
              const sqlTF4 = `
              INSERT INTO turn_over (phone, code, invite, daily_turn_over, total_turn_over)
              VALUES (?, ?, ?, ?, ?)
              ON DUPLICATE KEY UPDATE
              daily_turn_over = daily_turn_over + VALUES(daily_turn_over),
              total_turn_over = total_turn_over + VALUES(total_turn_over)
              `;
              await connection.execute(sqlTF4, [infoF4.phone, infoF4.code, infoF4.invite, rosesF4, rosesF4]);
              const sqlF4 = `INSERT INTO roses SET phone = ?,code = ?,invite = ?,f1 = ?,f2 = ?,f3 = ?,f4 = ?,f5 = ?,f6 = ?,time = ?`;
              await connection.execute(sqlF4, [infoF4.phone,'4',userInfo.phone,'0','0','0',rosesF4,'0','0',timeNow,]);
              const [f5] = await connection.query(
                "SELECT `phone`, `code`, `invite`, `rank`, `user_level` FROM users WHERE code = ? AND veri = 1  LIMIT 1 ",
                [infoF4.invite],
              );
              if (f5.length > 0) {
                let infoF5 = f5[0];
                let rosesF5 = (money / 100) * level[parseInt(infoF5.user_level)].f5;
                await connection.query(
                  "UPDATE users SET money = money + ?, roses_f = roses_f + ?, roses_today = roses_today + ? WHERE phone = ? ",
                  [rosesF5, rosesF5, rosesF5, infoF5.phone],
                );
                const sqlTF5 = `
                INSERT INTO turn_over (phone, code, invite, daily_turn_over, total_turn_over)
                VALUES (?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                daily_turn_over = daily_turn_over + VALUES(daily_turn_over),
                total_turn_over = total_turn_over + VALUES(total_turn_over)
                `;
                await connection.execute(sqlTF5, [infoF5.phone, infoF5.code, infoF5.invite, rosesF5, rosesF5]);
                const sqlF5 = `INSERT INTO roses SET phone = ?,code = ?,invite = ?,f1 = ?,f2 = ?,f3 = ?,f4 = ?,f5 = ?,f6 = ?,time = ?`;
                await connection.execute(sqlF5, [infoF5.phone,'5',userInfo.phone,'0','0','0','0',rosesF5,'0',timeNow,]);

                const [f6] = await connection.query(
                  "SELECT `phone`, `code`, `invite`, `rank`, `user_level` FROM users WHERE code = ? AND veri = 1  LIMIT 1 ",
                  [infoF5.invite],
                );
                if (f6.length > 0) {
                  let infoF6 = f6[0];
                  let rosesF6 = (money / 100) * level[parseInt(infoF6.user_level)].f6;
                  await connection.query(
                    "UPDATE users SET money = money + ?, roses_f = roses_f + ?, roses_today = roses_today + ? WHERE phone = ? ",
                    [rosesF6, rosesF6, rosesF6, infoF6.phone],
                  );
                  const sqlTF6 = `
                  INSERT INTO turn_over (phone, code, invite, daily_turn_over, total_turn_over)
                  VALUES (?, ?, ?, ?, ?)
                  ON DUPLICATE KEY UPDATE
                  daily_turn_over = daily_turn_over + VALUES(daily_turn_over),
                  total_turn_over = total_turn_over + VALUES(total_turn_over)
                  `;
                  await connection.execute(sqlTF6, [infoF6.phone, infoF6.code, infoF6.invite, rosesF6, rosesF6]);
                  const sqlF6 = `INSERT INTO roses SET phone = ?,code = ?,invite = ?,f1 = ?,f2 = ?,f3 = ?,f4 = ?,f5 = ?,f6 = ?,time = ?`;
                  await connection.execute(sqlF6, [infoF6.phone,'6',userInfo.phone,'0','0','0','0','0',rosesF6,timeNow,]);
                }
              }
            }
          }
        }
        
    }
  }
};


const betTrxWingo = async (req, res) => {
  try {
    let { typeid, join, x, money } = req.body;
    let auth = req.body.authtoken;

    if (typeid != 1 && typeid != 3 && typeid != 5 && typeid != 10) {
      return res.status(200).json({
        message: "Error!",
        status: true,
      });
    }

    let gameJoin = "";
    if (typeid == 1) gameJoin = "trx_wingo";
    if (typeid == 3) gameJoin = "trx_wingo3";
    if (typeid == 5) gameJoin = "trx_wingo5";
    if (typeid == 10) gameJoin = "trx_wingo10";
    const [trxWingoNow] = await connection.query(
      `SELECT period FROM trx_wingo_game WHERE status = 0 AND game = ? ORDER BY id DESC LIMIT 1 `,
      [gameJoin],
    );
    const [user] = await connection.query(
      "SELECT `phone`, `code`, `invite`, `level`, `money` FROM users WHERE token = ? AND veri = 1  LIMIT 1 ",
      [md5(auth)],
    );
    if (!trxWingoNow[0] || !user[0] || !isNumber(x) || !isNumber(money)) {
      return res.status(200).json({
        message: "Error!",
        status: true,
      });
    }

    let userInfo = user[0];
    let period = trxWingoNow[0].period;
    let fee = x * money * 0.02;
    let total = x * money - fee;
    let timeNow = Date.now();
    let check = userInfo.money - total;

    let date = new Date();
    let years = formateT(date.getFullYear());
    let months = formateT(date.getMonth() + 1);
    let days = formateT(date.getDate());
    let id_product =
      years + months + days + Math.floor(Math.random() * 1000000000000000);

    let formatTime = timerJoin();

    let color = "";
    if (join == "l") {
      color = "big";
    } else if (join == "n") {
      color = "small";
    } else if (join == "t") {
      color = "violet";
    } else if (join == "d") {
      color = "red";
    } else if (join == "x") {
      color = "green";
    } else if (join == "0") {
      color = "red-violet";
    } else if (join == "5") {
      color = "green-violet";
    } else if (join % 2 == 0) {
      color = "red";
    } else if (join % 2 != 0) {
      color = "green";
    }

    let checkJoin = "";

    if ((!isNumber(join) && join == "l") || join == "n") {
      checkJoin = `
        <div data-v-a9660e98="" class="van-image" style="width: 30px; height: 30px;">
            <img src="/images/${join == "n" ? "small" : "big"}.png" class="van-image__img">
        </div>
        `;
    } else {
      checkJoin = `
        <span data-v-a9660e98="">${isNumber(join) ? join : ""}</span>
        `;
    }

    let result = `
    <div data-v-a9660e98="" issuenumber="${period}" addtime="${formatTime}" rowid="1" class="hb">
        <div data-v-a9660e98="" class="item c-row">
            <div data-v-a9660e98="" class="result">
                <div data-v-a9660e98="" class="select select-${color}">
                    ${checkJoin}
                </div>
            </div>
            <div data-v-a9660e98="" class="c-row c-row-between info">
                <div data-v-a9660e98="">
                    <div data-v-a9660e98="" class="issueName">
                        ${period}
                    </div>
                    <div data-v-a9660e98="" class="tiem">${formatTime}</div>
                </div>
            </div>
        </div>
        <!---->
    </div>
    `;

    function timerJoin(params = "", addHours = 0) {
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
        " " +
        ampm
      );
    }
    let checkTime = timerJoin(date.getTime());

    if (check >= 0) {
      const sql = `INSERT INTO trx_wingo_bets SET 
            id_product = ?,
            phone = ?,
            code = ?,
            invite = ?,
            stage = ?,
            level = ?,
            money = ?,
            amount = ?,
            fee = ?,
            get = ?,
            game = ?,
            bet = ?,
            status = ?,
            today = ?,
            time = ?`;
      await connection.query(sql, [
        id_product,
        userInfo.phone,
        userInfo.code,
        userInfo.invite,
        period,
        userInfo.level,
        total,
        x,
        fee,
        0,
        gameJoin,
        join,
        0,
        checkTime,
        timeNow,
      ]);
      await connection.query(
        "UPDATE `users` SET `money` = `money` - ? WHERE `token` = ? ",
        [money * x, md5(auth)],
      );
      const [users] = await connection.query(
        "SELECT `money`, `level` FROM users WHERE token = ? AND veri = 1  LIMIT 1 ",
        [md5(auth)],
      );
      await rosesPlus(auth, money * x, fee);
      return res.status(200).json({
        message: "Successful bet",
        status: true,
        data: result,
        change: users[0].level,
        money: users[0].money,
      });
    } else {
      return res.status(200).json({
        message: "The amount is not enough",
        status: false,
      });
    }
  } catch (error) {
    return res.status(200).json({
      message: "Error!",
      status: false,
    });
  }
};

const listOrderOld = async (req, res) => {
  let { typeid, pageno, pageto } = req.body;

  if (typeid != 1 && typeid != 3 && typeid != 5 && typeid != 10) {
    return res.status(200).json({
      message: "Error!",
      status: true,
    });
  }
  if (pageno < 0 || pageto < 0) {
    return res.status(200).json({
      code: 0,
      msg: "No more data",
      data: {
        gameslist: [],
      },
      page: 1,
      status: false,
    });
  }
  let auth = req.body.authtoken;
  const [user] = await connection.query(
    "SELECT `phone`, `code`, `invite`, `level`, `money` FROM users WHERE token = ? AND veri = 1  LIMIT 1 ",
    [md5(auth)],
  );

  let game = "";
  if (typeid == 1) game = TRX_WINGO_GAME_TYPE_MAP.MIN_1;
  if (typeid == 3) game = TRX_WINGO_GAME_TYPE_MAP.MIN_3;
  if (typeid == 5) game = TRX_WINGO_GAME_TYPE_MAP.MIN_5;
  if (typeid == 10) game = TRX_WINGO_GAME_TYPE_MAP.MIN_10;

  const [trx_wingo] = await connection.query(
    "SELECT * FROM trx_wingo_game WHERE status != 0 AND game = ? ORDER BY id DESC LIMIT ?, ?",
    [game, Number(pageno), Number(pageto)],
  );

  const [trx_wingoAll] = await connection.query(
    "SELECT COUNT(*) as game_length FROM trx_wingo_game WHERE status != 0 AND game = ?",
    [game],
  );
  const [period] = await connection.query(
    "SELECT period FROM trx_wingo_game WHERE status = 0 AND game = ? ORDER BY id DESC LIMIT 1",
    [game],
  );
  if (!trx_wingo[0]) {
    return res.status(200).json({
      code: 0,
      msg: "No more data",
      data: {
        gameslist: [],
      },
      page: 1,
      status: false,
    });
  }

  if (!pageno || !pageto || !user[0] || !trx_wingo[0] || !period[0]) {
    return res.status(200).json({
      message: "Error!",
      status: true,
    });
  }

  let page = Math.ceil(trx_wingoAll[0].game_length / 10);

  return res.status(200).json({
    code: 0,
    msg: "Receive success",
    data: {
      gameslist: trx_wingo,
    },
    period: period[0].period,
    page: page,
    status: true,
  });
};

const Stat_listOrderOld = async (req, res) => {
  let { typeid, pageno, pageto } = req.body;

  if (typeid != 1 && typeid != 3 && typeid != 5 && typeid != 10) {
    return res.status(200).json({
      message: "Error!",
      status: true,
    });
  }


  let game = "";
  if (typeid == 1) game = TRX_WINGO_GAME_TYPE_MAP.MIN_1;
  if (typeid == 3) game = TRX_WINGO_GAME_TYPE_MAP.MIN_3;
  if (typeid == 5) game = TRX_WINGO_GAME_TYPE_MAP.MIN_5;
  if (typeid == 10) game = TRX_WINGO_GAME_TYPE_MAP.MIN_10;

  const [trx_wingo] = await connection.query(
    "SELECT result FROM trx_wingo_game WHERE status != 0 AND game = ? ORDER BY id DESC LIMIT ?, ?",
    [game, Number(pageno), Number(pageto)],
  );

  if (!trx_wingo[0]) {
    return res.status(200).json({
      code: 0,
      msg: "No more data",
      data: {
        gameslist: [],
      },
      page: 1,
      status: false,
    });
  }

  if (!pageno || !pageto || !trx_wingo[0]) {
    return res.status(200).json({
      message: "Error!",
      status: true,
    });
  }

  return res.status(200).json({
    code: 0,
    msg: "Receive success",
    data: {
      gameslist: trx_wingo,
    },
    status: true,
  });
};

const GetMyEmerdList = async (req, res) => {
  let { typeid, pageno, pageto } = req.body;

  // if (!pageno || !pageto) {
  //     pageno = 0;
  //     pageto = 10;
  // }

  if (typeid != 1 && typeid != 3 && typeid != 5 && typeid != 10) {
    return res.status(200).json({
      message: "Error!",
      status: true,
    });
  }

  if (pageno < 0 || pageto < 0) {
    return res.status(200).json({
      code: 0,
      msg: "No more data",
      data: {
        gameslist: [],
      },
      page: 1,
      status: false,
    });
  }
  let auth = req.body.authtoken;

  let game = "";
  if (typeid == 1) game = "trx_wingo";
  if (typeid == 3) game = "trx_wingo3";
  if (typeid == 5) game = "trx_wingo5";
  if (typeid == 10) game = "trx_wingo10";

  const [user] = await connection.query(
    "SELECT `phone`, `code`, `invite`, `level`, `money` FROM users WHERE token = ? AND veri = 1 LIMIT 1",
    [md5(auth)],
  );
  const [trx_wingo_bets] = await connection.query(
    "SELECT * FROM trx_wingo_bets WHERE phone = ? AND game = ? ORDER BY id DESC LIMIT ?, ?",
    [user[0].phone, game, Number(pageno), Number(pageto)],
  );
  const [trx_wingo_betsAll] = await connection.query(
    "SELECT COUNT(*) as bet_length FROM trx_wingo_bets WHERE phone = ? AND game = ? ORDER BY id DESC",
    [user[0].phone, game],
  );

  if (!trx_wingo_bets[0]) {
    return res.status(200).json({
      code: 0,
      msg: "No more data",
      data: {
        gameslist: [],
      },
      page: 1,
      status: false,
    });
  }
  if (!pageno || !pageto || !user[0] || !trx_wingo_bets[0]) {
    return res.status(200).json({
      message: "Error!",
      status: true,
    });
  }

  let page = Math.ceil(trx_wingo_betsAll[0].bet_length / 10);

  let datas = trx_wingo_bets.map((data) => {
    let { id, phone, code, invite, level, game, ...others } = data;
    return others;
  });

  return res.status(200).json({
    code: 0,
    msg: "Receive success",
    data: {
      gameslist: datas,
    },
    page: page,
    status: true,
  });
};

function minutesPassedSince(time) {
  const inputTime = moment(time);
  const minutesDiff = moment().diff(inputTime, "minutes");
  return minutesDiff;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const generateResultByHash = (hash) => {
  const hashItemList = hash.split("");

  let Result = "";
  for (let index = 0; index < hashItemList.length; index++) {
    const hashItem = hashItemList[hashItemList.length - 1 - index];

    const NUMBER_LIST = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const isNumber = NUMBER_LIST.includes(hashItem);
    if (isNumber) {
      Result = hashItem;
      break;
    }
  }

  return Result;
};

function getNthMinuteSinceDayStart() {
  const now = moment();
  const startOfDay = moment().startOf("day");
  const diff = now.diff(startOfDay, "minutes");
  return diff;
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const addTrxWingo = async (game) => {
  try {
    let join = "";
    if (game == 1) join = TRX_WINGO_GAME_TYPE_MAP.MIN_1;
    if (game == 3) join = TRX_WINGO_GAME_TYPE_MAP.MIN_3;
    if (game == 5) join = TRX_WINGO_GAME_TYPE_MAP.MIN_5;
    if (game == 10) join = TRX_WINGO_GAME_TYPE_MAP.MIN_10;

    // console.log(join)

    const [trxWingoNow] = await connection.query(
      "SELECT period FROM trx_wingo_game WHERE status = 0 AND game = ? ORDER BY id DESC LIMIT 1",
      [join],
    );

    const isPendingGame = trxWingoNow.length;
    const PendingGamePeriod = trxWingoNow?.[0]?.period
      ? parseInt(trxWingoNow?.[0]?.period)
      : 0;

    if (isPendingGame) {
      // console.log("TRX WINGO GAME PENDING GAME INSERTIONS Start")
      try{

        const isAdminManipulatedResult = false;
        const [setting] = await connection.query('SELECT * FROM `admin` ');
        let nextResult = '';
        if (game == 1) nextResult = setting[0].trx_wingo1;
        if (game == 3) nextResult = setting[0].trx_wingo3;
        if (game == 5) nextResult = setting[0].trx_wingo5;
        if (game == 10) nextResult = setting[0].trx_wingo10;
        console.log(nextResult);
        if (nextResult == '-1') {
          const rndInt = randomIntFromInterval(0, 9);
          let response = await axios({
            method: "GET",
            url: "https://apilist.tronscanapi.com/api/block?sort=-balance&start=0&limit=20&producer=&number=&start_timestamp=&end_timestamp=",
            headers: {
              "TRON-PRO-API-KEY": process.env.TRON_API_KEY,
            },
          });
         // console.log(response.data.data);
         const data_json = response.data.data[rndInt];
         const NextBlock = [];
         NextBlock.id = data_json.number;
         NextBlock.hash = data_json.hash;
         NextBlock.blockTime = data_json.timestamp;
         NextBlock.timeSS = moment(data_json.timestamp).format("ss");
          // const NextBlock = response.data.data
          //   .map((item) => {
          //     return {
          //       id: item.number,
          //       hash: item.hash,
          //       blockTime: item.timestamp,
          //       timeSS: moment(item.timestamp).format("ss"),
          //     };
          //   })
          //   .find((item) => item.timeSS === process.env.TRX_WINGO_GAME_TIME_SS);
  
          if (NextBlock === undefined) {
            throw new Error("NextBlock is undefined");
          }
  
          const BlockId = NextBlock.id;
          const BlockTime = NextBlock.blockTime;
          const Hash = NextBlock.hash;
  
          let Result = generateResultByHash(Hash);
  
          // console.log({
          //    BlockId,
          //    BlockTime: moment(BlockTime).format("HH:mm:ss"),
          //    Hash,
          //    Result,
          // })
  
          await connection.query(
            `
                 UPDATE trx_wingo_game
                 SET result = ?, status = ?, block_id = ?, block_time = ?, hash = ?, release_status = 1
                 WHERE period = ? AND game = ?
                 `,
            [
              Result,
              TRX_WINGO_GAME_STATUS_MAP.COMPLETED,
              BlockId,
              BlockTime,
              Hash,
              PendingGamePeriod,
              join,
            ],
          );   
          // console.log("TRX WINGO GAME PENDING GAME INSERTIONS Successfully")
        }
      else {
          await connection.query(
            `
                 UPDATE trx_wingo_game
                 SET status = ?, release_status = 1
                 WHERE period = ? AND game = ?
                 `,
            [
              TRX_WINGO_GAME_STATUS_MAP.COMPLETED,
              PendingGamePeriod,
              join,
            ],
          );
          let adminJoin = '';
          if (game == 1) adminJoin = 'trx_wingo1';
          if (game == 3) adminJoin = 'trx_wingo3';
          if (game == 5) adminJoin = 'trx_wingo5';
          if (game == 10) adminJoin = 'trx_wingo10';
  
          await connection.execute(`UPDATE admin SET ${adminJoin} = ?`, ['-1']);
        }  
      }
      catch (error) {
        console.log(error);
      }
    
    }

    let gameRepresentationId = GameRepresentationIds.TRXWINGO[game];
    let NewGamePeriod = generatePeriod(gameRepresentationId);

    let timeNow = Date.now();

    const [trxWinGoTest] = await connection.query(
      "SELECT period FROM trx_wingo_game WHERE period = ? AND game = ?",
      [NewGamePeriod, join],
    );

    if (trxWinGoTest.length > 0) {
      return;
    }

    await connection.query(
      "INSERT INTO trx_wingo_game SET period = ?, result = 0, game = ?, status = 0, block_id = 0, block_time = '', hash = '', time = ?",
      [NewGamePeriod, join, timeNow],
    );
    // console.log("TRX WINGO GAME INSERT SUCCESSFULLY")
  } catch (error) {
    if (error?.response?.status === 403) {
      console.log("API Quota Exceeded for 30 seconds");
      console.log(error.response.data.Error);
    } else console.log(error);
  }
};

const handlingTrxWingo1P = async (typeid) => {
  try {
    let game = "";
    if (typeid == 1) game = "trx_wingo";
    if (typeid == 3) game = "trx_wingo3";
    if (typeid == 5) game = "trx_wingo5";
    if (typeid == 10) game = "trx_wingo10";

    const [trxWingoNow] = await connection.query(
      "SELECT * FROM trx_wingo_game WHERE status = 1 AND release_status = 1 AND game = ? ORDER BY id DESC LIMIT 1",
      [game],
    );

    if (trxWingoNow.length === 0) {
      return;
    }

    await connection.query(
      "UPDATE trx_wingo_bets SET result = ? WHERE status = 0 AND game = ?",
      [trxWingoNow[0].result, game],
    );

    let result = Number(trxWingoNow[0].result);

    await batchUpdateBetStatus(result, game);

    const [order] = await connection.query(
      "SELECT * FROM trx_wingo_bets WHERE status = 0 AND game = ?",
      [game],
    );

    for (let i = 0; i < order.length; i++) {
      let orders = order[i];
      let id = orders.id;
      let result = orders.result;
      let bet = orders.bet;
      let total = orders.money + orders.fee;
      let phone = orders.phone;
      let winAmount = calculateWinAmount(bet, result, total);
      // x - green
      // t - Violet
      // d - red

      // Sirf 1-4 aur 6-9 tk hi *9 aana chahiye
      // Aur 0 aur 5 pe *4.5
      // Aur red aur green pe *2
      // 1,2,3,4,6,7,8,9

      const [users] = await connection.query(
        "SELECT `money` FROM `users` WHERE `phone` = ?",
        [phone],
      );

      let totals = parseFloat(users[0].money) + parseFloat(winAmount);

      await connection.query(
        "UPDATE `trx_wingo_bets` SET `get` = ?, `status` = 1 WHERE `id` = ?",
        [parseFloat(winAmount), id],
      );

      await connection.query(
        "UPDATE `users` SET `money` = ? WHERE `phone` = ?",
        [totals, phone],
      );
    }

    await connection.query(
      "UPDATE trx_wingo_game SET release_status = 2 WHERE period = ? AND game = ?",
      [trxWingoNow[0].period, game],
    );
  } catch (error) {
    console.log(error);
  }
};

const batchUpdateBetStatus = async (result, game) => {
  const validBets = getValidBets(result);
  const batchSize = 1000; // Adjust this based on your data volume and server capacity
  let offset = 0;

  while (true) {
    const [rows] = await connection.execute(
      `UPDATE trx_wingo_bets SET status = 2 
       WHERE status = 0 AND game = ? AND bet NOT IN (${validBets.map(() => "?").join(",")})
       LIMIT ${batchSize}`,
      [game, ...validBets],
    );

    if (rows.affectedRows === 0) break; // No more rows to update
    offset += batchSize;
  }
};

const getValidBets = (result) => {
  result = Number(result);

  const baseValidBets = [result.toString()];

  if (result % 2 === 0) baseValidBets.push("d");
  else baseValidBets.push("x");

  if (result === 0 || result === 5) baseValidBets.push("t");

  if (result <= 4) baseValidBets.push("n");
  else baseValidBets.push("l");

  return baseValidBets;
};

const calculateWinAmount = (bet, result, total) => {
  let winAmount = 0;
  if (bet == "l" || bet == "n") {
    winAmount = total * 2;
  } else {
    if (result == 0 || result == 5) {
      if (bet == "d" || bet == "x") {
        winAmount = total * 1.5;
      } else if (bet == "t") {
        winAmount = total * 4.5;
      } else if (bet == "0" || bet == "5") {
        winAmount = total * 4.5;
      }
    } else {
      if (result == 1 && bet == "1") {
        winAmount = total * 9;
      } else {
        if (result == 1 && bet == "x") {
          winAmount = total * 2;
        }
      }
      if (result == 2 && bet == "2") {
        winAmount = total * 9;
      } else {
        if (result == 2 && bet == "d") {
          winAmount = total * 2;
        }
      }
      if (result == 3 && bet == "3") {
        winAmount = total * 9;
      } else {
        if (result == 3 && bet == "x") {
          winAmount = total * 2;
        }
      }
      if (result == 4 && bet == "4") {
        winAmount = total * 9;
      } else {
        if (result == 4 && bet == "d") {
          winAmount = total * 2;
        }
      }
      if (result == 6 && bet == "6") {
        winAmount = total * 9;
      } else {
        if (result == 6 && bet == "d") {
          winAmount = total * 2;
        }
      }
      if (result == 7 && bet == "7") {
        winAmount = total * 9;
      } else {
        if (result == 7 && bet == "x") {
          winAmount = total * 2;
        }
      }
      if (result == 8 && bet == "8") {
        winAmount = total * 9;
      } else {
        if (result == 8 && bet == "d") {
          winAmount = total * 2;
        }
      }
      if (result == 9 && bet == "9") {
        winAmount = total * 9;
      } else {
        if (result == 9 && bet == "x") {
          winAmount = total * 2;
        }
      }
    }
  }
  return winAmount;
};

const rosesPlus1 = async (phone, money, levels = [], timeNow = "") => {
  try {
    const [userResult] = await connection.query(
      "SELECT `phone`, `code`, `invite`, `money` FROM users WHERE phone = ? AND veri = 1 LIMIT 1",
      [phone],
    );
    const userInfo = userResult[0];

    if (!userInfo) {
      return;
    }

    let userReferrer = userInfo.invite;
    let commissionsToInsert = [];
    let usersToUpdate = [];
    let timeNow1 = Date.now();

    for (let i = 0; i < levels.length; i++) {
      const levelCommission = levels[i] * money;
      const [referrerRows] = await connection.query(
        "SELECT phone, money, code, invite FROM users WHERE code = ?",
        [userReferrer],
      );
      const referrerInfo = referrerRows[0];

      if (referrerInfo) {
        const commissionId = generateCommissionId();
        commissionsToInsert.push([
          commissionId,
          referrerInfo.phone,
          userInfo.phone,
          levelCommission,
          i + 1,
          timeNow1,
        ]);
        usersToUpdate.push([levelCommission, referrerInfo.phone]);
        userReferrer = referrerInfo.invite;
      } else {
        console.log(`Level ${i + 1} referrer not found.`);
        break;
      }
    }
    if (commissionsToInsert.length > 0) {
      await connection.query(
        "INSERT INTO commissions (commission_id, phone, from_user_phone, money, level, time) VALUES ?",
        [commissionsToInsert],
      );
    }

    if (usersToUpdate.length > 0) {
      const updatePromises = usersToUpdate.map(([money, phone]) =>
        connection.query("UPDATE users SET money = money + ? WHERE phone = ?", [
          money,
          phone,
        ]),
      );
      await Promise.all(updatePromises);
    }

    return {
      success: true,
      message: "Commissions calculated and inserted successfully.",
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
  }
};

const manageResult = async (req, res) => {
  try {
    let auth = req.body.authtoken;
    let hash_number = req.body.hash_number;
    let hash_hash = req.body.hash_hash;
    let hash_result = req.body.hash_result;
    let hash_time = req.body.hash_time;
    let typeid = req.body.typeid;
    let join = '';
    let game = '';
    if (typeid == 1) join = 'trx_wingo1' , game = 'trx_wingo';
    if (typeid == 3) join = 'trx_wingo3', game = 'trx_wingo3';
    if (typeid == 5) join = 'trx_wingo5',game = 'trx_wingo5';
    if (typeid == 10) join = 'trx_wingo10',game = 'trx_wingo10';
    const [trxWingoNow] = await connection.query(
      "SELECT period FROM trx_wingo_game WHERE status = 0 AND game = ? ORDER BY id DESC LIMIT 1",
      [game],
    );
    const isPendingGame = trxWingoNow.length;
    const PendingGamePeriod = trxWingoNow?.[0]?.period
      ? parseInt(trxWingoNow?.[0]?.period)
      : 0;

    if (isPendingGame) {
      await connection.query(
        `
             UPDATE trx_wingo_game
             SET result = ?, status = ?, block_id = ?, block_time = ?, hash = ?, release_status = 0
             WHERE period = ? AND game = ?
             `,
        [
          hash_result,
          TRX_WINGO_GAME_STATUS_MAP.PENDING,
          hash_number,
          hash_time,
          hash_hash,
          PendingGamePeriod,
          game,
        ],
      );

      const sql = `UPDATE admin SET ${join} = ?`;
      await connection.execute(sql, [hash_result]);
    }
    return res.status(200).json({
      message: 'Editing is successful',//Register Sucess
      status: true
    });
  }
  catch (error) {
    console.log(error);
  }
};

const distributeCommission = async () => {
  try {
    const { startOfYesterdayTimestamp, endOfYesterdayTimestamp } =
      yesterdayTime();
    const [levelResult] = await connection.query("SELECT f1 FROM level");
    const levels = levelResult.map((row) => row.f1 / 100);

    // const [bets] = await connection.query('SELECT phone, SUM(money + fee) AS total_money FROM minutes_1 WHERE time > ? AND time <= ? GROUP BY phone', [startOfDay, endTime]);

    const [bets] = await connection.query(
      `
      SELECT phone, SUM(total_money) AS total_money
      FROM (
        SELECT phone, SUM(money + fee) AS total_money
        FROM trx_wingo_bets
        WHERE time > ? AND time <= ?
        GROUP BY phone
        UNION ALL
        SELECT phone, SUM(money + fee) AS total_money
        FROM trx_wingo_bets
        WHERE time > ? AND time <= ?
        GROUP BY phone
      ) AS combined
      GROUP BY phone
      `,
      [
        startOfYesterdayTimestamp,
        endOfYesterdayTimestamp,
        startOfYesterdayTimestamp,
        endOfYesterdayTimestamp,
      ],
    );
    
    const promises = bets.map((bet) =>
      rosesPlus1(bet.phone, bet.total_money, levels, endOfYesterdayTimestamp),
    );
    const response = await Promise.all(promises);
    return {
      success: true,
      message: "Commissions distributed successfully.",
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
  }
};

const trxWingoController = {
  trxWingoPage,
  betTrxWingo,
  listOrderOld,
  Stat_listOrderOld,
  GetMyEmerdList,
  handlingTrxWingo1P,
  addTrxWingo,
  trxWingoPage3,
  trxWingoPage5,
  trxWingoPage10,
  trxWingoBlockPage,
  distributeCommission,
  manageResult,
};

export default trxWingoController;
