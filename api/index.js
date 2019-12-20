import config from '../config/index';
import request from '../lib/request';


export default (oOption = {}, fnDataModel) => {
    oOption.url = config.api.url + oOption.url;
    return new Promise((resolve, reject) => {
        request(oOption)
            .then(res => {
                // ios机型上发现部分文章返回结果为字符串，导致渲染失败
                if (typeof(res) === 'string') {
                    try {
                        res = JSON.parse(res.replace(/\s+/g, ' '))
                    } catch (error) {
                        console.log(error)
                    }
                }
                if (res && res.success) {
                    // 如果没有data字段，将当前res对象展开
                    if (!res.data) {
                        delete res.success;
                        res.data = {
                            ...res
                        };
                    }
                    if (typeof fnDataModel === 'function') {
                        resolve(fnDataModel(res.data));
                    } else {
                        resolve(res.data);
                    }
                } else {
                    // 显示错误信息
                    if (res.error_msg) {
                        wx.showToast({
                            title: res.error_msg,
                            icon: 'none'
                        });
                    }
                    reject(res);
                }
            })
            .catch(e => {
                reject(e);
            });
    });
};
