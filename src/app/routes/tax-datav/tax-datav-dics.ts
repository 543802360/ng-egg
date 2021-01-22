import { _HttpClient } from "@delon/theme";
import { forkJoin } from "rxjs";

const MLMC = [
    '农业',
    '林业',
    '畜牧业',
    '渔业',
    '农、林、牧、渔专业及辅助性活动',
    '采矿业',
    '制造业',
    '电力、热力、燃气及水生产和供应业',
    '建筑业',
    '批发和零售业',
    '交通运输、仓储和邮政业',
    '住宿和餐饮业',
    '信息传输、软件和信息技术服务业',
    '金融业',
    '房地产业',
    '租赁和商务服务业',
    '科学研究和技术服务业',
    '水利、环境和公共设施管理业',
    '居民服务、修理和其他服务业',
    '教育',
    '卫生和社会工作',
    '文化、体育和娱乐业',
    '公共管理、社会保障和社会组织',
    '国际组织',
    '税务管理特定行业',
];


const ZSXM = {
    ZZS: "增值税",
    XFS: "消费税",
    QYSDS: "企业所得税",
    ZYS: "资源税",
    CZTDSYS: "城镇土地使用税",
    CJS: "城建税",
    YHS: "印花税",
    TDZZS: "土地增值税",
    FCS: "房产税",
    CCS: "车船税",
    CLGZS: "车辆购置税",
    YYS: "烟叶税",
    GDZYS: "耕地占用税",
    QS: "契税",
    HJBHS: "环境保护税",
    QTSS: "其他税收"
}
const SYJG = {
    ybnsr: '一般纳税人',
    xgm: '小规模纳税人',
    dwnsr: '单位纳税人',
    gtnsr: '个体纳税人',
    zch: '正常户',
    fzch: '非正常户',
    xxwlqy: '小型微利企业',
    nsh: '纳税户'

}
//税源结构item接口
interface ISyjgItem {
    SWJG_DM: string,
    SWJGJC: string,
    LB: string,
    BL: number,
    FLSL: number,
    GLHSL: number,
    SSGX
}

// 税收分级次item接口
interface ISsfjcItem {
    SE_HJ_LJ_BQ?: number,
    SE_HJ_LJ_BQ_ZJBL?: number,
    SE_HJ_LJ_BQ_ZJE?: number,
    SWJG_MC?: string
}
// 分税种zsxm接口
interface IZsxmItem {
    BTQ: number,
    BTQSE: number,
    LJBTQ: number,
    LJBTQSE: number,
    LJSRE: number,
    ROW_ID: number,
    SRE: number,
    ZSXM_DM: string,
    ZSXM_MC: string,
};
//分行业Item接口
interface IHyItem {
    HY_DM: string,
    HY_MC: string,
    SE_HJ: number,
    SE_HJ_ZJBL: number,
    SE_HJ_ZJE: number,
};

const DJZCLX = {
    100: '内资企业',
    200: '港、澳、台商投资企业',
    300: '外商投资企业',
    400: '个体经营',
    500: '非企业单位',
    900: '其他'
}

// mapbox pos参数
const MAPBOX_POS = {
    center: [120.657985, 37.24082995331422],
    pitch: 35,
    bearing: -10.441292648171384,
    zoom: 7.899747984494937
}
const DEFAULT_SWJG_DM = '13706000000';

// http://140.68.16.96:10920/api/bdg/enterprise/tax/zsxm?nsrmc year=2020&startMonth=1&endMonth=12&budgetValue=1,2,3,4

function getNsrZsxmDetail(http: _HttpClient, nsrmc) {
    const now = new Date();
    const year = now.getFullYear();
    const startMonth = 1;
    const endMonth = now.getMonth() + 1;
    const params = {
        year,
        startMonth,
        endMonth,
        budgetValue: [1, 2, 3, 4].toLocaleString(),
    }

    const $stream1 = http.get('bdg/enterprise/tax/zsxm', {
        ...Object.assign(params, { nsrmc })
    });

    const $stream2 = http.get('bdg/enterprise/tax/history', {
        ...Object.assign(params, { nsrmc })
    });

    return forkJoin([$stream1, $stream2]);

}


export { DEFAULT_SWJG_DM, MAPBOX_POS, DJZCLX, ZSXM, IHyItem, IZsxmItem, ISsfjcItem, ISyjgItem, SYJG, MLMC, getNsrZsxmDetail }