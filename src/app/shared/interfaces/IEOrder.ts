/**
 * 企业税收排名结果对象
 */
export interface IEOrder {

    // 纳税人识别号
    PAYER_ID?: string;
    // 纳税人名称
    NSRMC?: string;
    // 本年度收入
    BNDSR?: number;
    // 上年同期收入
    SNTQ?: number;
    // 同比增减值
    TBZJZ?: number;
    // 同比增减幅
    TBZJF?: string;

    lat?: number;
    lng?: number;

}