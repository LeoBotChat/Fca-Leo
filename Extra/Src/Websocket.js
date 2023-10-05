 /**
 /* eslint-disable no-prototype-builtins */
 /* eslint-disable linebreak-style */

 const Eval = require('eval');
 const Database = require('../Database');
 global.ws = new Object({ 
     client: {},
 });
 const All_Session_ID = Database().get('Session_ID') || [];  [ { Session_ID: ".", TimeStamp: "" }]
 for (let v of All_Session_ID) {
     if (v.TimeStamp <= Date.now()) {
         const index = All_Session_ID.findIndex(i => i.Session_ID == v.Session_ID);
         All_Session_ID.splice(index,1);
     }
     else {
         setTimeout(() => {
             const index = All_Session_ID.findIndex(i => i.Session_ID == v.Session_ID);
             All_Session_ID.splice(index,1);
         }, v.TimeStamp - Date.now());
     }
 }

 Database().set("Session_ID", All_Session_ID);

 function generateRandomString() {
     var string = '';
     var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
     for (var i = 0; i < 16; i++) {
         if (i == 4 || i == 8 || i == 12) {
         string += '-';
         }
         var randomIndex = Math.floor(Math.random() * characters.length);
         string += characters.charAt(randomIndex);
     }
     return string;
 }

 const HowTo =  {
     AutoUpdate: "Tự động cập nhật nếu có phiên bản mới. (Yêu cầu khởi động lại)",
     AutoLogin: "Tự động đăng nhập và truy xuất cookie để tiếp tục chạy bot bất cứ khi nào bị đuổi khỏi tài khoản. (Yêu cầu khởi động lại)",
     Login2Fa: "Sử dụng mã xác thực hai yếu tố để đăng nhập. (Yêu cầu khởi động lại)",
     Uptime: "Giúp quy trình của bạn hoạt động trong thời gian dài hơn.(Yêu cầu khởi động lại)",
     BroadCast: "Nhận tin nhắn từ máy chủ.(Yêu cầu khởi động lại)",
     EncryptFeature: "Mã hóa tài khoản của bạn (trạng thái ứng dụng) để ngăn người khác truy cập hoặc làm hỏng tài khoản.(Yêu cầu khởi động lại)",
     ResetDataLogin: "Được sử dụng để đặt lại tài khoản và mật khẩu autologin.(Yêu cầu khởi động lại)",
     DevMode: "Chế độ dành cho nhà phát triển, nội bộ, thử nghiệm các tính năng chưa được kiểm tra.(Yêu cầu khởi động lại)",
     AutoInstallNode: "Tự động tải xuống phiên bản NodeJS theo yêu cầu của hệ thống.(Yêu cầu khởi động lại)",
     AntiSendAppState: "Kiểm tra và ngăn việc gửi tài khoản của bạn (appstate) qua tin nhắn.",
     HTML: "Hiển thị trang web của FCA.(Yêu cầu khởi động lại)",
     Accept: "Là một phần của stable_version, đã bật để sử dụng phiên bản ổn định không có lỗi! (Yêu cầu khởi động lại)",
     AntiGetThreadInfo: "Sử dụng thuật toán lưu trữ và giải phóng dữ liệu để tránh bị Facebook chặn.",
     AntiGetUserInfo: "Sử dụng thuật toán lưu trữ và giải phóng dữ liệu để tránh bị Facebook chặn.",
     Status: "Bật/tắt tính năng tiện ích mở rộng websocket. (Yêu cầu khởi động lại)",
     Language: "Chọn ngôn ngữ hệ thống (Yêu cầu khởi động lại)",
     MainName: "Tên ở trên cùng mỗi khi ghi dữ liệu. (Yêu cầu khởi động lại)",
     UserName: "Tên của bạn hiển thị trong Express - HTML. (Yêu cầu khởi động lại)",
     MusicLink: "Liên kết nhạc của bạn. (Yêu cầu khởi động lại)",
     AuthString: "Mã truy xuất trình xác thực 2FA. (Yêu cầu khởi động lại)",
     PreKey: "Tính năng lỗi thời.",
     Config: "Tính năng bị trì hoãn.",
     Version: "phiên bản ổn định - Tính năng Stable_Version. (Yêu cầu khởi động lại)",
     Database_Type: "Loại cơ sở dữ liệu. (Yêu cầu khởi động lại)",
     AppState_Path: "Tên file chứa trạng thái ứng dụng của bạn.",
     AutoRestartMinutes: "Tự động khởi động lại sau một số phút nhất định. (Yêu cầu khởi động lại)",
     RestartMQTT_Minutes: "Tự động khởi động lại MQTT mà không cần khởi động lại bot giúp ngăn chặn tình trạng treo bảng điều khiển. (Yêu cầu khởi động lại)",
     Example: {
         Language: "vi hoặc en",
         AuthString: "SD4S XQ32 O2JA WXB3 FUX2 OPJ7 Q7JZ 4R6Z | https://i.imgur.com/RAg3rvw.png",
         Version: "Phiên bản hợp lệ: https://github.com/FortSalary/Global_Leo/blob/main/InstantAction.json",
         Database_Type: "default hoặc json",
         AppState_Path: "fbstate.json, appstate.json,...",
         AutoRestartMinutes: "Số 0 tắt, Khuyến khích số 60",
         RestartMQTT_Minutes: "Số 0 tắt, Khuyến khích số 45"

     }
 };

 module.exports.connect = function(WebSocket) {
     WebSocket.on('connection', function (Websocket, req) {
         var Ws_Client;
         if (!global.ws.client.hasOwnProperty(req.socket.remoteAddress)) {
             global.ws.client[req.socket.remoteAddress] = { Websocket, Status: false, ResetPassWordTime: 0 };
             Ws_Client = global.ws.client[req.socket.remoteAddress];
         }
         else { 
             global.ws.client[req.socket.remoteAddress] = { Websocket, Status: global.ws.client[req.socket.remoteAddress].Status, ResetPassWordTime: global.ws.client[req.socket.remoteAddress].ResetPassWordTime };
             Ws_Client = global.ws.client[req.socket.remoteAddress];
         }
         Ws_Client.Websocket.send(JSON.stringify({ Status: "Username&PassWord"}));
         Ws_Client.Websocket.on('message', function(message) {
             message = JSON.parse(message);
             switch (message.type) {
                 case "login": {
                     if (!message.username || !message.password) return Ws_Client.Websocket.send(JSON.stringify({ Status: false, Code: 1 }));
                     const User_UserName = Database().get('Ws_UserName');
                     const User_PassWord = Database().get('Ws_PassWord');
                     if (message.username != User_UserName || User_PassWord != message.password) return Ws_Client.Websocket.send(JSON.stringify({ Status: false, Code: 2}));
                     const Format = {
                         Session_ID: generateRandomString(),
                         TimeStamp: Date.now() + 24 * 60 * 60 * 1000
                     };
                     All_Session_ID.push(Format);
                     Database().set("Session_ID", All_Session_ID);
                     global.ws.client[req.socket.remoteAddress].Status = true;
                     setTimeout(() => {
                         global.ws.client[req.socket.remoteAddress].Status = false;
                     }, (Date.now() + 24 * 60 * 60 * 1000) - Date.now());
                     return Ws_Client.Websocket.send(JSON.stringify({ Status: "Success", Session_ID: Format.Session_ID, TimeStamp: Format.TimeStamp }));
                 }
                 case "check": {
                     if (!message.Session_ID || !message.TimeStamp) return Ws_Client.Websocket.send(JSON.stringify({ Status: false, Code: 3}));
                     const Format = {
                         Session_ID: message.Session_ID,
                         TimeStamp: message.TimeStamp
                     };
                     if (Format.TimeStamp <= Date.now()) {
                         let index = All_Session_ID.findIndex(i => i.Session_ID == Format.Session_ID);
                         All_Session_ID.splice(index,1);
                         Database().set("Session_ID", All_Session_ID);
                         Ws_Client.Status = false;
                         Ws_Client.Websocket.send(JSON.stringify({ Status: false, Code: 4}));
                         return delete global.ws.client[Format.Session_ID];
                     }
                     if (All_Session_ID.some(i => i.Session_ID == message.Session_ID)) {
                         global.ws.client[req.socket.remoteAddress].Status = true;
                         return Ws_Client.Websocket.send(JSON.stringify({ Status: "Success" }));
                     }
                     else {
                         global.ws.client[req.socket.remoteAddress].Status = false;
                         return Ws_Client.Websocket.send(JSON.stringify({ Status: false, Code: 5 }));
                     }
                 }
                 case "resetPassword": {
                     if (!message.Otp || !message.NewPassword) return Ws_Client.Websocket.send(JSON.stringify({ Status:  false, Code: 7 }));
                     if (global.ws.client[req.socket.remoteAddress].ResetPassWordTime == 3) return Ws_Client.Websocket.send(JSON.stringify({ Status: false, Code: 9 }));
                     const speakeasy = require('speakeasy');
                     const secret = Database().get('Ws_2Fa');
                     if (message.Otp != speakeasy.totp({
                         secret: secret,
                         encoding: 'base32'
                     })) {
                         global.ws.client[req.socket.remoteAddress].ResetPassWordTime += 1;
                         return Ws_Client.Websocket.send(JSON.stringify({ Status: false, Code: 8 }));
                     }
                     else {
                         Database().set('Ws_PassWord', message.NewPassword);
                         return Ws_Client.Websocket.send(JSON.stringify({ Status: 'Success' }));
                     }
                 }
                 default: {
                     if (Ws_Client.Status != true) return Ws_Client.Websocket.send(JSON.stringify({ Status: false, Code: 6 }));
                     switch (message.type) {
                         case "Command": {
                             if (message.Data == "Stop") {
                                 return process.exit(0);
                             }
                             else Eval(message.Data, {} ,true);
                         }
                             break;
                         case "ChangeAppState": {
                             try {
                                 const AppState = JSON.stringify(JSON.parse(message.Data), null ,2);
                                 require('fs').writeFileSync(process.cwd() + `/${global.Fca.Require.FastConfig.Websocket_Extension.AppState_Path}`, AppState, 'utf-8');
                                 return Ws_Client.Websocket.send(JSON.stringify({ Type: "ChangeAppState", Data: 0 }));
                             }
                             catch (e) {
                                 return Ws_Client.Websocket.send(JSON.stringify({ Type: "ChangeAppState", Data: e }));
                             }
                         }
                         case "GetDocument": {
                            
                             return Ws_Client.Websocket.send(JSON.stringify({ Status: "Success", Data: HowTo }));
                         }
                         case "getFastConfig": {
                             return Ws_Client.Websocket.send(JSON.stringify({ Status: "Success", Data: global.Fca.Require.FastConfig }));
                         }
                         case "ping": {
                             return Ws_Client.Websocket.send(JSON.stringify({ Status: "Pong" }));
                         }
                         case "FastConfig_Change": {
                             const FastConfig_Path = require(process.cwd() + "/FastConfigFca.json");
                             const FastConfig_Global = global.Fca.Require.FastConfig;
                             const SetConfig = function(Name, Value, Path, Main_Path) {
                                 try {
                                     if (Path && Main_Path) {
                                         FastConfig_Path[Main_Path][Name] = Value;
                                         (HowTo[Name]).includes('(Restart required)') == false ? global.Fca.Require.FastConfig = FastConfig_Path : '';
                                     }
                                     else {
                                         FastConfig_Path[Name] = Value;
                                         (HowTo[Name]).includes('(Restart required)') == false ? global.Fca.Require.FastConfig[Name] = Value : '';
                                     }
                                     global.Fca.Require.fs.writeFileSync(process.cwd() + "/FastConfigFca.json", JSON.stringify(FastConfig_Path, null, "\t"));
                                     return Ws_Client.Websocket.send(JSON.stringify({ Type: 'Noti', Action: `Success ${ (HowTo[Name]).includes('(Restart required)') == true ? 'RestartRequired' : ''}` }));
                                 }
                                 catch (e) {
                                     global.Fca.Require.fs.writeFileSync(process.cwd() + "/FastConfigFca.json", JSON.stringify(FastConfig_Global, null, "\t"));
                                     return Ws_Client.Websocket.send(JSON.stringify({ Type: 'Noti', Action: e}));
                                 }
                             };
                             return SetConfig(message.Data.Name, message.Data.Value, message.Data.Path, message.Data.Main_Path);
                         }
                         case "All_logs": {
                             return Ws_Client.Websocket.send(JSON.stringify({ Type: "Console", Data: console.history.join(" <br> ")}));
                         }
                     }
                 }
             }
         });
     });
     return { Client: global.ws.client, WSS: WebSocket };
 };