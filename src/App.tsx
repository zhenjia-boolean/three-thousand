import ClipboardJS from 'clipboard';
import React, { Component } from 'react';
import './App.css';
import { getRawResultFromSouceData, handleResultOrder } from './model/parse-data';
import { parseKeys } from './model/parse-key';
import { Button, Input, message, Table } from 'antd';
import Column from 'antd/lib/table/Column';
import ColumnGroup from 'antd/lib/table/ColumnGroup';
const { TextArea } = Input;

const example = `血沉ESR：血沉[ESR]，26mm/h； 血常规五分类+hsCRP(临)：有核红细胞百分率，0.000%，有核红细胞绝对值，0.00E+9/L，#白细胞计数，7.87E+9/L，中性粒细胞百分率，66.0%，淋巴细胞百分率，19.9%，单核细胞百分率，8.4%，嗜酸粒细胞百分率，5.1%，嗜碱粒细胞百分率，0.6%，中性粒细胞绝对值，5.19E+9/L，淋巴细胞绝对值，1.57E+9/L，单核细胞绝对值，0.66E+9/L，嗜酸粒细胞绝对值，0.40E+9/L，嗜碱粒细胞绝对值，0.05E+9/L，#红细胞计数，5.87E+12/L，#血红蛋白，131g/L，红细胞比积，42.8%，平均红细胞体积，72.9fL，平均血红蛋白浓度，306g/L，平均血红蛋白含量，22.3Pg，RBC分布宽度SD，37.6fL，RBC分布宽度CV，14.4%，#血小板计数，466E+9/L，血小板平均体积，9.4fL，血小板体积分布宽度，9.7fL，大血小板比率，19.7%，血小板压积，0.44%，超敏C反应蛋白，32.920mg/L； 肾功五项+电解质四项+肝功六项+血脂四项+谷草转氨酶AST+γ谷氨酰基转移酶GGT+碱性磷酸酶ALP+胆碱脂酶CHE+甲功三项：白球蛋白比值[A/G]，1.0，球蛋白[Glb]，32.0g/L，间接胆红素[IB]，3.7umol/L，游离甲状腺素[FT4-国际单位]，11.96pmol/L，游离三碘甲状腺原氨酸[FT3-国际单位]，5.36pmol/L，尿素/肌酐比值[urea/Cr]，0.07，葡萄糖[GLU]，4.78mmol/L，尿素[urea]，4.22mmol/L，肌酐[Cr]，64umol/L，尿酸[UA]，444umol/L，二氧化碳结合力[CO2-CP]，27.6mmol/L，#钾[K]，4.87mmol/L，#钠[Na]，141mmol/L，#氯[Cl]，104.0mmol/L，钙[Ca]，2.19mmol/L，#丙氨酸氨基转移酶[ALT]，9U/L，总胆红素[TB]，4.7umol/L，直接胆红素[DB]，1.0umol/L，#总蛋白[TP]，63.8g/L，#白蛋白[Alb]，31.8g/L，总胆汁酸[TBA]，9.1umol/L，#甘油三脂[TG]，0.68mmol/L，#总胆固醇[TC]，2.70mmol/L，#高密度脂蛋白胆固醇[HDL-C]，0.86mmol/L，#低密度脂蛋白胆固醇[LDL-C]，1.74mmol/L，#天门冬氨基转移酶[AST]，10U/L，#L-γ-谷氨酰基转肽酶[GGT]，12U/L，#碱性磷酸酶[ALP]，118U/L，胆碱脂酶[CHE]，4858U/L，游离三碘甲状腺原氨酸[FT3]，3.48pg/ml，游离甲状腺素[FT4]，0.92ng/dl，#促甲状腺激素[TSH]，2.342mIU/L； 糖化血红蛋白：糖化血红蛋白[HbA1c]，5.6%； 肿瘤三项：#甲胎蛋白[AFP]，1.4ng/ml，#癌胚抗原[CEA]，0.9ng/ml，糖类抗原19-9[CA19-9]，< 2.00U/ml； 术前四项（HIV/TP/HCV/HBV)：#抗丙肝病毒抗体[HCV-Ab]，0.12(阴性)S/CO，#乙肝病毒表面抗原定量(HBsAg)，0.00(阴性)IU/ml，抗梅毒螺旋体特异性抗体[TP-Ab]，0.10(阴性)S/CO，HIV 抗原/抗体，0.38(阴性)S/CO； 凝血四项[血液室]：凝血酶原时间[PT]，12.80秒(s)，血浆凝血酶原时间比值[PT-R]，0.98，PT国际标准化比值[INR]，0.97，PT活动度[PT%]，105.00%，活化部分凝血激酶时间[APTT]，44.10秒(s)，纤维蛋白原[FIB]，5.70g/L，凝血酶凝固时间[TT]，14.30秒(s)； 大便常规+隐血(体液)：颜色，黄褐色，性状，软便，虫卵，未见/LP，隐血试验，阳性，红细胞，未见/HP，白细胞，未见/HP； 免疫功能六项+前白蛋白：免疫球蛋白G[IgG]，13.15g/L，免疫球蛋白M[IgM]，0.85g/L，免疫球蛋白A[IgA]，2.300g/L，血清补体3[C3]，1.40g/L，血清补体4[C4]，0.24g/L，血清总补体[CH50]，48.8U/mL，前白蛋白[PA]，155.9mg/L； 糖类抗原72-4：糖类抗原724[CA724]，3.9IU/ml； 结核抗体：结核分枝杆菌抗体IgG[Tb-IgG]，阴性； 前列腺特异性抗原(2项)：前列腺抗原比值[FPSA/TPSA]，0.35，#总前列腺特异性抗原[TPSA]，0.254ng/mL，游离前列腺特异性抗原[FPSA]，0.090ng/ml； 尿常规分析：管型，0/LP，尿沉渣项目(镜检法)，.，红细胞(手工)，0/HP，白细胞(手工)，3-6/HP，上皮细胞(手工)，1-2/HP，尿液常规项目（干化学法），.，#尿糖(U-GLU)，阴性，#蛋白质(PRO)，+-，胆红素(BIL)，阴性，#尿胆原(UBG)，阴性，酮体(KET)，阴性，酸碱度(PH)，6.0，比重(SG)，1.027，#潜血(BLD)，阴性，白细胞酯酶(LEU)，阴性，亚硝酸盐(NIT)，阴性，透明度(TURB)，微浑，颜色(COL)，黄色，尿液沉渣项目(流式法)，.，红细胞(RBC)，2.9/ul，白细胞(WBC)，38.3/ul，上皮细胞(EC)，10.3/ul，管型(CAST)，0.02/ul，结晶(XTAL)，0.00/ul，类酵母菌(YLC)，0.00/ul，粘液丝(MUCUS)，5.27/ul，电导率(Cond.)，23.10mS/cm，未受损红细胞百分比(NLRBC%)，39.10%； EB/巨细胞/腺病毒DNA(外周血)：EB病毒DNA[EBV-DNA]，阴性(<500)拷贝，腺病毒DNA[ADV-DNA]，阴性(<500)拷贝，人巨细胞病毒DNA[HCMV-DNA]，阴性(<500)拷贝； *外周血结核感染T细胞检测(T-SPOT)：结核感染T细胞斑点实验，阴性，  阴性对照孔斑点数，0个/孔，  抗原A(ESAT-6)孔斑点数，0个/孔，  抗原B(CFP-10)孔斑点数，0个/孔，  阳性对照孔斑点数，318个/孔，抗原A孔-阴性对照孔，0，抗原B孔-阴性对照孔，0，抗原A孔-2*阴性对照孔，0，抗原B孔-2*阴性对照孔，0； 大便真菌涂片检查：真菌镜检，未见真菌； 血管炎五项：抗髓过氧化物酶抗体[MPO-ANCA]，阴性(-)，抗蛋白酶3抗体[PR3-ANCA]，阴性(-)，抗肾小球基底膜抗体[GBM]，阴性(-)，抗中性粒细胞胞浆抗体核周型[pANCA]，阴性，抗中性粒细胞胞浆抗体胞浆型[cANCA]，阴性； ENA多肽抗体谱+抗双链DNA抗体ds-DNA+抗核抗体ANA：抗核糖体P蛋白抗体，阴性(-)，抗线粒体M2抗体[PBC-AMA-M2]，阴性(-)，抗PM-Scl抗体[Anti-PM-Scl]，阴性(-)，抗Scl-70抗体[Anti-Scl-70]，阴性(-)，抗SS-A抗体[Anti-SSA]，阴性(-)，抗增殖细胞核抗原抗体[PCNA]，阴性(-)，抗RO-52抗体[Anti-RO-52]，阴性(-)，抗组蛋白抗体[AHA]，阴性(-)，抗Sm抗体[Anti-Sm]，阴性(-)，抗着丝点抗体[CENP B]，阴性(-)，抗nRNP/Sm抗体，阴性(-)，抗Jo-1抗体[Anti-Jo-1]，阴性(-)，抗SS-B抗体[Anti-SSB]，阴性(-)，抗核小体抗体[AnuA]，阴性(-)，ANA核型(细胞核):，-，ANA核型(细胞浆):，-，均质型，>1:1000(阳性)，颗粒型，1:1000(阳性)，胞浆颗粒型，1:100(阳性)，抗双链DNA抗体[dsDNA]，阴性(<50.0)IU/ml；`;

let lastTime = Date.now();
function deboundText() {
  if (Date.now() - lastTime < 1000) return;
  message.success('复制成功，请到 Excel 粘贴确认');
  lastTime = Date.now();
}

class App extends Component {
  state = {
    showTable: false,
  }
  // tableData: any = handleResultOrder(getRawResultFromSouceData(example));
  tableData: any;
  copyRow = new ClipboardJS('#copy-row', {
    text: function() {
      deboundText();
      return (document.querySelector('.ant-table-tbody')! as any).innerText;
    }
  });
  copyHeader = new ClipboardJS('#copy-header', {
    text: function() {
      deboundText();
      return (document.querySelector('.ant-table-thead')! as any).innerText;
    },
  });
  handleClear = () => {
    const textArea = document.querySelector('#paste-data') as any;
    textArea.value = "";
  }

  handleClick = () => {
    const textArea = document.querySelector('#paste-data') as any;
    const value = textArea.value;
    try {
      let result = getRawResultFromSouceData(value);
      result = handleResultOrder(result);
      console.log(result);
      this.tableData = result;
    } catch (e) {
      message.error('数据有误，请按示例输入数据。');
      this.setState({
        showTable: false,
      });
    }
    this.setState({
      showTable: true,
    });
  }

  renderTable = () => {
    if (!this.state.showTable || !this.tableData) return null;

    // const keys = Object.keys(this.tableData);
    // const data: any = {}
    // for (const key of keys) {
    //   Object.assign(data, this.tableData[key]);
    // }

    return (
      <div>
        <Table dataSource={[this.tableData]}>
          {
            parseKeys.map((keyName: any, index: any) => {
              return <Column title={keyName} dataIndex={keyName} key={keyName} />
            })
          }
          {/* { Object.keys(parseKeys).map((item, index) => {
            return (<ColumnGroup title={item}>
              { parseKeys[item].map((subItem: any, subIndex: any) => {
                return <Column title={subItem} dataIndex={subItem} key={subItem} />
              })}
            </ColumnGroup>)
          }) } */}
        </Table>
        <Button type="primary" id="copy-header" style={{ marginRight: 10 }}>复制行头数据</Button>
        <Button type="primary" id="copy-row">复制行数据</Button>
      </div>
    );
  }

  render() {
    return (
      <div className="App">
        <div className="top">
          {/* @ts-ignore */}
          <TextArea name="" id="paste-data" placeholder={`请粘贴数据，例如 ${example}`} autoFocus={true}></TextArea>
          <div className="paste-list">
            <h3>程序会按以下顺序解析：</h3>
            {/* {
              Object.keys(parseKeys).map((key, index) => {
                return (<div className="main-key" key={index}>
                  {key}
                  {
                    parseKeys[key].map((item: any, index1: number) => {
                      const key = index + '-' + index1;
                      return <div className="sub-key" key={key}>{item}</div>
                    })
                  }
                </div>);
              })
            } */}
            {
              parseKeys.map((item: any, index1: number) => {
                const key = item + '-' + index1;
                return <div className="sub-key" key={key}>{item}</div>
              })
            }
          </div>
        </div>
        <div className="bottom" style={{ marginTop: 10, marginBottom: 10 }}>
          <Button type="primary" onClick={this.handleClick}>点击转换</Button>
          <Button type="primary" style={{ marginLeft: 20, background: "#faf1d1", color: "black"}} onClick={this.handleClear}>清空</Button>
        </div>
        { this.renderTable() }
      </div>
    );
  }
}

export default App;
