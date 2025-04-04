import connection from "../config/connectDB";
import jwt from 'jsonwebtoken'
import md5 from "md5";
const fs = require('fs');
import "dotenv/config";


const homePage = async (req, res) => {
    const [settings] = await connection.query('SELECT `app` FROM admin');
    let app = settings[0].app;
    let auth = req.body.authtoken;
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("home/index.ejs", { app , sandbox});
}

const gameStatisticsPage = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("member/game_statistics.ejs",{sandbox});
}


const activityPage = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("checkIn/activity.ejs", {sandbox});
}

const rebatePage = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("checkIn/rebate.ejs", {sandbox});
}

const vipPage = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("checkIn/vip.ejs", {  sandbox});
}

const jackpotPage = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("checkIn/jackpot.ejs", {sandbox});
}

const dailytaskPage = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("checkIn/dailytask.ejs", {sandbox});
}

const invibonusPage = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("checkIn/invibonus.ejs", {sandbox});
}

const checkInPage = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("checkIn/checkIn.ejs", {sandbox});
}

const checkDes = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("checkIn/checkDes.ejs", {sandbox});
}


const attendancePage = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("checkIn/attendance.ejs", {sandbox});
  };

  const attendanceRecordPage = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("checkIn/attendanceRecord.ejs", {sandbox});
  };
  const attendanceRulesPage = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("checkIn/attendanceRules.ejs", {sandbox});
  };


const checkRecord = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("checkIn/checkRecord.ejs", {sandbox});
}

const addBank = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("wallet/addbank.ejs", {sandbox});
}

// promotion
const promotionPage = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("promotion/promotion.ejs", {sandbox});
}

const promotion1Page = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("promotion/promotion1.ejs", {sandbox});
}

const promotionmyTeamPage = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("promotion/myTeam.ejs", {sandbox});
}

const promotionDesPage = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("promotion/promotionDes.ejs", {sandbox});
}

const comhistoryPage = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("promotion/comhistory.ejs", {sandbox});
}

const mybethistoryPage = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("promotion/mybethistory.ejs", {sandbox});
}


const tutorialPage = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("promotion/tutorial.ejs", {sandbox});
}

const bonusRecordPage = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("promotion/bonusrecord.ejs", {sandbox});
}

// wallet

const rabateRatioPage = async (req, res) => {
    return res.render("promotion/rebateratio.ejs");
  };


const transactionhistoryPage = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("wallet/transactionhistory.ejs", {sandbox});
}


const walletPage = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("wallet/index.ejs", {sandbox});
}

const rechargePage = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("wallet/recharge.ejs", {
        MinimumMoney: process.env.MINIMUM_MONEY, sandbox
    });
}

const rechargerecordPage = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("wallet/rechargerecord.ejs", {sandbox});
}

const withdrawalPage = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    var whatsapp1 = process.env.WHATSAPP_LOCAL_KEY;
    var whatsapp2 = process.env.WHATSAPP_INTERNATIONAL_KEY;
    return res.render("wallet/withdrawal.ejs" , {sandbox,whatsapp1, whatsapp2});
}

const withdrawalrecordPage = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("wallet/withdrawalrecord.ejs", {sandbox});
}
const transfer = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("wallet/transfer.ejs", {sandbox});
}




// member page

const readFileAsync = async () => {
    try {
    var obj = '';
    var contents;
    

    } catch (err) {
      console.error(err)
    }
  }
  
const mianPage = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("member/index.ejs",{sandbox});
}

const safePage = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    var roi1 = process.env.STAKE_ROI_1;
    var roi2 = process.env.STAKE_ROI_3;
    var roi3 = process.env.STAKE_ROI_6;
    var roi4 = process.env.STAKE_ROI_12;
    var pi_rate = process.env.PI_EXCHANGE_RATE;
    return res.render("member/safe.ejs",{ sandbox,roi1,roi2,roi3,roi4, pi_rate});
}

const invitationRulesPage = async (req, res) => {
    return res.render("checkIn/invitationRules.ejs");
  };

const rechargeAwardCollectionRecord = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("checkIn/rechargeAwardCollectionRecord.ejs",{ sandbox});
  };

const languegePage = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("member/language.ejs", {sandbox});
}

const avatarpage = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("member/avatar.ejs", {sandbox});
}

const d_get_betting = async (req, res) => {
    let auth = req.body.authtoken;
    const [user] = await connection.query('SELECT `phone` FROM users WHERE `token` = ? ', [md5(auth)]);
    let phone = user[0].phone;
    let gameJoin = req.body.gameJoin;
    var betting_list = '';
    if( gameJoin == "WinGo")
    {
        [betting_list] = await connection.query('SELECT * FROM minutes_1 WHERE `phone` = ? AND status NOT IN ( 0 )  ORDER BY `id` DESC', [phone]);
    }
    else if(gameJoin == "5D")
    {
        [betting_list] = await connection.query('SELECT * FROM result_5d WHERE `phone` = ? AND status NOT IN ( 0 )  ORDER BY `id` DESC ', [phone]);
    }
    else if(gameJoin == "K3")
    {
        [betting_list] = await connection.query('SELECT * FROM result_k3 WHERE `phone` = ? AND status NOT IN ( 0 )  ORDER BY `id` DESC ', [phone]);     
    }
    else if(gameJoin == "Trx Wingo")
        {
            [betting_list] = await connection.query('SELECT * FROM trx_wingo_bets WHERE `phone` = ? AND status NOT IN ( 0 )  ORDER BY `id` DESC ', [phone]);     
        }
    return res.status(200).json({
        message: 'Success',
        status: true,
        datas: betting_list,
    });
}
const aboutPage = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("member/about/index.ejs", {sandbox});
}

const notificationPage = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("member/notification.ejs", {sandbox});
}

const wingochat = async (req, res) => {
    const [winGo1] = await connection.execute('SELECT * FROM `wingo` WHERE `game` = "wingo" ORDER BY `id` DESC LIMIT 2 ', []);
    const period = winGo1[1].period;
    const amount = winGo1[1].amount;
    var f_api= process.env.Firebase_Apikey;
    var f_authdomain= process.env.Firebase_AuthDomain;
    var f_dburl= process.env.Firebase_Dburl;
    var f_projid= process.env.Firebase_ProjId;
    var f_stobck= process.env.Firebase_StorageBucket;
    var f_messId= process.env.Firebase_MessageSenId;
    var f_appid= process.env.Firebase_AppId;
    var f_mesuareId= process.env.Firebase_MeasurementId;
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("member/wingochat.ejs", { d_period: period, d_amount :amount,d_f_api: f_api, d_f_authdomain :f_authdomain,d_f_dburl:f_dburl,d_f_projid:f_projid,d_f_stobck:f_stobck,d_f_messId:f_messId,d_f_appid:f_appid,d_f_mesuareId:f_mesuareId, sandbox});
}

const k3chat = async (req, res) => {
    const [k31] = await connection.execute('SELECT * FROM `k3` WHERE `game` = "1" ORDER BY `id` DESC LIMIT 2 ', []);
    const k_period = k31[1].period;
    const k_amount = k31[1].result;
    var f_api= process.env.Firebase_Apikey;
    var f_authdomain= process.env.Firebase_AuthDomain;
    var f_dburl= process.env.Firebase_Dburl;
    var f_projid= process.env.Firebase_ProjId;
    var f_stobck= process.env.Firebase_StorageBucket;
    var f_messId= process.env.Firebase_MessageSenId;
    var f_appid= process.env.Firebase_AppId;
    var f_mesuareId= process.env.Firebase_MeasurementId;
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("member/k3chat.ejs", { kd_period: k_period, kd_amount :k_amount,d_f_api: f_api, d_f_authdomain :f_authdomain,d_f_dburl:f_dburl,d_f_projid:f_projid,d_f_stobck:f_stobck,d_f_messId:f_messId,d_f_appid:f_appid,d_f_mesuareId:f_mesuareId, sandbox});
}

const d5chat = async (req, res) => {
    const [d51] = await connection.execute('SELECT * FROM `d5` WHERE `game` = "1" ORDER BY `id` DESC LIMIT 2 ', []);
    const d5_period = d51[1].period;
    const d5_amount = d51[1].result;
    var f_api= process.env.Firebase_Apikey;
    var f_authdomain= process.env.Firebase_AuthDomain;
    var f_dburl= process.env.Firebase_Dburl;
    var f_projid= process.env.Firebase_ProjId;
    var f_stobck= process.env.Firebase_StorageBucket;
    var f_messId= process.env.Firebase_MessageSenId;
    var f_appid= process.env.Firebase_AppId;
    var f_mesuareId= process.env.Firebase_MeasurementId;
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("member/d5chat.ejs", { d5_period: d5_period, d5_amount :d5_amount , d_f_api: f_api, d_f_authdomain :f_authdomain,d_f_dburl:f_dburl,d_f_projid:f_projid,d_f_stobck:f_stobck,d_f_messId:f_messId,d_f_appid:f_appid,d_f_mesuareId:f_mesuareId, sandbox});
}

const recordsalary = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("member/about/recordsalary.ejs", {sandbox});
}



const privacyPolicy = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("member/about/privacyPolicy.ejs", {sandbox});
}

const newtutorial = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("member/newtutorial.ejs", {sandbox});
}

const forgot = async (req, res) => {
    let auth = req.body.authtoken;
    const [user] = await connection.query('SELECT `time_otp` FROM users WHERE token = ? ', [md5(auth)]);
    let time = user[0].time_otp;
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("member/forgot.ejs", { time, sandbox });
}

const redenvelopes = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("member/redenvelopes.ejs", {sandbox});
}

const riskAgreement = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("member/about/riskAgreement.ejs", {sandbox});
}

const myProfilePage = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    return res.render("member/myProfile.ejs", {sandbox});
}


const getSalaryRecord = async (req, res) => {
    const auth = req.body.authtoken;

    const [rows] = await connection.query(`SELECT * FROM users WHERE token = ?`, [md5(auth)]);
    let rowstr = rows[0];
    if (!rows) {
        return res.status(200).json({
            message: 'Failed',
            status: false,

        });
    }
    const [getPhone] = await connection.query(
        `SELECT * FROM salary WHERE phone = ? ORDER BY time DESC`,
        [rowstr.phone]
    );


    console.log("asdasdasd : " + [rows.phone])
    return res.status(200).json({
        message: 'Success',
        status: true,
        data: {

        },
        rows: getPhone,
    })
}
module.exports = {
    attendancePage,
    attendanceRecordPage,
    attendanceRulesPage,
    avatarpage,
    languegePage,
    homePage,
    checkInPage,
    d5chat,
    invibonusPage,
    rechargeAwardCollectionRecord,
    rebatePage,
    jackpotPage,
    k3chat,
    vipPage,
    activityPage,
    dailytaskPage,
    promotionPage,
    promotion1Page,
    rabateRatioPage,
    walletPage,
	wingochat,
    mianPage,
    safePage,
    myProfilePage,
    promotionmyTeamPage,
    promotionDesPage,
    comhistoryPage,
    mybethistoryPage,
    gameStatisticsPage,
    tutorialPage,
    bonusRecordPage,
    rechargePage,
    rechargerecordPage,
    withdrawalPage,
    withdrawalrecordPage,
    aboutPage,
    privacyPolicy,
    notificationPage,
    riskAgreement,
    newtutorial,
    redenvelopes,
    forgot,
    checkDes,
    checkRecord,
    addBank,
    transfer,
    recordsalary,
    getSalaryRecord,
    transactionhistoryPage,
    d_get_betting,
    invitationRulesPage
}