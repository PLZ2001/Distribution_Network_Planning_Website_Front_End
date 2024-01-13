import React from 'react';
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";

function TopMenu() {
    return (
        <Stack display="flex" justifyContent="center" direction="row"
               divider={<Divider orientation="vertical" flexItem/>} spacing={2}>
            <Link href={'/'} underline="hover">
                <Button color='secondary'
                        sx={{fontSize: 'subtitle1.fontSize', letterSpacing: 3}}>首页</Button>
            </Link>
            <Link href={'/annual'} underline="hover">
                <Button color='secondary'
                        sx={{fontSize: 'subtitle1.fontSize', letterSpacing: 3}}>配电网规划问题智能诊断样机</Button>
            </Link>
            <Link href={'/forum'} underline="hover">
                <Button color='secondary'
                        sx={{fontSize: 'subtitle1.fontSize', letterSpacing: 3}}>10千伏馈线及配变负荷增长异常诊断样机</Button>
            </Link>
            <Link href={'/ftp/root>'} underline="hover">
                <Button color='secondary'
                        sx={{fontSize: 'subtitle1.fontSize', letterSpacing: 3}}>配电网目标网架智能生成样机</Button>
            </Link>
        </Stack>
    )
}

export default TopMenu;
