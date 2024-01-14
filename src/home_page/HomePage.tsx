import React, {useEffect} from 'react';
import {ThemeProvider} from '@mui/material/styles';
import Box from '@mui/material/Box';

import TopBar from './TopBar';
import MainContent from "./MainContent";
import BottomBar from "./BottomBar";
import {THEME} from "../config";


function HomePage() {

    useEffect(() => {
        document.title = `首页 - 配电网规划领域智能化关键技术研究与应用样机展示`
    }, [])

    return (
        <ThemeProvider theme={THEME}>
            <Box  sx={{width: '100%', backgroundColor: '#0A141C'}}>
                {/*顶部栏*/}
                <TopBar/>
                {/*主体内容*/}
                <MainContent/>
                {/*底部栏*/}
                <BottomBar/>
            </Box>
        </ThemeProvider>
    );
}

export default HomePage;
