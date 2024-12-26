// src/utils/deviceInfo.ts
function GetDeviceInfo() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent);
    const device = isMobile ? 'Mobile' : 'Desktop';
  
    let browser = { name: 'Unknown Browser', version: '' };
  
    if (/chrome|crios/i.test(userAgent)) {
      browser.name = 'Chrome';
    } else if (/safari/i.test(userAgent) && !/chrome|crios/i.test(userAgent)) {
      browser.name = 'Safari';
    } else if (/firefox|fxios/i.test(userAgent)) {
      browser.name = 'Firefox';
    } else if (/edg/i.test(userAgent)) {
      browser.name = 'Edge';
    }
  
    return { device, browser };
  };
  
export default GetDeviceInfo