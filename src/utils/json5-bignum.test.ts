import { describe, expect, it } from 'vitest';
import '@/utils/json5-bignum';

const bigJson = `{
"code":200,
"success":true,
"data":{
"vacantNum":121,
"arrearsNum":95,
"rentingNum":239,
"houseNum":95,
"communityDongFloorHouseVoList":{
"records":[{
"id":1911328104527409155,
"personId":null,
"communityId":1911239335774236673,
"communityName":"临江产业邻里中心",
"dongNumber":"3栋1单元",
"houseName":"818",
"houseAlias":"818",
"tenants":null,
"withPeople":null,
"manager":null,
"maintenance":null,
"managerList":null,
"maintenanceList":null,
"deviceId":"1929809743871979521",
"productKey":"68240ae56b00c735478abb1c",
"deviceModel":"G1N9",
"checkIn":false,
"houseStatus":1,
"createTime":null,
"lastTime":"2026-08-17",
"startTime":null,
"endTime":null,
"houseCode":"1911239335774236673,1911328104154116098,1911328104527409155",
"houseCodeName":"临江产业邻里中心3栋1单元818",
"online":1,
"devSignal":"0",
"electricityStatus":"1",
"electricity":"100%",
"monthlyElectricity":233.5,
"monthlyWater":9,
"occupancy":null,
"houseType":1,
"houseMoney":-166.16,
"waterCount":null,
"electricCount":null,
"isCollection":null,
"deviceSn":"62ba4bf0bb5e",
"vacantNum":0,
"rentingNum":0,
"occupancyNum":2,
"vacantDays":"0"
}],
"total":95,
"size":10,
"current":3,
"orders":[],
"optimizeCountSql":true,
"searchCount":true,
"countId":null,
"maxLimit":null,
"pages":10
}
},
"msg":"操作成功",
"num_value":12345678901234567890.123456789,
"num_small":42,
"num_other":1.77777777777777777777777777,
"num_arr":[1.234567890123456789,"hello"]
}`;

describe('json5-bignum utils', () => {
  describe('JSON.parseBigNum', () => {
    it('should parse big numbers in JSON (but not in strings)', () => {
      expect(JSON.stringify(JSON.parseBigNum(bigJson))).toBe(bigJson.replace(/[\r\n]/g, ''));
    });
  });
});
