import LAY_EXCEL from 'lay-excel';
import dayjs from 'dayjs'; // 时间日期处理库

/** 导出到excel */
function exportExcel(json: any, name: string) {
  return new Promise((resolve, reject) => {
    try {
      LAY_EXCEL.setExportCellStyle(json, 'A1:AX1', {
        s: {
          fill: { bgColor: { indexed: 64 }, fgColor: { rgb: 'FEFF00' } },
          font: { bold: true },
          alignment: {
            horizontal: 'left',
            vertical: 'left',
            wrapText: true
          }
        }
      });
      const colConf = LAY_EXCEL.makeColConfig({
        A: 100,
        AX: 100
      }, 100);
      LAY_EXCEL.exportExcel(json, `${name}${dayjs(Date.now()).format('YYYYMMDD')}.xlsx`, 'xlsx', {
        extend: { '!cols': colConf }
      });
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}

/** 读取excel文件，转化成json数据 */
function readExcel(file: any) {
  const files = file.raw ? file.raw : file;
  return new Promise((resolve) => {
    let wb: any = null; // 工作表对象
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = e.target.result;
      const XLSX = require('lay-excel/src/xlsx');
      wb = XLSX.default.read(data, {
        type: 'binary',
      });
      let result: any = [];
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      result = XLSX.default.utils.sheet_to_json(ws);
      resolve(result);
    };
    reader.readAsBinaryString(files);
  });
}

export {
  exportExcel,
  readExcel
};
