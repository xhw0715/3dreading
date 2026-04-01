import { ElMessage } from 'element-plus'

export default class SpeechRecognition {
  constructor() {
    this.isRecording = false
    this.wsConnected = false
    this.finalResult = '' // 最终的识别结果
    this.interimResult = '' // 中间的识别结果
    this.mediaStream = null
    this.mediaRecorder = null
    this.webSocket = null
    this.audioContext = null
    this.processor = null
    // 优化配置参数，提高实时性
    this.funasrConfig = {
      chunk_size: [5, 10, 5],
      wav_name: 'h5',
      is_speaking: true, // 初始标记为正在说话
      chunk_interval: 2, // 缩短间隔，加快响应
      mode: '2pass-online',
    }
    // 回调函数，用于传递识别结果
    this.onResult = null
  }

  // 连接WebSocket
  connectWS() {
    try {
      const wsUrl = 'wss://ai.credit.jxjaxzf.gov.cn/ws'
      // const wsUrl = 'ws://192.168.0.113:9988/websocket';
      this.webSocket = new WebSocket(wsUrl)

      this.webSocket.onopen = () => {
        console.log('WebSocket连接成功')
        this.wsConnected = true
        this.sendConfig()
      }

      this.webSocket.onmessage = event => {
        try {
          const response = JSON.parse(event.data)
          this.handleServerMessage(response)
        } catch (e) {
          console.error('解析服务端消息失败:', e)
        }
      }

      this.webSocket.onerror = error => {
        console.error('WebSocket错误:', error)
        ElMessage.error('WebSocket连接错误')
      }

      this.webSocket.onclose = () => {
        console.log('WebSocket连接关闭')
        this.wsConnected = false
      }
    } catch (error) {
      console.error('创建WebSocket失败:', error)
      ElMessage.error('创建WebSocket失败')
    }
  }

  // 发送配置信息
  sendConfig() {
    if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
      const configMessage = {
        type: 'config',
        ...this.funasrConfig,
      }
      this.webSocket.send(JSON.stringify(configMessage))
    }
  }

  // 处理服务端消息
  handleServerMessage(response) {
    console.log('收到服务端消息:', response)

    if (response.text) {
      // 去除前缀信息的正则表达式
      const cleanText = response.text.replace(/<\|[^|]+\|>/g, '')

      if (response.is_final) {
        // 最终结果：累加并清空中间结果
        this.finalResult += cleanText
        this.interimResult = ''
      } else {
        // 中间结果：实时更新显示
        this.interimResult = cleanText
      }
      console.log('识别结果：', this.finalResult + this.interimResult)
      // 通过回调传递结果
      if (typeof this.onResult === 'function') {
        this.onResult(this.finalResult + this.interimResult)
      }
    }
  }

  // 打开麦克风
  async openMicrophone() {
    try {
      if (!this.wsConnected) {
        ElMessage.error('请先连接WebSocket')
        return
      }

      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })
      console.log('mediaStream', this.mediaStream)
      this.isRecording = true
      this.funasrConfig.is_speaking = true // 标记为正在说话
      this.setupAudioProcessing()
    } catch (error) {
      console.error('获取麦克风权限失败:', error)
      ElMessage.error('获取麦克风权限失败')
      throw error
    }
  }

  // 设置音频处理
  setupAudioProcessing() {
    if (!this.mediaStream) return

    this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
      sampleRate: 16000,
    })

    const source = this.audioContext.createMediaStreamSource(this.mediaStream)
    // 减小缓冲区大小，更频繁地发送音频片段
    this.processor = this.audioContext.createScriptProcessor(2048, 1, 1)

    this.processor.onaudioprocess = event => {
      if (!this.isRecording || !this.wsConnected) return

      const audioData = event.inputBuffer.getChannelData(0)
      const int16Data = this.floatToInt16(audioData)

      if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
        this.webSocket.send(int16Data)
      }
    }

    source.connect(this.processor)
    this.processor.connect(this.audioContext.destination)
  }

  // Float32转Int16
  floatToInt16(float32Array) {
    const int16Array = new Int16Array(float32Array.length)
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]))
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff
    }
    return int16Array
  }

  // 停止录音
  stopRecording() {
    this.isRecording = false
    this.funasrConfig.is_speaking = false

    if (this.processor) {
      this.processor.disconnect()
      this.processor = null
    }

    if (this.audioContext) {
      this.audioContext.close().then(() => {
        this.audioContext = null
      })
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop())
      this.mediaStream = null
    }
    if (this.webSocket && this.wsConnected) {
      const endMessage = JSON.stringify({
        is_speaking: false,
        wav_name: this.funasrConfig.wav_name,
      })
      this.webSocket.send(endMessage)
    }
  }

  // 断开WebSocket连接
  disconnectWS() {
    if (this.webSocket) {
      this.webSocket.close()
      this.webSocket = null
    }
    this.wsConnected = false
  }

  // 清理资源，类似beforeUnmount
  cleanup() {
    if (this.isRecording) {
      this.stopRecording()
    }
    if (this.wsConnected) {
      this.disconnectWS()
    }
  }
}
