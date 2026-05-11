import css from './Loader.module.css'
import  { LineWave } from 'react-loader-spinner'

export default function Loader(){
  return (
      <div className={css.loader}><LineWave
visible={true}
height="100"
width="100"
color="#4fa94d"
ariaLabel="line-wave-loading"
wrapperStyle={{}}
wrapperClass=""
firstLineColor=""
middleLineColor=""
lastLineColor=""
/></div>

  )
}