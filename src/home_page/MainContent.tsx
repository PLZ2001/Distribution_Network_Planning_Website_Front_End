import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import {useNavigate} from "react-router-dom";
import TopMenu from "./TopMenu";
import {_getDate, _hash, API_STATUS} from "../config";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FilePresentOutlinedIcon from '@mui/icons-material/FilePresentOutlined';
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import {api_submit_files, api_get_distribution_network} from "../api/api";
import Button from '@mui/material/Button';
import Grid from "@mui/material/Unstable_Grid2";
import type { LineLayerProps } from '@antv/larkmap';
import { LarkMap, LayerPopup, LineLayer, PointLayer, MapThemeControl } from '@antv/larkmap';
import type { PointLayerProps } from '@antv/larkmap';
import type { LarkMapProps } from '@antv/larkmap';
import Graphin, { Behaviors, Utils } from '@antv/graphin';


function DxfUpload(p:{submit_success: boolean, set_submit_success: (value: (((prevState: boolean) => boolean) | boolean)) => void }) {
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

    const [submit_clicked, set_submit_clicked] = useState(false);
    const [reload_clicked, set_reload_clicked] = useState(false);

    const [other_files_selected, set_other_files_selected] = useState([{
        name: "",
        display_name: "",
        url: "",
        file: new File([], "")
    }])

    const [other_files_order, set_other_files_order] = useState([0])

    const handleOtherFile = (files: FileList | null) => {
        if (files) {
            if (files.length > 0) {
                let _other_files_selected = [];
                let _other_files_order = [];
                for (let i = 0; i < files.length; i++) {
                    _other_files_selected.push({
                        name: _hash(files[i].name + time_stamp) + "-" + files[i].name.replaceAll(" ", "+"),
                        display_name: files[i].name,
                        url: URL.createObjectURL(files[i]),
                        file: files[i]
                    })
                    _other_files_order.push(i);
                }
                set_other_files_selected(_other_files_selected)
                set_other_files_order(_other_files_order)
                set_submit_clicked(true);
                p.set_submit_success(false);
            }
        }
    }

    useEffect(()=>{
        if (submit_clicked && other_files_selected.length > 0) {
            if (other_files_selected[0].name.length > 0) {
                handleFileSubmit();
                get_distribution_network(true);
            }
        }
    }, [submit_clicked])

    const handleFileSubmit = async () => {
        const post_id = "dxfs";
        let result = await api_submit_files(post_id, other_files_selected, other_files_order);
        if (result.status == API_STATUS.SUCCESS) {
            p.set_submit_success(true);
            set_submit_clicked(false);
        } else if (result.status == API_STATUS.FAILURE_WITH_REASONS) {
            p.set_submit_success(false);
            set_submit_clicked(false);
            navigate(`/error`, {replace: false, state: {error: result.reasons}})
        } else if (result.status == API_STATUS.FAILURE_WITHOUT_REASONS) {
            p.set_submit_success(false);
            set_submit_clicked(false);
            navigate(`/error`, {replace: false, state: {error: null}})
        }
    }

    const [distribution_network, set_distribution_network] = useState({
        name: "",
        lines: [{path: [], feeder_name: "", feeder_type: "", line_length: 0, power_supply_unit_name: ""}],
        dots: [{center_x: 0, center_y: 0, name: "", dot_type: "", power_supply_unit_name: ""}],
        graph: {
            node: [{id: "", x: 0, y: 0, data: {type: ""}, style: {keyshape:{size:0, fill:""}, label:{value:"", position:"", fontSize: 0}}}],
            edge: [{source:"", target: ""}],
        },
        simple_graph: {
            node: [{id: "", x: 0, y: 0, data: {type: ""}, style: {keyshape:{size:0, fill:""}, label:{value:"", position:"", fontSize: 0}}}],
            edge: [{source:"", target: ""}],
        }
    });

    useEffect(() => {
        get_distribution_network(false);
    }, [])

    const get_distribution_network = async (reload: boolean) => {
        if (reload) {
            set_reload_clicked(true);
        }
        api_get_distribution_network(reload).then((result) => {
            if (result.status == API_STATUS.SUCCESS) {
                set_distribution_network(result.data);
                set_reload_clicked(false);
            } else if (result.status == API_STATUS.FAILURE_WITH_REASONS) {
                set_reload_clicked(false);
                navigate(`/error`, {replace: false, state: {error: result.reasons}})
            } else if (result.status == API_STATUS.FAILURE_WITHOUT_REASONS) {
                set_reload_clicked(false);
                navigate(`/error`, {replace: false, state: {error: null}})
            }
        })
    }

    const config: LarkMapProps = {
        mapType: 'Gaode',
        mapOptions: {
            style: 'grey',
            minZoom: 2,
            maxZoom: 19,
        },
    };


    const lineLayerOptions: Omit<LineLayerProps, 'source'> = {
        autoFit: true,
        shape: 'line' as const,
        size: 1.5,
        color: {
            field: 'feeder_name',
            value: ['#00A6FF', '#FF8B00'],
        },
        state: { active: { color: '#FFF684' } },
        style: {
            opacity: 0.8,
            lineType: 'solid',
        },
    };

    const dotLayerOptions: Omit<PointLayerProps, 'source'> = {
        autoFit: true,
        shape: {
            field: 'dot_type',
            value: ({ dot_type }) => {
                if (dot_type == "高压变电站") {
                    return "triangle"
                } else if (dot_type == "环网柜/联络柜" || dot_type == "配电台变") {
                    return "square"
                } else {
                    return "circle"
                }
            }
        },
        size: {
            field: 'dot_type',
            value: ({ dot_type }) => {
                if (dot_type == "高压变电站") {
                    return 10
                } else if (dot_type == "环网柜/联络柜" || dot_type == "配电台变") {
                    return 5
                } else {
                    return 2
                }
            }
        },
        color: {
            field: 'dot_type',
            value: ({ dot_type }) => {
                if (dot_type == "高压变电站") {
                    return "#FF3900"
                } else if (dot_type == "环网柜/联络柜" || dot_type == "配电台变") {
                    return "#00FF76"
                } else {
                    return "#808080"
                }
            }
        },
        state: { active: { color: '#FFF684' } },
        style: {
            opacity: 0.8,
        },
    };

    const [lineOptions, setLineOptions] = useState(lineLayerOptions);
    const [lineSource, setLineSource] = useState({
        data: [{path: [[113.27143, 23.13534]], feeder_name: "", feeder_type: "", line_length: 0, power_supply_unit_name: ""}],
        parser: { type: 'json', coordinates: 'path' },
    });

    const [dotOptions, setDotOptions] = useState(dotLayerOptions);
    const [dotSource, setDotSource] = useState({
        data: [{center_x: 113.27143, center_y: 23.13534, name: "", dot_type: "", power_supply_unit_name: ""}],
        parser: { type: 'json', x: 'center_x', y: 'center_y' },
    });

    const [graphData, setGraphData] = useState({
        nodes: [{id: "", x: 0, y: 0, data: {type: ""}, style: {keyshape:{size:0, fill:""}, label:{value:"", position:"", fontSize: 0}}}],
        edges: [{source:"", target: ""}],
    });

    const [simpleGraphData, setSimpleGraphData] = useState({
        nodes: [{id: "", x: 0, y: 0, data: {type: ""}, style: {keyshape:{size:0, fill:""}, label:{value:"", position:"", fontSize: 0}}}],
        edges: [{source:"", target: ""}],
    });

    useEffect(() => {
        if (distribution_network.name.length > 0) {
            setLineSource((prevState) => ({ ...prevState, data: distribution_network.lines }));
            setDotSource((prevState) => ({ ...prevState, data: distribution_network.dots }));
            setGraphData({nodes: distribution_network.graph.node, edges: distribution_network.graph.edge, });
            setSimpleGraphData({nodes: distribution_network.simple_graph.node, edges: distribution_network.simple_graph.edge, });
        }
    }, [distribution_network]);

    const items = [
        {
            layer: 'myLineLayer',
            title: '馈线',
            customContent: (data: {path: [number, number][], feeder_name: string, feeder_type: string, line_length: number, power_supply_unit_name: string}) => {
                return (
                    <Box alignItems="center" sx={{width: '100%'}}>
                        <Typography color="text.secondary"
                                    sx={{fontSize: 'subtitle2.fontSize'}}>
                            类型：{data.feeder_type}
                        </Typography>
                        <Typography color="text.secondary"
                                    sx={{fontSize: 'subtitle2.fontSize'}}>
                            名称：{data.feeder_name}
                        </Typography>
                        <Typography color="text.secondary"
                                    sx={{fontSize: 'subtitle2.fontSize'}}>
                            所属供电单元：{data.power_supply_unit_name}
                        </Typography>
                        <Typography color="text.secondary"
                                    sx={{fontSize: 'subtitle2.fontSize'}}>
                            长度：{data.line_length} 米
                        </Typography>
                    </Box>
                );
            },
        },
        {
            layer: 'myDotLayer',
            title: '兴趣点',
            customContent: (data: {center_x: number, center_y: number, name: string, dot_type: string, power_supply_unit_name: string}) => {
                return (
                    <Box alignItems="center" sx={{width: '100%'}}>
                        <Typography color="text.secondary"
                                    sx={{fontSize: 'subtitle2.fontSize'}}>
                            类型：{data.dot_type}
                        </Typography>
                        <Typography color="text.secondary"
                                    sx={{fontSize: 'subtitle2.fontSize'}}>
                            名称：{data.name}
                        </Typography>
                        <Typography color="text.secondary"
                                    sx={{fontSize: 'subtitle2.fontSize'}}>
                            所属供电单元：{data.power_supply_unit_name}
                        </Typography>
                    </Box>
                );
            },
        },
    ];


    const {
        DragCanvas, // 拖拽画布
        ZoomCanvas, //缩放画布
        ActivateRelations, // 关联高亮
        FitView,
    } = Behaviors;

    return (
        <div>
            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={submit_clicked || reload_clicked}
                onExited={() => {
                }}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            <Paper elevation={0} sx={{width: '100%', borderRadius: '20px'}}>
                <Box sx={{height: '40px', width: '100%'}}/>
                <Box display="flex" justifyContent="center" alignItems="center" sx={{width: '100%'}}>
                    <Stack display="flex" justifyContent="center" alignItems="center" direction="column" sx={{width: '95%'}}>
                        <Grid container spacing={0} sx={{width: '100%'}}>
                            <Grid xs>
                                <Stack display="flex" justifyContent="start" direction="row" alignItems="center"
                                       spacing={1}>
                                    <IconButton aria-label="add file" size="small">
                                        <Stack alignItems="center" display="flex"
                                               justifyContent="start" direction="row"
                                               spacing={1}>
                                            <FilePresentOutlinedIcon/>
                                            <Box alignItems="center" sx={{width: '100%'}}>
                                                <Typography color="text.secondary"
                                                            sx={{fontSize: 'subtitle2.fontSize'}}>
                                                    输入一个或多个配电网CAD文件（仅限*.dxf格式）
                                                </Typography>
                                            </Box>
                                        </Stack>
                                        <input
                                            title=""
                                            type="file"
                                            style={{
                                                position: 'absolute',
                                                opacity: 0,
                                                left: "0",
                                                bottom: "0",
                                                width: "100%",
                                                height: "100%"
                                            }}
                                            accept='.dxf'
                                            multiple
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                handleOtherFile(event.target.files)
                                            }}
                                        />
                                    </IconButton>
                                </Stack>
                            </Grid>
                            <Grid xs>
                                <Stack display="flex" justifyContent="end" direction="row" alignItems="center"
                                       spacing={1}>
                                    <Button variant="outlined" sx={{fontSize: 'subtitle2.fontSize'}} onClick={()=>{get_distribution_network(true);}}>
                                        刷新
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                        <Box sx={{height: '40px', width: '100%'}}/>
                        <Grid container spacing={5} sx={{width: '100%'}}>
                            <Grid xs={6}>
                                <LarkMap {...config} logoVisible={false} style={{ width: '100%', height: '500px' }}>
                                    <MapThemeControl />
                                    <LineLayer {...lineOptions} source={lineSource} id="myLineLayer"/>
                                    <PointLayer {...dotOptions} source={dotSource} id="myDotLayer"/>
                                    <LayerPopup closeButton={true} anchor="bottom-left" trigger="click" items={items} />
                                </LarkMap>
                            </Grid>
                            <Grid xs={6}>
                                <Graphin fitCenter maxZoom={1000} data={simpleGraphData} theme={{ mode: 'dark'}} layout={{ type: 'preset'}} style={{ width: '100%', height: '500px' }}>
                                    <ZoomCanvas  maxZoom={1000} enableOptimize />
                                    <DragCanvas enableOptimize />
                                    <ActivateRelations/>
                                    <FitView/>
                                </Graphin>
                            </Grid>
                        </Grid>
                    </Stack>
                </Box>
                <Box sx={{height: '40px', width: '100%'}}/>
            </Paper>
        </div>
    )
}

function MainContent() {
    const [submit_success, set_submit_success] = useState(false);
    return (
        <Box sx={{
            width: '100%',
            background: '#0A141C',
            borderRadius: '20px',
            minHeight: `calc(${window.innerHeight}px - 92px)`
        }}>
            <Box sx={{
                width: '100%',
                background: '#0A141C',
                borderRadius: '20px',
                minHeight: `calc(${window.innerHeight}px - 92px)`
            }}>
                <Box sx={{height: '10px', width: '100%'}}/>
                <Box display="flex" justifyContent="center" alignItems="center" sx={{width: '100%'}}>
                    <TopMenu/>
                </Box>
                <Box display="flex" justifyContent="center" alignItems="center" sx={{width: '100%'}}>
                    <Stack spacing={2} sx={{width: '95%'}}>
                        <Box sx={{height: '10px', width: '100%'}}/>
                        <DxfUpload submit_success={submit_success} set_submit_success={set_submit_success}/>
                        <Box sx={{height: '50px', width: '100%'}}/>
                    </Stack>
                </Box>
            </Box>
        </Box>
    )
}

export default MainContent;