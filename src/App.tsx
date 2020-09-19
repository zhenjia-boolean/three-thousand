import React, { Component } from 'react';
import './App.css';
import { getRawResultFromSouceData, handleResultOrder } from './model/parse-data';
import { parseKeys } from './model/parse-key';

class App extends Component {

  handleClick() {
    const textArea = document.querySelector('#paste-data') as any;
    const value = textArea.value;
    try {
      let result = getRawResultFromSouceData(value);
      result = handleResultOrder(result);
      console.log(result);
    } catch (e) {
      alert('数据有误，请检查数据。');
    }
  }

  render() {
    return (
      <div className="App">
        <div className="top">
          {/* @ts-ignore */}
          <textarea name="" id="paste-data" placeholder="请粘贴数据" autoFocus={true}></textarea>
          <div className="paste-list">
            {
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
            }
          </div>
        </div>
        <div className="bottom">
          <button onClick={this.handleClick}>点击转换</button>
        </div>
      </div>
    );
  }
}

export default App;
