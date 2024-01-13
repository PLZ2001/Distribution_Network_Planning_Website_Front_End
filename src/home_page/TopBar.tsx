import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import {useNavigate} from "react-router-dom";
import {_getDate} from "../config";
import Typography from "@mui/material/Typography";



function TopBar() {
    const navigate = useNavigate()

    const [formatted_time, set_formatted_time] = useState("")
    const [time_stamp, set_time_stamp] = useState(0)
    const get_time_now = () => {
        const date = new Date();
        const time_stamp = date.getTime() / 1000;
        const formatted_time = _getDate(time_stamp);
        return {"formatted_time": formatted_time, "time_stamp": time_stamp};
    }
    setInterval(() => {
        const result = get_time_now();
        set_formatted_time(result.formatted_time);
        set_time_stamp(result.time_stamp);
    }, 1000)

    return (
        <Box sx={{width: '100%', backgroundColor: '#ffffff'}}>
            <Box sx={{height: '3px', width: '100%'}}/>
            <Grid container spacing={0}>
                <Grid xs={1}/>
                <Grid xs>
                    <Stack display="flex" justifyContent="center" alignItems="center" direction="column">
                        <Box display="flex" justifyContent="center" alignItems="center" sx={{paddingTop: '5px'}}>
                            <Typography fontWeight="bold" sx={{fontSize: 'h4.fontSize', letterSpacing: 3}}>
                                配电网规划领域智能化关键技术研究与应用样机展示
                            </Typography>
                        </Box>
                        <Box display="flex" justifyContent="center" alignItems="center" sx={{paddingTop: '5px', paddingBottom: '5px'}}>
                            <Typography color="text.secondary" sx={{fontSize: 'subtitle2.fontSize'}}>
                                当前时间：{formatted_time}
                            </Typography>
                        </Box>
                    </Stack>
                </Grid>
                <Grid xs={1}/>
            </Grid>
            <Box sx={{height: '3px', width: '100%'}}/>
        </Box>
    )
}

export default TopBar;
