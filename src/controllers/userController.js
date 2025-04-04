import connection from "../config/connectDB";
import jwt from 'jsonwebtoken'
import md5 from "md5";
import request from 'request';
import PiNetwork from 'pi-backend';
import "dotenv/config";
import { getlang_data } from "../helpers/get_langauges.js";
import moment from "moment";

const axios = require('axios');
let timeNow = Date.now();

const apiKey = process.env.PIAPI_KEY
const walletPrivateSeed = process.env.PISEED_KEY// starts with S
const pi_exchange_rate =process.env.PI_EXCHANGE_RATE ;
const pi = new PiNetwork(apiKey, walletPrivateSeed);
const pi_block_link = process.env.BLOCK_CHAIN_LINK; 

const randomNumber = (min, max) => {
    return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

const verifyCode = async (req, res) => {
    let auth = req.body.authtoken;
    let now = new Date().getTime();
    let timeEnd = (+new Date) + 1000 * (60 * 2 + 0) + 500;
    let otp = randomNumber(100000, 999999);

    conswit[rows] = await connection.query('SELECT * FROM users WHERE `token` = ? ', [md5(auth)]);
    if (!rows) {
        return res.status(200).json({
            message: 'Account does not exist',
            status: false,
            timeStamp: timeNow,
        });
    }
    let user = rows[0];
    if (user.time_otp - now <= 0) {
        request(`http://47.243.168.18:9090/sms/batch/v2?appkey=NFJKdK&appsecret=brwkTw&phone=84${user.phone}&msg=Your verification code is ${otp}&extend=${now}`, async (error, response, body) => {
            let data = JSON.parse(body);
            if (data.code == '00000') {
                await connection.execute("UPDATE users SET otp = ?, time_otp = ? WHERE phone = ? ", [otp, timeEnd, user.phone]);
                return res.status(200).json({
                    message: 'Submitted successfully',
                    status: true,
                    timeStamp: timeNow,
                    timeEnd: timeEnd,
                });
            }
        });
    } else {
        return res.status(200).json({
            message: 'Send SMS regularly.',
            status: false,
            timeStamp: timeNow,
        });
    }
}

const aviator = async (req, res) => {
    let auth = req.body.authtoken;
    res.redirect(`https://247cashwin.cloud/theninja/src/api/userapi.php?action=loginandregisterbyauth&token=${md5(auth)}`);
    //res.redirect(`https://jetx.asia/#/jet/loginbyauth/${auth}`);
}

const userInfo = async (req, res) => {
    let auth = req.body.authtoken;
    if (!auth) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        });
    }
    const [rows] = await connection.query('SELECT * FROM users WHERE `token` = ? ', [md5(auth)]);

    if (!rows) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        });
    }
    const [recharge] = await connection.query('SELECT * FROM recharge WHERE `phone` = ? AND status = 1', [rows[0].phone]);
    let totalRecharge = 0;
    recharge.forEach((data) => {
        totalRecharge += data.money;
    });
    const [withdraw] = await connection.query('SELECT * FROM withdraw WHERE `phone` = ? AND status = 1', [rows[0].phone]);
    let totalWithdraw = 0;
    withdraw.forEach((data) => {
        totalWithdraw += data.money;
    });

    const { id, password, ip, veri, ip_address, status, time, token, ...others } = rows[0];
    return res.status(200).json({
        message: 'Success',
        status: true,
        data: {
            code: others.code,
            id_user: others.id_user,
            name_user: others.name_user,
            phone_user: others.phone,
            money_user: others.money,
            user_avatar: others.avatar,
            country_code: others.dial_code,
        },
        totalRecharge: totalRecharge,
        totalWithdraw: totalWithdraw,
        timeStamp: timeNow,
    });

}

const changeUser = async (req, res) => {
    let auth = req.body.authtoken;
    let name = req.body.name;
    let country_code = req.body.country_code;
    let type = req.body.type;

    const [rows] = await connection.query('SELECT * FROM users WHERE `token` = ? ', [md5(auth)]);
    if (!rows || !type || !name) return res.status(200).json({
        message: 'Failed',
        status: false,
        timeStamp: timeNow,
    });;
    switch (type) {
        case 'editname':
            await connection.query('UPDATE users SET name_user = ?, dial_code = ? WHERE `token` = ? ', [name,country_code, md5(auth)]);
            return res.status(200).json({
                message: 'Username modification successful',
                status: true,
                timeStamp: timeNow,
            });
            break;

        default:
            return res.status(200).json({
                message: 'Failed',
                status: false,
                timeStamp: timeNow,
            });
            break;
    }

}

const changePassword = async (req, res) => {
    let auth = req.body.authtoken;
    let password = req.body.password;
    let newPassWord = req.body.newPassWord;
    // let otp = req.body.otp;

    if (!password || !newPassWord) return res.status(200).json({
        message: 'Failed',
        status: false,
        timeStamp: timeNow,
    });;
    const [rows] = await connection.query('SELECT * FROM users WHERE `token` = ? AND `password` = ? ', [md5(auth), md5(password)]);
    if (rows.length == 0) return res.status(200).json({
        message: 'Incorrect password',
        status: false,
        timeStamp: timeNow,
    });;

    // let getTimeEnd = Number(rows[0].time_otp);
    // let tet = new Date(getTimeEnd).getTime();
    // var now = new Date().getTime();
    // var timeRest = tet - now;
    // if (timeRest <= 0) {
    //     return res.status(200).json({
    //         message: 'Mã OTP đã hết hiệu lực',
    //         status: false,
    //         timeStamp: timeNow,
    //     });
    // }

    // const [check_otp] = await connection.query('SELECT * FROM users WHERE `token` = ? AND `password` = ? AND otp = ? ', [auth, md5(password), otp]);
    // if(check_otp.length == 0) return res.status(200).json({
    //     message: 'Mã OTP không chính xác',
    //     status: false,
    //     timeStamp: timeNow,
    // });;

    await connection.query('UPDATE users SET otp = ?, password = ?, plain_password = ? WHERE `token` = ? ', [randomNumber(100000, 999999), md5(newPassWord), newPassWord, md5(auth)]);
    return res.status(200).json({
        message: 'Password modification successful',
        status: true,
        timeStamp: timeNow,
    });

}

const checkInHandling = async (req, res) => {
    let auth = req.body.authtoken;
    let data = req.body.data;

    if (!auth) return res.status(200).json({
        message: 'Failed',
        status: false,
        timeStamp: timeNow,
    });;
    const [rows] = await connection.query('SELECT * FROM users WHERE `token` = ? ', [md5(auth)]);
    if (!rows) return res.status(200).json({
        message: 'Failed',
        status: false,
        timeStamp: timeNow,
    });;
    if (!data) {
        const [point_list] = await connection.query('SELECT * FROM point_list WHERE `phone` = ? ', [rows[0].phone]);
        return res.status(200).json({
            message: 'No More Data',
            datas: point_list,
            status: true,
            timeStamp: timeNow,
        });
    }
    if (data) {
        if (data == 1) {
            const [point_lists] = await connection.query('SELECT * FROM point_list WHERE `phone` = ? ', [rows[0].phone]);
            let check = rows[0].money;
            let point_list = point_lists[0];
            let get = 300;
            if (check >= data && point_list.total1 != 0) {
                await connection.query('UPDATE users SET money = money + ? WHERE phone = ? ', [point_list.total1, rows[0].phone]);
                await connection.query('UPDATE point_list SET total1 = ? WHERE phone = ? ', [0, rows[0].phone]);
                return res.status(200).json({
                    message: `You just received ₹ ${point_list.total1}.00`,
                    status: true,
                    timeStamp: timeNow,
                });
            } else if (check < get && point_list.total1 != 0) {
                return res.status(200).json({
                    message: 'Please Recharge ₹ 300 to claim gift.',
                    status: false,
                    timeStamp: timeNow,
                });
            } else if (point_list.total1 == 0) {
                return res.status(200).json({
                    message: 'You have already received this gift',
                    status: false,
                    timeStamp: timeNow,
                });
            }
        };
        if (data == 2) {
            const [point_lists] = await connection.query('SELECT * FROM point_list WHERE `phone` = ? ', [rows[0].phone]);
            let check = rows[0].money;
            let point_list = point_lists[0];
            let get = 3000;
            if (check >= get && point_list.total2 != 0) {
                await connection.query('UPDATE users SET money = money + ? WHERE phone = ? ', [point_list.total2, rows[0].phone]);
                await connection.query('UPDATE point_list SET total2 = ? WHERE phone = ? ', [0, rows[0].phone]);
                return res.status(200).json({
                    message: `You just received ₹ ${point_list.total2}.00`,
                    status: true,
                    timeStamp: timeNow,
                });
            } else if (check < get && point_list.total2 != 0) {
                return res.status(200).json({
                    message: 'Please Recharge ₹ 3000 to claim gift.',
                    status: false,
                    timeStamp: timeNow,
                });
            } else if (point_list.total2 == 0) {
                return res.status(200).json({
                    message: 'You have already received this gift',
                    status: false,
                    timeStamp: timeNow,
                });
            }
        };
        if (data == 3) {
            const [point_lists] = await connection.query('SELECT * FROM point_list WHERE `phone` = ? ', [rows[0].phone]);
            let check = rows[0].money;
            let point_list = point_lists[0];
            let get = 6000;
            if (check >= get && point_list.total3 != 0) {
                await connection.query('UPDATE users SET money = money + ? WHERE phone = ? ', [point_list.total3, rows[0].phone]);
                await connection.query('UPDATE point_list SET total3 = ? WHERE phone = ? ', [0, rows[0].phone]);
                return res.status(200).json({
                    message: `You just received ₹ ${point_list.total3}.00`,
                    status: true,
                    timeStamp: timeNow,
                });
            } else if (check < get && point_list.total3 != 0) {
                return res.status(200).json({
                    message: 'Please Recharge ₹ 6000 to claim gift.',
                    status: false,
                    timeStamp: timeNow,
                });
            } else if (point_list.total3 == 0) {
                return res.status(200).json({
                    message: 'You have already received this gift',
                    status: false,
                    timeStamp: timeNow,
                });
            }
        };
        if (data == 4) {
            const [point_lists] = await connection.query('SELECT * FROM point_list WHERE `phone` = ? ', [rows[0].phone]);
            let check = rows[0].money;
            let point_list = point_lists[0];
            let get = 12000;
            if (check >= get && point_list.total4 != 0) {
                await connection.query('UPDATE users SET money = money + ? WHERE phone = ? ', [point_list.total4, rows[0].phone]);
                await connection.query('UPDATE point_list SET total4 = ? WHERE phone = ? ', [0, rows[0].phone]);
                return res.status(200).json({
                    message: `You just received ₹ ${point_list.total4}.00`,
                    status: true,
                    timeStamp: timeNow,
                });
            } else if (check < get && point_list.total4 != 0) {
                return res.status(200).json({
                    message: 'Please Recharge ₹ 12000 to claim gift.',
                    status: false,
                    timeStamp: timeNow,
                });
            } else if (point_list.total4 == 0) {
                return res.status(200).json({
                    message: 'You have already received this gift',
                    status: false,
                    timeStamp: timeNow,
                });
            }
        };
        if (data == 5) {
            const [point_lists] = await connection.query('SELECT * FROM point_list WHERE `phone` = ? ', [rows[0].phone]);
            let check = rows[0].money;
            let point_list = point_lists[0];
            let get = 28000;
            if (check >= get && point_list.total5 != 0) {
                await connection.query('UPDATE users SET money = money + ? WHERE phone = ? ', [point_list.total5, rows[0].phone]);
                await connection.query('UPDATE point_list SET total5 = ? WHERE phone = ? ', [0, rows[0].phone]);
                return res.status(200).json({
                    message: `You just received ₹ ${point_list.total5}.00`,
                    status: true,
                    timeStamp: timeNow,
                });
            } else if (check < get && point_list.total5 != 0) {
                return res.status(200).json({
                    message: 'Please Recharge ₹ 28000 to claim gift.',
                    status: false,
                    timeStamp: timeNow,
                });
            } else if (point_list.total5 == 0) {
                return res.status(200).json({
                    message: 'You have already received this gift',
                    status: false,
                    timeStamp: timeNow,
                });
            }
        };
        if (data == 6) {
            const [point_lists] = await connection.query('SELECT * FROM point_list WHERE `phone` = ? ', [rows[0].phone]);
            let check = rows[0].money;
            let point_list = point_lists[0];
            let get = 100000;
            if (check >= get && point_list.total6 != 0) {
                await connection.query('UPDATE users SET money = money + ? WHERE phone = ? ', [point_list.total6, rows[0].phone]);
                await connection.query('UPDATE point_list SET total6 = ? WHERE phone = ? ', [0, rows[0].phone]);
                return res.status(200).json({
                    message: `You just received ₹ ${point_list.total6}.00`,
                    status: true,
                    timeStamp: timeNow,
                });
            } else if (check < get && point_list.total6 != 0) {
                return res.status(200).json({
                    message: 'Please Recharge ₹ 100000 to claim gift.',
                    status: false,
                    timeStamp: timeNow,
                });
            } else if (point_list.total6 == 0) {
                return res.status(200).json({
                    message: 'You have already received this gift',
                    status: false,
                    timeStamp: timeNow,
                });
            }
        };
        if (data == 7) {
            const [point_lists] = await connection.query('SELECT * FROM point_list WHERE `phone` = ? ', [rows[0].phone]);
            let check = rows[0].money;
            let point_list = point_lists[0];
            let get = 200000;
            if (check >= get && point_list.total7 != 0) {
                await connection.query('UPDATE users SET money = money + ? WHERE phone = ? ', [point_list.total7, rows[0].phone]);
                await connection.query('UPDATE point_list SET total7 = ? WHERE phone = ? ', [0, rows[0].phone]);
                return res.status(200).json({
                    message: `You just received ₹ ${point_list.total7}.00`,
                    status: true,
                    timeStamp: timeNow,
                });

            } else if (check < get && point_list.total7 != 0) {
                return res.status(200).json({
                    message: 'Please Recharge ₹200000 to claim gift.',
                    status: false,
                    timeStamp: timeNow,
                });
            } else if (point_list.total7 == 0) {
                return res.status(200).json({
                    message: 'You have already received this gift',
                    status: false,
                    timeStamp: timeNow,
                });
            }
        };
    }

}

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

function timerJoin1(params = '', addHours = 0) {
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

    return years + '-' + months + '-' + days;
}

const promotion = async (req, res) => {
    let auth = req.body.authtoken;
    if (!auth) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        });
    }

    const [user] = await connection.query('SELECT `phone`, `code`,`invite`, `roses_f`, `roses_f1`, `roses_today`,`user_level` FROM users WHERE `token` = ? ', [md5(auth)]);
    const [level] = await connection.query('SELECT * FROM level');

    if (!user) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        });
    }

    let userInfo = user[0];

    // Directly referred level-1 users
    const [f1s] = await connection.query('SELECT `phone`, `code`,`invite`, `time` FROM users WHERE `invite` = ? ', [userInfo.code]);

    // Directly referred users today
    let f1_today = 0;
    for (let i = 0; i < f1s.length; i++) {
        const f1_time = f1s[i].time;
        let check = (timerJoin1(f1_time) == timerJoin1()) ? true : false;
        if (check) {
            f1_today += 1;
        }
    }

    // All direct referrals today
    let f_all_today = 0;
    for (let i = 0; i < f1s.length; i++) {
        const f1_code = f1s[i].code;
        const f1_time = f1s[i].time;
        let check_f1 = (timerJoin1(f1_time) == timerJoin1()) ? true : false;
        if (check_f1) f_all_today += 1;

        // Total level-2 referrals today
        const [f2s] = await connection.query('SELECT `phone`, `code`,`invite`, `time` FROM users WHERE `invite` = ? ', [f1_code]);
        for (let i = 0; i < f2s.length; i++) {
            const f2_code = f2s[i].code;
            const f2_time = f2s[i].time;
            let check_f2 = (timerJoin1(f2_time) == timerJoin1()) ? true : false;
            if (check_f2) f_all_today += 1;

            // Total level-3 referrals today
            const [f3s] = await connection.query('SELECT `phone`, `code`,`invite`, `time` FROM users WHERE `invite` = ? ', [f2_code]);
            for (let i = 0; i < f3s.length; i++) {
                const f3_code = f3s[i].code;
                const f3_time = f3s[i].time;
                let check_f3 = (timerJoin1(f3_time) == timerJoin1()) ? true : false;
                if (check_f3) f_all_today += 1;

                // Total level-4 referrals today
                const [f4s] = await connection.query('SELECT `phone`, `code`,`invite`, `time` FROM users WHERE `invite` = ? ', [f3_code]);
                for (let i = 0; i < f4s.length; i++) {
                    const f4_code = f4s[i].code;
                    const f4_time = f4s[i].time;
                    let check_f4 = (timerJoin1(f4_time) == timerJoin1()) ? true : false;
                    if (check_f4) f_all_today += 1;
                }
            }
        }
    }

    // Total level-2 referrals
    let f2 = 0;
    for (let i = 0; i < f1s.length; i++) {
        const f1_code = f1s[i].code;
        const [f2s] = await connection.query('SELECT `phone`, `code`,`invite` FROM users WHERE `invite` = ? ', [f1_code]);
        f2 += f2s.length;
    }

    // Total level-3 referrals
    let f3 = 0;
    for (let i = 0; i < f1s.length; i++) {
        const f1_code = f1s[i].code;
        const [f2s] = await connection.query('SELECT `phone`, `code`,`invite` FROM users WHERE `invite` = ? ', [f1_code]);
        for (let i = 0; i < f2s.length; i++) {
            const f2_code = f2s[i].code;
            const [f3s] = await connection.query('SELECT `phone`, `code`,`invite` FROM users WHERE `invite` = ? ', [f2_code]);
            if (f3s.length > 0) f3 += f3s.length;
        }
    }

    // Total level-4 referrals
    let f4 = 0;
    for (let i = 0; i < f1s.length; i++) {
        const f1_code = f1s[i].code;
        const [f2s] = await connection.query('SELECT `phone`, `code`,`invite` FROM users WHERE `invite` = ? ', [f1_code]);
        for (let i = 0; i < f2s.length; i++) {
            const f2_code = f2s[i].code;
            const [f3s] = await connection.query('SELECT `phone`, `code`,`invite` FROM users WHERE `invite` = ? ', [f2_code]);
            for (let i = 0; i < f3s.length; i++) {
                const f3_code = f3s[i].code;
                const [f4s] = await connection.query('SELECT `phone`, `code`,`invite` FROM users WHERE `invite` = ? ', [f3_code]);
                if (f4s.length > 0) f4 += f4s.length;
            }
        }
    }

    let selectedData = [];

    async function fetchInvitesByCode(code, depth = 1) {
        if (depth > 6) {
            return;
        }

        const [inviteData] = await connection.query('SELECT `id_user`,`name_user`,`phone`, `code`, `invite`, `rank`, `user_level`, `total_money` FROM users WHERE `invite` = ?', [code]);

        if (inviteData.length > 0) {
            for (const invite of inviteData) {
                selectedData.push(invite);
                await fetchInvitesByCode(invite.code, depth + 1);
            }
        }
    }

    if (f1s.length > 0) {
        for (const initialInfoF1 of f1s) {
            selectedData.push(initialInfoF1);
            await fetchInvitesByCode(initialInfoF1.code);
        }
    }

    const rosesF1 = parseFloat(userInfo.roses_f);
    const rosesAll = parseFloat(userInfo.roses_f1);
    let rosesAdd = rosesF1 + rosesAll;

    return res.status(200).json({
        message: 'Receive success',
        level: level,
        info: user,
        status: true,
        invite: {
            f1: f1s.length,
            total_f: selectedData.length,
            f1_today: f1_today,
            f_all_today: f_all_today,
            roses_f1: userInfo.roses_f1,
            roses_f: userInfo.roses_f,
            roses_all: rosesAdd,
            roses_today: userInfo.roses_today,
        },
        timeStamp: timeNow,
    });

}

const myTeam = async (req, res) => {
    let auth = req.body.authtoken;
    if (!auth) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        })
    }
    const [user] = await connection.query('SELECT `phone`, `code`,`invite` FROM users WHERE `token` = ? ', [md5(auth)]);
    const [level] = await connection.query('SELECT * FROM level');
    if (!user) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        });
    };
    return res.status(200).json({
        message: 'Receive success',
        level: level,
        info: user,
        status: true,
        timeStamp: timeNow,
    });

}

const listMyTeam = async (req, res) => {
    let auth = req.body.authtoken;
    if (!auth) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        })
    }
    const [user] = await connection.query('SELECT `phone`, `code`,`invite` FROM users WHERE `token` = ? ', [md5(auth)]);
    if (!user) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        });
    };
    let userInfo = user[0];
    const [f1] = await connection.query('SELECT `id_user`, `phone`, `code`, `invite`,`roses_f`, `rank`, `name_user`,`status`,`total_money`, `time` FROM users WHERE `invite` = ? ORDER BY id DESC', [userInfo.code]);
    const [mem] = await connection.query('SELECT `id_user`, `phone`, `time` FROM users WHERE `invite` = ? ORDER BY id DESC LIMIT 100', [userInfo.code]);
    const [total_roses] = await connection.query('SELECT `f1`,`invite`, `code`,`phone`,`time` FROM roses WHERE `invite` = ? ORDER BY id DESC LIMIT 100', [userInfo.code]);

    const selectedData = [];

    async function fetchUserDataByCode(code, depth = 1) {
        if (depth > 6) {
            return;
        }

        const [userData] = await connection.query('SELECT `id_user`, `name_user`, `phone`, `code`, `invite`, `rank`, `total_money` FROM users WHERE `invite` = ?', [code]);
        if (userData.length > 0) {
            for (const user of userData) {
                const [turnoverData] = await connection.query('SELECT `phone`, `daily_turn_over`, `total_turn_over` FROM turn_over WHERE `phone` = ?', [user.phone]);
                const [inviteCountData] = await connection.query('SELECT COUNT(*) as invite_count FROM users WHERE `invite` = ?', [user.code]);
                const inviteCount = inviteCountData[0].invite_count;

                const userObject = {
                    ...user,
                    invite_count: inviteCount,
                    user_level: depth,
                    daily_turn_over: turnoverData[0]?.daily_turn_over || 0,
                    total_turn_over: turnoverData[0]?.total_turn_over || 0,
                };

                selectedData.push(userObject);
                await fetchUserDataByCode(user.code, depth + 1);
            }
        }
    }

    await fetchUserDataByCode(userInfo.code);


    let newMem = [];
    mem.map((data) => {
        let objectMem = {
            id_user: data.id_user,
            phone: '91' + data.phone.slice(0, 1) + '****' + String(data.phone.slice(-4)),
            time: data.time,
        };

        return newMem.push(objectMem);
    });
    return res.status(200).json({
        message: 'Receive success',
        f1: selectedData,
        f1_direct: f1,
        mem: newMem,
        total_roses: total_roses,
        status: true,
        timeStamp: timeNow,
    });

}
const wowpay = async (req, res) => {
    let auth = req.body.authtoken;
    let money = req.body.money;

    // Fetching the user's mobile number from the database using auth token


    // Your existing controller code here
};

const recharge = async (req, res) => {
    let auth = req.body.access_token;
    let money = req.body.money;
    let type = req.body.type;
    let typeid = req.body.typeid;

    const minimumMoney = process.env.MINIMUM_MONEY

    if (type != 'cancel') {
        if (!auth || !money || money < minimumMoney - 1) {
            return res.status(200).json({
                message: 'Failed',
                status: false,
                timeStamp: timeNow,
            })
        }
    }
    const [user] = await connection.query('SELECT `phone`, `code`,`name_user`,`invite` FROM users WHERE `token` = ? ', [md5(auth)]);
    let userInfo = user[0];
    if (!user) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        });
    };
    if (type == 'cancel') {
        await connection.query('UPDATE recharge SET status = 2 WHERE phone = ? AND id_order = ? AND status = ? ', [userInfo.phone, typeid, 0]);
        return res.status(200).json({
            message: 'Cancelled order successfully',
            status: true,
            timeStamp: timeNow,
        });
    }
    const [recharge] = await connection.query('SELECT * FROM recharge WHERE phone = ? AND status = ? ', [userInfo.phone, 0]);

    if (recharge.length == 0) {
        let time = new Date().getTime();
        const date = new Date();
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
        let checkTime = timerJoin(time);
        let id_time = date.getUTCFullYear() + '' + date.getUTCMonth() + 1 + '' + date.getUTCDate();
        let id_order = Math.floor(Math.random() * (99999999999999 - 10000000000000 + 1)) + 10000000000000;
        // let vat = Math.floor(Math.random() * (2000 - 0 + 1) ) + 0;

        money = Number(money);
        let client_transaction_id = id_time + id_order;
        const formData = {
            username: process.env.accountBank,
            secret_key: process.env.secret_key,
            client_transaction: client_transaction_id,
            amount: money,
        }

        if (type == 'momo') {
            const sql = `INSERT INTO recharge SET 
            id_order = ?,
            transaction_id = ?,
            phone = ?,
            money = ?,
            type = ?,
            status = ?,
            today = ?,
            url = ?,
            time = ?`;
            await connection.execute(sql, [client_transaction_id, 'NULL', userInfo.phone, money, type, 0, checkTime, 'NULL', time]);
            const [recharge] = await connection.query('SELECT * FROM recharge WHERE phone = ? AND status = ? ', [userInfo.phone, 0]);
            return res.status(200).json({
                message: 'Received successfully',
                datas: recharge[0],
                status: true,
                timeStamp: timeNow,
            });
        }

        const moneyString = money.toString();

        const apiData = {
            key: "0c79da69-fdc1-4a07-a8b4-7135a0168385",
            client_txn_id: client_transaction_id,
            amount: moneyString,
            p_info: 'WINGO PAYMENT',
            customer_name: userInfo.name_user,
            customer_email: 'manas.xdr@gmail.com',
            customer_mobile: userInfo.phone,
            redirect_url: `https://247cashwin.cloud/wallet/verify/upi`,
            udf1: 'TIRANGA',
        };









        try {
            const apiResponse = await axios.post('https://api.ekqr.in/api/create_order', apiData);

            if (apiResponse.data.status == true) {
                const sql = `INSERT INTO recharge SET 
                id_order = ?,
                transaction_id = ?,
                phone = ?,
                money = ?,
                type = ?,
                status = ?,
                today = ?,
                url = ?,
                time = ?`;

                await connection.execute(sql, [client_transaction_id, '0', userInfo.phone, money, type, 0, checkTime, '0', timeNow]);

                const [recharge] = await connection.query('SELECT * FROM recharge WHERE phone = ? AND status = ? ', [userInfo.phone, 0]);

                return res.status(200).json({
                    message: 'Received successfully',
                    datas: recharge[0],
                    payment_url: apiResponse.data.data.payment_url,
                    status: true,
                    timeStamp: timeNow,
                });
            } else {
                return res.status(500).json({ message: 'Failed to create order', status: false });
            }
        } catch (error) {
            return res.status(500).json({ message: 'API request failed', status: false });
        }
    } else {
        return res.status(200).json({
            message: 'Received successfully',
            datas: recharge[0],
            status: true,
            timeStamp: timeNow,
        });
    }
}


const cancelRecharge = async (req, res) => {
    try {
        let auth = req.body.authtoken;

        if (!auth) {
            return res.status(200).json({
                message: 'Authorization is required to access this API!',
                status: false,
                timeStamp: timeNow,
            })
        }

        const [user] = await connection.query('SELECT `phone`, `code`,`name_user`,`invite` FROM users WHERE `token` = ? ', [md5(auth)]);

        if (!user) {
            return res.status(200).json({
                message: 'Authorization is required to access this API!',
                status: false,
                timeStamp: timeNow,
            })
        }

        let userInfo = user[0];

        const result = await connection.query('DELETE FROM recharge WHERE phone = ? AND status = ?', [userInfo.phone, 0]);

        if (result.affectedRows > 0) {
            return res.status(200).json({
                message: 'All the pending recharges has been deleted successfully!',
                status: true,
                timeStamp: timeNow,
            })
        } else {
            return res.status(200).json({
                message: 'There was no pending recharges for this user or delete operation has been failed!',
                status: true,
                timeStamp: timeNow,
            })
        }
    } catch (error) {
        console.error("API error: ", error)
        return res.status(500).json({
            message: 'API Request failed!',
            status: false,
            timeStamp: timeNow,
        })
    }
}


const addBank = async (req, res) => {
    let auth = req.body.access_token;
    let name_bank = req.body.name_bank;
    let name_user = req.body.name_user;
    let stk = req.body.stk;
    let email = req.body.email;
    let sdt = req.body.sdt;
    let tinh = req.body.tinh;
   
    let time = new Date().getTime();

    if (!auth || !name_bank || !name_user || !stk || !email || !stk || !tinh ) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        })
    }
    const [user] = await connection.query('SELECT `phone`, `code`,`invite` FROM users WHERE `token` = ? ', [md5(auth)]);
    let userInfo = user[0];
    if (!user) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        });
    };
    const [user_bank] = await connection.query('SELECT * FROM user_bank WHERE tinh = ? ', [tinh]);
    const [user_bank2] = await connection.query('SELECT * FROM user_bank WHERE phone = ? ', [userInfo.phone]);
    if (user_bank.length == 0 && user_bank2.length == 0) {
        const sql = `INSERT INTO user_bank SET 
        phone = ?,
        name_bank = ?,
        name_user = ?,
        stk = ?,
        email = ?,
        sdt = ?,
        tinh = ?,
        
        time = ?`;
        await connection.execute(sql, [userInfo.phone, name_bank, name_user, stk, email, sdt, tinh, time]);
        return res.status(200).json({
            message: 'Successfully added bank',
            status: true,
            timeStamp: timeNow,
        });
    } else if (user_bank.length == 0) {
        await connection.query('UPDATE user_bank SET tinh = ? WHERE phone = ? ', [tinh, userInfo.phone]);
        return res.status(200).json({
            message: 'KYC Already Done',
            status: false,
            timeStamp: timeNow,
        });
    } else if (user_bank2.length > 0) {
        await connection.query('UPDATE user_bank SET name_bank = ?, name_user = ?, stk = ?, email = ?, sdt = ?, tinh = ?, time = ? WHERE phone = ?', [name_bank, name_user, stk, email, sdt, tinh, time, userInfo.phone]);
        return res.status(200).json({
            message: 'your account is updated',
            status: false,
            timeStamp: timeNow,
        });
    }

}

const infoUserBank = async (req, res) => {
    let auth = req.body.access_token;
    let b_type = req.body.bank_type;
    if (!auth) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        })
    }
    const [user] = await connection.query('SELECT `phone`, `code`,`invite`, `money` FROM users WHERE `token` = ? ', [md5(auth)]);
    let userInfo = user[0];
    if (!user) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        });
    };
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
    let date = new Date().getTime();
    let checkTime = timerJoin(date);
    const [recharge] = await connection.query('SELECT * FROM recharge WHERE phone = ? AND status = 1', [userInfo.phone]);
    const [minutes_1] = await connection.query('SELECT * FROM minutes_1 WHERE phone = ?', [userInfo.phone]);
    const [d5_minute] = await connection.query('SELECT * FROM result_5d WHERE phone = ?', [userInfo.phone]);
    const [k3_minute] = await connection.query('SELECT * FROM result_k3 WHERE phone = ?', [userInfo.phone]);
    const [trx_minute] = await connection.query('SELECT * FROM trx_wingo_bets WHERE phone = ?', [userInfo.phone]);
    let total = 0;

    recharge.forEach((data) => {
        total += parseFloat(data.money);
    });

    let total2 = 0;
    let total_w = 0;
    let total_k3 = 0;
    let total_5d = 0;
    let total_trx = 0;
    let total_w_fee = 0;
    let total_k3_fee = 0;
    let total_5d_fee = 0;
    let total_trx_fee = 0;
    let fee = 0;
    minutes_1.forEach((data) => {
        total_w += parseFloat(data.money);
        total_w_fee += parseFloat(data.fee);
    });
    k3_minute.forEach((data) => {
        total_k3 += parseFloat(data.money);
        total_k3_fee += parseFloat(data.fee);
    });
    d5_minute.forEach((data) => {
        total_5d += parseFloat(data.money);
        total_5d_fee += parseFloat(data.fee);
    });
    trx_minute.forEach((data) => {
        total_trx += parseFloat(data.money);
        total_trx_fee += parseFloat(data.fee);
    });
    total2 += parseInt(total_w) + parseInt(total_k3) + parseInt(total_5d) + parseInt(total_trx);
    fee += parseInt(total_w_fee) + parseInt(total_k3_fee) + parseInt(total_5d_fee) + parseInt(total_trx_fee);

    let result = 0;
    if (total - total2 > 0) result = total - total2 - fee;
    result = Math.max(result, 0);

    var [userBank] = '';
    if(b_type == "Bank")
    {
        [userBank] = await connection.query('SELECT * FROM user_bank WHERE phone = ?', [userInfo.phone]);
    }
    else if(b_type == "Pi")
    {
        [userBank] = await connection.query('SELECT * FROM user_bank WHERE phone = ? AND `name_bank` = ?', [userInfo.phone,'Pi_pay']);
    }
    return res.status(200).json({
        message: 'Received successfully',
        datas: userBank,
        userInfo: user,
        result: result,
        status: true,
        timeStamp: timeNow,
    });
}

const withdrawal3 = async (req, res) => {
    let auth = req.body.access_token;
    let money = req.body.money;
    let password = req.body.password;
    let with_type = req.body.pay_type;
    let otp_val1 = req.body.otp_val;
    let otp_active1 = req.body.otp_active;
    if (!auth || !money || money < 299) {
        return res.status(200).json({
            message: 'Minimum Amount Should be 300',
            status: false,
            timeStamp: timeNow,
        })
    }
    const [user] = await connection.query('SELECT `id`,`phone`, `code`,`invite`, `money`,`name_user`,`dial_code`,`plain_password` FROM users WHERE `token` = ?', [md5(auth)]);
    if(with_type == "Bank")
        {
            const [user_bank2] = await connection.query('SELECT * FROM user_bank WHERE phone = ? ', [user[0].phone]);
            if ( user_bank2.length == 0) {
                return res.status(200).json({
                    message: 'Add Bank Details',
                    status: false,
                    timeStamp: timeNow,
                });
            }
            else{
                var message2 = await widthProcess(user[0].phone,user[0].money, money,'bank',user[0].plain_password,user[0].id);
                if( message2 == "Withdrawal successful")
                {
                res.status(200).json({
                    message: message2,
                    bank_sucess:"sucess",
                    status: true,
                    timeStamp: timeNow,
                });
            }
            else{
                res.status(200).json({
                    message: message2,
                    status: false,
                    timeStamp: timeNow,
                });
            }
            }
        }
        else if(with_type == "Pi")
            {
                if (user[0].name_user.length == 0) {
                    return res.status(200).json({
                        message: 'Update Profile with Phone Number',
                        status: false,
                        timeStamp: timeNow,
                    });
                }
                else{
                    if(otp_active1 == 1)
                    {
                        var message1 = await widthProcess(user[0].phone,user[0].money, money,'pi',user[0].plain_password,user[0].id);
                        
                        if( message1 == "Withdrawal successful")
                        {
                            res.status(200).json({
                                message: message1,
                                pi_sucess:"sucess",
                                status: true,
                                timeStamp: timeNow,
                                });
                        }
                        else{
                            res.status(200).json({
                                message: message1,
                                status: false,
                                timeStamp: timeNow,
                            });
                        }     
                    }
                    else{
                    return res.status(200).json({
                        message: 'Please enter OTP.',
                        phone: user[0].name_user,
                        c_code: user[0].dial_code,
                        status: false,
                        timeStamp: timeNow,
                    });  
                }
                }
            }

}



const widthProcess = async (phone,us_money, add_money,w_type,userid,db_uid) =>
{
    var message = "";
    const date = new Date();
    let id_time = date.getUTCFullYear() + '' + date.getUTCMonth() + 1 + '' + date.getUTCDate();
    let id_order = Math.floor(Math.random() * (99999999999999 - 10000000000000 + 1)) + 10000000000000;

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
    let dates = new Date().getTime();
    let checkTime = timerJoin(dates);
    const [recharge] = await connection.query('SELECT * FROM recharge WHERE phone = ? AND status = 1', [phone]);
    const [minutes_1] = await connection.query('SELECT * FROM minutes_1 WHERE phone = ?', [phone]);
    const [k3_bet_money] = await connection.query('SELECT * FROM result_k3 WHERE phone = ?', [phone]);
    const [d5_bet_money] = await connection.query('SELECT * FROM result_5d WHERE phone = ?', [phone]);
    const [trx_bet_money] = await connection.query('SELECT * FROM trx_wingo_bets WHERE phone = ?', [phone]);
    let total = 0;
    recharge.forEach((data) => {
        total += parseFloat(data.money);
    });
    let total2 = 0;
    let total_w = 0;
    let total_k3 = 0;
    let total_5d = 0;
    let total_trx = 0;
    minutes_1.forEach((data) => {
        total_w += parseFloat(data.money);
    });
    k3_bet_money.forEach((data) => {
        total_k3 += parseFloat(data.money);
    });
    d5_bet_money.forEach((data) => {
        total_5d += parseFloat(data.money);
    });
    trx_bet_money.forEach((data) => {
        total_trx += parseFloat(data.money);
    });
    total2 += parseInt(total_w) + parseInt(total_k3) + parseInt(total_5d) + parseInt(total_trx);
    let result = 0;
    console.log("total wingo betting");
    console.log(total_w);
    console.log("total 5d betting");
    console.log(total_k3);
    console.log("total k3 betting");
    console.log(total_5d);
    console.log("total trx betting");
    console.log(total_trx);
    if (total - total2 > 0) result = total - total2;
    result = Math.max(result, 0);
    let result2 = parseInt ((parseInt(total) * 80)/100);
    console.log("total betting amount");
    console.log(total2);
    console.log("total recharge amount");
    console.log(total);
    console.log("80% recharge amount");
    console.log(result2);
    console.log("balanced recharge amount");
    console.log(result);
    const [user_bank] = await connection.query('SELECT * FROM user_bank WHERE `phone` = ?', [phone]);
    const [withdraw] = await connection.query('SELECT * FROM withdraw WHERE `phone` = ? AND today = ?', [phone, checkTime]);
        if (withdraw.length < 3) {
            if (parseInt(us_money) - parseInt(add_money) >= 0) {
                if (total2 >= result2) {
                    if (total - total2 >= 0) {
                        if (result == 0) {
                            message = 'The total bet is not enough to fulfill the request';
                        }
                        else{
                            let infoBank = user_bank[0];
                            if(w_type == 'bank')
                            {
                                if (user_bank.length != 0) {
                            const sql = `INSERT INTO withdraw SET 
                        id_order = ?,
                        phone = ?,
                        money = ?,
                        stk = ?,
                        name_bank = ?,
                        ifsc = ?,
                        name_user = ?,
                        status = ?,
                        today = ?,
                        time = ?,
                        type = ?,
                        with_type = ?`;
                            await connection.execute(sql, [id_time + '' + id_order, phone, add_money, infoBank.stk, infoBank.name_bank, infoBank.email, infoBank.name_user, 0, checkTime, dates,'manual',w_type]);
                            await connection.query('UPDATE users SET money = money - ? WHERE phone = ? ', [parseInt(add_money), phone]);
                            let withdrdesc = "Amount of "+ add_money + " have been transferred successfully.";
                            let sql_noti1 = "INSERT INTO notification SET recipient = ?, description = ?, isread = ?, noti_type = ?";
                            await connection.query(sql_noti1, [parseInt(db_uid), withdrdesc , "0", "Withdraw"]);
                            message = 'Withdrawal successful';
                        } else {
                            message =  'Please link your bank first';
                         
                        }
                        }
                            else if(w_type == 'pi')
                                {
                                    try{
                                    var pi_amount = parseFloat(parseFloat(add_money).toFixed(4) / parseFloat(pi_exchange_rate).toFixed(4)).toFixed(4);
                                
                                    const userUid = userid;
                                    const paymentData = {
                                        amount: parseFloat(pi_amount).toFixed(4),
                                        memo: "payment withdraw for cloudyscape app", // this is just an example
                                        metadata: {productId: "automate withdraw"},
                                        uid: userUid
                                    }
                                    //const canId = await pi.cancelPayment("wSXCxk8lWJwn914Vel0WOGRAbpYL");
                                    const paymentId = await pi.createPayment(paymentData);
                                    const txid = await pi.submitPayment(paymentId);
                                    const completedPayment = await pi.completePayment(paymentId, txid);
                                    var block_link = completedPayment.transaction._link.replace("https://api.testnet.minepi.com/",pi_block_link);
                                    const sql = `INSERT INTO withdraw SET 
                        id_order = ?,
                        phone = ?,
                        money = ?,
                        stk = ?,
                        name_bank = ?,
                        ifsc = ?,
                        name_user = ?,
                        status = ?,
                        today = ?,
                        time = ?,
                        type = ?,
                        with_type = ?`;
                        
                            await connection.execute(sql, [id_time + '' + id_order, phone, parseFloat(add_money).toFixed(4).toString(), txid, paymentId, completedPayment.transaction._link, "", completedPayment.transaction.verified, checkTime, dates,'manual',w_type]);
                            await connection.query('UPDATE users SET money = money - ? WHERE phone = ? ', [parseFloat(add_money).toFixed(4).toString(), phone]);
                            let sql_noti1 = "INSERT INTO notification SET recipient = ?, description = ?, isread = ?, noti_type = ?";
                            let withdrdesc = "<span>Your withdrawal of sum "+parseFloat(pi_amount).toFixed(4).toString()+" Has been processed at "+completedPayment.created_at.toString()+" And transaction reference is <a href="+block_link+" target='_blank' style='color:rgb(89, 176, 234);'>Blockchain Transaction</a></span>" ;
                            await connection.query(sql_noti1, [parseInt(db_uid), withdrdesc , "0", "Withdraw"]);
                                const [user_bank_pi] = await connection.query('SELECT * FROM user_bank WHERE phone = ?  AND name_bank = ? ', [phone, 'Pi_pay' ]);
                                    if ( user_bank_pi.length == 0) {
                                        const sql = `INSERT INTO user_bank SET 
                                        phone = ?,
                                        name_bank = ?,
                                        name_user = ?,
                                        stk = ?,
                                        email = ?,
                                        sdt = ?,
                                        tinh = ?,
                                        
                                        time = ?`;
                                        await connection.execute(sql, [phone, 'Pi_pay' , "", completedPayment.to_address.toString(), "", completedPayment.user_uid.toString(), "", checkTime]);
                                    }
                                    message = 'Withdrawal successful';
                                }
                                catch(e)
                                {
                                    //message = 'Too Many Payments. Please try again later'; 
                                    message = e.toString();
                                }
                        }        
                        }
                    } else {
                        let infoBank = user_bank[0];
                            if(w_type == 'bank')
                            {
                                if (user_bank.length != 0) {
                            const sql = `INSERT INTO withdraw SET 
                        id_order = ?,
                        phone = ?,
                        money = ?,
                        stk = ?,
                        name_bank = ?,
                        ifsc = ?,
                        name_user = ?,
                        status = ?,
                        today = ?,
                        time = ?,
                        type = ?,
                        with_type = ?`;
                            await connection.execute(sql, [id_time + '' + id_order, phone, add_money, infoBank.stk, infoBank.name_bank, infoBank.email, infoBank.name_user, 0, checkTime, dates,'manual',w_type]);
                            await connection.query('UPDATE users SET money = money - ? WHERE phone = ? ', [add_money, phone]);
                            let withdrdesc = "Amount of "+ add_money + " have been transferred successfully.";
                            let sql_noti1 = "INSERT INTO notification SET recipient = ?, description = ?, isread = ?, noti_type = ?";
                            await connection.query(sql_noti1, [parseInt(db_uid), withdrdesc , "0", "Withdraw"]);
                            message = 'Withdrawal successful';
                        } else {
                            message =  'Please link your bank first';
                         
                        }
                        }
                        else if(w_type == 'pi')
                            {
                                try{
                                var pi_amount = parseFloat(parseFloat(add_money).toFixed(4) / parseFloat(pi_exchange_rate).toFixed(4)).toFixed(4);
                            
                                const userUid = userid;
                                const paymentData = {
                                    amount: parseFloat(pi_amount).toFixed(4),
                                    memo: "payment withdraw for cloudyscape app", // this is just an example
                                    metadata: {productId: "automate withdraw"},
                                    uid: userUid
                                }
                                //const canId = await pi.cancelPayment("wSXCxk8lWJwn914Vel0WOGRAbpYL");
                                const paymentId = await pi.createPayment(paymentData);
                                const txid = await pi.submitPayment(paymentId);
                                const completedPayment = await pi.completePayment(paymentId, txid);
                                // console.log("Transaction Link");
                                // console.log(completedPayment.transaction._link);
                                // console.log("Environmental Link");
                                // console.log(pi_block_link);
                                // console.log("Replaced Link");
                                // console.log(completedPayment.transaction._link.replace("https://api.testnet.minepi.com/",pi_block_link))
                                var block_link = completedPayment.transaction._link.replace("https://api.testnet.minepi.com/",pi_block_link);
                                const sql = `INSERT INTO withdraw SET 
                    id_order = ?,
                    phone = ?,
                    money = ?,
                    stk = ?,
                    name_bank = ?,
                    ifsc = ?,
                    name_user = ?,
                    status = ?,
                    today = ?,
                    time = ?,
                    type = ?,
                    with_type = ?`;
                    
                        await connection.execute(sql, [id_time + '' + id_order, phone, parseFloat(add_money).toFixed(4).toString(), txid, paymentId, completedPayment.transaction._link, "", completedPayment.transaction.verified, checkTime, dates,'manual',w_type]);
                        await connection.query('UPDATE users SET money = money - ? WHERE phone = ? ', [parseFloat(add_money).toFixed(4).toString(), phone]);
                        let sql_noti1 = "INSERT INTO notification SET recipient = ?, description = ?, isread = ?, noti_type = ?";
                        let withdrdesc = "<span>Your withdrawal of sum "+parseFloat(pi_amount).toFixed(4).toString()+" Has been processed at "+completedPayment.created_at.toString()+" And transaction reference is <a href="+block_link+" target='_blank' style='color:rgb(89, 176, 234);'>Blockchain Transaction</a></span>" ;
                        await connection.query(sql_noti1, [parseInt(db_uid), withdrdesc , "0", "Withdraw"]);
                            const [user_bank_pi] = await connection.query('SELECT * FROM user_bank WHERE phone = ?  AND name_bank = ? ', [phone, 'Pi_pay' ]);
                                if ( user_bank_pi.length == 0) {
                                    const sql = `INSERT INTO user_bank SET 
                                    phone = ?,
                                    name_bank = ?,
                                    name_user = ?,
                                    stk = ?,
                                    email = ?,
                                    sdt = ?,
                                    tinh = ?,
                                    
                                    time = ?`;
                                    await connection.execute(sql, [phone, 'Pi_pay' , "", completedPayment.to_address.toString(), "", completedPayment.user_uid.toString(), "", checkTime]);
                                }
                                message = 'Withdrawal successful';
                            }
                            catch(e)
                            {
                                //message = 'Too Many Payments. Please try again later'; 
                                message = e.toString();
                            }
                    }        
                    }
                } else {
                    message = 'The total bet is not enough to fulfill the request';
                }
            } else {
                message = 'The balance is not enough to fulfill the request';
             
            }
        } else {
            message =   'You can only make 2 withdrawals per day';
        }
    
    return message ;
}
const transfer = async (req, res) => {
    let auth = req.body.authtoken;
    let amount = req.body.amount;
    let receiver_phone = req.body.phone;
    const date = new Date();
    // let id_time = date.getUTCFullYear() + '' + (date.getUTCMonth() + 1) + '' + date.getUTCDate();
    let id_order = Math.floor(Math.random() * (99999999999999 - 10000000000000 + 1)) + 10000000000000;
    let time = new Date().getTime();
    let client_transaction_id = id_order;

    const [user] = await connection.query('SELECT `id`,`phone`,`money`, `code`,`invite` FROM users WHERE `token` = ? ', [md5(auth)]);
    let userInfo = user[0];
    let sender_phone = userInfo.phone;
    let sender_money = parseInt(userInfo.money);
    if (!user) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        });
    };

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

    let dates = new Date().getTime();
    let checkTime = timerJoin(dates);
    const [recharge] = await connection.query('SELECT * FROM recharge WHERE phone = ? AND status = 1 ', [userInfo.phone]);
    const [minutes_1] = await connection.query('SELECT * FROM minutes_1 WHERE phone = ? ', [userInfo.phone]);
    const [k3_bet_money] = await connection.query('SELECT * FROM result_k3 WHERE phone = ?', [userInfo.phone]);
    const [d5_bet_money] = await connection.query('SELECT * FROM result_5d WHERE phone = ?', [userInfo.phone]);
    const [trx_bet_money] = await connection.query('SELECT * FROM trx_wingo_bets WHERE phone = ?', [userInfo.phone]);
    let total = 0;
    recharge.forEach((data) => {
        total += parseFloat(data.money);
    });
    let total2 = 0;
    let total_w = 0;
    let total_k3 = 0;
    let total_5d = 0;
    let total_trx = 0;
    minutes_1.forEach((data) => {
        total_w += parseFloat(data.money);
    });
    k3_bet_money.forEach((data) => {
        total_k3 += parseFloat(data.money);
    });
    d5_bet_money.forEach((data) => {
        total_5d += parseFloat(data.money);
    });
    trx_bet_money.forEach((data) => {
        total_trx += parseFloat(data.money);
    });
    total2 += parseInt(total_w) + parseInt(total_k3) + parseInt(total_5d)+ parseInt(total_trx);

    let result = 0;
    if (total - total2 > 0) result = total - total2;
    let result2 = parseInt ((parseInt(total) * 80)/100)
    if (total2 >= result2) {
        if (sender_money >= amount) {
            let [receiver] = await connection.query('SELECT * FROM users WHERE `phone` = ?', [receiver_phone]);
            if (receiver.length === 1 && sender_phone !== receiver_phone) {
                let money = sender_money - amount;
                let total_money = amount + receiver[0].total_money;
                let trans_mode = '';
                const [admin_user] = await connection.query('SELECT * FROM users WHERE level = ? ', [1]);
                let adminInfo = admin_user[0];
                const [ad_rows] = await connection.query('SELECT transfer_mode FROM bank_recharge WHERE `phone` = ? ', [adminInfo.phone]);
                trans_mode = ad_rows[0].transfer_mode; 
                if(trans_mode == 'instant')
                {
                    await connection.query('UPDATE users SET money = ? WHERE phone = ?', [money, sender_phone]);
                    await connection.query(`UPDATE users SET money = money + ? WHERE phone = ?`, [amount, receiver_phone]);
                    const sql = "INSERT INTO balance_transfer (sender_phone, receiver_phone, amount) VALUES (?, ?, ?)";
                    await connection.execute(sql, [sender_phone, receiver_phone, amount]);
                    const sql_recharge = "INSERT INTO recharge (id_order, transaction_id, phone, money, type, status, today, url, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    await connection.execute(sql_recharge, [client_transaction_id, 0, receiver_phone, amount, 'wallet', 1, checkTime, 0, time]);
                    const sql_recharge_with = "INSERT INTO withdraw (id_order, phone, money, stk, name_bank, name_user, ifsc, sdt, tp, status, today, time, type,with_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?)";
                    await connection.execute(sql_recharge_with, [client_transaction_id, sender_phone, amount,0,0,0,0,0,0, 1, checkTime, time,trans_mode,'transfer']);
                    let sql_noti = 'INSERT INTO notification SET recipient = ?, description = ?, isread = ?, noti_type = ?';
                    await connection.query(sql_noti, [receiver[0]?.id, "Congrates! you received an reward of "+amount+" from your friend " + userInfo.code +".", '0', "Recharge"]);
                    let sql_noti1 = "INSERT INTO notification SET recipient = ?, description = ?, isread = ?, noti_type = ?";
                    let withdrdesc = "Amount of "+ amount + " have been transferred successfully.";
                    await connection.query(sql_noti1, [userInfo.id, withdrdesc , "0", "Withdraw"]);
                    return res.status(200).json({
                        message: `Requested ${amount} sent successfully`,
                        curr_user_m:money,
                        transfer_mode:trans_mode,
                        status: true,
                        timeStamp: timeNow,
                    });
                    
                }
                else{
                    const sql_recharge_with = "INSERT INTO withdraw (id_order, phone, money, stk, name_bank, name_user, ifsc, sdt, tp, status, today, time, type,with_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?)";
                    await connection.execute(sql_recharge_with, [client_transaction_id, sender_phone, amount,0,0,0,0,0,0, 0, checkTime, time,trans_mode,'transfer']);
                    const sql = "INSERT INTO balance_transfer (sender_phone, receiver_phone, amount) VALUES (?, ?, ?)";
                    await connection.execute(sql, [sender_phone, receiver_phone, amount]);
                    const sql_recharge = "INSERT INTO recharge (id_order, transaction_id, phone, money, type, status, today, url, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    await connection.execute(sql_recharge, [client_transaction_id, 0, receiver_phone, amount, 'wallet', 0, checkTime, 0, time]);
                    let sql_noti = 'INSERT INTO notification SET recipient = ?, description = ?, isread = ?, noti_type = ?';
                    await connection.query(sql_noti, [userInfo.id, "Balance Transfer of Amount "+amount+" Initiated Successfully.", '0', "Transfer"]);
                    return res.status(200).json({
                        message: `Waiting for admin approval`,
                        curr_user_m:money,
                        transfer_mode:trans_mode,
                        status: true,
                        timeStamp: timeNow,
                    });
                }
            } else {
                return res.status(200).json({
                    message: `${receiver_phone} is not a valid user mobile number`,
                    status: false,
                    timeStamp: timeNow,
                });
            }
        } else {
            return res.status(200).json({
                message: 'Your balance is not enough',
                status: false,
                timeStamp: timeNow,
            });
        }
    }
    else {
        return res.status(200).json({
            message: 'The total bet is not enough to fulfill the request',
            status: false,
            timeStamp: timeNow,
        });
    }
}

// get transfer balance data 
const transferHistory = async (req, res) => {
    let auth = req.body.authtoken;

    const [user] = await connection.query('SELECT `phone`,`money`, `code`,`invite` FROM users WHERE `token` = ? ', [md5(auth)]);
    let userInfo = user[0];
    if (!user) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        });
    };
    const [history] = await connection.query('SELECT * FROM balance_transfer WHERE sender_phone = ?', [userInfo.phone]);
    const [receive] = await connection.query('SELECT * FROM balance_transfer WHERE receiver_phone = ?', [userInfo.phone]);
    if (receive.length > 0 || history.length > 0) {
        return res.status(200).json({
            message: 'Success',
            receive: receive,
            datas: history,
            status: true,
            timeStamp: timeNow,
        });
    }
}
const recharge2 = async (req, res) => {
    let auth = req.body.authtoken;
    let money = req.body.money;
    if (!auth) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        })
    }
    const [user] = await connection.query('SELECT `phone`, `code`,`invite` FROM users WHERE `token` = ? ', [md5(auth)]);
    let userInfo = user[0];
    if (!user) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        });
    };
    const [recharge] = await connection.query('SELECT * FROM recharge WHERE phone = ? AND status = ? ', [userInfo.phone, 0]);
    const [bank_recharge] = await connection.query('SELECT * FROM bank_recharge');
    if (recharge.length != 0) {
        return res.status(200).json({
            message: 'Received successfully',
            datas: recharge[0],
            infoBank: bank_recharge,
            status: true,
            timeStamp: timeNow,
        });
    } else {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        });
    }
}

const listRecharge = async (req, res) => {
    let auth = req.body.access_token;
    if (!auth) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        })
    }
    const [user] = await connection.query('SELECT `phone`, `code`,`invite` FROM users WHERE `token` = ? ', [md5(auth)]);
    let userInfo = user[0];
    if (!user) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        });
    };
    const [recharge] = await connection.query('SELECT * FROM recharge WHERE phone = ? ORDER BY id DESC ', [userInfo.phone]);
    return res.status(200).json({
        message: 'Receive success',
        datas: recharge,
        status: true,
        timeStamp: timeNow,
    });
}

const search = async (req, res) => {
    let auth = req.body.authtoken;
    let phone = req.body.phone;
    if (!auth) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        })
    }
    const [user] = await connection.query('SELECT `phone`, `code`,`invite`, `level` FROM users WHERE `token` = ? ', [md5(auth)]);
    if (user.length == 0) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        });
    };
    let userInfo = user[0];
    if (userInfo.level == 1) {
        const [users] = await connection.query(`SELECT * FROM users WHERE phone = ? ORDER BY id DESC `, [phone]);
        return res.status(200).json({
            message: 'Receive success',
            datas: users,
            status: true,
            timeStamp: timeNow,
        });
    } else if (userInfo.level == 2) {
        const [users] = await connection.query(`SELECT * FROM users WHERE phone = ? ORDER BY id DESC `, [phone]);
        if (users.length == 0) {
            return res.status(200).json({
                message: 'Receive success',
                datas: [],
                status: true,
                timeStamp: timeNow,
            });
        } else {
            if (users[0].ctv == userInfo.phone) {
                return res.status(200).json({
                    message: 'Receive success',
                    datas: users,
                    status: true,
                    timeStamp: timeNow,
                });
            } else {
                return res.status(200).json({
                    message: 'Failed',
                    status: false,
                    timeStamp: timeNow,
                });
            }
        }
    } else {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        });
    }
}


const listWithdraw = async (req, res) => {
    let auth = req.body.access_token;
    if (!auth) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        })
    }
    const [user] = await connection.query('SELECT `phone`, `code`,`invite` FROM users WHERE `token` = ? ', [md5(auth)]);
    let userInfo = user[0];
    if (!user) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        });
    };
    const [recharge] = await connection.query('SELECT * FROM withdraw WHERE phone = ? ORDER BY id DESC ', [userInfo.phone]);
    return res.status(200).json({
        message: 'Receive success',
        datas: recharge,
        status: true,
        timeStamp: timeNow,
    });
}

const getnotificationCount = async (req, res) => {
    let auth = req.body.authtoken;
    if (!auth) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
            N_Count: 0,
        });
    }
    let [user] = await connection.query('SELECT * FROM users WHERE `token` = ?', [md5(auth)]);
    const [notifications] = await connection.query(`SELECT COUNT(id) as total FROM notification WHERE recipient  = ? AND isread = ? `,[user[0]?.id, '0']);

    let countNot = notifications[0].total;
    
    return res.status(200).json({
            message: 'Success',
            status: true,
            N_Count: countNot,
        });
}


const useRedenvelope = async (req, res) => {
    let auth = req.body.authtoken;
    let code = req.body.code;
    if (!auth || !code) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        })
    }
    const [user] = await connection.query('SELECT `phone`, `code`,`invite` FROM users WHERE `token` = ? ', [md5(auth)]);
    let userInfo = user[0];
    if (!user) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        });
    };
    const [redenvelopes] = await connection.query(
        'SELECT * FROM redenvelopes WHERE id_redenvelope = ?', [code]);

    if (redenvelopes.length == 0) {
        return res.status(200).json({
            message: 'Redemption code error',
            status: false,
            timeStamp: timeNow,
        });
    } else {
        let infoRe = redenvelopes[0];
        const d = new Date();
        const time = d.getTime();
        if (infoRe.status == 0) {
            await connection.query('UPDATE redenvelopes SET used = ?, status = ? WHERE `id_redenvelope` = ? ', [0, 1, infoRe.id_redenvelope]);
            await connection.query('UPDATE users SET money = money + ? WHERE `phone` = ? ', [infoRe.money, userInfo.phone]);
            let sql = 'INSERT INTO redenvelopes_used SET phone = ?, phone_used = ?, id_redenvelops = ?, money = ?, `time` = ? ';
            await connection.query(sql, [infoRe.phone, userInfo.phone, infoRe.id_redenvelope, infoRe.money, time]);
            return res.status(200).json({
                message: `Received successfully +${infoRe.money}`,
                status: true,
                timeStamp: timeNow,
            });
        } else {
            return res.status(200).json({
                message: 'Gift code already used',
                status: false,
                timeStamp: timeNow,
            });
        }
    }
}

const callback_bank = async (req, res) => {
    let transaction_id = req.body.transaction_id;
    let client_transaction_id = req.body.client_transaction_id;
    let amount = req.body.amount;
    let requested_datetime = req.body.requested_datetime;
    let expired_datetime = req.body.expired_datetime;
    let payment_datetime = req.body.payment_datetime;
    let status = req.body.status;
    if (!transaction_id) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        })
    }
    if (status == 2) {
        await connection.query(`UPDATE recharge SET status = 1 WHERE id_order = ?`, [client_transaction_id]);
        const [info] = await connection.query(`SELECT * FROM recharge WHERE id_order = ?`, [client_transaction_id]);
        await connection.query('UPDATE users SET money = money + ?, total_money = total_money + ? WHERE phone = ? ', [info[0].money, info[0].money, info[0].phone]);
        return res.status(200).json({
            message: 0,
            status: true,
        });
    } else {
        await connection.query(`UPDATE recharge SET status = 2 WHERE id = ?`, [id]);

        return res.status(200).json({
            message: 'Cancellation successful',
            status: true,
            datas: recharge,
        });
    }
}


const confirmRecharge = async (req, res) => {
    let auth = req.body.access_token;
    //let money = req.body.money;
    //let paymentUrl = req.body.payment_url;
    let client_txn_id = req.body?.client_txn_id;

    if (!client_txn_id) {
        return res.status(200).json({
            message: 'client_txn_id is required',
            status: false,
            timeStamp: timeNow,
        })
    }

    if (!auth) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        })
    }

    const [user] = await connection.query('SELECT `phone`, `code`,`invite` FROM users WHERE `token` = ? ', [md5(auth)]);
    let userInfo = user[0];

    if (!user) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        });
    };

    const [recharge] = await connection.query('SELECT * FROM recharge WHERE phone = ? AND status = ? ', [userInfo.phone, 0]);

    if (recharge.length != 0) {
        const rechargeData = recharge[0];
        const date = new Date(rechargeData.today);
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        const formattedDate = `${dd}-${mm}-${yyyy}`;
        const apiData = {
            key: "0c79da69-fdc1-4a07-a8b4-7135a0168385",
            client_txn_id: client_txn_id,
            txn_date: formattedDate,
        };
        try {
            const apiResponse = await axios.post('https://api.ekqr.in/api/check_order_status', apiData);
            console.log(apiResponse.data)
            const apiRecord = apiResponse.data.data;
            if (apiRecord.status === "scanning") {
                return res.status(200).json({
                    message: 'Waiting for confirmation',
                    status: false,
                    timeStamp: timeNow,
                });
            }
            if (apiRecord.client_txn_id === rechargeData.id_order && apiRecord.customer_mobile === rechargeData.phone && apiRecord.amount === rechargeData.money) {
                if (apiRecord.status === 'success') {
                    await connection.query(`UPDATE recharge SET status = 1 WHERE id = ? AND id_order = ? AND phone = ? AND money = ?`, [rechargeData.id, apiRecord.client_txn_id, apiRecord.customer_mobile, apiRecord.amount]);
                    // const [code] = await connection.query(`SELECT invite, total_money from users WHERE phone = ?`, [apiRecord.customer_mobile]);
                    // const [data] = await connection.query('SELECT recharge_bonus_2, recharge_bonus FROM admin WHERE id = 1');
                    // let selfBonus = info[0].money * (data[0].recharge_bonus_2 / 100);
                    // let money = info[0].money + selfBonus;
                    let money = apiRecord.amount;
                    await connection.query('UPDATE users SET money = money + ?, total_money = total_money + ? WHERE phone = ? ', [money, money, apiRecord.customer_mobile]);
                    // let rechargeBonus;
                    // if (code[0].total_money <= 0) {
                    //     rechargeBonus = apiRecord.customer_mobile * (data[0].recharge_bonus / 100);
                    // }
                    // else {
                    //     rechargeBonus = apiRecord.customer_mobile * (data[0].recharge_bonus_2 / 100);
                    // }
                    // const percent = rechargeBonus;
                    // await connection.query('UPDATE users SET money = money + ?, total_money = total_money + ? WHERE code = ?', [money, money, code[0].invite]);

                    return res.status(200).json({
                        message: 'Successful application confirmation',
                        status: true,
                        datas: recharge,
                    });
                } else if (apiRecord.status === 'failure' || apiRecord.status === 'close') {
                    console.log(apiRecord.status)
                    await connection.query(`UPDATE recharge SET status = 2 WHERE id = ? AND id_order = ? AND phone = ? AND money = ?`, [rechargeData.id, apiRecord.client_txn_id, apiRecord.customer_mobile, apiRecord.amount]);
                    return res.status(200).json({
                        message: 'Payment failure',
                        status: true,
                        timeStamp: timeNow,
                    });
                }
            } else {

                return res.status(200).json({
                    message: 'Mismtach data',
                    status: true,
                    timeStamp: timeNow,
                });
            }
        } catch (error) {
            console.error(error);
        }
    } else {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        });
    }
}

const confirmUSDTRecharge = async (req, res) => {
    console.log(res?.body)
    console.log(res?.query)
    console.log(res?.cookies)
    // let auth = req.body.authtoken;
    // //let money = req.body.money;
    // //let paymentUrl = req.body.payment_url;
    // let client_txn_id = req.body?.client_txn_id;

    // if (!client_txn_id) {
    //     return res.status(200).json({
    //         message: 'client_txn_id is required',
    //         status: false,
    //         timeStamp: timeNow,
    //     })
    // }

    // if (!auth) {
    //     return res.status(200).json({
    //         message: 'Failed',
    //         status: false,
    //         timeStamp: timeNow,
    //     })
    // }

    // const [user] = await connection.query('SELECT `phone`, `code`,`invite` FROM users WHERE `token` = ? ', [md5(auth)]);
    // let userInfo = user[0];

    // if (!user) {
    //     return res.status(200).json({
    //         message: 'Failed',
    //         status: false,
    //         timeStamp: timeNow,
    //     });
    // };

    // const [recharge] = await connection.query('SELECT * FROM recharge WHERE phone = ? AND status = ? ', [userInfo.phone, 0]);

    // if (recharge.length != 0) {
    //     const rechargeData = recharge[0];
    //     const date = new Date(rechargeData.today);
    //     const dd = String(date.getDate()).padStart(2, '0');
    //     const mm = String(date.getMonth() + 1).padStart(2, '0');
    //     const yyyy = date.getFullYear();
    //     const formattedDate = `${dd}-${mm}-${yyyy}`;
    //     const apiData = {
    //         key: process.env.PAYMENT_KEY,
    //         client_txn_id: client_txn_id,
    //         txn_date: formattedDate,
    //     };
    //     try {
    //         const apiResponse = await axios.post('https://api.ekqr.in/api/check_order_status', apiData);
    //         const apiRecord = apiResponse.data.data;
    //         if (apiRecord.status === "scanning") {
    //             return res.status(200).json({
    //                 message: 'Waiting for confirmation',
    //                 status: false,
    //                 timeStamp: timeNow,
    //             });
    //         }
    //         if (apiRecord.client_txn_id === rechargeData.id_order && apiRecord.customer_mobile === rechargeData.phone && apiRecord.amount === rechargeData.money) {
    //             if (apiRecord.status === 'success') {
    //                 await connection.query(`UPDATE recharge SET status = 1 WHERE id = ? AND id_order = ? AND phone = ? AND money = ?`, [rechargeData.id, apiRecord.client_txn_id, apiRecord.customer_mobile, apiRecord.amount]);
    //                 // const [code] = await connection.query(`SELECT invite, total_money from users WHERE phone = ?`, [apiRecord.customer_mobile]);
    //                 // const [data] = await connection.query('SELECT recharge_bonus_2, recharge_bonus FROM admin WHERE id = 1');
    //                 // let selfBonus = info[0].money * (data[0].recharge_bonus_2 / 100);
    //                 // let money = info[0].money + selfBonus;
    //                 let money = apiRecord.amount;
    //                 await connection.query('UPDATE users SET money = money + ?, total_money = total_money + ? WHERE phone = ? ', [money, money, apiRecord.customer_mobile]);
    //                 // let rechargeBonus;
    //                 // if (code[0].total_money <= 0) {
    //                 //     rechargeBonus = apiRecord.customer_mobile * (data[0].recharge_bonus / 100);
    //                 // }
    //                 // else {
    //                 //     rechargeBonus = apiRecord.customer_mobile * (data[0].recharge_bonus_2 / 100);
    //                 // }
    //                 // const percent = rechargeBonus;
    //                 // await connection.query('UPDATE users SET money = money + ?, total_money = total_money + ? WHERE code = ?', [money, money, code[0].invite]);

    //                 return res.status(200).json({
    //                     message: 'Successful application confirmation',
    //                     status: true,
    //                     datas: recharge,
    //                 });
    //             } else if (apiRecord.status === 'failure' || apiRecord.status === 'close') {
    //                 console.log(apiRecord.status)
    //                 await connection.query(`UPDATE recharge SET status = 2 WHERE id = ? AND id_order = ? AND phone = ? AND money = ?`, [rechargeData.id, apiRecord.client_txn_id, apiRecord.customer_mobile, apiRecord.amount]);
    //                 return res.status(200).json({
    //                     message: 'Payment failure',
    //                     status: true,
    //                     timeStamp: timeNow,
    //                 });
    //             }
    //         } else {
    //             return res.status(200).json({
    //                 message: 'Mismtach data',
    //                 status: true,
    //                 timeStamp: timeNow,
    //             });
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     }
    // } else {
    //     return res.status(200).json({
    //         message: 'Failed',
    //         status: false,
    //         timeStamp: timeNow,
    //     });
    // }
}



const updateRecharge = async (req, res) => {
    let auth = req.body.authtoken;
    let money = req.body.money;
    let order_id = req.body.id_order;
    let data = req.body.inputData;

    // if (type != 'upi') {
    //     if (!auth || !money || money < 300) {
    //         return res.status(200).json({
    //             message: 'upi failed',
    //             status: false,
    //             timeStamp: timeNow,
    //         })
    //     }
    // }
    const [user] = await connection.query('SELECT `phone`, `code`,`invite` FROM users WHERE `token` = ? ', [md5(auth)]);
    let userInfo = user[0];
    if (!user) {
        return res.status(200).json({
            message: 'user not found',
            status: false,
            timeStamp: timeNow,
        });
    };
    const [utr] = await connection.query('SELECT * FROM recharge WHERE `utr` = ? ', [data]);
    let utrInfo = utr[0];

    if (!utrInfo) {
        await connection.query('UPDATE recharge SET utr = ? WHERE phone = ? AND id_order = ?', [data, userInfo.phone, order_id]);
        return res.status(200).json({
            message: 'UTR updated',
            status: true,
            timeStamp: timeNow,
        });
    } else {
        return res.status(200).json({
            message: 'UTR is already in use',
            status: false,
            timeStamp: timeNow,
        });
    }
}

const getnotifications = async (req, res) => {
    let auth = req.body.authtoken;
    let [user] = await connection.query('SELECT * FROM users WHERE `token` = ?', [md5(auth)]);
    const [rows] = await connection.query('SELECT * FROM notification WHERE `recipient` = ? ORDER BY id DESC',[user[0]?.id]);

    if (!rows) {
        return res.status(200).json({
            message: 'Failed',
            status: false,

        });
    }
    return res.status(200).json({
        message: 'Success',
        status: true,
        data: {
        },
        rows: rows
    })
};


const updatenotifications = async (req, res) => {
    let auth = req.body.authtoken;
    let [user] = await connection.query('SELECT * FROM users WHERE `token` = ?', [md5(auth)]);
    await connection.execute("UPDATE notification SET isread = ?  WHERE `recipient` = ? AND  isread = ? ", [1,user[0]?.id,'0'] );
    return res.status(200).json({
        message: 'Updated',
        status: true,
        });
};


const get_user_invitor = async (phone_num,amount) => {
    let phone = phone_num;
    let invite_phone = "";
    let invite_role = "";
    const [f1s] = await connection.query('SELECT * FROM users WHERE `phone` = ? ', [phone]);
    if(phone != "iamlive"){
    const [f1s_inv] = await connection.query('SELECT * FROM users WHERE `code` = ? ', [f1s[0].invite]);
      if(parseInt(f1s_inv[0].level) != 2 && parseInt(f1s_inv[0].level) != 1)
      { 
        const [f2s_inv] = await connection.query('SELECT * FROM users WHERE `code` = ? ', [f1s_inv[0].invite]);
        if(parseInt(f2s_inv[0].level) != 2 && parseInt(f2s_inv[0].level) != 1)
        { 
          const [f3s_inv] = await connection.query('SELECT * FROM users WHERE `code` = ? ', [f2s_inv[0].invite]);
          if(parseInt(f3s_inv[0].level) != 2 && parseInt(f3s_inv[0].level) != 1)
          {
            const [f4s_inv] = await connection.query('SELECT * FROM users WHERE `code` = ? ', [f3s_inv[0].invite]);
            if(parseInt(f4s_inv[0].level) != 2 && parseInt(f4s_inv[0].level) != 1)
            {
              const [f5s_inv] = await connection.query('SELECT * FROM users WHERE `code` = ? ', [f4s_inv[0].invite]);
              if(parseInt(f5s_inv[0].level) != 2 && parseInt(f5s_inv[0].level) != 1)
              {
                const [f6s_inv] = await connection.query('SELECT * FROM users WHERE `code` = ? ', [f5s_inv[0].invite]);
                if(parseInt(f6s_inv[0].level) != 2 && parseInt(f6s_inv[0].level) != 1)
                {
                  const [f_admin] = await connection.query('SELECT *  FROM users WHERE `level` = 1 ');
                  invite_role = 'admin';
                  invite_phone = f_admin[0].phone;
                }
                else{
                  invite_role = f6s_inv[0].level == 2 ? "colloborator" : "admin";
                  invite_phone = f6s_inv[0].phone ;
                }
              }
              else{
                invite_role = f5s_inv[0].level == 2 ? "colloborator" : "admin";
                invite_phone = f5s_inv[0].phone ;
              }
            }
            else{
              invite_role = f4s_inv[0].level == 2 ? "colloborator" : "admin";
              invite_phone = f4s_inv[0].phone ;
            }
          }
          else{
            invite_role = f3s_inv[0].level == 2 ? "colloborator" : "admin";
            invite_phone = f3s_inv[0].phone ;
          }
        }
        else{
          invite_role = f2s_inv[0].level == 2 ? "colloborator" : "admin";
          invite_phone = f2s_inv[0].phone ;
        }
      }
      else{
        invite_role = f1s_inv[0].level == 2 ? "colloborator" : "admin";
        invite_phone = f1s_inv[0].phone ;
      }
    }
    else{
      invite_role = "admin";
      invite_phone =  username;
    }
    console.log(invite_role)
    console.log(invite_phone)
    if(invite_role = "colloborator")
    {
        const [rows] = await connection.execute('SELECT * FROM `point_list` WHERE `phone` = ? ', [invite_phone]);
        let coll_rech_limit = rows[0].recharge;
        if(parseInt(coll_rech_limit) >= amount)
        {
            invite_phone =  invite_phone;   
        }
        else
        {
            const [f_admin] = await connection.query('SELECT *  FROM users WHERE `level` = 1 ');
            invite_role = 'admin';
            invite_phone = f_admin[0].phone;  
        }
    }
    return invite_phone;
  }


const get_manual_upi_id = async (req, res) => {
    let auth = req.body.access_token;
    let money = req.body.amount;
    const [rows] = await connection.execute('SELECT * FROM `users` WHERE `token` = ? ', [md5(auth)]);
    const [bank_recharge_momo] = await connection.query("SELECT * FROM bank_recharge WHERE phone = ?", [rows[0].phone]);

    let bank_recharge_momo_data
    if (bank_recharge_momo.length) {
        bank_recharge_momo_data = bank_recharge_momo[0]
    }

    const momo = {
        bank_name: bank_recharge_momo_data?.name_bank || "",
        username: bank_recharge_momo_data?.name_user || "",
        upi_id: bank_recharge_momo_data?.stk || "",
        usdt_wallet_address: bank_recharge_momo_data?.qr_code_image || "",
    }
	
	const user_admin_invitor = await get_user_invitor(rows[0].phone,money);
    const [bank_recharge] = await connection.query("SELECT * FROM bank_recharge WHERE phone = ?", [user_admin_invitor]);
    var upi_address = '';
    var upi_image = '';
    if(bank_recharge[0].colloborator_action == "off")
    {
        const [f_admin] = await connection.query('SELECT *  FROM users WHERE `level` = 1 ');
        var invite_phone = f_admin[0].phone;
        const [bank_recharge12] = await connection.query("SELECT * FROM bank_recharge WHERE phone = ?", [invite_phone]);
        upi_address = bank_recharge12[0].stk;
        upi_image = bank_recharge12[0].qr_code_image.toString().trim();
    }
    else{
        upi_address = bank_recharge[0].stk;
        upi_image = bank_recharge[0].qr_code_image.toString().trim();
    }
    return res.status(200).json({
        message: 'Successful',//Register Sucess
        dynamic_upi_Addr:upi_address,
        upi_user_phone:user_admin_invitor,
        upi_address_image:upi_image.replace(/\\/g, "/").replace("src/public",""),
        status: true
    });
}

const check_login_val = async (req, res) => {
    let auth = req.body.authtoken;
    let username =  req.body.username;
    let password =  req.body.pwd;
    let message = '';
    const [rows] = await connection.query('SELECT * FROM users WHERE phone = ? AND password = ?', [username, md5(password)]);
    if (rows.length == 1) {
        let [user] = await connection.query('SELECT * FROM users WHERE `token` = ?', [md5(auth)]);
        if (user.length == 1) {
            message = "exits";
        }
        else{
            message = "login";
        }
    }
    else{
        message = "register";
    }
    return res.status(200).json({
        message: 'Successful',//Register Sucess
        data: message,
        status: true
    });
}
const xpgain_value = async (req, res) => {
    let auth = req.body.authtoken;
    let xp_gain_val = 0;
    let [user] = await connection.query('SELECT * FROM users WHERE `token` = ?', [md5(auth)]);
    let telegram = '';
    let whatsapp = '';
    if (user.length == 0) {
        let [settings] = await connection.query('SELECT `telegram`, `cskh`,`whatsapp` FROM admin');
        telegram = settings[0].telegram;
        whatsapp = settings[0].whatsapp;
    } else {
        if (user[0].level != 0) {
            var [settings] = await connection.query('SELECT * FROM admin');
        } else {
            var [check] = await connection.query('SELECT `telegram`,`whatsapp` FROM point_list WHERE phone = ?', [user[0].ctv]);
            if (check.length == 0) {
                var [settings] = await connection.query('SELECT * FROM admin');
            } else {
                var [settings] = await connection.query('SELECT `telegram`, `whatsapp` FROM point_list WHERE phone = ?', [user[0].ctv]);
            }
        }
        telegram = settings[0].telegram;
        whatsapp = settings[0].whatsapp;
    }
    const [user_stoke] = await connection.query('SELECT SUM(stake_amnt) AS `sum` FROM claimed_rewards WHERE status = 2 AND `reward_id` = 136 AND `phone` = ?', [user[0].phone]);
    const stakeamount = user_stoke[0].sum || 0;
    const [trx_xp] = await connection.query(`SELECT SUM(money) as total FROM trx_wingo_bets WHERE phone = ? `, user[0].phone);
    const [wingo_xp] = await connection.query(`SELECT SUM(money) as total FROM minutes_1 WHERE phone = ? `, user[0].phone);
    const [k3_xp] = await connection.query(`SELECT SUM(money) as total FROM result_k3 WHERE phone = ? `, user[0].phone);
    const [d5_xp] = await connection.query(`SELECT SUM(money) as total FROM result_5d WHERE phone = ? `, user[0].phone);
    if(wingo_xp[0].total == null)
    {
        wingo_xp[0].total = 0;
    }
    if(k3_xp[0].total == null)
    {
        k3_xp[0].total = 0;
    }
    if(d5_xp[0].total == null)
    {
        d5_xp[0].total = 0;
    }
    if(trx_xp[0].total == null)
    {
        trx_xp[0].total = 0;
    }
    let level = user[0].level;

    xp_gain_val = parseInt(wingo_xp[0].total) + parseInt(k3_xp[0].total) + parseInt(d5_xp[0].total) + parseInt(trx_xp[0].total);

    return res.status(200).json({
        message: 'Successful',//Register Sucess
        xp_value: xp_gain_val,
        level: level,
        status: true,
        language:user[0].lang_code,
        user_stake:stakeamount,
        whatsapp_data:whatsapp,
    });

};
const getlang_datacall = async (req, res) => {
    let lang_code = req.body.lang_code;
    var lang_data = getlang_data(lang_code);
    return res.status(200).json({
        message: 'Successful',//Register Sucess
        status: true,
        data:lang_data,
    });
}
const set_lang_data = async (req, res) => {
    let lang_code = req.body.lang_code;
    let auth = req.body.authtoken;
    const [rows] = await connection.query('SELECT * FROM users WHERE `token` = ? ', [md5(auth)]);
    let user = rows[0];
    await connection.execute("UPDATE users SET lang_code = ? WHERE phone = ? ", [lang_code, user.phone]);
    return res.status(200).json({
        message: 'Successful',//Register Sucess
        status: true,
    });
}

const getsandbox = async (req, res) => {
    var sandbox = process.env.SANDBOX_MODE;
    return res.status(200).json({
        sandbox_val: sandbox,//Register Sucess
        status: true,
    });
}
const get_lang_data = async (req, res) => {
    let auth = req.body.authtoken;
    let [user] = await connection.query('SELECT * FROM users WHERE `token` = ?', [md5(auth)]);
    return res.status(200).json({
        message: 'Successful',//Register Sucess
        status: true,
        lang:user[0].lang_code,
    });
}


const username_transfer = async (req, res) => {
    let auth = req.body.authtoken;
    let amount = req.body.amount;
    let receiver_phone = req.body.phone;
    const date = new Date();
    // let id_time = date.getUTCFullYear() + '' + (date.getUTCMonth() + 1) + '' + date.getUTCDate();
    let id_order = Math.floor(Math.random() * (99999999999999 - 10000000000000 + 1)) + 10000000000000;
    let time = new Date().getTime();
    let client_transaction_id = id_order;

    const [user] = await connection.query('SELECT `id`,`phone`,`money`, `code`,`invite` FROM users WHERE `token` = ? ', [md5(auth)]);
    let userInfo = user[0];
    let sender_phone = userInfo.phone;
    let sender_money = parseInt(userInfo.money);
    if (!user) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        });
    };


    let dates = new Date().getTime();
    let checkTime = timerJoin(dates);
    const [recharge] = await connection.query('SELECT * FROM recharge WHERE phone = ? AND status = 1 ', [userInfo.phone]);
    const [minutes_1] = await connection.query('SELECT * FROM minutes_1 WHERE phone = ? ', [userInfo.phone]);
    const [k3_bet_money] = await connection.query('SELECT * FROM result_k3 WHERE phone = ?', [userInfo.phone]);
    const [d5_bet_money] = await connection.query('SELECT * FROM result_5d WHERE phone = ?', [userInfo.phone]);
    const [trx_bet_money] = await connection.query('SELECT * FROM trx_wingo_bets WHERE phone = ?', [userInfo.phone]);

    let total = 0;
    recharge.forEach((data) => {
        total += parseFloat(data.money);
    });
    let total2 = 0;
    let total_w = 0;
    let total_k3 = 0;
    let total_5d = 0;
    let total_trx = 0;
    minutes_1.forEach((data) => {
        total_w += parseFloat(data.money);
    });
    k3_bet_money.forEach((data) => {
        total_k3 += parseFloat(data.money);
    });
    d5_bet_money.forEach((data) => {
        total_5d += parseFloat(data.money);
    });
    trx_bet_money.forEach((data) => {
        total_trx += parseFloat(data.money);
    });
    total2 += parseInt(total_w) + parseInt(total_k3) + parseInt(total_5d)+ parseInt(total_trx);

    let result = 0;
    if (total - total2 > 0) result = total - total2;
    let result2 = parseInt ((parseInt(total) * 80)/100)
    if (total2 >= result2) {
        if (sender_money >= amount) {
            let [receiver] = await connection.query('SELECT * FROM users WHERE `phone` = ?', [receiver_phone]);
            if (receiver.length === 1 && sender_phone !== receiver_phone) {
                let money = sender_money - amount;
                let total_money = amount + receiver[0].total_money;
                let trans_mode = '';
                const [admin_user] = await connection.query('SELECT * FROM users WHERE level = ? ', [1]);
                let adminInfo = admin_user[0];
                trans_mode = adminInfo.transfer_mode; 
                if(trans_mode == 'instant')
                {
                    await connection.query('UPDATE users SET money = ? WHERE phone = ?', [money, sender_phone]);
                    await connection.query(`UPDATE users SET money = money + ? WHERE phone = ?`, [amount, receiver_phone]);
                    const sql = "INSERT INTO balance_transfer (sender_phone, receiver_phone, amount) VALUES (?, ?, ?)";
                    await connection.execute(sql, [sender_phone, receiver_phone, amount]);
                    const sql_recharge = "INSERT INTO recharge (id_order, transaction_id, phone, money, type, status, today, url, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    await connection.execute(sql_recharge, [client_transaction_id, 0, receiver_phone, amount, 'wallet', 1, checkTime, 0, time]);
                    const sql_recharge_with = "INSERT INTO withdraw (id_order, phone, money, stk, name_bank, name_user, ifsc, sdt, tp, status, today, time, type,with_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?)";
                    await connection.execute(sql_recharge_with, [client_transaction_id, sender_phone, amount,0,0,0,0,0,0, 1, checkTime, time,trans_mode,'transfer']);
                    let sql_noti = 'INSERT INTO notification SET recipient = ?, description = ?, isread = ?, noti_type = ?';
                    await connection.query(sql_noti, [receiver[0]?.id, "Congrates! you received an reward of "+amount+" from your friend " + userInfo.code +".", '0', "Recharge"]);
                    let sql_noti1 = "INSERT INTO notification SET recipient = ?, description = ?, isread = ?, noti_type = ?";
                    let withdrdesc = "Amount of "+ amount + " have been transferred successfully.";
                    await connection.query(sql_noti1, [userInfo.id, withdrdesc , "0", "Withdraw"]);
                    return res.status(200).json({
                        message: `Requested ${amount} sent successfully`,
                        curr_user_m:money,
                        transfer_mode:trans_mode,
                        status: true,
                        timeStamp: timeNow,
                    });
                    
                }
                else{
                    const sql_recharge_with = "INSERT INTO withdraw (id_order, phone, money, stk, name_bank, name_user, ifsc, sdt, tp, status, today, time, type,with_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?)";
                    await connection.execute(sql_recharge_with, [client_transaction_id, sender_phone, amount,0,0,0,0,0,0, 0, checkTime, time,trans_mode,'transfer']);
                    const sql = "INSERT INTO balance_transfer (sender_phone, receiver_phone, amount) VALUES (?, ?, ?)";
                    await connection.execute(sql, [sender_phone, receiver_phone, amount]);
                    const sql_recharge = "INSERT INTO recharge (id_order, transaction_id, phone, money, type, status, today, url, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    await connection.execute(sql_recharge, [client_transaction_id, 0, receiver_phone, amount, 'wallet', 0, checkTime, 0, time]);
                    let sql_noti = 'INSERT INTO notification SET recipient = ?, description = ?, isread = ?, noti_type = ?';
                    await connection.query(sql_noti, [userInfo.id, "Balance Transfer of Amount "+amount+" Initiated Successfully.", '0', "Transfer"]);
                    return res.status(200).json({
                        message: `Waiting for admin approval`,
                        curr_user_m:money,
                        transfer_mode:trans_mode,
                        status: true,
                        timeStamp: timeNow,
                    });
                }
            } else {
                return res.status(200).json({
                    message: `${receiver_phone} is not a valid username`,
                    status: false,
                    timeStamp: timeNow,
                });
            }
        } else {
            return res.status(200).json({
                message: 'Your balance is not enough',
                status: false,
                timeStamp: timeNow,
            });
        }
    }
    else {
        return res.status(200).json({
            message: 'The total bet is not enough to fulfill the request',
            status: false,
            timeStamp: timeNow,
        });
    }
}


const phone_transfer = async (req, res) => {
    let auth = req.body.authtoken;
    let amount = req.body.amount;
    let receiver_phone = req.body.phone;
    let country_code = req.body.c_code;
    const date = new Date();
    // let id_time = date.getUTCFullYear() + '' + (date.getUTCMonth() + 1) + '' + date.getUTCDate();
    let id_order = Math.floor(Math.random() * (99999999999999 - 10000000000000 + 1)) + 10000000000000;
    let time = new Date().getTime();
    let client_transaction_id = id_order;

    const [user] = await connection.query('SELECT `id`,`phone`,`money`, `code`,`invite` FROM users WHERE `token` = ? ', [md5(auth)]);
    let userInfo = user[0];
    let sender_phone = userInfo.phone;
    let sender_money = parseInt(userInfo.money);
    if (!user) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        });
    };


    let dates = new Date().getTime();
    let checkTime = timerJoin(dates);
    const [recharge] = await connection.query('SELECT * FROM recharge WHERE phone = ? AND status = 1 ', [userInfo.phone]);
    const [minutes_1] = await connection.query('SELECT * FROM minutes_1 WHERE phone = ? ', [userInfo.phone]);
    const [k3_bet_money] = await connection.query('SELECT * FROM result_k3 WHERE phone = ?', [userInfo.phone]);
    const [d5_bet_money] = await connection.query('SELECT * FROM result_5d WHERE phone = ?', [userInfo.phone]);
    const [trx_bet_money] = await connection.query('SELECT * FROM trx_wingo_bets WHERE phone = ?', [userInfo.phone]);
    let total = 0;
    recharge.forEach((data) => {
        total += parseFloat(data.money);
    });
    let total2 = 0;
    let total_w = 0;
    let total_k3 = 0;
    let total_5d = 0;
    let total_trx = 0;
    minutes_1.forEach((data) => {
        total_w += parseFloat(data.money);
    });
    k3_bet_money.forEach((data) => {
        total_k3 += parseFloat(data.money);
    });
    d5_bet_money.forEach((data) => {
        total_5d += parseFloat(data.money);
    });
    trx_bet_money.forEach((data) => {
        total_trx += parseFloat(data.money);
    });
    total2 += parseInt(total_w) + parseInt(total_k3) + parseInt(total_5d)+ parseInt(total_trx);

    let result = 0;
    if (total - total2 > 0) result = total - total2;
    let result2 = parseInt ((parseInt(total) * 80)/100)
    if (total2 >= result2) {
        if (sender_money >= amount) {
            let [receiver] = await connection.query('SELECT * FROM users WHERE `name_user` = ? AND `dial_code` = ?', [receiver_phone,country_code]);
            if (receiver.length === 1 && userInfo.name_user !== receiver_phone && userInfo.dial_code !== country_code) {
                let money = sender_money - amount;
                let total_money = amount + receiver[0].total_money;
                let trans_mode = '';
                const [admin_user] = await connection.query('SELECT * FROM users WHERE level = ? ', [1]);
                let adminInfo = admin_user[0];
                trans_mode = adminInfo.transfer_mode; 
                if(trans_mode == 'instant')
                {
                    await connection.query('UPDATE users SET money = ? WHERE phone = ?', [money, sender_phone]);
                    await connection.query(`UPDATE users SET money = money + ? WHERE phone = ?`, [amount, receiver_phone]);
                    const sql = "INSERT INTO balance_transfer (sender_phone, receiver_phone, amount) VALUES (?, ?, ?)";
                    await connection.execute(sql, [userInfo.phone, receiver[0].phone, amount]);
                    const sql_recharge = "INSERT INTO recharge (id_order, transaction_id, phone, money, type, status, today, url, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    await connection.execute(sql_recharge, [client_transaction_id, 0, receiver_phone, amount, 'wallet', 1, checkTime, 0, time]);
                    const sql_recharge_with = "INSERT INTO withdraw (id_order, phone, money, stk, name_bank, name_user, ifsc, sdt, tp, status, today, time, type,with_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?)";
                    await connection.execute(sql_recharge_with, [client_transaction_id, sender_phone, amount,0,0,0,0,0,0, 1, checkTime, time,trans_mode,'transfer']);
                    let sql_noti = 'INSERT INTO notification SET recipient = ?, description = ?, isread = ?, noti_type = ?';
                    await connection.query(sql_noti, [receiver[0]?.id, "Congrates! you received an reward of "+amount+" from your friend " + userInfo.code +".", '0', "Recharge"]);
                    let sql_noti1 = "INSERT INTO notification SET recipient = ?, description = ?, isread = ?, noti_type = ?";
                    let withdrdesc = "Amount of "+ amount + " have been transferred successfully.";
                    await connection.query(sql_noti1, [userInfo.id, withdrdesc , "0", "Withdraw"]);
                    return res.status(200).json({
                        message: `Requested ${amount} sent successfully`,
                        curr_user_m:money,
                        transfer_mode:trans_mode,
                        status: true,
                        timeStamp: timeNow,
                    });
                    
                }
                else{
                    const sql_recharge_with = "INSERT INTO withdraw (id_order, phone, money, stk, name_bank, name_user, ifsc, sdt, tp, status, today, time, type,with_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?)";
                    await connection.execute(sql_recharge_with, [client_transaction_id, sender_phone, amount,0,0,0,0,0,0, 0, checkTime, time,trans_mode,'transfer']);
                    const sql = "INSERT INTO balance_transfer (sender_phone, receiver_phone, amount) VALUES (?, ?, ?)";
                    await connection.execute(sql, [userInfo.phone, receiver[0].phone, amount]);
                    const sql_recharge = "INSERT INTO recharge (id_order, transaction_id, phone, money, type, status, today, url, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    await connection.execute(sql_recharge, [client_transaction_id, 0, receiver_phone, amount, 'wallet', 0, checkTime, 0, time]);
                    let sql_noti = 'INSERT INTO notification SET recipient = ?, description = ?, isread = ?, noti_type = ?';
                    await connection.query(sql_noti, [userInfo.id, "Balance Transfer of Amount "+amount+" Initiated Successfully.", '0', "Transfer"]);
                    return res.status(200).json({
                        message: `Waiting for admin approval`,
                        curr_user_m:money,
                        transfer_mode:trans_mode,
                        status: true,
                        timeStamp: timeNow,
                    });
                }
            } else {
                return res.status(200).json({
                    message: `${country_code}  ${receiver_phone} is not a valid user mobile number`,
                    status: false,
                    timeStamp: timeNow,
                });
            }
        } else {
            return res.status(200).json({
                message: 'Your balance is not enough',
                status: false,
                timeStamp: timeNow,
            });
        }
    }
    else {
        return res.status(200).json({
            message: 'The total bet is not enough to fulfill the request',
            status: false,
            timeStamp: timeNow,
        });
    }
}


const user_id_transfer = async (req, res) => {
    let auth = req.body.authtoken;
    let amount = req.body.amount;
    let receiver_phone = req.body.phone;
    const date = new Date();
    // let id_time = date.getUTCFullYear() + '' + (date.getUTCMonth() + 1) + '' + date.getUTCDate();
    let id_order = Math.floor(Math.random() * (99999999999999 - 10000000000000 + 1)) + 10000000000000;
    let time = new Date().getTime();
    let client_transaction_id = id_order;

    const [user] = await connection.query('SELECT `id`,`phone`,`money`, `code`,`invite` FROM users WHERE `token` = ? ', [md5(auth)]);
    let userInfo = user[0];
    let sender_phone = userInfo.phone;
    let sender_money = parseInt(userInfo.money);
    if (!user) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        });
    };


    let dates = new Date().getTime();
    let checkTime = timerJoin(dates);
    const [recharge] = await connection.query('SELECT * FROM recharge WHERE phone = ? AND status = 1 ', [userInfo.phone]);
    const [minutes_1] = await connection.query('SELECT * FROM minutes_1 WHERE phone = ? ', [userInfo.phone]);
    const [k3_bet_money] = await connection.query('SELECT * FROM result_k3 WHERE phone = ?', [userInfo.phone]);
    const [d5_bet_money] = await connection.query('SELECT * FROM result_5d WHERE phone = ?', [userInfo.phone]);
    const [trx_bet_money] = await connection.query('SELECT * FROM trx_wingo_bets WHERE phone = ?', [userInfo.phone]);
    let total = 0;
    recharge.forEach((data) => {
        total += parseFloat(data.money);
    });
    let total2 = 0;
    let total_w = 0;
    let total_k3 = 0;
    let total_5d = 0;
    let total_trx = 0;
    minutes_1.forEach((data) => {
        total_w += parseFloat(data.money);
    });
    k3_bet_money.forEach((data) => {
        total_k3 += parseFloat(data.money);
    });
    d5_bet_money.forEach((data) => {
        total_5d += parseFloat(data.money);
    });

    trx_bet_money.forEach((data) => {
        total_trx += parseFloat(data.money);
    });

    total2 += parseInt(total_w) + parseInt(total_k3) + parseInt(total_5d)+ parseInt(total_trx);

    let result = 0;
    if (total - total2 > 0) result = total - total2;
    let result2 = parseInt ((parseInt(total) * 80)/100)
    if (total2 >= result2) {
        if (sender_money >= amount) {
            let [receiver] = await connection.query('SELECT * FROM users WHERE `id_user` = ?', [receiver_phone]);
            if (receiver.length === 1 && userInfo.id_user !== receiver_phone) {
                let money = sender_money - amount;
                let total_money = amount + receiver[0].total_money;
                let trans_mode = '';
                const [admin_user] = await connection.query('SELECT * FROM users WHERE level = ? ', [1]);
                let adminInfo = admin_user[0];
                trans_mode = adminInfo.transfer_mode; 
                if(trans_mode == 'instant')
                {
                    await connection.query('UPDATE users SET money = ? WHERE phone = ?', [money, sender_phone]);
                    await connection.query(`UPDATE users SET money = money + ? WHERE phone = ?`, [amount, receiver_phone]);
                    const sql = "INSERT INTO balance_transfer (sender_phone, receiver_phone, amount) VALUES (?, ?, ?)";
                    await connection.execute(sql, [userInfo.phone, receiver[0].phone, amount]);
                    const sql_recharge = "INSERT INTO recharge (id_order, transaction_id, phone, money, type, status, today, url, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    await connection.execute(sql_recharge, [client_transaction_id, 0, receiver_phone, amount, 'wallet', 1, checkTime, 0, time]);
                    const sql_recharge_with = "INSERT INTO withdraw (id_order, phone, money, stk, name_bank, name_user, ifsc, sdt, tp, status, today, time, type,with_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?)";
                    await connection.execute(sql_recharge_with, [client_transaction_id, sender_phone, amount,0,0,0,0,0,0, 1, checkTime, time,trans_mode,'transfer']);
                    let sql_noti = 'INSERT INTO notification SET recipient = ?, description = ?, isread = ?, noti_type = ?';
                    await connection.query(sql_noti, [receiver[0]?.id, "Congrates! you received an reward of "+amount+" from your friend " + userInfo.code +".", '0', "Recharge"]);
                    let sql_noti1 = "INSERT INTO notification SET recipient = ?, description = ?, isread = ?, noti_type = ?";
                    let withdrdesc = "Amount of "+ amount + " have been transferred successfully.";
                    await connection.query(sql_noti1, [userInfo.id, withdrdesc , "0", "Withdraw"]);
                    return res.status(200).json({
                        message: `Requested ${amount} sent successfully`,
                        curr_user_m:money,
                        transfer_mode:trans_mode,
                        status: true,
                        timeStamp: timeNow,
                    });
                    
                }
                else{
                    const sql_recharge_with = "INSERT INTO withdraw (id_order, phone, money, stk, name_bank, name_user, ifsc, sdt, tp, status, today, time, type,with_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?)";
                    await connection.execute(sql_recharge_with, [client_transaction_id, sender_phone, amount,0,0,0,0,0,0, 0, checkTime, time,trans_mode,'transfer']);
                    const sql = "INSERT INTO balance_transfer (sender_phone, receiver_phone, amount) VALUES (?, ?, ?)";
                    await connection.execute(sql, [userInfo.phone, receiver[0].phone, amount]);
                    const sql_recharge = "INSERT INTO recharge (id_order, transaction_id, phone, money, type, status, today, url, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    await connection.execute(sql_recharge, [client_transaction_id, 0, receiver_phone, amount, 'wallet', 0, checkTime, 0, time]);
                    let sql_noti = 'INSERT INTO notification SET recipient = ?, description = ?, isread = ?, noti_type = ?';
                    await connection.query(sql_noti, [userInfo.id, "Balance Transfer of Amount "+amount+" Initiated Successfully.", '0', "Transfer"]);
                    return res.status(200).json({
                        message: `Waiting for admin approval`,
                        curr_user_m:money,
                        transfer_mode:trans_mode,
                        status: true,
                        timeStamp: timeNow,
                    });
                }
            } else {
                return res.status(200).json({
                    message: `${receiver_phone} is not a valid user-id`,
                    status: false,
                    timeStamp: timeNow,
                });
            }
        } else {
            return res.status(200).json({
                message: 'Your balance is not enough',
                status: false,
                timeStamp: timeNow,
            });
        }
    }
    else {
        return res.status(200).json({
            message: 'The total bet is not enough to fulfill the request',
            status: false,
            timeStamp: timeNow,
        });
    }
}


const getmybets = async (req, res) => {
    let auth = req.body.authtoken;
    let type = req.body.data_type;
    console.log("fired");
    if (!auth) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        })
    }
    const [user] = await connection.query('SELECT `phone` FROM users WHERE `token` = ? ', [md5(auth)]);
    let phone = user[0].phone;
    if (!user) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        });
    };

    var wing_betting_list = '';
    var k3_betting_list = '';
    var d5_betting_list = '';
    var trx_betting_list = '';
    var total_wingo_bet = 0;
    var total_k3_bet = 0;
    var total_trx_bet = 0;
    var total_d5_bet = 0;
    var total_wingo_win_amt = 0;
    var total_k3_win_amt = 0;
    var total_d5_win_amt = 0;
    var total_trx_win_amt = 0;
    var total_bet_amt = 0;
    var total_win_loss = 0 ;
    var total_win_amt = 0;
    var win_loss_label = "";

    if( type == 1)
    {
        const time = moment().startOf("day").valueOf();
        [wing_betting_list] = await connection.query('SELECT sum(money) as sum , count(*) as count , sum(CASE WHEN status = "1" THEN get ELSE NULL END) AS win_amt FROM minutes_1 WHERE `phone` = ? AND status NOT IN ( 0 ) AND `time` >= ? GROUP BY `stage` DESC;', [phone, time]);
        [k3_betting_list] = await connection.query('SELECT sum(money) as sum , count(*) as count , sum(CASE WHEN status = "1" THEN get ELSE NULL END) AS win_amt FROM result_k3 WHERE `phone` = ? AND status NOT IN ( 0 ) AND `time` >= ? GROUP BY `stage` DESC;', [phone, time]);
        [d5_betting_list] = await connection.query('SELECT sum(money) as sum , count(*) as count , sum(CASE WHEN status = "1" THEN get ELSE NULL END) AS win_amt FROM result_5d WHERE `phone` = ? AND status NOT IN ( 0 ) AND `time` >= ? GROUP BY `stage` DESC;', [phone, time]);
        [trx_betting_list] = await connection.query('SELECT sum(money) as sum , count(*) as count , sum(CASE WHEN status = "1" THEN get ELSE NULL END) AS win_amt FROM trx_wingo_bets WHERE `phone` = ? AND status NOT IN ( 0 ) AND `time` >= ? GROUP BY `stage` DESC;', [phone, time]);
        [[total_wingo_bet]] = await connection.query('SELECT SUM(money) AS `sum` FROM minutes_1 WHERE `phone` = ? AND `time`>= ?  ORDER BY `id` DESC', [phone, time]);
        [[total_k3_bet]] = await connection.query('SELECT SUM(money) AS `sum` FROM result_k3 WHERE `phone` = ? AND `time` >= ?  ORDER BY `id` DESC', [phone, time]);
        [[total_d5_bet]] = await connection.query('SELECT SUM(money) AS `sum` FROM result_5d WHERE `phone` = ? AND `time` >= ?  ORDER BY `id` DESC', [phone, time]);
        [[total_trx_bet]] = await connection.query('SELECT SUM(money) AS `sum` FROM trx_wingo_bets WHERE `phone` = ? AND `time` >= ?  ORDER BY `id` DESC', [phone, time]);
        [[total_wingo_win_amt]] = await connection.query('SELECT SUM(get) AS `sum` FROM minutes_1 WHERE `phone` = ? AND `time` >= ? AND `status` = 1  ORDER BY `id` DESC', [phone, time]);
        [[total_k3_win_amt]] = await connection.query('SELECT SUM(get) AS `sum` FROM result_k3 WHERE `phone` = ? AND `time` >= ? AND `status` = 1  ORDER BY `id` DESC', [phone, time]);
        [[total_d5_win_amt]] = await connection.query('SELECT SUM(get) AS `sum` FROM result_5d WHERE `phone` = ? AND `time` >= ? AND `status` = 1  ORDER BY `id` DESC', [phone, time]);
        [[total_trx_win_amt]] = await connection.query('SELECT SUM(get) AS `sum` FROM trx_wingo_bets WHERE `phone` = ? AND `time` >= ? AND `status` = 1  ORDER BY `id` DESC', [phone, time]);
        var tt_wingo_bets = total_wingo_bet.sum || 0 ;
        var tt_k3_bets = total_k3_bet.sum || 0 ;
        var tt_d5_bets = total_d5_bet.sum || 0 ;
        var tt_trx_bets = total_trx_bet.sum || 0 ;
        var ttw_wingo_bets = total_wingo_win_amt.sum || 0 ;
        var ttw_k3_bets = total_k3_win_amt.sum || 0 ;
        var ttw_d5_bets = total_d5_win_amt.sum || 0 ;
        var ttw_trx_bets = total_trx_win_amt.sum || 0 ; 
        total_bet_amt +=  parseInt(tt_wingo_bets) + parseInt(tt_k3_bets) + parseInt(tt_d5_bets) + parseInt(tt_trx_bets);
        total_win_amt +=  parseInt(ttw_wingo_bets) + parseInt(ttw_k3_bets) + parseInt(ttw_d5_bets) + parseInt(ttw_trx_bets);
        total_win_loss = parseInt(total_win_amt) - parseInt(total_bet_amt);
        if(total_win_loss < 0)
        {
            win_loss_label = "LOSS";
        }
        else{
            win_loss_label = "WIN"; 
        }
    }
    else if(type == 2)
    {
        const time = moment().subtract(1, "days").valueOf();
        [wing_betting_list] = await connection.query('SELECT sum(money) as sum , count(*) as count , sum(CASE WHEN status = "1" THEN get ELSE NULL END) AS win_amt FROM minutes_1 WHERE `phone` = ? AND status NOT IN ( 0 ) AND `time` >= ? GROUP BY `stage` DESC;', [phone, time]);
        [k3_betting_list] = await connection.query('SELECT sum(money) as sum , count(*) as count , sum(CASE WHEN status = "1" THEN get ELSE NULL END) AS win_amt FROM result_k3 WHERE `phone` = ? AND status NOT IN ( 0 ) AND `time` >= ? GROUP BY `stage` DESC;', [phone, time]);
        [d5_betting_list] = await connection.query('SELECT sum(money) as sum , count(*) as count , sum(CASE WHEN status = "1" THEN get ELSE NULL END) AS win_amt FROM result_5d WHERE `phone` = ? AND status NOT IN ( 0 ) AND `time` >= ? GROUP BY `stage` DESC;', [phone, time]);
        [trx_betting_list] = await connection.query('SELECT sum(money) as sum , count(*) as count , sum(CASE WHEN status = "1" THEN get ELSE NULL END) AS win_amt FROM trx_wingo_bets WHERE `phone` = ? AND status NOT IN ( 0 ) AND `time` >= ? GROUP BY `stage` DESC;', [phone, time]);
        [[total_wingo_bet]] = await connection.query('SELECT SUM(money) AS `sum` FROM minutes_1 WHERE `phone` = ? AND `time`>= ?  ORDER BY `id` DESC', [phone, time]);
        [[total_k3_bet]] = await connection.query('SELECT SUM(money) AS `sum` FROM result_k3 WHERE `phone` = ? AND `time` >= ?  ORDER BY `id` DESC', [phone, time]);
        [[total_d5_bet]] = await connection.query('SELECT SUM(money) AS `sum` FROM result_5d WHERE `phone` = ? AND `time` >= ?  ORDER BY `id` DESC', [phone, time]);
        [[total_trx_bet]] = await connection.query('SELECT SUM(money) AS `sum` FROM trx_wingo_bets WHERE `phone` = ? AND `time` >= ?  ORDER BY `id` DESC', [phone, time]);
        [[total_wingo_win_amt]] = await connection.query('SELECT SUM(get) AS `sum` FROM minutes_1 WHERE `phone` = ? AND `time` >= ? AND `status` = 1  ORDER BY `id` DESC', [phone, time]);
        [[total_k3_win_amt]] = await connection.query('SELECT SUM(get) AS `sum` FROM result_k3 WHERE `phone` = ? AND `time` >= ? AND `status` = 1  ORDER BY `id` DESC', [phone, time]);
        [[total_d5_win_amt]] = await connection.query('SELECT SUM(get) AS `sum` FROM result_5d WHERE `phone` = ? AND `time` >= ? AND `status` = 1  ORDER BY `id` DESC', [phone, time]);
        [[total_trx_win_amt]] = await connection.query('SELECT SUM(get) AS `sum` FROM trx_wingo_bets WHERE `phone` = ? AND `time` >= ? AND `status` = 1  ORDER BY `id` DESC', [phone, time]);
        var tt_wingo_bets = total_wingo_bet.sum || 0 ;
        var tt_k3_bets = total_k3_bet.sum || 0 ;
        var tt_d5_bets = total_d5_bet.sum || 0 ;
        var tt_trx_bets = total_trx_bet.sum || 0 ;
        var ttw_wingo_bets = total_wingo_win_amt.sum || 0 ;
        var ttw_k3_bets = total_k3_win_amt.sum || 0 ;
        var ttw_d5_bets = total_d5_win_amt.sum || 0 ;
        var ttw_trx_bets = total_trx_win_amt.sum || 0 ; 
        total_bet_amt +=  parseInt(tt_wingo_bets) + parseInt(tt_k3_bets) + parseInt(tt_d5_bets) + parseInt(tt_trx_bets);
        total_win_amt +=  parseInt(ttw_wingo_bets) + parseInt(ttw_k3_bets) + parseInt(ttw_d5_bets) + parseInt(ttw_trx_bets);
        total_win_loss = parseInt(total_win_amt) - parseInt(total_bet_amt);
        if(total_win_loss < 0)
        {
            win_loss_label = "LOSS";
        }
        else{
            win_loss_label = "WIN"; 
        }
    }
    else if(type == 3)
    {
        [wing_betting_list] = await connection.query('SELECT sum(money) as sum , count(*) as count , sum(CASE WHEN status = "1" THEN get ELSE NULL END) AS win_amt FROM minutes_1 WHERE `phone` = ? AND status NOT IN ( 0 ) AND YEARWEEK(`today`, 1) = YEARWEEK(CURDATE(), 1) GROUP BY `stage` DESC;', [phone]);
        [k3_betting_list] = await connection.query('SELECT sum(money) as sum , count(*) as count , sum(CASE WHEN status = "1" THEN get ELSE NULL END) AS win_amt FROM result_k3 WHERE `phone` = ? AND status NOT IN ( 0 ) AND YEARWEEK(`today`, 1) = YEARWEEK(CURDATE(), 1) GROUP BY `stage` DESC;', [phone]);
        [d5_betting_list] = await connection.query('SELECT sum(money) as sum , count(*) as count , sum(CASE WHEN status = "1" THEN get ELSE NULL END) AS win_amt FROM result_5d WHERE `phone` = ? AND status NOT IN ( 0 ) AND YEARWEEK(`today`, 1) = YEARWEEK(CURDATE(), 1) GROUP BY `stage` DESC;', [phone]);
        [trx_betting_list] = await connection.query('SELECT sum(money) as sum , count(*) as count , sum(CASE WHEN status = "1" THEN get ELSE NULL END) AS win_amt FROM trx_wingo_bets WHERE `phone` = ? AND status NOT IN ( 0 ) AND YEARWEEK(`today`, 1) = YEARWEEK(CURDATE(), 1) GROUP BY `stage` DESC;', [phone]);
        [[total_wingo_bet]] = await connection.query('SELECT SUM(money) AS `sum` FROM minutes_1 WHERE `phone` = ? AND YEARWEEK(`today`, 1) = YEARWEEK(CURDATE(), 1)  ORDER BY `id` DESC', [phone]);
        [[total_k3_bet]] = await connection.query('SELECT SUM(money) AS `sum` FROM result_k3 WHERE `phone` = ? AND YEARWEEK(`today`, 1) = YEARWEEK(CURDATE(), 1)  ORDER BY `id` DESC', [phone]);
        [[total_d5_bet]] = await connection.query('SELECT SUM(money) AS `sum` FROM result_5d WHERE `phone` = ? AND YEARWEEK(`today`, 1) = YEARWEEK(CURDATE(), 1)  ORDER BY `id` DESC', [phone]);
        [[total_trx_bet]] = await connection.query('SELECT SUM(money) AS `sum` FROM trx_wingo_bets WHERE `phone` = ? AND YEARWEEK(`today`, 1) = YEARWEEK(CURDATE(), 1)  ORDER BY `id` DESC', [phone]);
        [[total_wingo_win_amt]] = await connection.query('SELECT SUM(get) AS `sum` FROM minutes_1 WHERE `phone` = ? AND YEARWEEK(`today`, 1) = YEARWEEK(CURDATE(), 1) AND `status` = 1  ORDER BY `id` DESC', [phone]);
        [[total_k3_win_amt]] = await connection.query('SELECT SUM(get) AS `sum` FROM result_k3 WHERE `phone` = ? AND YEARWEEK(`today`, 1) = YEARWEEK(CURDATE(), 1) AND `status` = 1  ORDER BY `id` DESC', [phone]);
        [[total_d5_win_amt]] = await connection.query('SELECT SUM(get) AS `sum` FROM result_5d WHERE `phone` = ? AND YEARWEEK(`today`, 1) = YEARWEEK(CURDATE(), 1) AND `status` = 1  ORDER BY `id` DESC', [phone]);
        [[total_trx_win_amt]] = await connection.query('SELECT SUM(get) AS `sum` FROM trx_wingo_bets WHERE `phone` = ? AND YEARWEEK(`today`, 1) = YEARWEEK(CURDATE(), 1) AND `status` = 1  ORDER BY `id` DESC', [phone]);
        var tt_wingo_bets = total_wingo_bet.sum || 0 ;
        var tt_k3_bets = total_k3_bet.sum || 0 ;
        var tt_d5_bets = total_d5_bet.sum || 0 ;
        var tt_trx_bets = total_trx_bet.sum || 0 ;
        var ttw_wingo_bets = total_wingo_win_amt.sum || 0 ;
        var ttw_k3_bets = total_k3_win_amt.sum || 0 ;
        var ttw_d5_bets = total_d5_win_amt.sum || 0 ;
        var ttw_trx_bets = total_trx_win_amt.sum || 0 ; 
        total_bet_amt +=  parseInt(tt_wingo_bets) + parseInt(tt_k3_bets) + parseInt(tt_d5_bets) + parseInt(tt_trx_bets);
        total_win_amt +=  parseInt(ttw_wingo_bets) + parseInt(ttw_k3_bets) + parseInt(ttw_d5_bets) + parseInt(ttw_trx_bets);
        total_win_loss = parseInt(total_win_amt) - parseInt(total_bet_amt);
        if(total_win_loss < 0)
        {
            win_loss_label = "LOSS";
        }
        else{
            win_loss_label = "WIN"; 
        }
    }
    else if(type == 4)
    {
        [wing_betting_list] = await connection.query('SELECT sum(money) as sum , count(*) as count , sum(CASE WHEN status = "1" THEN get ELSE NULL END) AS win_amt FROM minutes_1 WHERE `phone` = ? AND status NOT IN ( 0 ) AND MONTH(`today`) = MONTH(CURRENT_DATE()) AND YEAR(`today`) = YEAR(CURRENT_DATE()) GROUP BY `stage` DESC;', [phone]);
        [k3_betting_list] = await connection.query('SELECT sum(money) as sum , count(*) as count , sum(CASE WHEN status = "1" THEN get ELSE NULL END) AS win_amt FROM result_k3 WHERE `phone` = ? AND status NOT IN ( 0 ) AND MONTH(`today`) = MONTH(CURRENT_DATE()) AND YEAR(`today`) = YEAR(CURRENT_DATE()) GROUP BY `stage` DESC;', [phone]);
        [d5_betting_list] = await connection.query('SELECT sum(money) as sum , count(*) as count , sum(CASE WHEN status = "1" THEN get ELSE NULL END) AS win_amt FROM result_5d WHERE `phone` = ? AND status NOT IN ( 0 ) AND MONTH(`today`) = MONTH(CURRENT_DATE()) AND YEAR(`today`) = YEAR(CURRENT_DATE()) GROUP BY `stage` DESC;', [phone]);
        [trx_betting_list] = await connection.query('SELECT sum(money) as sum , count(*) as count , sum(CASE WHEN status = "1" THEN get ELSE NULL END) AS win_amt FROM trx_wingo_bets WHERE `phone` = ? AND status NOT IN ( 0 ) AND MONTH(`today`) = MONTH(CURRENT_DATE()) AND YEAR(`today`) = YEAR(CURRENT_DATE()) GROUP BY `stage` DESC;', [phone]);
        [[total_wingo_bet]] = await connection.query('SELECT SUM(money) AS `sum` FROM minutes_1 WHERE `phone` = ? AND MONTH(`today`) = MONTH(CURRENT_DATE()) AND YEAR(`today`) = YEAR(CURRENT_DATE())  ORDER BY `id` DESC', [phone]);
        [[total_k3_bet]] = await connection.query('SELECT SUM(money) AS `sum` FROM result_k3 WHERE `phone` = ? AND MONTH(`today`) = MONTH(CURRENT_DATE()) AND YEAR(`today`) = YEAR(CURRENT_DATE())  ORDER BY `id` DESC', [phone]);
        [[total_d5_bet]] = await connection.query('SELECT SUM(money) AS `sum` FROM result_5d WHERE `phone` = ? AND MONTH(`today`) = MONTH(CURRENT_DATE()) AND YEAR(`today`) = YEAR(CURRENT_DATE())  ORDER BY `id` DESC', [phone]);
        [[total_trx_bet]] = await connection.query('SELECT SUM(money) AS `sum` FROM trx_wingo_bets WHERE `phone` = ? AND MONTH(`today`) = MONTH(CURRENT_DATE()) AND YEAR(`today`) = YEAR(CURRENT_DATE())  ORDER BY `id` DESC', [phone]);
        [[total_wingo_win_amt]] = await connection.query('SELECT SUM(get) AS `sum` FROM minutes_1 WHERE `phone` = ? AND MONTH(`today`) = MONTH(CURRENT_DATE()) AND YEAR(`today`) = YEAR(CURRENT_DATE()) AND `status` = 1  ORDER BY `id` DESC', [phone]);
        [[total_k3_win_amt]] = await connection.query('SELECT SUM(get) AS `sum` FROM result_k3 WHERE `phone` = ? AND MONTH(`today`) = MONTH(CURRENT_DATE()) AND YEAR(`today`) = YEAR(CURRENT_DATE()) AND `status` = 1  ORDER BY `id` DESC', [phone]);
        [[total_d5_win_amt]] = await connection.query('SELECT SUM(get) AS `sum` FROM result_5d WHERE `phone` = ? AND MONTH(`today`) = MONTH(CURRENT_DATE()) AND YEAR(`today`) = YEAR(CURRENT_DATE()) AND `status` = 1  ORDER BY `id` DESC', [phone]);
        [[total_trx_win_amt]] = await connection.query('SELECT SUM(get) AS `sum` FROM trx_wingo_bets WHERE `phone` = ? AND MONTH(`today`) = MONTH(CURRENT_DATE()) AND YEAR(`today`) = YEAR(CURRENT_DATE()) AND `status` = 1  ORDER BY `id` DESC', [phone]);
        var tt_wingo_bets = total_wingo_bet.sum || 0 ;
        var tt_k3_bets = total_k3_bet.sum || 0 ;
        var tt_d5_bets = total_d5_bet.sum || 0 ;
        var tt_trx_bets = total_trx_bet.sum || 0 ;
        var ttw_wingo_bets = total_wingo_win_amt.sum || 0 ;
        var ttw_k3_bets = total_k3_win_amt.sum || 0 ;
        var ttw_d5_bets = total_d5_win_amt.sum || 0 ;
        var ttw_trx_bets = total_trx_win_amt.sum || 0 ; 
        total_bet_amt +=  parseInt(tt_wingo_bets) + parseInt(tt_k3_bets) + parseInt(tt_d5_bets) + parseInt(tt_trx_bets);
        total_win_amt +=  parseInt(ttw_wingo_bets) + parseInt(ttw_k3_bets) + parseInt(ttw_d5_bets) + parseInt(ttw_trx_bets);
        total_win_loss = parseInt(total_win_amt) - parseInt(total_bet_amt);
        if(total_win_loss < 0)
        {
            win_loss_label = "LOSS";
        }
        else{
            win_loss_label = "WIN"; 
        }
    }
    return res.status(200).json({
        message: 'Successful',//Register Sucess
        status: true,
        wingo_betting: wing_betting_list,
        k3_betting: k3_betting_list,
        trx_betting: trx_betting_list,
        d5_betting: d5_betting_list,
        total_bet: total_bet_amt,
        winning_amount:total_win_loss,
        win_loss_label:win_loss_label,
        no_of_bets:wing_betting_list.length + k3_betting_list.length + d5_betting_list.length + trx_betting_list.length
    });
}
        
 
module.exports = {
    get_manual_upi_id,
    getmybets,
    get_lang_data,
    set_lang_data,
    getlang_datacall,
    userInfo,
    changeUser,
    promotion,
    myTeam,
    wowpay,
    recharge,
    recharge2,
    listRecharge,
    listWithdraw,
    changePassword,
    checkInHandling,
    check_login_val,
    infoUserBank,
    addBank,
    withdrawal3,
    transfer,
    transferHistory,
    callback_bank,
    listMyTeam,
    verifyCode,
    aviator,
    useRedenvelope,
    search,
    updateRecharge,
    confirmRecharge,
    cancelRecharge,
    confirmUSDTRecharge,
    getnotificationCount,
    getnotifications,
    updatenotifications,
    xpgain_value,
    username_transfer,
    phone_transfer,
    user_id_transfer,
    getsandbox,
}