import React from 'react'
import { Button, Divider, Row, Col, message } from 'antd'
import './App.css'

class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      base64Url: '', //base64
      points: [] as any[], //路径点集合
      copyPoint: [] as any[], //用来判断是否书写过
    }
  }
  componentDidMount() {
    this.initCanvas()
  }

  /**
   * 初始化canvas
   */
  initCanvas() {
    const canvas = document.getElementById('canvas')!
    const ctx = (canvas as HTMLCanvasElement).getContext('2d')!
    /**
     * 背景色
     */
    ctx.fillStyle = '#CCC'
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)
    /**
     * 笔尖
     * 1.颜色
     * 2.粗细
     * 3.线头
     * 4.连接
     */
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    /**
     * 监听屏幕触碰
     */
    canvas.addEventListener('touchstart', (e: TouchEvent) => {
      e.preventDefault()
      console.log(e.changedTouches[0])
      let { pageX: startX, pageY: startY } = e.changedTouches[0]
      let pointList = [...this.state.points]
      pointList.push({ X: startX, Y: startY })
      setTimeout(() => {
        this.setState({
          points: pointList,
          copyPoint: pointList,
        })
      }, 0)
      ctx.beginPath()
    })
    canvas.addEventListener('touchmove', (e: TouchEvent) => {
      e.preventDefault()
      let { pageX: startX, pageY: startY } = e.changedTouches[0]
      let pointLists = [...this.state.points]
      pointLists.push({ X: startX, Y: startY })
      setTimeout(() => {
        this.setState({
          points: pointLists,
          copyPoint: pointLists,
        })
      }, 0)

      let result = [...this.state.points]
      if (result.length > 1) {
        // console.log(result)
        // return;
        let point1 = result[0]
        let point2 = result[1]
        result.shift()
        setTimeout(() => {
          this.setState({
            points: result, //删除上一个已经绘制的点
          })
        }, 0)
        ctx.moveTo(point1.X, point1.Y) //起点
        ctx.lineTo(point2.X, point2.Y) //下一个点(终点)
        ctx.stroke()
      }
    })
    canvas.addEventListener('touchend', (e: TouchEvent) => {
      e.preventDefault()
      setTimeout(() => {
        this.setState({
          points: [],
        })
      }, 0)
    })
  }
  /**
   * 清空canvas
   */
  clearCanvas() {
    this.setState({
      points:[],
      copyPoint:[],
      base64Url:''
    })
    this.initCanvas()
  }
  /**
   * 获取签名的image
   */
  getCanvasImg() {
    const isSign = this.state.copyPoint.length
    if (!isSign) {
      return message.error('请签名')
    }
    this.setState({
      base64Url: document.querySelector('canvas')?.toDataURL(),
    })
  }
  /**
   * 转换图片
   */
  blankCanvas(): boolean {
    let blank = document.createElement('canvas')
    const canvasImage = document.getElementById('canvas')
    blank.width = canvasImage!.clientWidth
    blank.height = canvasImage!.clientHeight

    const context = blank.getContext('2d')!
    context.fillStyle = '#ccc'
    context.fillRect(0, 0, blank.width, blank.height)
    console.log(blank.toDataURL())
    return (canvasImage as HTMLCanvasElement).toDataURL() === blank.toDataURL()
  }

  render() {
    return (
      <div className="App">
        <canvas
          id="canvas"
          disable-scroll="true"
          style={{ width: '100vw', height: '50vh' }}
        ></canvas>
        <Divider orientation="center">手写签名</Divider>
        <Row justify="space-around" align="middle">
          <Col>
            <Button onClick={this.getCanvasImg.bind(this)}>提交签名</Button>
          </Col>
          <Col>
            <Button onClick={this.clearCanvas.bind(this)}>清除签名</Button>
          </Col>
        </Row>
        <div style={{ wordBreak: 'break-all' }}>
          base64图片: <br /> {this.state.base64Url}
        </div>
      </div>
    )
  }
}

export default App
