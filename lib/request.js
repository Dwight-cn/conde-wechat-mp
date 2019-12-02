// 处理请求选项
function fnHandleRequestOption(oOption) {
    // 定义默认的全局请求参数
    let oDefaultData = {};
    const sAccessToken = wx.getStorageSync('accessToken');
    if (sAccessToken) {
        oDefaultData.accesstoken = sAccessToken;
    }
    // 使传入的请求参数，覆盖默认参数
    oOption.data = {
        ...oDefaultData,
        ...oOption.data
    };
    return oOption;
}



export default (oOption = {}) => {
    return new Promise((resolve, reject) => {
        try {
            wx.request({
                ...fnHandleRequestOption(oOption),
                success(res) {
                    if (res.data) {
                        resolve(res.data);
                    } else {
                        reject(res);
                    }
                },
                fail(err) {
                    reject(err);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
};
