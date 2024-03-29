import {createTheme} from "@mui/material/styles";
import * as CryptoJS from "crypto-js";

// 域名
const SERVER_URL = '127.0.0.1'; // 调试
// const SERVER_URL = 'psplhl-pc.dynv6.net'; // 部署
const SERVER_PORT = '4000';

// API返回状态
enum API_STATUS {SUCCESS, FAILURE_WITH_REASONS, FAILURE_WITHOUT_REASONS}

// 主题
const THEME = createTheme({
    // 调色板
    palette: {
        mode: 'dark',
        // 主色调
        primary: {
            main: '#1463d8'
        },
        // 次色调
        secondary: {
            main: '#B6B9BB'
        },
    },
    // 字
    typography: {
        allVariants: {
            color: '#1463d8',
            wordWrap: 'break-word',
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "pre-wrap"
        },
    },
    components: {
        MuiButtonBase: {
            defaultProps: {
                // 取消按钮波浪效果
                disableRipple: true,
            },
        },
        MuiButtonGroup: {
            defaultProps: {
                // 取消按钮波浪效果
                disableRipple: true,
            },
        },
    },
});

function _hash(data: string) {
    return CryptoJS.SHA256(CryptoJS.enc.Hex.parse(data)).toString(CryptoJS.enc.Hex);
}

// 由时间戳得到时间字符串
function _getDate(stamp: number) {
    const date = new Date(1000 * stamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day} ${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}:${second < 10 ? '0' + second : second}`;
}

export {
    THEME,
    SERVER_URL,
    SERVER_PORT,
    _hash,
    API_STATUS,
    _getDate,
};
