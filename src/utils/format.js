import { dayjs } from 'element-plus'
// 格式化时间
export const formatTime = (time) => {
  return dayjs(time).format('YYYY年MM月DD日 HH:mm:ss')
}
