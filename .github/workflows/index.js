const axios = require('axios')
const qs = require('qs');
var bluebird = require("bluebird");

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

async function checkApi() {
  const tokenData = {
    host: 'gateway.mdex.one',
    type: 'hijack',
    _token: 'RxLM3wP5Yyhey4JGTc85js5mfITwKWKmOFHjch7p',
    create_task: '0',
    isp: '1,2,3'
  }
  const tokenRes = await axios({
    method: 'post',
    url: 'https://www.boce.com/check',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
      'Cookie': 'Hm_lvt_6f7bb05729dbcfbb35109223ae6b3c4f=1628994826; Hm_lpvt_6f7bb05729dbcfbb35109223ae6b3c4f=1629368017; boce_session=eyJpdiI6Ikcxbm5kTDV5dnpJbllMejNwckF6TkE9PSIsInZhbHVlIjoiRlE5OVNmNmVkNGVCb2FaZWYxTjJDYWR6VURGNisrVDVWbFhBTWhDRnpGTUNYeU1MNFJNS2g2QUtURk84RDlMRjBvTktDcER6MTdSYmJYamFqU1IzaXc9PSIsIm1hYyI6ImExZGE3YmQ2Y2VlYzZmOWQyMjY1ODkzZDdmN2U5MmE0NmE4MzJiZjE2ODhkMGJlNTY0NTExMzVhNGE0NWRlY2IifQ%3D%3D'
    },
    data: qs.stringify(tokenData)
  })
  if(tokenRes.data.code == 1) {
    const {_token, host, type, create_task} = tokenData
    const taskID = tokenRes.data.data.taskID 
    const checkData = {
      _token,
      host,
      type,
      create_task,
      task_id: taskID
    }
    const lenArr= [...new Array(15).keys()]
    for(const key in lenArr) {
      const checkRes = await axios({
        method: 'post',
        url: 'https://www.boce.com/check',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
          'Cookie': 'Hm_lvt_6f7bb05729dbcfbb35109223ae6b3c4f=1628994826; Hm_lpvt_6f7bb05729dbcfbb35109223ae6b3c4f=1629368017; boce_session=eyJpdiI6Ikcxbm5kTDV5dnpJbllMejNwckF6TkE9PSIsInZhbHVlIjoiRlE5OVNmNmVkNGVCb2FaZWYxTjJDYWR6VURGNisrVDVWbFhBTWhDRnpGTUNYeU1MNFJNS2g2QUtURk84RDlMRjBvTktDcER6MTdSYmJYamFqU1IzaXc9PSIsIm1hYyI6ImExZGE3YmQ2Y2VlYzZmOWQyMjY1ODkzZDdmN2U5MmE0NmE4MzJiZjE2ODhkMGJlNTY0NTExMzVhNGE0NWRlY2IifQ%3D%3D'
        },
        data: qs.stringify(checkData)
      })
      await bluebird.delay(2000)
      if(key == lenArr.length - 1) {
        await Promise.all(checkRes.data.data.list.map(async (list) => {
          const {remote_ip, node_name} = list 
          if(remote_ip == '127.0.0.1' || remote_ip == '0.0.0.0') {
            const desp = `【地区】：${node_name}\n【IP】：${remote_ip}`.replace(/[\n\r]/g, '\n\n')
            await axios({
              method: 'post',
              url: `https://sc.ftqq.com/${secrets.sctKey}.send`,
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              data: `text=${node_name} ERROR&desp=${desp}`
            })
            await bluebird.delay(20000)
          }
       }));
      }
    }
  }
}
checkApi()